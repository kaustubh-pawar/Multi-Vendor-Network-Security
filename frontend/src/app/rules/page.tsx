'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { fetchRulesCatalog } from '@/lib/api';

export default function RuleCatalogPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [vendorFilter, setVendorFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRules() {
      try {
        const data = await fetchRulesCatalog(vendorFilter === 'all' ? undefined : vendorFilter);
        setRules(data);
      } catch (err) {
        console.error('Error fetching rules:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRules();
  }, [vendorFilter]);

  const filteredRules = rules.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.rule_code.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold tracking-widest text-[#f59e0b] uppercase">Deterministic Control Catalog</span>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-white">Rule & Framework Catalog</h1>
        <p className="text-xs text-slate-400 font-sans">
          30+ Machine-checkable security rules mapped to CIS Benchmarks, NIST SP 800-53, DISA STIG, and ISO 27001.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#1f222a] flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search rules by code, title, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:outline-none focus:border-[#f59e0b] font-mono"
          />
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#14151a] border border-[#22252e] text-white focus:outline-none font-mono"
          >
            <option value="all">All Vendors</option>
            <option value="cisco">Cisco IOS</option>
            <option value="junos">Juniper Junos</option>
            <option value="fortios">Fortinet FortiOS</option>
          </select>
        </div>
      </div>

      {/* Rules Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 animate-pulse font-mono">
          Loading verified security rule catalog...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRules.map((rule) => (
            <div
              key={rule.rule_code}
              className="glass-panel glass-panel-hover p-7 rounded-3xl border border-[#1f222a] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-[#f59e0b]">{rule.rule_code}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#18191e] border border-[#282b36] text-white">
                    {rule.vendor}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-white">{rule.title}</h3>
                <p className="text-xs text-slate-400">{rule.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#1f222a]">
                <div className="p-3.5 rounded-2xl bg-[#08090d] border border-[#1f222a] font-mono text-[11px] text-amber-200">
                  <span className="text-slate-400 text-[10px] block mb-1">Pass Regex Pattern:</span>
                  <code>{rule.pass_pattern}</code>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  {rule.cis_mapping && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 font-medium">
                      {rule.cis_mapping}
                    </span>
                  )}
                  {rule.nist_mapping && (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 font-medium">
                      {rule.nist_mapping}
                    </span>
                  )}
                  {rule.stig_mapping && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-medium">
                      {rule.stig_mapping}
                    </span>
                  )}
                  {rule.iso_mapping && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 font-medium">
                      {rule.iso_mapping}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
