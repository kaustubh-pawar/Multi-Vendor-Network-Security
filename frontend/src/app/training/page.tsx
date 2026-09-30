'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Sparkles, ArrowRight, Check, Pencil, X, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

const WORKFLOW_STEPS = [
  'Raw Configuration Ingestion',
  'AI TF-IDF Similarity Analysis',
  'Suggested Security Domain',
  'Auditor / Human Review',
  'Normalized AST Mapping',
  'Approval & Rule Catalog Entry'
];

const INITIAL_PATTERNS = [
  {
    id: 'pat-101',
    vendor: 'junos',
    os: 'Junos OS 21.4R1',
    snippet: 'set security ike proposal IKE-PROP-01 encryption-algorithm aes-256-gcm',
    suggestedCategory: 'ENCRYPTION',
    suggestedField: 'ike_proposal_encryption',
    aiInterpretation: 'IKE Proposal Encryption Suite configured for High-Grade AES-256-GCM',
    confidence: 0.88,
    similarityPatterns: [
      { snippet: 'set security ike proposal P1 encryption-algorithm aes-256', similarity: 0.92 },
      { snippet: 'crypto ikev2 proposal IKEv2-PROP encryption aes-cbc-256', similarity: 0.85 }
    ],
    status: 'AI_SUGGESTED'
  },
  {
    id: 'pat-102',
    vendor: 'fortios',
    os: 'FortiOS v7.2.4',
    snippet: 'config system global\n    set Strong-crypto enable\nend',
    suggestedCategory: 'HARDENING',
    suggestedField: 'system_global_strong_crypto',
    aiInterpretation: 'Enforces high-cipher suite TLS 1.3 for administrative HTTPS/SSH sessions',
    confidence: 0.94,
    similarityPatterns: [
      { snippet: 'set ssl-min-proto-version tls-1-2', similarity: 0.89 }
    ],
    status: 'AI_SUGGESTED'
  },
  {
    id: 'pat-103',
    vendor: 'cisco',
    os: 'Cisco IOS-XE 17.06.01',
    snippet: 'ip ssh client algorithm encryption aes256-ctr aes192-ctr',
    suggestedCategory: 'MGMT',
    suggestedField: 'ssh_client_ciphers',
    aiInterpretation: 'Specifies modern CTR mode cipher suite for outbound SSH connections',
    confidence: 0.82,
    similarityPatterns: [
      { snippet: 'ip ssh cipher algorithm aes256-ctr', similarity: 0.91 }
    ],
    status: 'PENDING_REVIEW'
  }
];

