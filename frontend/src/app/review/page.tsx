'use client';

import React, { useEffect, useState } from 'react';
import { UserCheck, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, Check, X, ShieldAlert, Server } from 'lucide-react';
import { fetchReviewQueue, submitReviewDecision } from '@/lib/api';

export default function ReviewQueuePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await fetchReviewQueue();
      setQueue(data);
    } catch (err) {
      console.error('Error fetching review queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleDecision = async (item: any, action: 'CONFIRMED' | 'OVERRIDDEN' | 'REJECTED', overrideSeverity?: string) => {
    try {
      await submitReviewDecision({
        job_id: item.job_id,
        finding_id: item.id,
        snippet_raw: item.evidence_raw || item.title,
        vendor: item.vendor || 'cisco',
        reviewer_action: action,
        corrected_severity: overrideSeverity || item.severity,
        reviewer_notes: `Auditor decision: ${action} via Human-in-the-loop review interface.`
      });

      setSuccessMsg(`Finding #${item.id} (${item.rule_code}) recorded as ${action}!`);
      setQueue(prev => prev.filter(q => q.id !== item.id));
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error('Error submitting review decision:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#f59e0b] uppercase">Human Audit Oversight</span>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-white flex items-center gap-3">
            Human-in-the-Loop Review Queue
            <span className="px-3 py-0.5 rounded-full text-xs font-mono bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] font-bold uppercase">
              AI Confidence Gate
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review low-confidence ML predictions (&lt;85% confidence) and novel syntax patterns to provide auditable human feedback.
          </p>
        </div>

        <button
          onClick={loadQueue}
          className="btn-black-pill inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold transition-all self-start md:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Queue
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-pass/10 border border-pass/30 text-pass text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {successMsg}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 animate-pulse font-mono">
          Fetching review queue items from database...
        </div>
      ) : queue.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-[#1f222a] text-center space-y-3">
          <CheckCircle2 className="h-10 w-10 text-pass mx-auto" />
          <h3 className="text-base font-bold text-white">Queue Empty — All AI Predictions Verified</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No pending low-confidence configuration snippets require human review at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-3xl border border-[#1f222a] space-y-4 hover:border-[#f59e0b]/40 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap font-mono text-[10px]">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30">
                      AI Confidence: {((item.ai_confidence || 0.78) * 100).toFixed(0)}%
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#18191e] border border-[#282b36] text-white uppercase font-bold">
                      {item.vendor} OS
                    </span>
                    <span className="text-white font-bold flex items-center gap-1">
                      <Server className="h-3 w-3 text-[#f59e0b]" /> {item.hostname}
                    </span>
                    <span className="text-slate-400">• {item.rule_code}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleDecision(item, 'CONFIRMED')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-pass/10 border border-pass/30 text-pass hover:bg-pass/20 transition-all text-xs font-mono font-semibold"
                  >
                    <Check className="h-3.5 w-3.5" /> Confirm Prediction
                  </button>
                  <button
                    onClick={() => handleDecision(item, 'OVERRIDDEN', 'CRITICAL')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-fail/10 border border-fail/30 text-fail hover:bg-fail/20 transition-all text-xs font-mono font-semibold"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" /> Override Severity
                  </button>
                  <button
                    onClick={() => handleDecision(item, 'REJECTED')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#18191e] border border-[#282b36] text-slate-400 hover:text-white transition-all text-xs font-mono font-semibold"
                  >
                    <X className="h-3.5 w-3.5" /> Dismiss
                  </button>
                </div>
              </div>

              {/* Evidence Snippet */}
              <div className="p-4 rounded-2xl bg-[#08090d] border border-[#1f222a] font-mono text-xs text-amber-200">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span>Target Evidence Snippet:</span>
                  <span>Line #{item.evidence_start_line || 1}</span>
                </div>
                <code>{item.evidence_raw || item.title}</code>
              </div>

              {/* Framework mappings tags */}
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono pt-1">
                {item.cis_mapping && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300">
                    {item.cis_mapping}
                  </span>
                )}
                {item.nist_mapping && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300">
                    {item.nist_mapping}
                  </span>
                )}
                {item.stig_mapping && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    {item.stig_mapping}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
