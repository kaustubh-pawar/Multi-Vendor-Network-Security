'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { fetchAuditJobs } from '@/lib/api';

export default function AuditLogsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 15;

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await fetchAuditJobs();
        setJobs(data);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const filtered = jobs.filter(j =>
    j.job_number.toLowerCase().includes(search.toLowerCase()) ||
    j.hostname.toLowerCase().includes(search.toLowerCase()) ||
    j.vendor.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold tracking-widest text-[#f59e0b] uppercase">System Audit Trails</span>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-white">Audit Logs & History</h1>
        <p className="text-xs text-slate-400 font-sans">
          Historical record of all 500 configuration audit jobs executed by the compliance engine.
        </p>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-[#1f222a]">
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search 500 audit logs by Job ID, host, or vendor..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:outline-none focus:border-[#f59e0b] font-mono"
          />
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 space-y-4 border border-[#1f222a]">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 font-mono animate-pulse">
            Loading audit logs...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1f222a] text-slate-400 uppercase text-[11px]">
                    <th className="py-3 px-4">Job Number</th>
                    <th className="py-3 px-4">Hostname</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Compliance Score</th>
                    <th className="py-3 px-4">Audit Timestamp</th>
                    <th className="py-3 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f222a]/50">
                  {paginated.map((j) => (
                    <tr key={j.id} className="hover:bg-[#18191e]/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#f59e0b]">{j.job_number}</td>
                      <td className="py-3.5 px-4 text-white font-sans font-semibold">{j.hostname}</td>
                      <td className="py-3.5 px-4 uppercase text-slate-300">{j.vendor}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          j.compliance_score >= 80 ? 'bg-pass/10 text-pass border border-pass/30' : 'bg-fail/10 text-fail border border-fail/30'
                        }`}>
                          {j.compliance_score.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{new Date(j.created_at).toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/audit/${j.id}`}
                          className="btn-black-pill inline-flex items-center gap-1 px-3 py-1.5 transition-all text-[11px] font-sans font-semibold"
                        >
                          Inspect <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-3 text-xs font-mono text-slate-400 border-t border-[#1f222a]">
              <span>Showing Page {page} of {totalPages} ({filtered.length} Jobs)</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-lg bg-[#14151a] border border-[#22252e] disabled:opacity-40 hover:bg-[#1c1e26] text-white"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded-lg bg-[#14151a] border border-[#22252e] disabled:opacity-40 hover:bg-[#1c1e26] text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
