import React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import AppLayoutClient from '@/components/layout/AppLayoutClient';

export const metadata: Metadata = {
  title: 'ANCP — AI Multi-Vendor Network Security Compliance Auditor',
  description: 'Automated multi-vendor network configuration compliance auditing and hardening platform for Cisco IOS, Juniper Junos, and Fortinet FortiOS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-100 min-h-screen relative flex flex-col antialiased">
        <AppLayoutClient>
          {children}
        </AppLayoutClient>
      </body>
    </html>
  );
}
