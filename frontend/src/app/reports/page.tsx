'use client';

import React, { useEffect, useState } from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { fetchAuditJobs, getApiBase } from '@/lib/api';
import { downloadPdfReport, downloadExcelReport } from '@/lib/pdfHelper';

export default function ReportsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await fetchAuditJobs();
        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const paginated = jobs.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(jobs.length / pageSize) || 1;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold tracking-widest text-[#f59e0b] uppercase">Export Center</span>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-white">Audit Reports & Export Center</h1>
        <p className="text-xs text-slate-400 font-sans">
          Download executive audit-ready compliance reports and detailed multi-framework mapping workbooks across 500 device audits.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 animate-pulse font-mono">
          Loading audit artifacts...
        </div>
      ) : (
        <div className="glass-panel p-7 rounded-3xl border border-[#1f222a] space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1f222a] text-slate-400 uppercase text-[11px]">
                  <th className="py-3 px-4">Audit Job</th>
                  <th className="py-3 px-4">Target Host</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Compliance Score</th>
                  <th className="py-3 px-4 text-right">Download Formats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f222a]/50">
                {paginated.map((job) => (
                  <tr key={job.id} className="hover:bg-[#18191e]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#f59e0b]">{job.job_number}</td>
                    <td className="py-3.5 px-4 text-white font-sans font-medium">{job.hostname}</td>
                    <td className="py-3.5 px-4 uppercase text-slate-300">{job.vendor}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        job.compliance_score >= 80 ? 'bg-pass/10 text-pass border border-pass/30' : 'bg-fail/10 text-fail border border-fail/30'
                      }`}>
                        {job.compliance_score.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => downloadPdfReport(job)}
                          className="btn-amber-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 transition-all text-[11px] font-sans font-bold"
                        >
                          <FileText className="h-3.5 w-3.5 text-black" /> PDF Report
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadExcelReport(job)}
                          className="btn-black-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 transition-all text-[11px] font-sans font-bold"
                        >
                          <FileSpreadsheet className="h-3.5 w-3.5" /> Excel XLSX
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-3 text-xs font-mono text-slate-400 border-t border-[#1f222a]">
            <span>Showing Page {page} of {totalPages} ({jobs.length} Reports)</span>
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
        </div>
      )}
    </div>
  );
}
