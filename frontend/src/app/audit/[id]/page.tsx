'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  Download,
  Copy,
  Check,
  Code2,
  Sparkles
} from 'lucide-react';
import { fetchAuditJobById } from '@/lib/api';

export default function AuditJobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'FAIL' | 'PASS'>('FAIL');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    async function loadJob() {
      try {
        const data = await fetchAuditJobById(jobId);
        setJob(data);
      } catch (err) {
        console.error('Error fetching audit job:', err);
      } finally {
        setLoading(false);
      }
    }
    if (jobId) loadJob();
  }, [jobId]);

  const copyRemediation = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-2 border-[#f59e0b] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-xs text-slate-400 font-mono">Retrieving audit evidence and compliance mappings...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-white">Audit Job Not Found</h2>
        <Link href="/dashboard" className="text-xs text-[#f59e0b] font-mono font-bold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const filteredFindings = job.findings.filter((f: any) => {
    if (activeTab === 'FAIL') return f.status === 'FAIL';
    if (activeTab === 'PASS') return f.status === 'PASS';
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="glass-panel p-7 rounded-3xl border border-[#1f222a] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 font-mono">
            <span className="text-xs font-bold text-[#f59e0b] uppercase">{job.vendor} OS</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Job #{job.job_number}</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">{job.hostname}</h1>
          <p className="text-xs text-slate-400 font-mono">
            Audited on {new Date(job.created_at).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className={`text-4xl font-serif font-bold ${
              job.compliance_score >= 80 ? 'text-pass' : 'text-fail'
            }`}>
              {job.compliance_score.toFixed(1)}%
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase font-medium">Compliance Score</span>
          </div>

          <div className="h-10 w-px bg-[#1f222a]"></div>

          <div className="flex flex-col gap-2">
            <a
              href={`http://127.0.0.1:8000/api/reports/pdf/${job.id}`}
              target="_blank"
              rel="noreferrer"
              className="btn-amber-pill inline-flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all"
            >
              <Download className="h-3.5 w-3.5 text-black" /> Download PDF Report
            </a>
            <a
              href={`http://127.0.0.1:8000/api/reports/excel/${job.id}`}
              target="_blank"
              rel="noreferrer"
              className="btn-black-pill inline-flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all"
            >
              <Download className="h-3.5 w-3.5 text-[#f59e0b]" /> Download Excel Matrix
            </a>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#1f222a] gap-4">
        <button
          onClick={() => setActiveTab('FAIL')}
          className={`pb-3 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'FAIL' ? 'border-fail text-fail' : 'border-transparent text-slate-400'
          }`}
        >
          <ShieldAlert className="h-4 w-4" /> Non-Compliant Controls ({job.failed_rules})
        </button>
        <button
          onClick={() => setActiveTab('PASS')}
          className={`pb-3 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'PASS' ? 'border-pass text-pass' : 'border-transparent text-slate-400'
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Compliant Controls ({job.passed_rules})
        </button>
        <button
          onClick={() => setActiveTab('ALL')}
          className={`pb-3 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'ALL' ? 'border-[#f59e0b] text-[#f59e0b]' : 'border-transparent text-slate-400'
          }`}
        >
          All Evaluated Controls ({job.total_rules})
        </button>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.map((f: any) => {
          const isFail = f.status === 'FAIL';
          const sevColor = f.severity === 'CRITICAL' ? 'bg-fail/10 text-fail border-fail/30' : 'bg-warning/10 text-warning border-warning/30';

          return (
            <div
              key={f.id}
              className="glass-panel p-7 rounded-3xl border border-[#1f222a] space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap font-mono text-[10px]">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold border uppercase ${sevColor}`}>
                      {f.severity}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#18191e] border border-[#282b36] text-white">
                      {f.category}
                    </span>
                    <span className="text-slate-400">{f.rule_code}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white">{f.title}</h3>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold self-start md:self-auto ${
                  isFail ? 'bg-fail/10 text-fail border border-fail/30' : 'bg-pass/10 text-pass border border-pass/30'
                }`}>
                  {f.status}
                </span>
              </div>

              {/* Line Evidence Highlight */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 font-medium">
                  <Code2 className="h-3.5 w-3.5 text-[#f59e0b]" /> Configuration Evidence Line {f.evidence_start_line}
                </span>
                <div className="p-4 rounded-2xl bg-[#08090d] border border-[#1f222a] font-mono text-xs text-amber-200 flex items-center justify-between">
                  <code>{f.evidence_raw || 'No evidence line found'}</code>
                  <span className="text-[10px] text-slate-500">Line #{f.evidence_start_line}</span>
                </div>
              </div>

              {/* Vendor Remediation Guidance */}
              {isFail && f.remediation && (
                <div className="p-4 rounded-2xl bg-[#14151a] border border-[#22252e] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#f59e0b] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#f59e0b]" /> Vendor Remediation Command ({String(job.vendor).toUpperCase()})
                    </span>
                    <button
                      onClick={() => copyRemediation(f.id, f.remediation)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-all font-medium"
                    >
                      {copiedId === f.id ? <Check className="h-3.5 w-3.5 text-pass" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedId === f.id ? 'Copied' : 'Copy Remediation'}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-amber-200 whitespace-pre-wrap bg-[#050505] p-3.5 rounded-xl border border-white/5">
                    {f.remediation}
                  </pre>
                </div>
              )}

              {/* Multi-Framework Cross Reference Mapping */}
              <div className="pt-2 border-t border-[#1f222a] flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <span className="text-slate-400 font-medium">Framework Mappings:</span>
                {f.cis_mapping && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300">
                    {f.cis_mapping}
                  </span>
                )}
                {f.nist_mapping && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300">
                    {f.nist_mapping}
                  </span>
                )}
                {f.stig_mapping && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    {f.stig_mapping}
                  </span>
                )}
                {f.iso_mapping && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300">
                    {f.iso_mapping}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
