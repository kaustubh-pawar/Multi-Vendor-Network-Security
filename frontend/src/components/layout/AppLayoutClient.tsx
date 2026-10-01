'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import CyberBackground3D from '@/components/3d/CyberBackground3D';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { WorkflowIndicator } from '@/components/layout/WorkflowIndicator';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { NotificationDrawer } from '@/components/shared/NotificationDrawer';
import { AppProvider } from '@/context/AppContext';

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <AppProvider>
      <CyberBackground3D />
      <div className="relative z-10 flex flex-col min-h-screen">
        {!isLoginPage && (
          <>
            <Navbar />
            <WorkflowIndicator />
          </>
        )}
        <div className="flex flex-1">
          {!isLoginPage && <Sidebar />}
          <main className={isLoginPage ? 'flex-1 w-full' : 'flex-1 p-3 sm:p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden'}>
            {children}
          </main>
        </div>
      </div>
      <CommandPalette />
      <NotificationDrawer />
    </AppProvider>
  );
}
