'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const WORKFLOW_STEPS = [
  { label: 'Ingestion', href: '/configurations/upload' },
  { label: 'Parsing', href: '/devices' },
  { label: 'AI Classify', href: '/ai-lab' },
  { label: 'Framework Map', href: '/frameworks' },
  { label: 'Human Review', href: '/review' },
  { label: 'Remediation', href: '/remediation' },
  { label: 'Export Report', href: '/reports' },
];

export function WorkflowIndicator() {
  const pathname = usePathname();
  const { audio } = useApp();

  return (
    <div className="w-full bg-[#08090d]/90 border-b border-[#1b1e28] px-6 py-2 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold mr-2">
          AUDIT PIPELINE:
        </span>
        {WORKFLOW_STEPS.map((step, idx) => {
          const isActive = pathname === step.href;
          return (
            <React.Fragment key={step.href}>
              <Link
                href={step.href}
                onClick={() => audio.play('navigate')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold uppercase transition-all ${
                  isActive
                    ? 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-[#12141c]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-[#f59e0b] animate-ping' : 'bg-slate-700'
                  }`}
                />
                {step.label}
              </Link>
              {idx < WORKFLOW_STEPS.length - 1 && (
                <div className="w-3 h-px bg-[#1f222e]" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
