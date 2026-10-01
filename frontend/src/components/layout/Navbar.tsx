'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Terminal, User, LogOut, Volume2, VolumeX, Search, Bell, Menu, X,
  LayoutDashboard, Server, Upload, ShieldAlert, Layers, Wrench, Cpu,
  GraduationCap, UserCheck, FileSpreadsheet, FileText, Settings
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LiveClock } from '@/components/shared/LiveClock';

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

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    currentUser,
    audio,
    logout,
    setCommandPaletteOpen,
    setNotificationsOpen
  } = useApp();

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false);
    audio.play('navigate');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0c0d11]/95 backdrop-blur-md border-b border-[#1f222a] px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        {/* Brand logo & title */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            onClick={() => audio.play('click')}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gold-gradient text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-all shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
                ANCP <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] font-bold uppercase tracking-wider">AI Intelligence</span>
              </span>
              <p className="text-[11px] text-slate-400 hidden md:block">Multi-Vendor Security Auditor</p>
            </div>
          </Link>
        </div>

        {/* Toolbar items */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* 1. Command Palette Trigger Button (⌘K) */}
          <button
            onClick={() => {
              setCommandPaletteOpen(true);
              audio.play('click');
            }}
            className="flex items-center gap-2 px-2.5 sm:px-3.5 py-2 rounded-2xl bg-[#14151e] border border-[#222533] hover:border-[#f59e0b]/50 text-slate-300 hover:text-white transition-all text-xs font-mono group shadow-inner"
          >
            <Search className="w-4 h-4 text-[#f59e0b] group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden sm:inline font-semibold">Command</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded-lg bg-[#1e202c] border border-[#2b2e40] text-[10px] text-slate-300 font-bold tracking-wider">
              ⌘K
            </kbd>
          </button>

          {/* 2. Audio Mute/Unmute Synthesizer Toggle */}
          <button
            onClick={() => { audio.toggle(); audio.play('click'); }}
            title={audio.settings.enabled ? 'Audio Effects Enabled (Click to Mute)' : 'Audio Effects Muted (Click to Unmute)'}
            className="p-2 sm:p-2.5 rounded-2xl bg-[#14151e] border border-[#222533] text-slate-300 hover:text-[#f59e0b] hover:border-[#f59e0b]/40 transition-all shadow-inner"
          >
            {audio.settings.enabled ? (
              <Volume2 className="h-4 w-4 text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {/* 3. Notification Bell */}
          <button
            onClick={() => {
              setNotificationsOpen(true);
              audio.play('click');
            }}
            title="Security Notifications & Reviews"
            className="relative p-2 sm:p-2.5 rounded-2xl bg-[#14151e] border border-[#222533] text-slate-300 hover:text-white hover:border-[#f59e0b]/40 transition-all shadow-inner"
          >
            <Bell className="h-4 w-4 text-slate-300" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white font-mono text-[9px] font-bold flex items-center justify-center border-2 border-[#0c0d11] shadow-[0_0_10px_rgba(239,68,68,0.8)]">
              8
            </span>
          </button>

          {/* 4. Live UTC Digital Clock & Date */}
          <div className="hidden lg:block pl-2 pr-1">
            <LiveClock />
          </div>

          {/* 5. User Analyst Profile Badge */}
          <div className="hidden xl:flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-[#12131b] border border-[#222533] shadow-inner">
            <div className="h-8 w-8 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/50 flex items-center justify-center text-[#00f0ff] font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              <User className="w-4 h-4 text-[#00f0ff]" />
            </div>
            <div className="text-left font-mono leading-tight pr-1">
              <span className="text-xs text-white font-bold block">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 font-medium block">{currentUser.clearance}</span>
            </div>
          </div>

          {/* 6. Run Audit CTA Button */}
          <Link
            href="/configurations/upload"
            onClick={() => audio.play('click')}
            className="btn-amber-pill hidden sm:inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            <Terminal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-black shrink-0" />
            <span>Run Audit</span>
          </Link>

          {/* 7. Sign Out Button */}
          <Link
            href="/login"
            onClick={logout}
            title="Sign Out / Switch Terminal Identity"
            className="hidden sm:p-2.5 p-2 rounded-2xl bg-[#14151e] border border-[#222533] text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all"
          >
            <LogOut className="h-4 w-4" />
          </Link>

          {/* 8. Mobile Menu Hamburger Toggle (Smartphone Screen View) */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              audio.play('click');
            }}
            className="md:hidden p-2 rounded-2xl bg-[#14151e] border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)]"
            aria-label="Toggle Mobile Auditor Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden flex flex-col justify-between"
          >
            <div className="p-4 overflow-y-auto max-h-[85vh]">
              {/* Header inside Mobile Drawer */}
              <div className="flex items-center justify-between border-b border-[#1f222a] pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/50 flex items-center justify-center text-[#00f0ff] font-bold text-xs">
                    <User className="w-4 h-4 text-[#00f0ff]" />
                  </div>
                  <div className="font-mono">
                    <span className="text-xs text-white font-bold block">{currentUser.name}</span>
                    <span className="text-[10px] text-[#f59e0b] font-semibold block">{currentUser.clearance}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    audio.play('click');
                  }}
                  className="p-2 rounded-xl bg-[#14151a] border border-[#22252e] text-slate-300"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              {/* Mobile Quick CTA */}
              <Link
                href="/configurations/upload"
                onClick={() => handleMobileNavClick('/configurations/upload')}
                className="btn-amber-pill w-full mb-4 py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              >
                <Terminal className="h-4 w-4 text-black" />
                Upload Config / Run Audit
              </Link>

              {/* Navigation Items */}
              <p className="px-2 text-[10px] font-mono uppercase tracking-widest text-[#f59e0b] font-bold mb-2">Auditor Platform Navigation</p>
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => handleMobileNavClick(item.href)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-mono font-medium transition-all ${
                        isActive
                          ? 'bg-[#18191e] text-white border border-[#f59e0b]/50 font-bold shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                          : 'text-slate-300 hover:text-white hover:bg-[#14151a]'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#f59e0b]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-[#1f222a] bg-[#08090d] flex items-center justify-between font-mono text-xs">
              <LiveClock />
              <Link
                href="/login"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-[11px]"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
