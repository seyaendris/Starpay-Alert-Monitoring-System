'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, Users, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export const nav = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics', icon: BarChart },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className='space-y-1 px-2 pt-4'>
      {nav.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-normal hover:bg-green-100/30 hover:text-accent-foreground',
              active && 'bg-green-100 text-black font-semibold'
            )}
          >
            <Icon className='h-4 w-4' />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
