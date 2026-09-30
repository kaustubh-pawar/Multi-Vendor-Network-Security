'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Shield, Activity, Brain, Radar, FileText, Lock, ChevronRight,
  Terminal, Fingerprint, KeyRound, CheckCircle2, UserPlus, AlertCircle,
  ShieldCheck, Layers, ShieldAlert, Sparkles
} from 'lucide-react';
import { CyberBackground, Scanline } from '@/components/shared/CyberBackground';
import { useApp } from '@/context/AppContext';
import { useTypewriter } from '@/hooks/useAnimations';
import {
  findUserByEmail,
  verifyUserCredentials,
  registerNewUser,
  getStoredUsers,
  type StoredUser
} from '@/data/usersData';

type LoginPhase = 'landing' | 'auth' | 'booting';

export function LoginExperience() {
  const router = useRouter();
  const [phase, setPhase] = useState<LoginPhase>('landing');
  const { setAuthed, audio } = useApp();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505]">
      <CyberBackground variant="particles" />
      <Scanline />
      <AnimatePresence mode="wait">
        {phase === 'landing' && (
          <motion.div key="landing" exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }} transition={{ duration: 0.5 }}>
            <LandingScreen onEnter={() => { audio.play('click'); setPhase('auth'); }} />
          </motion.div>
        )}
        {phase === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.4 }}>
            <AuthScreen onAccess={() => { audio.play('success'); setPhase('booting'); }} />
          </motion.div>
        )}
        {phase === 'booting' && (
          <motion.div key="booting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(12px)' }} transition={{ duration: 0.3 }}>
            <BootSequence onComplete={() => { audio.play('success'); setAuthed(true); router.push('/dashboard'); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LandingScreen({ onEnter }: { onEnter: () => void }) {
  const { audio } = useApp();
  const tagline = useTypewriter('From Multi-Vendor Network Configs to Explainable Compliance Intelligence.', 35, 500);
  const systemStatus = [
    { label: 'FASTAPI AUDIT ENGINE', icon: Activity },
    { label: 'AI PATTERN CLASSIFIER', icon: Brain },
    { label: 'MULTI-VENDOR DATABASE', icon: Radar },
    { label: 'CIS BENCHMARKS ENGINE', icon: ShieldAlert },
    { label: 'NIST 800-53 REV 5', icon: Layers },
    { label: 'PDF & EXCEL REPORT ENGINE', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f222a]">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <ShieldCheck className="w-7 h-7 text-[#f59e0b]" />
            <div className="absolute inset-0 bg-[#f59e0b]/30 blur-md rounded-full" />
          </div>
          <span className="font-mono text-sm font-bold tracking-wider text-white">ANCP</span>
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] font-bold">
            AI INTELLIGENCE PLATFORM
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-pass animate-ping" />
          <span className="text-pass font-bold">SYSTEM OPERATIONAL · ENGINE ONLINE</span>
        </div>
      </div>

      {/* Main hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1, type: 'spring' }} className="relative mx-auto mb-8 w-24 h-24">
            <div className="absolute inset-0 rounded-full border-2 border-[#f59e0b]/40 animate-spinSlow" />
            <div className="absolute inset-2 rounded-full border border-pass/30 animate-spinSlow" style={{ animationDirection: 'reverse' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <ShieldCheck className="w-10 h-10 text-[#f59e0b]" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-[#f59e0b]/30 blur-xl rounded-full" />
              </div>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-3">
            <span className="text-white">ANCP</span> <span className="text-[#f59e0b]">SECURITY</span>
            <span className="text-slate-500 ml-3 text-3xl md:text-5xl font-mono">AUDITOR</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 font-mono mb-2 min-h-[28px]">
            {tagline.displayed}
            <span className="inline-block w-2 h-5 bg-[#f59e0b] ml-1 animate-pulse align-middle" />
          </p>
          <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mb-10">
            Ingest · Parse · AI Classify · Correlate · Remediate · Report
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnter}
              onMouseEnter={() => audio.play('click')}
              className="btn-amber-pill px-8 py-4 text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] group"
            >
              <Terminal className="w-5 h-5 text-black" />
              ENTER SECURITY COMMAND CENTER
              <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Status card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-14 w-full max-w-lg glass-panel p-6 border border-[#1f222a]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#f59e0b] font-bold">Engine System Status</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pass animate-pulse" />
              <span className="font-mono text-xs text-pass font-bold">OPERATIONAL</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {systemStatus.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#08090d] border border-[#1f222a]">
                  <Icon className="w-4 h-4 text-[#f59e0b]" />
                  <span className="font-mono text-[11px] text-slate-300 flex-1">{s.label}</span>
                  <span className="font-mono text-[11px] text-pass font-bold">ONLINE</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="px-6 py-4 border-t border-[#1f222a] flex items-center justify-between font-mono text-[11px] text-slate-500">
        <span>v2.4.1 PRODUCTION · SECURE TERMINAL</span>
        <span>ENCRYPTED CHANNEL · FASTAPI 0.110.0</span>
      </div>
    </div>
  );
}

function AuthScreen({ onAccess }: { onAccess: () => void }) {
  const { audio, setCurrentUser } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state - starts empty
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regKey, setRegKey] = useState('');
  const [regConfirmKey, setRegConfirmKey] = useState('');
  const [regClearance, setRegClearance] = useState('L4 Clearance');

  // Boot verification sequence
  const [verifying, setVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const verifySteps = [
    'Verifying TLS 1.3 encrypted handshake...',
    'Authenticating identity against registered dataset...',
    'Checking analyst clearance level...',
    'Session token issued. Launching Security Command Center...',
  ];

  const presetUsers = getStoredUsers();

  useEffect(() => {
    if (!verifying) return;
    if (verifyStep < verifySteps.length) {
      const t = setTimeout(() => {
        setVerifyStep((s) => s + 1);
        audio.play('terminalType');
      }, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onAccess, 500);
    return () => clearTimeout(t);
  }, [verifying, verifyStep, audio, onAccess, verifySteps.length]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    audio.play('click');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your registered Email and Access Key.');
      audio.play('alert');
      return;
    }

    // Strict Credential Verification against registered dataset
    const authResult = verifyUserCredentials(email.trim(), password.trim());
    if (!authResult.success || !authResult.user) {
      setErrorMessage(authResult.error || 'Authentication failed.');
      audio.play('alert');
      return;
    }

    // Set active current user
    setCurrentUser({
      name: authResult.user.name,
      email: authResult.user.email,
      clearance: authResult.user.clearance,
      role: authResult.user.role,
    });

    setVerifying(true);
    setVerifyStep(0);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    audio.play('click');

    if (!regName.trim() || !regEmail.trim() || !regKey.trim()) {
      setErrorMessage('All fields are required for Analyst Registration.');
      audio.play('alert');
      return;
    }

    if (regKey !== regConfirmKey) {
      setErrorMessage('Access Keys (Passwords) do not match.');
      audio.play('alert');
      return;
    }

    const newUserObj: StoredUser = {
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      accessKey: regKey,
      clearance: regClearance,
      role: 'Security Auditor',
    };

    const regResult = registerNewUser(newUserObj);
    if (!regResult.success) {
      setErrorMessage(regResult.error || 'Registration failed.');
      audio.play('alert');
      return;
    }

    // Registration successful -> pre-fill login email & show notice
    setSuccessMessage(`REGISTRATION SUCCESSFUL! Analyst "${newUserObj.name}" registered. You can now enter your Access Key to log in.`);
    audio.play('success');
    setTab('login');
    setEmail(newUserObj.email);
    setPassword('');
    setRegName('');
    setRegEmail('');
    setRegKey('');
    setRegConfirmKey('');
  };

  const selectPresetUser = (u: StoredUser) => {
    audio.play('click');
    setEmail(u.email);
    setPassword(u.accessKey);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="glass-panel p-8 relative overflow-hidden border border-[#1f222a]">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#f59e0b]/40 rounded-tl-xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#f59e0b]/40 rounded-br-xl" />

          {/* Sub-Tab Selector */}
          <div className="flex items-center justify-center gap-2 mb-6 p-1 bg-[#08090d] rounded-xl border border-[#1f222a] font-mono text-xs">
            <button
              type="button"
              onClick={() => { setTab('login'); setErrorMessage(null); setSuccessMessage(null); audio.play('click'); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'login'
                  ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> SECURE ACCESS
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setErrorMessage(null); setSuccessMessage(null); audio.play('click'); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'register'
                  ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> REGISTER ANALYST
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 mb-3 relative">
              {tab === 'login' ? <Lock className="w-6 h-6 text-[#f59e0b]" /> : <UserPlus className="w-6 h-6 text-[#f59e0b]" />}
              <div className="absolute inset-0 rounded-full bg-[#f59e0b]/20 blur-md" />
            </div>
            <h2 className="text-xl font-bold text-white font-mono tracking-wide">
              {tab === 'login' ? 'SECURE ACCESS TERMINAL' : 'ANALYST REGISTRATION'}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              {tab === 'login' ? 'IDENTITY VERIFICATION & ACCESS KEY AUTHENTICATION' : 'REGISTER NEW ANALYST IDENTITY & SET ACCESS KEY'}
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 p-3.5 rounded-xl bg-pass/15 border border-pass/40 text-pass font-mono text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">STATUS NOTICE</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{successMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3.5 rounded-xl bg-fail/15 border border-fail/40 text-fail font-mono text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">AUTHENTICATION ERROR</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          {!verifying ? (
            tab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#f59e0b] mb-1.5">Identity (Email)</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#14151a] border border-[#22252e] rounded-xl pl-10 pr-4 py-2.5 font-mono text-xs text-slate-200 focus:border-[#f59e0b] focus:outline-none transition-colors"
                      placeholder="e.g. kaustubh1006p@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#f59e0b] mb-1.5">Access Key (Password)</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#14151a] border border-[#22252e] rounded-xl pl-10 pr-4 py-2.5 font-mono text-xs text-slate-200 focus:border-[#f59e0b] focus:outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Preset Analyst Quick-Select Account Chips */}
                <div className="pt-1">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#f59e0b]" /> Quick-Select Registered Identities:
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {presetUsers.map((u) => (
                      <button
                        key={u.email}
                        type="button"
                        onClick={() => selectPresetUser(u)}
                        className="px-2.5 py-1 rounded-lg bg-[#08090d] border border-[#22252e] hover:border-[#f59e0b]/50 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                        <span>{u.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-slate-500">({u.accessKey})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn-amber-pill w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 group mt-3">
                  <ShieldCheck className="w-4 h-4 text-black" /> SECURE ACCESS <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#f59e0b] mb-1">Full Analyst Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-[#14151a] border border-[#22252e] rounded-xl px-3.5 py-2 text-slate-200 focus:border-[#f59e0b] focus:outline-none"
                    placeholder="e.g. Kaustubh Pawar"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#f59e0b] mb-1">Analyst Email</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-[#14151a] border border-[#22252e] rounded-xl px-3.5 py-2 text-slate-200 focus:border-[#f59e0b] focus:outline-none"
                    placeholder="e.g. kaustubh1006p@gmail.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#f59e0b] mb-1">Access Key</label>
                    <input
                      type="password"
                      required
                      value={regKey}
                      onChange={(e) => setRegKey(e.target.value)}
                      className="w-full bg-[#14151a] border border-[#22252e] rounded-xl px-3.5 py-2 text-slate-200 focus:border-[#f59e0b] focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#f59e0b] mb-1">Confirm Key</label>
                    <input
                      type="password"
                      required
                      value={regConfirmKey}
                      onChange={(e) => setRegConfirmKey(e.target.value)}
                      className="w-full bg-[#14151a] border border-[#22252e] rounded-xl px-3.5 py-2 text-slate-200 focus:border-[#f59e0b] focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#f59e0b] mb-1">Clearance Level</label>
                  <select
                    value={regClearance}
                    onChange={(e) => setRegClearance(e.target.value)}
                    className="w-full bg-[#14151a] border border-[#22252e] rounded-xl px-3.5 py-2 text-slate-200 focus:border-[#f59e0b] focus:outline-none font-mono"
                  >
                    <option value="L4 Clearance">L4 Lead Clearance</option>
                    <option value="L3 Senior Clearance">L3 Senior Investigator</option>
                    <option value="L2 Threat Clearance">L2 Threat Hunter</option>
                    <option value="Executive Clearance">Executive Clearance</option>
                  </select>
                </div>

                <button type="submit" className="btn-amber-pill w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 group mt-3">
                  <UserPlus className="w-4 h-4 text-black" /> REGISTER ANALYST & SET ACCESS KEY <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )
          ) : (
            <div className="py-4">
              <div className="font-mono text-xs space-y-2.5 mb-4">
                {verifySteps.slice(0, verifyStep + 1).map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pass shrink-0" />
                    <span className="text-slate-300">{step}</span>
                  </motion.div>
                ))}
                {verifyStep < verifySteps.length && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#f59e0b]/30 border-t-[#f59e0b] rounded-full animate-spin shrink-0" />
                    <span className="text-[#f59e0b] font-bold">{verifySteps[verifyStep]}</span>
                  </div>
                )}
              </div>
              <div className="h-1.5 bg-[#14151a] rounded-full overflow-hidden border border-[#22252e]">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#f59e0b] to-pass"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(verifyStep / verifySteps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const { audio, currentUser } = useApp();
  const lines = [
    '> ACCESS GRANTED',
    `> WELCOME ${currentUser.name.toUpperCase()} (${currentUser.clearance.toUpperCase()})`,
    '> INITIALIZING SECURITY INTELLIGENCE PLATFORM...',
    '> Loading SIEM connectors... OK',
    '> Loading AI investigation engine... OK',
    '> Loading risk intelligence engine... OK',
    '> Loading MITRE ATT&CK framework... OK',
    '> Loading GRC / ISO 27001 / NIST mappings... OK',
    '> Establishing secure telemetry feeds... OK',
    `> Security intelligence system ready for ${currentUser.email}.`,
  ];
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < lines.length) {
      const t = setTimeout(() => {
        setVisibleLines((v) => v + 1);
        audio.play('terminalType');
      }, 180);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onComplete, 600);
    return () => clearTimeout(t);
  }, [visibleLines, audio, onComplete, lines.length]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="glass-panel p-8 font-mono text-xs border border-[#1f222a]">
          <div className="space-y-2">
            {lines.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={i === 0 ? 'text-pass font-bold text-sm' : i === 1 ? 'text-[#f59e0b] font-bold text-sm' : 'text-slate-300'}
              >
                {line}
              </motion.div>
            ))}
            {visibleLines < lines.length && (
              <div className="text-[#f59e0b]">
                <span className="inline-block w-2 h-4 bg-[#f59e0b] animate-pulse align-middle" />
              </div>
            )}
          </div>
          {visibleLines >= lines.length && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 pt-4 border-t border-[#1f222a]">
              <div className="flex items-center gap-2 text-pass font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>SYSTEM READY — ENTERING COMMAND CENTER AS {currentUser.name.toUpperCase()}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
