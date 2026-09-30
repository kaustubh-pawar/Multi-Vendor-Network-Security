'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Terminal, ShieldAlert, Layers, Wrench, Cpu, GraduationCap,
  UserCheck, FileSpreadsheet, FileText, Settings, LayoutDashboard, Server,
  Upload, Volume2, LogOut, ChevronRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, audio, logout } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Command+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
        audio.play('click');
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen, audio]);

  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery('');
    }
  }, [commandPaletteOpen]);

  const commands = [
    { label: 'Executive Compliance Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Monitored Network Devices (500 Nodes)', path: '/devices', icon: Server, category: 'Inventory' },
    { label: 'Upload Configuration File', path: '/configurations/upload', icon: Upload, category: 'Action' },
    { label: 'Security Findings & Vulnerabilities', path: '/findings', icon: ShieldAlert, category: 'Audit' },
    { label: 'Framework Correlation (CIS / NIST / STIG)', path: '/frameworks', icon: Layers, category: 'GRC' },
    { label: 'Remediation Center (Fix CLI Commands)', path: '/remediation', icon: Wrench, category: 'Fix' },
    { label: 'AI Intelligence Hub', path: '/ai-lab', icon: Cpu, category: 'AI' },
    { label: 'AI Training Center', path: '/training', icon: GraduationCap, category: 'Model' },
    { label: 'Human-in-the-Loop Review Queue', path: '/review', icon: UserCheck, category: 'Review' },
    { label: 'Compliance Reports & Exports (PDF/Excel)', path: '/reports', icon: FileSpreadsheet, category: 'Report' },
    { label: 'Audit Logs & System Ledger', path: '/audit', icon: FileText, category: 'Logs' },
    { label: 'Engine Settings & Parameters', path: '/settings', icon: Settings, category: 'System' },
    { label: 'Toggle Web Audio Sound Synthesizer', action: () => audio.toggle(), icon: Volume2, category: 'Audio' },
    { label: 'Sign Out / Switch Identity', action: () => { logout(); router.push('/login'); }, icon: LogOut, category: 'Session' },
  ];

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-[#0e0f14] border border-[#f59e0b]/40 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden z-10"
          >
            {/* Input header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1f222a] bg-[#12131a]">
              <Search className="w-5 h-5 text-[#f59e0b]" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filtered.length > 0) {
                    const item = filtered[0];
                    if (item.path) {
                      router.push(item.path);
                    } else if (item.action) {
                      item.action();
                    }
                    audio.play('click');
                    setCommandPaletteOpen(false);
                  }
                }}
                placeholder="Type a command or search section (e.g. Findings, Review, Report)..."
                className="flex-1 bg-transparent font-mono text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <span className="font-mono text-[10px] px-2 py-1 rounded bg-[#1c1e28] text-slate-400 border border-[#2a2d3d]">
                ESC
              </span>
            </div>

            {/* Results list */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {filtered.map((cmd, idx) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (cmd.path) {
                        router.push(cmd.path);
                      } else if (cmd.action) {
                        cmd.action();
                      }
                      audio.play('click');
                      setCommandPaletteOpen(false);
                    }}
                    onMouseEnter={() => audio.play('click')}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-[#181922] border border-transparent hover:border-[#f59e0b]/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-[#1f222d] border border-[#2b2e3c] flex items-center justify-center text-slate-400 group-hover:text-[#f59e0b] group-hover:border-[#f59e0b]/40 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-200 group-hover:text-white">
                        {cmd.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#161822] text-[#f59e0b] font-bold border border-[#f59e0b]/20">
                        {cmd.category}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#f59e0b] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div className="p-8 text-center font-mono text-xs text-slate-500">
                  No matching commands found for "{query}"
                </div>
              )}
            </div>

            {/* Footer shortcuts */}
            <div className="px-5 py-3 border-t border-[#1f222a] bg-[#0b0c10] flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Press <kbd className="text-[#f59e0b] font-bold">↵ Enter</kbd> to execute top item</span>
              <span>ANCP Command Palette • ⌘K</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
