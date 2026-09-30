'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Server, ArrowUpRight, Search, Plus, Cpu, Layers } from 'lucide-react';
import { fetchMonitoredDevices } from '@/lib/api';

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 15;

  useEffect(() => {
    async function loadDevices() {
      try {
        const data = await fetchMonitoredDevices();
        setDevices(data);
      } catch (err) {
        console.error('Error fetching devices:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDevices();
  }, []);

  const filtered = devices.filter(d =>
    d.hostname.toLowerCase().includes(search.toLowerCase()) ||
    d.vendor.toLowerCase().includes(search.toLowerCase()) ||
    (d.device_type && d.device_type.toLowerCase().includes(search.toLowerCase())) ||
    (d.device_model && d.device_model.toLowerCase().includes(search.toLowerCase())) ||
    d.ip_address.includes(search)
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-[#f59e0b] uppercase">Monitored Infrastructure</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] font-bold">
              Device List Verified
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-white">Network Devices Inventory</h1>
          <p className="text-xs text-slate-400 font-sans">
            Comprehensive Device List displaying Device Type, Hardware Model, Hostname, Vendor, and Real-Time Compliance Score across monitored nodes.
          </p>
        </div>

        <Link
          href="/configurations/upload"
          className="btn-amber-pill inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all self-start md:self-auto shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
          <Plus className="h-4 w-4" /> Add Device / Run Audit
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-[#1f222a] flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 block uppercase font-bold">Total Device List</span>
            <span className="text-2xl font-serif font-bold text-white">{devices.length || 500} Nodes</span>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b]">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#1f222a] flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 block uppercase font-bold">Device Types</span>
            <span className="text-2xl font-serif font-bold text-white">Switches, Routers, FWs</span>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#1f222a] flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 block uppercase font-bold">Hardware Models</span>
            <span className="text-2xl font-serif font-bold text-white">Catalyst, SRX, FortiGate</span>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#1f222a]">
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search Device List by Type (e.g. Core Switch, Firewall), Model (e.g. Catalyst 9300, SRX300), Hostname, or IP..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:outline-none focus:border-[#f59e0b] font-mono"
          />
        </div>
      </div>

      {/* Device Table */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1f222a] pb-3">
          <span className="font-mono text-xs font-bold text-[#f59e0b] uppercase tracking-wider">
            Network Device List ({filtered.length} Items)
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Page {page} of {totalPages}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 font-mono animate-pulse">
            Loading Device List inventory...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1f222a] text-slate-400 uppercase text-[11px]">
                    <th className="py-3 px-4">Device Hostname</th>
                    <th className="py-3 px-4">Device Type</th>
                    <th className="py-3 px-4">Hardware Model</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f222a]/50">
                  {paginated.map((d) => (
                    <tr key={d.hostname} className="hover:bg-[#18191e]/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white font-sans flex items-center gap-2">
                        <Server className="h-4 w-4 text-[#f59e0b] shrink-0" />
                        {d.hostname}
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">
                        <span className="px-2 py-0.5 rounded bg-[#161822] border border-[#242736] text-[#00f0ff] font-semibold text-[11px]">
                          {d.device_type || 'Core Switch'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-semibold">
                        {d.device_model || 'Catalyst 9300'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{d.ip_address}</td>
                      <td className="py-3.5 px-4 uppercase text-slate-300 font-bold">{d.vendor}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          d.compliance_score >= 80 ? 'bg-pass/10 text-pass border border-pass/30' : 'bg-fail/10 text-fail border border-fail/30'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{d.compliance_score.toFixed(1)}%</td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/audit/${d.id}`}
                          className="btn-black-pill inline-flex items-center gap-1 px-3 py-1.5 transition-all text-[11px] font-sans font-semibold"
                        >
                          Audit <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-3 text-xs font-mono text-slate-400 border-t border-[#1f222a]">
              <span>Showing Page {page} of {totalPages} ({filtered.length} Monitored Devices)</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3.5 py-1.5 rounded-xl bg-[#14151a] border border-[#22252e] disabled:opacity-40 hover:bg-[#1c1e26] text-white transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3.5 py-1.5 rounded-xl bg-[#14151a] border border-[#22252e] disabled:opacity-40 hover:bg-[#1c1e26] text-white transition-colors"
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
