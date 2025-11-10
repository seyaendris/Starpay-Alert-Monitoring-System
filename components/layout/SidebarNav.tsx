'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserRoundCog, TriangleAlert, BookAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export const nav = [
  { href: '/', label: 'Alerts', icon: TriangleAlert },
  { href: '/analytics', label: 'Alert History', icon: BookAlert },
  { href: '/users', label: 'Users Account', icon: UserRoundCog },
  { href: '/receivers', label: 'Alert Receivers', icon: Users },
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
