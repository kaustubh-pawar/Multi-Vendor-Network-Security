'use client';

import React, { useEffect, useState } from 'react';
import { Wrench, Copy, Check, Filter, Search, Terminal } from 'lucide-react';
import { fetchRemediationItems } from '@/lib/api';

export default function RemediationPage() {
  const [items, setItems] = useState<any[]>([]);
  const [vendor, setVendor] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const pageSize = 15;

  useEffect(() => {
    async function loadRemediation() {
      setLoading(true);
      try {
        const data = await fetchRemediationItems(vendor === 'all' ? undefined : vendor);
        setItems(data);
      } catch (err) {
        console.error('Error fetching remediation items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRemediation();
  }, [vendor]);

  const copyScript = (id: number, script: string) => {
    navigator.clipboard.writeText(script);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.rule_code.toLowerCase().includes(search.toLowerCase()) ||
    i.hostname.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold tracking-widest text-[#f59e0b] uppercase">Hardening Guidance</span>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-white">Remediation Center</h1>
        <p className="text-xs text-slate-400 font-sans">
          Actionable CLI fix commands and step-by-step resolution scripts for non-compliant controls across 500 audited devices.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-[#1f222a] flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search remediation scripts by title, rule code, or host..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:outline-none focus:border-[#f59e0b] font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={vendor}
            onChange={(e) => { setVendor(e.target.value); setPage(1); }}
            className="px-3.5 py-2 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:outline-none font-mono"
          >
            <option value="all">All Vendors</option>
            <option value="cisco">Cisco IOS</option>
            <option value="junos">Juniper Junos</option>
            <option value="fortios">Fortinet FortiOS</option>
          </select>
        </div>
      </div>

      {/* Remediation Cards */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 font-mono animate-pulse">
          Loading vendor remediation scripts...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-2">
          <p className="text-sm font-bold text-white">No pending remediation items found for selected vendor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginated.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-3xl border border-[#1f222a] space-y-4 hover:border-[#f59e0b]/40 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded font-bold uppercase bg-fail/10 text-fail border border-fail/30">
                      {item.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#18191e] border border-[#282b36] text-white uppercase">
                      {item.vendor} OS
                    </span>
                    <span className="text-white font-bold">{item.hostname}</span>
                    <span className="text-slate-400">• {item.rule_code}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                </div>

                <button
                  onClick={() => copyScript(item.id, item.remediation_script)}
                  className="btn-amber-pill inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all self-start md:self-auto"
                >
                  {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-black" /> : <Copy className="h-3.5 w-3.5 text-black" />}
                  {copiedId === item.id ? 'Copied Script' : 'Copy Remediation CLI'}
                </button>
              </div>

              {/* Fix Command Box */}
              <div className="p-4 rounded-2xl bg-[#08090d] border border-[#1f222a] font-mono space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#f59e0b] font-bold">
                  <Terminal className="h-4 w-4" /> Vendor Fix Commands ({item.vendor.toUpperCase()} CLI)
                </div>
                <pre className="text-xs text-amber-200 whitespace-pre-wrap bg-[#050505] p-3 rounded-xl border border-white/5">
                  {item.remediation_script || 'No specific fix script available.'}
                </pre>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4 text-xs font-mono text-slate-400">
            <span>Showing Page {page} of {totalPages} ({filtered.length} Items)</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl bg-[#14151a] border border-[#22252e] disabled:opacity-40 hover:bg-[#1c1e26] text-white"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-xl bg-[#14151a] border border-[#22252e] disabled:opacity-40 hover:bg-[#1c1e26] text-white"
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
