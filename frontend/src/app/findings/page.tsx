'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Copy, Check, Search, ArrowUpRight } from 'lucide-react';
import { fetchAllFindings } from '@/lib/api';

export default function FindingsPage() {
  const [findings, setFindings] = useState<any[]>([]);
  const [severity, setSeverity] = useState('ALL');
  const [vendor, setVendor] = useState('ALL');
  const [status, setStatus] = useState('FAIL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const pageSize = 15;

  useEffect(() => {
    async function loadFindings() {
      setLoading(true);
      try {
        const data = await fetchAllFindings(
          severity === 'ALL' ? undefined : severity,
          vendor === 'ALL' ? undefined : vendor,
          status === 'ALL' ? undefined : status
        );
        setFindings(data);
      } catch (err) {
        console.error('Error fetching findings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFindings();
  }, [severity, vendor, status]);

  const copyRemediation = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = findings.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.rule_code.toLowerCase().includes(search.toLowerCase()) ||
    f.hostname.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">Security Evidence Telemetry</span>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-white">Central Security Findings Database</h1>
        <p className="text-xs text-muted-foreground font-sans">
          Evidence-backed security flaws discovered across 500 network device audits (3,760 Total Findings).
        </p>
      </div>

      {/* Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-primary/20 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search findings across 500 devices by title, rule code, or host..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-overlay border border-border text-white text-xs focus:outline-none focus:border-primary font-mono"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          <select
            value={severity}
            onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl bg-surface-overlay border border-border text-white focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={vendor}
            onChange={(e) => { setVendor(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl bg-surface-overlay border border-border text-white focus:outline-none"
          >
            <option value="ALL">All Vendors</option>
            <option value="cisco">Cisco IOS</option>
            <option value="junos">Juniper Junos</option>
            <option value="fortios">Fortinet FortiOS</option>
          </select>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl bg-surface-overlay border border-border text-white focus:outline-none"
          >
            <option value="FAIL">Failed Controls Only</option>
            <option value="PASS">Compliant Controls Only</option>
            <option value="ALL">All Statuses</option>
          </select>
        </div>
      </div>

      {/* Findings Cards */}
      {loading ? (
        <div className="py-16 text-center text-xs text-muted-foreground font-mono animate-pulse">
          Loading security findings database...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-2">
          <p className="text-sm font-bold text-white">No security findings matched selected filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginated.map((f) => (
            <div
              key={f.id}
              className="glass-panel p-6 rounded-3xl border border-primary/20 space-y-4 hover:border-primary/40 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap font-mono text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-bold border uppercase ${
                      f.severity === 'CRITICAL' ? 'bg-fail/10 text-fail border-fail/30' : 'bg-warning/10 text-warning border-warning/30'
                    }`}>
                      {f.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-overlay border border-white/10 text-white uppercase">
                      {f.vendor}
                    </span>
                    <span className="text-white font-bold">{f.hostname}</span>
                    <span className="text-muted-foreground">• {f.rule_code}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                </div>

                <Link
                  href={`/audit/${f.job_id}`}
                  className="btn-black-pill inline-flex items-center gap-1 px-3 py-1.5 transition-all text-[11px] font-mono self-start md:self-auto"
                >
                  Audit Details <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Line Evidence */}
              <div className="p-3.5 rounded-2xl bg-[#04060a] border border-border font-mono text-xs text-cyan-300 flex items-center justify-between">
                <code>{f.evidence_raw || 'No evidence snippet available'}</code>
                <span className="text-[10px] text-muted-foreground ml-4">Line #{f.evidence_start_line}</span>
              </div>

              {/* Framework Mapping Tags */}
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                {f.cis_mapping && (
                  <span className="px-2.5 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300">
                    {f.cis_mapping}
                  </span>
                )}
                {f.nist_mapping && (
                  <span className="px-2.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                    {f.nist_mapping}
                  </span>
                )}
                {f.stig_mapping && (
                  <span className="px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    {f.stig_mapping}
                  </span>
                )}
                {f.iso_mapping && (
                  <span className="px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300">
                    {f.iso_mapping}
                  </span>
                )}
              </div>

              {/* Vendor Fix Guidance */}
              {f.remediation && (
                <div className="p-4 rounded-2xl bg-surface-overlay/60 border border-primary/20 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-primary font-bold">
                    <span>Remediation Fix Snippet ({f.vendor.toUpperCase()}):</span>
                    <button
                      onClick={() => copyRemediation(f.id, f.remediation)}
                      className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-all"
                    >
                      {copiedId === f.id ? <Check className="h-3 w-3 text-pass" /> : <Copy className="h-3 w-3" />}
                      {copiedId === f.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-200 whitespace-pre-wrap bg-[#080d1a] p-3 rounded-xl border border-white/5">
                    {f.remediation}
                  </pre>
                </div>
              )}
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4 text-xs font-mono text-muted-foreground">
            <span>Showing Page {page} of {totalPages} ({filtered.length} Findings)</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl bg-surface-overlay border border-border disabled:opacity-40 hover:bg-surface-overlay/80 text-white"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-xl bg-surface-overlay border border-border disabled:opacity-40 hover:bg-surface-overlay/80 text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
