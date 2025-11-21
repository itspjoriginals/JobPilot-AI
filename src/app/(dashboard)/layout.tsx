'use client';
import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <DashboardSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        <div className={cn(
          "flex flex-col transition-[margin-left] duration-300 ease-in-out",
          isSidebarCollapsed ? "sm:ml-14" : "sm:ml-56"
        )}>
          <DashboardHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
  );
}
