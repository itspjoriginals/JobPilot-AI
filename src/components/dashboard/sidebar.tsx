'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Briefcase, FileText, History, Settings, ShieldCheck } from 'lucide-react';
import { Logo } from '../logo';

const menuItems = [
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/resumes', label: 'Resumes', icon: FileText },
  { href: '/applications', label: 'Applications', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/admin', label: 'Admin', icon: ShieldCheck },
];

interface DashboardSidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export function DashboardSidebar({ isCollapsed, setIsCollapsed }: DashboardSidebarProps) {
  const pathname = usePathname();

  const commonLinkClasses = 'flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground transition-all hover:text-primary';
  const activeLinkClasses = 'bg-muted text-primary';

  return (
    <>
      {/* Mobile Sidebar Content (in Sheet) */}
      <nav className="grid gap-2 text-lg font-medium sm:hidden">
        <div className="border-b p-4">
          <Logo />
        </div>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              commonLinkClasses,
              pathname === item.href && activeLinkClasses
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-14" : "w-56"
        )}>
        <nav className={cn(
            "flex flex-col items-center gap-4 px-2 py-4",
            !isCollapsed && "items-stretch"
            )}>
          <div className={cn("mb-2 px-2", isCollapsed && "px-0")}>
            <Logo isCollapsed={isCollapsed} />
          </div>
          <TooltipProvider delayDuration={0}>
            {menuItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex h-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground',
                      pathname === item.href && 'bg-accent text-accent-foreground',
                      isCollapsed ? 'w-9' : 'justify-start gap-4 px-3'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className={cn('sr-only', !isCollapsed && 'not-sr-only')}>{item.label}</span>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </aside>
    </>
  );
}
