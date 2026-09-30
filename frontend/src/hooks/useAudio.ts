import { useCallback, useEffect, useRef, useState } from 'react';

export type SoundType =
  | 'click' | 'navigate' | 'alert' | 'critical' | 'correlate'
  | 'aiProcessing' | 'timelineTick' | 'reportGenerate' | 'terminalType'
  | 'riskEscalate' | 'success';

export interface AudioSettings {
  enabled: boolean;
  volume: number;
  interactionSounds: boolean;
  alertSounds: boolean;
  aiSounds: boolean;
}

const defaultSettings: AudioSettings = {
  enabled: true,
  volume: 0.3,
  interactionSounds: true,
  alertSounds: true,
  aiSounds: true,
};

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(ctx: AudioContext, freq: number, duration: number, type: OscillatorType, volume: number, delay = 0, freqEnd?: number) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + delay + duration);
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch {
    /* ignore audio synthesis errors */
  }
}

function playNoise(ctx: AudioContext, duration: number, volume: number, delay = 0) {
  try {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(ctx.currentTime + delay);
    noise.stop(ctx.currentTime + delay + duration);
  } catch {
    /* ignore audio synthesis errors */
  }
}

export function playSound(type: SoundType, settings: AudioSettings) {
  if (!settings.enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const v = settings.volume;

  switch (type) {
    case 'click':
      if (!settings.interactionSounds) return;
      playTone(ctx, 800, 0.05, 'square', v * 0.3);
      playTone(ctx, 1200, 0.03, 'square', v * 0.15, 0.02);
      break;
    case 'navigate':
      if (!settings.interactionSounds) return;
      playTone(ctx, 400, 0.08, 'sine', v * 0.25);
      playTone(ctx, 600, 0.06, 'sine', v * 0.2, 0.04);
      break;
    case 'alert':
      if (!settings.alertSounds) return;
      playTone(ctx, 880, 0.1, 'sine', v * 0.3);
      playTone(ctx, 880, 0.1, 'sine', v * 0.3, 0.15);
      break;
    case 'critical':
      if (!settings.alertSounds) return;
      playTone(ctx, 220, 0.15, 'sawtooth', v * 0.4);
      playTone(ctx, 180, 0.2, 'sawtooth', v * 0.35, 0.1);
      playTone(ctx, 140, 0.25, 'sawtooth', v * 0.3, 0.2);
      break;
    case 'correlate':
      if (!settings.interactionSounds) return;
      playTone(ctx, 523, 0.08, 'sine', v * 0.25);
      playTone(ctx, 659, 0.08, 'sine', v * 0.25, 0.06);
      playTone(ctx, 784, 0.08, 'sine', v * 0.25, 0.12);
      playTone(ctx, 1047, 0.15, 'sine', v * 0.3, 0.18);
      break;
    case 'aiProcessing':
      if (!settings.aiSounds) return;
      playTone(ctx, 200, 0.5, 'sawtooth', v * 0.1, 0, 400);
      playNoise(ctx, 0.5, v * 0.05);
      break;
    case 'timelineTick':
      if (!settings.aiSounds) return;
      playTone(ctx, 1200, 0.03, 'square', v * 0.15);
      break;
    case 'reportGenerate':
      if (!settings.interactionSounds) return;
      playNoise(ctx, 0.8, v * 0.08);
      playTone(ctx, 523, 0.15, 'sine', v * 0.2, 0.8);
      playTone(ctx, 784, 0.2, 'sine', v * 0.25, 0.9);
      break;
    case 'terminalType':
      if (!settings.interactionSounds) return;
      playTone(ctx, 1500 + Math.random() * 300, 0.02, 'square', v * 0.08);
      break;
    case 'riskEscalate':
      if (!settings.alertSounds) return;
      playTone(ctx, 300, 0.1, 'sawtooth', v * 0.25);
      playTone(ctx, 400, 0.1, 'sawtooth', v * 0.25, 0.1);
      playTone(ctx, 500, 0.15, 'sawtooth', v * 0.3, 0.2);
      break;
    case 'success':
      playTone(ctx, 659, 0.1, 'sine', v * 0.25);
      playTone(ctx, 880, 0.15, 'sine', v * 0.3, 0.08);
      break;
  }
}

export function useAudio() {
  const [settings, setSettings] = useState<AudioSettings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    try {
      const stored = localStorage.getItem('ancp-audio-settings');
      if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ancp-audio-settings', JSON.stringify(settings));
    } catch { /* ignore */ }
  }, [settings]);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const play = useCallback((type: SoundType) => {
    playSound(type, settingsRef.current);
  }, []);

  const toggle = useCallback(() => setSettings((s) => ({ ...s, enabled: !s.enabled })), []);
  const update = useCallback((patch: Partial<AudioSettings>) => setSettings((s) => ({ ...s, ...patch })), []);

  return { settings, play, toggle, update };
}
