'use client';

import React, { useState } from 'react';
import { Settings, Shield, Sliders, Database, Server, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [confidenceGate, setConfidenceGate] = useState(85);
  const [sshTimeout, setSshTimeout] = useState(30);
  const [autoRetrain, setAutoRetrain] = useState(true);
  const [activeFrameworks, setActiveFrameworks] = useState({
    cis: true,
    nist: true,
    stig: true,
    iso: true,
  });
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-[#f59e0b] uppercase">Platform Administration</span>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-white flex items-center gap-3">
          Auditor Engine Settings
          <span className="px-3 py-0.5 rounded-full text-xs font-mono bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] font-bold uppercase">
            System Config
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure multi-vendor compliance rule engine parameters, AI confidence thresholds, and SSH collection parameters.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-pass/10 border border-pass/30 text-pass text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> Platform settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Framework Activation */}
        <div className="glass-panel p-7 rounded-3xl border border-[#1f222a] space-y-4">
          <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#f59e0b]" /> Active Compliance Frameworks
          </h2>
          <p className="text-xs text-slate-400">Select which security standards are evaluated during automated configuration parsing.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="p-4 rounded-2xl bg-[#08090d] border border-[#1f222a] flex items-center justify-between cursor-pointer hover:border-[#f59e0b]/40 transition-all">
              <div>
                <span className="text-xs font-mono font-bold text-white block">CIS Benchmarks (L1/L2)</span>
                <span className="text-[11px] text-slate-400">Cisco IOS, Junos & FortiOS consensus</span>
              </div>
              <input
                type="checkbox"
                checked={activeFrameworks.cis}
                onChange={(e) => setActiveFrameworks({ ...activeFrameworks, cis: e.target.checked })}
                className="h-4 w-4 accent-[#f59e0b] rounded"
              />
            </label>

            <label className="p-4 rounded-2xl bg-[#08090d] border border-[#1f222a] flex items-center justify-between cursor-pointer hover:border-[#f59e0b]/40 transition-all">
              <div>
                <span className="text-xs font-mono font-bold text-white block">NIST SP 800-53 Rev 5</span>
                <span className="text-[11px] text-slate-400">Federal security controls (AC, AU, SC, IA)</span>
              </div>
              <input
                type="checkbox"
                checked={activeFrameworks.nist}
                onChange={(e) => setActiveFrameworks({ ...activeFrameworks, nist: e.target.checked })}
                className="h-4 w-4 accent-[#f59e0b] rounded"
              />
            </label>

            <label className="p-4 rounded-2xl bg-[#08090d] border border-[#1f222a] flex items-center justify-between cursor-pointer hover:border-[#f59e0b]/40 transition-all">
              <div>
                <span className="text-xs font-mono font-bold text-white block">DISA STIG (DoD)</span>
                <span className="text-[11px] text-slate-400">Department of Defense hardening guides</span>
              </div>
              <input
                type="checkbox"
                checked={activeFrameworks.stig}
                onChange={(e) => setActiveFrameworks({ ...activeFrameworks, stig: e.target.checked })}
                className="h-4 w-4 accent-[#f59e0b] rounded"
              />
            </label>

            <label className="p-4 rounded-2xl bg-[#08090d] border border-[#1f222a] flex items-center justify-between cursor-pointer hover:border-[#f59e0b]/40 transition-all">
              <div>
                <span className="text-xs font-mono font-bold text-white block">ISO/IEC 27001:2022</span>
                <span className="text-[11px] text-slate-400">International security management standard</span>
              </div>
              <input
                type="checkbox"
                checked={activeFrameworks.iso}
                onChange={(e) => setActiveFrameworks({ ...activeFrameworks, iso: e.target.checked })}
                className="h-4 w-4 accent-[#f59e0b] rounded"
              />
            </label>
          </div>
        </div>

        {/* AI & SSH Parameters */}
        <div className="glass-panel p-7 rounded-3xl border border-[#1f222a] space-y-5">
          <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#f59e0b]" /> AI Confidence & Ingestion Parameters
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Human Review Confidence Gate (%)</span>
                <span className="text-[#f59e0b] font-bold">{confidenceGate}% Threshold</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={confidenceGate}
                onChange={(e) => setConfidenceGate(parseInt(e.target.value))}
                className="w-full accent-[#f59e0b]"
              />
              <p className="text-[11px] text-slate-500 mt-1">Predictions below this score route to the Human Review Queue.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">SSH Connection Timeout (Seconds)</label>
                <input
                  type="number"
                  value={sshTimeout}
                  onChange={(e) => setSshTimeout(parseInt(e.target.value) || 30)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs font-mono focus:border-[#f59e0b] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#08090d] border border-[#1f222a]">
                <div>
                  <span className="text-xs font-mono font-bold text-white block">Auto Retraining Pipeline</span>
                  <span className="text-[11px] text-slate-400">Retrain model when 5 decisions approved</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoRetrain}
                  onChange={(e) => setAutoRetrain(e.target.checked)}
                  className="h-4 w-4 accent-[#f59e0b] rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="glass-panel p-7 rounded-3xl border border-[#1f222a] space-y-3">
          <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <Database className="h-4 w-4 text-[#f59e0b]" /> Active Audit Database Provenance
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-1">
            <div className="p-3.5 rounded-2xl bg-[#08090d] border border-[#1f222a]">
              <span className="text-slate-500 text-[10px] block">Database Engine</span>
              <span className="text-white font-bold">SQLite 3.42</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#08090d] border border-[#1f222a]">
              <span className="text-slate-500 text-[10px] block">Audited Devices</span>
              <span className="text-[#f59e0b] font-bold">500 Nodes</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#08090d] border border-[#1f222a]">
              <span className="text-slate-500 text-[10px] block">Total Findings</span>
              <span className="text-white font-bold">3,784 Items</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#08090d] border border-[#1f222a]">
              <span className="text-slate-500 text-[10px] block">AI Model Card</span>
              <span className="text-pass font-bold">v1.2.0-rf-tfidf</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-amber-pill px-6 py-3 text-xs font-bold inline-flex items-center gap-2"
        >
          <Save className="h-4 w-4 text-black" /> Save Platform Settings
        </button>
      </form>
    </div>
  );
}
