'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Server,
  Upload,
  ShieldAlert,
  Layers,
  Wrench,
  Cpu,
  GraduationCap,
  UserCheck,
  FileSpreadsheet,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Compliance Dashboard', icon: LayoutDashboard },
  { href: '/devices', label: 'Monitored Devices', icon: Server },
  { href: '/configurations/upload', label: 'Upload Configuration', icon: Upload },
  { href: '/findings', label: 'Security Findings', icon: ShieldAlert },
  { href: '/frameworks', label: 'Framework Correlation', icon: Layers },
  { href: '/remediation', label: 'Remediation Center', icon: Wrench },
  { href: '/ai-lab', label: 'AI Intelligence Hub', icon: Cpu },
  { href: '/training', label: 'AI Training Center', icon: GraduationCap },
  { href: '/review', label: 'Human Review Queue', icon: UserCheck },
  { href: '/reports', label: 'Reports & Exports', icon: FileSpreadsheet },
  { href: '/audit', label: 'Audit Logs & Trails', icon: FileText },
  { href: '/settings', label: 'Engine Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { audio, logout } = useApp();

  return (
    <aside className="w-64 bg-[#0c0d11]/90 backdrop-blur-md border-r border-[#1f222a] min-h-[calc(100vh-73px)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#f59e0b] font-bold mb-3">Auditor Navigation</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => audio.play('navigate')}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#18191e] text-white border border-[#f59e0b]/50 font-bold shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-[#14151a]'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#f59e0b]' : 'text-slate-500'}`} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="space-y-3 mt-4">
        <div className="p-4 rounded-2xl bg-[#111216] border border-[#1f222a] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-mono text-[11px]">Audit Engine</span>
            <span className="text-[#f59e0b] font-bold text-[10px] uppercase font-mono">Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Multi-vendor compliance & AI pattern intelligence mapped to CIS, NIST, STIG & ISO 27001.
          </p>
        </div>

        <Link
          href="/login"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(239,68,68,0.15)]"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out / Logout</span>
        </Link>
      </div>
    </aside>
  );
}
