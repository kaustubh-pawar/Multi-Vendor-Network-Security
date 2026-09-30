'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ShieldAlert, CheckCircle2, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function NotificationDrawer() {
  const { notificationsOpen, setNotificationsOpen, audio } = useApp();
  const router = useRouter();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'CRITICAL: Plaintext Telnet Enabled',
      device: 'cisco-core-sw01 (Cisco IOS)',
      time: '2 mins ago',
      severity: 'critical',
      href: '/findings',
    },
    {
      id: 2,
      title: 'CRITICAL: Default SNMP Community "public"',
      device: 'fortigate-edge-02 (FortiOS)',
      time: '14 mins ago',
      severity: 'critical',
      href: '/findings',
    },
    {
      id: 3,
      title: 'HIGH: Unhashed BGP Secret Detected',
      device: 'vyos-border-router (VyOS)',
      time: '28 mins ago',
      severity: 'high',
      href: '/findings',
    },
    {
      id: 4,
      title: 'REVIEW QUEUE: 8 AI Classifications Pending',
      device: 'Human-in-the-Loop Verification Required',
      time: '45 mins ago',
      severity: 'review',
      href: '/review',
    },
    {
      id: 5,
      title: 'HIGH: Missing AAA Authentication Server',
      device: 'junos-gw-05 (JunOS)',
      time: '1 hour ago',
      severity: 'high',
      href: '/findings',
    },
    {
      id: 6,
      title: 'MEDIUM: Insecure HTTP Web Exec Active',
      device: 'cisco-dist-sw04 (Cisco IOS)',
      time: '2 hours ago',
      severity: 'medium',
      href: '/findings',
    },
    {
      id: 7,
      title: 'MEDIUM: Missing Password Encryption Service',
      device: 'checkpoint-sec-gw01 (Gaia)',
      time: '3 hours ago',
      severity: 'medium',
      href: '/findings',
    },
    {
      id: 8,
      title: 'LOW: NTP Server Synchronization Warning',
      device: 'arista-dc-spine01 (EOS)',
      time: '5 hours ago',
      severity: 'low',
      href: '/findings',
    },
  ]);

  const dismiss = (id: number) => {
    audio.play('click');
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AnimatePresence>
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotificationsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0e0f14] border-l border-[#f59e0b]/40 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] p-6 flex flex-col z-10"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1f222a]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="w-5 h-5 text-[#f59e0b]" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">Security Alerts & Reviews</h3>
                  <p className="font-mono text-[11px] text-slate-400">{notifications.length} Active System Notifications</p>
                </div>
              </div>
              <button
                onClick={() => { setNotificationsOpen(false); audio.play('click'); }}
                className="p-2 rounded-full bg-[#181922] border border-[#282b3a] text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {notifications.map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.severity === 'critical'
                      ? 'bg-red-500/10 border-red-500/30 text-white'
                      : item.severity === 'high'
                      ? 'bg-amber-500/10 border-amber-500/30 text-white'
                      : item.severity === 'review'
                      ? 'bg-blue-500/10 border-blue-500/30 text-white'
                      : 'bg-[#14151e] border-[#202330] text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.severity === 'critical' && <ShieldAlert className="w-4 h-4 text-red-400" />}
                      {item.severity === 'high' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      {item.severity === 'review' && <UserCheck className="w-4 h-4 text-blue-400" />}
                      {item.severity === 'medium' && <ShieldAlert className="w-4 h-4 text-slate-400" />}
                      {item.severity === 'low' && <CheckCircle2 className="w-4 h-4 text-slate-400" />}
                      <span className="font-mono text-xs font-bold">{item.title}</span>
                    </div>
                    <button
                      onClick={() => dismiss(item.id)}
                      className="text-slate-500 hover:text-slate-300 text-xs font-mono"
                    >
                      ×
                    </button>
                  </div>

                  <p className="font-mono text-[11px] text-slate-400 mt-1">{item.device}</p>

                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">{item.time}</span>
                    <button
                      onClick={() => {
                        router.push(item.href);
                        audio.play('click');
                        setNotificationsOpen(false);
                      }}
                      className="flex items-center gap-1 text-[#f59e0b] hover:underline font-bold"
                    >
                      View Details <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="p-8 text-center font-mono text-xs text-slate-500">
                  All alerts and review items have been addressed.
                </div>
              )}
            </div>

            {/* Footer button */}
            <div className="pt-4 border-t border-[#1f222a]">
              <button
                onClick={() => {
                  router.push('/review');
                  audio.play('click');
                  setNotificationsOpen(false);
                }}
                className="w-full py-3 rounded-2xl bg-gold-gradient text-black font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-all"
              >
                OPEN HUMAN REVIEW QUEUE
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
