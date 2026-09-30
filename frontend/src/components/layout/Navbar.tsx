'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Terminal, User, LogOut, Volume2, VolumeX, Search, Bell
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LiveClock } from '@/components/shared/LiveClock';

export default function Navbar() {
  const {
    currentUser,
    audio,
    logout,
    setCommandPaletteOpen,
    setNotificationsOpen
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c0d11]/95 backdrop-blur-md border-b border-[#1f222a] px-6 py-3 flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          onClick={() => audio.play('click')}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-gradient text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-all">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl tracking-tight text-white flex items-center gap-2">
              ANCP <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] font-bold uppercase tracking-wider">AI Intelligence</span>
            </span>
            <p className="text-xs text-slate-400 hidden sm:block">Multi-Vendor Security Auditor</p>
          </div>
        </Link>
      </div>

      {/* Center/Right Toolbar items matching reference screenshot */}
      <div className="flex items-center gap-3.5">
        {/* 1. Command Palette Trigger Button (⌘K) */}
        <button
          onClick={() => {
            setCommandPaletteOpen(true);
            audio.play('click');
          }}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#14151e] border border-[#222533] hover:border-[#f59e0b]/50 text-slate-300 hover:text-white transition-all text-xs font-mono group shadow-inner"
        >
          <Search className="w-4 h-4 text-[#f59e0b] group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline font-semibold">Command</span>
          <kbd className="hidden md:inline-flex items-center px-2 py-0.5 rounded-lg bg-[#1e202c] border border-[#2b2e40] text-[10px] text-slate-300 font-bold tracking-wider">
            ⌘K
          </kbd>
        </button>

        {/* 2. Audio Mute/Unmute Synthesizer Toggle */}
        <button
          onClick={() => { audio.toggle(); audio.play('click'); }}
          title={audio.settings.enabled ? 'Audio Effects Enabled (Click to Mute)' : 'Audio Effects Muted (Click to Unmute)'}
          className="p-2.5 rounded-2xl bg-[#14151e] border border-[#222533] text-slate-300 hover:text-[#f59e0b] hover:border-[#f59e0b]/40 transition-all shadow-inner"
        >
          {audio.settings.enabled ? (
            <Volume2 className="h-4 w-4 text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
          ) : (
            <VolumeX className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {/* 3. Notification Bell with Glowing Alert Count Badge */}
        <button
          onClick={() => {
            setNotificationsOpen(true);
            audio.play('click');
          }}
          title="Security Notifications & Reviews"
          className="relative p-2.5 rounded-2xl bg-[#14151e] border border-[#222533] text-slate-300 hover:text-white hover:border-[#f59e0b]/40 transition-all shadow-inner"
        >
          <Bell className="h-4 w-4 text-slate-300" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white font-mono text-[9px] font-bold flex items-center justify-center border-2 border-[#0c0d11] shadow-[0_0_10px_rgba(239,68,68,0.8)]">
            8
          </span>
        </button>

        {/* 4. Live UTC Digital Clock & Date */}
        <div className="pl-2 pr-1">
          <LiveClock />
        </div>

        {/* 5. User Analyst Profile Badge */}
        <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-[#12131b] border border-[#222533] shadow-inner">
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
          className="btn-amber-pill inline-flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        >
          <Terminal className="h-4 w-4 text-black" />
          Run Audit
        </Link>

        {/* 7. Sign Out / Switch Identity Button */}
        <Link
          href="/login"
          onClick={logout}
          title="Sign Out / Switch Terminal Identity"
          className="p-2.5 rounded-2xl bg-[#14151e] border border-[#222533] text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all"
        >
          <LogOut className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