export default function TrainingCenterPage() {
  const [patterns, setPatterns] = useState(INITIAL_PATTERNS);
  const [activePattern, setActivePattern] = useState<any | null>(null);
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [reviewNote, setReviewNote] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleDecision = (patternId: string, decision: 'APPROVE' | 'MODIFY' | 'REJECT') => {
    setDecisions(prev => ({ ...prev, [patternId]: decision }));
    setSuccessMsg(`Pattern ${patternId} successfully recorded as ${decision}! Knowledge base updated.`);
    setActivePattern(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#f59e0b] uppercase">Human-in-the-Loop Training</span>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-white flex items-center gap-3">
            AI Training Center & Knowledge Base
            <span className="px-3 py-0.5 rounded-full text-xs font-mono bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] font-bold uppercase">
              Auditor Oversight
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Train the classification engine to recognize novel multi-vendor syntax. Unfamiliar patterns require explicit auditor approval before becoming compliance rules.
          </p>
        </div>

        <Link
          href="/review"
          className="btn-amber-pill inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all self-start md:self-auto"
        >
          <Cpu className="h-4 w-4 text-black" /> Review Queue <ArrowRight className="h-3.5 w-3.5 text-black" />
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-pass/10 border border-pass/30 text-pass text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {successMsg}
        </div>
      )}

      {/* Workflow Strip Card */}
      <div className="glass-panel p-5 rounded-3xl border border-[#1f222a] space-y-3">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Pattern Learning Pipeline Architecture</span>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {WORKFLOW_STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <span className="px-3 py-1.5 rounded-full bg-[#18191e] border border-[#282b36] text-white">
                <span className="text-[#f59e0b] font-bold mr-1.5">{i + 1}.</span> {step}
              </span>
              {i < WORKFLOW_STEPS.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Pattern Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patterns.map((p) => {
          const isDecided = decisions[p.id];
          return (
            <div
              key={p.id}
              className="glass-panel p-6 rounded-3xl border border-[#1f222a] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#18191e] border border-[#282b36] text-white uppercase font-bold">
                      {p.vendor}
                    </span>
                    <span className="text-slate-400">{p.os}</span>
                  </div>

                  {isDecided ? (
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      isDecided === 'REJECT' ? 'bg-fail/10 text-fail border border-fail/30' : 'bg-pass/10 text-pass border border-pass/30'
                    }`}>
                      {isDecided}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30">
                      {(p.confidence * 100).toFixed(0)}% AI Confidence
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Configuration Syntax Snippet:</span>
                  <pre className="p-3.5 rounded-2xl bg-[#08090d] border border-[#1f222a] font-mono text-xs text-amber-200 whitespace-pre-wrap">
                    {p.snippet}
                  </pre>
                </div>

                <div className="p-4 rounded-2xl bg-[#14151a] border border-[#22252e] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#f59e0b] font-bold">
                    <Sparkles className="h-3.5 w-3.5 text-[#f59e0b]" /> AI Suggested Interpretation
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{p.aiInterpretation}</p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
                    <span>Category: <strong className="text-white">{p.suggestedCategory}</strong></span>
                    <span>•</span>
                    <span>Field: <strong className="text-[#f59e0b]">{p.suggestedField}</strong></span>
                  </div>
                </div>
              </div>

              <button
                disabled={!!isDecided}
                onClick={() => setActivePattern(p)}
                className="w-full btn-amber-pill py-2.5 text-xs font-bold transition-all disabled:opacity-40"
              >
                {isDecided ? 'Pattern Reviewed' : 'Review & Train Pattern'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Review Modal Panel */}
      {activePattern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="glass-panel p-7 rounded-3xl border border-[#f59e0b]/40 max-w-2xl w-full space-y-5 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <div className="flex items-center justify-between border-b border-[#1f222a] pb-3">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#f59e0b]" /> Review & Approve Unknown Syntax
              </h3>
              <button onClick={() => setActivePattern(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#18191e] text-white uppercase font-bold">{activePattern.vendor}</span>
                <span className="text-slate-400">{activePattern.os}</span>
              </div>

              <pre className="p-3.5 rounded-2xl bg-[#08090d] border border-[#1f222a] text-amber-200 whitespace-pre-wrap">
                {activePattern.snippet}
              </pre>

              {/* Similar patterns */}
              {activePattern.similarityPatterns && activePattern.similarityPatterns.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 uppercase">Nearest Knowledge Base Match:</span>
                  {activePattern.similarityPatterns.map((sim: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#14151a] border border-[#22252e] flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">{sim.snippet}</span>
                      <span className="text-[#f59e0b] font-bold">{(sim.similarity * 100).toFixed(0)}% match</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1.5 pt-2">
                <label className="block text-slate-400 text-[11px]">Auditor Rationale / Review Note (Optional):</label>
                <textarea
                  rows={2}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Rationale for approving or overriding this configuration pattern..."
                  className="w-full p-3 rounded-xl bg-[#14151a] border border-[#22252e] text-white focus:border-[#f59e0b] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleDecision(activePattern.id, 'APPROVE')}
                className="btn-amber-pill px-5 py-2.5 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Check className="h-4 w-4 text-black" /> Approve Pattern
              </button>
              <button
                onClick={() => handleDecision(activePattern.id, 'MODIFY')}
                className="btn-black-pill px-5 py-2.5 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Pencil className="h-4 w-4" /> Approve with Changes
              </button>
              <button
                onClick={() => handleDecision(activePattern.id, 'REJECT')}
                className="px-5 py-2.5 rounded-full bg-fail/10 border border-fail/30 text-fail hover:bg-fail/20 text-xs font-bold transition-all inline-flex items-center gap-1.5"
              >
                <X className="h-4 w-4" /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
