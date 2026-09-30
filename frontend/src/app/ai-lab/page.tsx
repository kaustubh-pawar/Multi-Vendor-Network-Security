'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cpu, Sparkles, CheckCircle2, AlertCircle, Play, GraduationCap, ArrowRight, HelpCircle } from 'lucide-react';
import { fetchMLTelemetry, predictMLPattern } from '@/lib/api';

export default function AILabPage() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Sandbox state
  const [testSnippet, setTestSnippet] = useState('set security ike proposal IKE-PROP-01 encryption-algorithm aes-256-gcm');
  const [testVendor, setTestVendor] = useState('junos');
  const [prediction, setPrediction] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMLTelemetry();
        setTelemetry(data);
      } catch (err) {
        console.error('Error loading telemetry:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    try {
      const res = await predictMLPattern(testSnippet, testVendor);
      setPrediction(res);
    } catch (err) {
      console.error('Error predicting pattern:', err);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#f59e0b] uppercase">AI Machine Learning Intelligence</span>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-white flex items-center gap-3">
            AI Intelligence Hub & Model Telemetry
            <span className="px-3 py-0.5 rounded-full text-xs font-mono bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] font-bold uppercase">
              Hybrid Pattern Engine
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Offline trained TF-IDF + Random Forest Classifier metrics, Model Card provenance, hybrid path explainer, and live pattern testing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/training"
            className="btn-amber-pill inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all"
          >
            <GraduationCap className="h-4 w-4 text-black" /> Training Center
          </Link>
        </div>
      </div>

      {/* Deterministic vs AI Hybrid Path Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-panel p-6 rounded-3xl border border-pass/30 space-y-3">
          <h3 className="text-sm font-serif font-bold text-pass flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> 1. Deterministic Rule Engine Path (Known Syntax)
          </h3>
          <ol className="space-y-2 text-xs font-mono text-slate-300">
            <li className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-pass text-black flex items-center justify-center font-bold text-[10px]">1</span> Known vendor syntax block</li>
            <li className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-pass text-black flex items-center justify-center font-bold text-[10px]">2</span> Line-aware parser AST</li>
            <li className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-pass text-black flex items-center justify-center font-bold text-[10px]">3</span> Rule catalog match (CIS/NIST/STIG/ISO)</li>
            <li className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-pass text-black flex items-center justify-center font-bold text-[10px]">4</span> Instant pass/fail evidence fact</li>
          </ol>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-[#f59e0b]/40 space-y-3">
          <h3 className="text-sm font-serif font-bold text-[#f59e0b] flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> 2. AI Machine Learning Path (Unknown / Novel Syntax)
          </h3>
          <ol className="space-y-2 text-xs font-mono text-slate-300">
            <li className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-[#f59e0b] text-black flex items-center justify-center font-bold text-[10px]">1</span> Unrecognized configuration line</li>
            <li className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-[#f59e0b] text-black flex items-center justify-center font-bold text-[10px]">2</span> TF-IDF vector similarity calculation</li>
            <li className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-[#f59e0b] text-black flex items-center justify-center font-bold text-[10px]">3</span> Random Forest classification prediction</li>
            <li className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-[#f59e0b] text-black flex items-center justify-center font-bold text-[10px]">4</span> Confidence Gate check (&lt;85% to Review)</li>
          </ol>
        </div>
      </div>

      {/* Metrics Row */}
      {telemetry && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-panel p-6 rounded-3xl border border-[#1f222a]">
            <span className="text-xs font-mono text-slate-400 uppercase">Model Provenance</span>
            <div className="mt-2 text-2xl font-bold text-white font-mono">{telemetry.model_version}</div>
            <p className="text-[11px] text-slate-500 mt-1">Active Inference Engine</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-[#1f222a]">
            <span className="text-xs font-mono text-slate-400 uppercase">Classification Accuracy</span>
            <div className="mt-2 text-3xl font-bold text-pass font-mono">
              {(telemetry.accuracy * 100).toFixed(2)}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Held-out Evaluation Set</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-[#1f222a]">
            <span className="text-xs font-mono text-slate-400 uppercase">Macro F1-Score</span>
            <div className="mt-2 text-3xl font-bold text-[#f59e0b] font-mono">
              {(telemetry.macro_f1 * 100).toFixed(2)}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Balanced Metric across classes</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-[#1f222a]">
            <span className="text-xs font-mono text-slate-400 uppercase">Training Dataset Size</span>
            <div className="mt-2 text-2xl font-bold text-white font-mono">
              {telemetry.total_samples || telemetry.sample_count} Samples
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Synthetic & Verified Snippets</p>
          </div>
        </div>
      )}

      {/* Live Pattern Testing Sandbox */}
      <div className="glass-panel p-7 rounded-3xl border border-[#1f222a] space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#f59e0b]" />
          Interactive Pattern Classification Sandbox
        </h2>
        <p className="text-xs text-slate-400">
          Test any arbitrary configuration line to inspect real-time ML classification, similarity score, and review threshold routing.
        </p>

        <form onSubmit={handlePredict} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-mono text-slate-400 mb-1">Syntax Snippet</label>
              <input
                type="text"
                value={testSnippet}
                onChange={(e) => setTestSnippet(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs font-mono focus:border-[#f59e0b] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Vendor</label>
              <select
                value={testVendor}
                onChange={(e) => setTestVendor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs font-mono focus:border-[#f59e0b] focus:outline-none"
              >
                <option value="cisco">Cisco IOS</option>
                <option value="junos">Juniper Junos</option>
                <option value="fortios">Fortinet FortiOS</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={testing}
            className="btn-amber-pill inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all"
          >
            <Play className="h-3.5 w-3.5 text-black" /> Run Inference Prediction
          </button>
        </form>

        {prediction && (
          <div className="p-5 rounded-2xl bg-[#08090d] border border-[#1f222a] space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Inference Result:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                prediction.confidence >= 0.85 ? 'bg-pass/20 text-pass border border-pass/30' : 'bg-warning/20 text-warning border border-warning/30'
              }`}>
                {(prediction.confidence * 100).toFixed(1)}% Confidence
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Predicted Domain</span>
                <span className="font-bold text-white">{prediction.predicted_category}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Predicted Severity</span>
                <span className="font-bold text-[#f59e0b]">{prediction.predicted_severity}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Review Action</span>
                <span className="font-bold text-white">
                  {prediction.requires_review ? 'Route to Review Queue' : 'Auto-Approve'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
