'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, ArrowUpRight } from 'lucide-react';
import { fetchFrameworkStats } from '@/lib/api';

const FRAMEWORK_CARDS = [
  {
    id: 'cis',
    name: 'CIS Benchmarks (L1/L2)',
    badge: 'Level 1 & Level 2',
    description: 'Vendor-specific consensus-based security hardening recommendations for Cisco, Juniper, and Fortinet.',
    complianceScore: 85.0,
    color: '#3b82f6',
    controlsCount: 18,
  },
  {
    id: 'nist',
    name: 'NIST SP 800-53 Rev 5',
    badge: 'Federal Compliance',
    description: 'Security and Privacy Controls for Information Systems and Organizations (AC, AU, SC, IA families).',
    complianceScore: 78.5,
    color: '#a855f7',
    controlsCount: 16,
  },
  {
    id: 'stig',
    name: 'DISA STIG',
    badge: 'DoD Hardening',
    description: 'Department of Defense Cyber Exchange Security Technical Implementation Guides for network devices.',
    complianceScore: 72.0,
    color: '#10b981',
    controlsCount: 14,
  },
  {
    id: 'iso',
    name: 'ISO/IEC 27001:2022',
    badge: 'International Standard',
    description: 'Information security management controls (Annex A.9 Access Control, A.12 Operations, A.13 Communications).',
    complianceScore: 90.0,
    color: '#f59e0b',
    controlsCount: 15,
  },
];

export default function FrameworksPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchFrameworkStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching framework stats:', err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold tracking-widest text-[#f59e0b] uppercase">Cross-Standard Mapping</span>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-white">Framework Compliance Correlation Hub</h1>
        <p className="text-xs text-slate-400 font-sans">
          Correlate single multi-vendor configuration findings across CIS Benchmarks, NIST SP 800-53, DISA STIG, and ISO 27001 across 500 device audits.
        </p>
      </div>

      {/* Framework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FRAMEWORK_CARDS.map((fw) => (
          <div
            key={fw.id}
            className="glass-panel glass-panel-hover p-7 rounded-3xl border border-[#1f222a] space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#18191e] border border-[#282b36] text-[#f59e0b]">
                  {fw.badge}
                </span>
                <span className="text-xl font-serif font-bold text-white">{fw.complianceScore}% Score</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-white">{fw.name}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{fw.description}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#1f222a]">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Compliance Adherence</span>
                  <span className="text-[#f59e0b] font-bold">{fw.complianceScore}%</span>
                </div>
                <div className="w-full bg-[#14151a] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${fw.complianceScore}%`, backgroundColor: fw.color }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-slate-400">{fw.controlsCount} Active Mapped Controls</span>
                <Link href="/rules" className="text-[#f59e0b] font-bold hover:underline flex items-center gap-1">
                  View Rules <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
