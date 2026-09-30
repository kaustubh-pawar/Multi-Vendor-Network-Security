'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Server,
  Upload,
  ArrowUpRight,
  Activity,
  Layers,
  FileText,
  Search,
  Cpu,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { fetchAuditJobs, fetchFindingsSummary } from '@/lib/api';

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsData, summaryData] = await Promise.all([
          fetchAuditJobs(),
          fetchFindingsSummary()
        ]);
        setJobs(jobsData);
        setSummary(summaryData);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalJobs = jobs.length;
  const avgScore = totalJobs > 0
    ? (jobs.reduce((acc, j) => acc + j.compliance_score, 0) / totalJobs).toFixed(1)
    : '0.0';

  const severityBarData = [
    { name: 'Critical', count: summary?.critical_count || 0, fill: '#ef4444' },
    { name: 'High', count: summary?.high_count || 0, fill: '#f59e0b' },
    { name: 'Medium', count: summary?.medium_count || 0, fill: '#3b82f6' },
    { name: 'Low', count: summary?.low_count || 0, fill: '#94a3b8' },
  ];

  const frameworkCorrelationData = [
    { name: 'CIS Benchmarks (L1/L2)', score: 85, color: '#3b82f6' },
    { name: 'NIST SP 800-53 Rev 5', score: 78, color: '#a855f7' },
    { name: 'DISA STIG (DoD)', score: 72, color: '#10b981' },
    { name: 'ISO/IEC 27001:2022', score: 90, color: '#d4af37' },
  ];

  const filteredJobs = jobs.filter(j =>
    j.hostname.toLowerCase().includes(search.toLowerCase()) ||
    j.job_number.toLowerCase().includes(search.toLowerCase()) ||
    j.vendor.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredJobs.length / pageSize) || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">Multi-Vendor Security Auditor</span>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-white">Executive Compliance Dashboard</h1>
          <p className="text-xs text-muted-foreground font-sans">
            Real-time security posture and multi-framework correlation across audited network configurations.
          </p>
        </div>

        <Link
          href="/configurations/upload"
          className="btn-gold-pill inline-flex items-center gap-2 px-6 py-3 text-xs font-bold transition-all self-start md:self-auto"
        >
          <Upload className="h-4 w-4" />
          Upload Configuration
        </Link>
      </div>

      {/* 4 Black & Golden KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel glass-panel-hover p-6 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Devices Analyzed</span>
            <div className="h-9 w-9 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Server className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-serif font-bold text-white">{totalJobs}</span>
            <span className="text-xs text-muted-foreground font-mono font-medium">Nodes</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Cisco IOS, Junos & FortiOS devices</p>
        </div>

        <div className="glass-panel glass-panel-hover p-6 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Critical Failures</span>
            <div className="h-9 w-9 rounded-2xl bg-fail/10 border border-fail/30 flex items-center justify-center text-fail">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-serif font-bold text-fail">{summary?.critical_count || 0}</span>
            <span className="text-xs text-fail font-mono font-semibold">Immediate Fix</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Telnet, unhashed secrets, default SNMP</p>
        </div>

        <div className="glass-panel glass-panel-hover p-6 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">High Risk Findings</span>
            <div className="h-9 w-9 rounded-2xl bg-warning/10 border border-warning/30 flex items-center justify-center text-warning">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-serif font-bold text-warning">{summary?.high_count || 0}</span>
            <span className="text-xs text-warning font-mono font-semibold">Priority Action</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Missing AAA, Syslog & Timeout limits</p>
        </div>

        <div className="glass-panel glass-panel-hover p-6 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Compliance Pass Rate</span>
            <div className="h-9 w-9 rounded-2xl bg-pass/10 border border-pass/30 flex items-center justify-center text-pass">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-serif font-bold text-white">{avgScore}%</span>
            <span className="text-xs text-pass font-mono font-bold">Network Average</span>
          </div>
          <div className="w-full bg-surface-overlay h-2 rounded-full overflow-hidden">
            <div className="bg-pass h-full rounded-full" style={{ width: `${avgScore}%` }}></div>
          </div>
        </div>
      </div>

      {/* AI Intelligence & 3 Core Capabilities Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-primary/30 space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> AI Intelligence & Multi-Framework Core Engine
            </span>
            <h2 className="text-lg font-serif font-bold text-white">Three-Pillar Security Audit System</h2>
            <p className="text-xs text-muted-foreground">Combining deterministic vendor parsing, multi-framework correlation, and AI pattern intelligence.</p>
          </div>

          <Link
            href="/ai-lab"
            className="btn-black-pill px-4 py-2 text-xs font-mono font-bold flex items-center gap-2 self-start md:self-auto"
          >
            <Cpu className="h-3.5 w-3.5 text-primary" /> Inspect AI Telemetry
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-surface-overlay/80 border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-primary font-mono flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-pass" /> 1. Vendor Fingerprinting & Parsing
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">Line-aware parsing for Cisco IOS, Junos brace/set, and FortiOS config blocks.</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-overlay/80 border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-primary font-mono flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-pass" /> 2. Multi-Framework Mapping
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">Single configuration check mapped to CIS Benchmarks, NIST 800-53, STIG & ISO 27001.</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-overlay/80 border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-primary font-mono flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-pass" /> 3. AI Pattern Assistance & Review
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">TF-IDF + Random Forest model auto-classifies unknown syntax with confidence gate.</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Correlation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Framework Compliance Correlation Card */}
        <div className="glass-panel p-7 rounded-3xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Framework Correlation
            </h2>
            <Link href="/frameworks" className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1">
              View Mappings <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-4 pt-2">
            {frameworkCorrelationData.map((fw) => (
              <div key={fw.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-200">{fw.name}</span>
                  <span className="font-bold text-primary">{fw.score}%</span>
                </div>
                <div className="w-full bg-surface-overlay h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${fw.score}%`, backgroundColor: fw.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Findings By Severity Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-7 rounded-3xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Findings Distribution across 500 Audits
            </h2>
            <Link href="/findings" className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1">
              3,760 Total Findings <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityBarData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d111a', borderColor: '#d4af37', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#d4af37', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {severityBarData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Device Audits Table with Pagination */}
      <div className="glass-panel rounded-3xl p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-base font-serif font-bold text-white">Audited Network Devices (500 Total)</h2>
            <p className="text-xs text-muted-foreground">Live compliance analysis per device configuration</p>
          </div>

          <div className="relative">
            <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search 500 devices..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 pr-4 py-1.5 rounded-full bg-surface-overlay border border-primary/20 text-white text-xs font-mono focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground font-mono animate-pulse">
            Loading 500 audited device configurations...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-mono uppercase text-[11px]">
                    <th className="py-3 px-4">Job ID</th>
                    <th className="py-3 px-4">Target Hostname</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Compliance Score</th>
                    <th className="py-3 px-4">Pass / Fail</th>
                    <th className="py-3 px-4 text-right">Inspect Findings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 font-mono">
                  {paginatedJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-surface-overlay/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-primary">{job.job_number}</td>
                      <td className="py-3.5 px-4 text-white font-sans font-semibold">{job.hostname}</td>
                      <td className="py-3.5 px-4 uppercase text-slate-300">{job.vendor}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          job.compliance_score >= 80
                            ? 'bg-pass/10 text-pass border border-pass/30'
                            : 'bg-fail/10 text-fail border border-fail/30'
                        }`}>
                          {job.compliance_score.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        <span className="text-pass font-bold">{job.passed_rules} Pass</span> / <span className="text-fail font-bold">{job.failed_rules} Fail</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/audit/${job.id}`}
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
            <div className="flex items-center justify-between pt-3 text-xs font-mono text-muted-foreground border-t border-border">
              <span>Showing Page {page} of {totalPages} ({filteredJobs.length} Devices)</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-lg bg-surface-overlay border border-border disabled:opacity-40 hover:bg-surface-overlay/80 text-white"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded-lg bg-surface-overlay border border-border disabled:opacity-40 hover:bg-surface-overlay/80 text-white"
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
