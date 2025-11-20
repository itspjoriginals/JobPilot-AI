'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Briefcase, FileText, History, Settings, ShieldCheck, Github } from 'lucide-react';
import { Logo } from '../logo';
import { Button } from '../ui/button';

const menuItems = [
  { href: '/', label: 'Jobs', icon: Briefcase },
  { href: '/resumes', label: 'Resumes', icon: FileText },
  { href: '/applications', label: 'Applications', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/admin', label: 'Admin', icon: ShieldCheck },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  icon={<item.icon />}
                  tooltip={{
                    children: item.label,
                    side: 'right',
                  }}
                >
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col items-center justify-center gap-2 p-4 text-center group-data-[collapsible=icon]:hidden">
          <p className="text-xs text-muted-foreground">
            © 2024 JobPilot AI. All rights reserved.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
