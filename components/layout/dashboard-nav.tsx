'use client';

import { cn } from '@/lib/utils';
import {
  Phone,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: BarChart3 },
  { name: 'Voice Calls', href: '/dashboard/voice-calls', icon: Phone },
  { name: 'SMS', href: '/dashboard/sms', icon: MessageSquare },
  { name: 'Schedules', href: '/dashboard/schedules', icon: Calendar },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
] as const;

interface DashboardNavProps {
  collapsed?: boolean;
}

export function DashboardNav({ collapsed }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 px-2 py-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
              isActive
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
            )}
            title={collapsed ? item.name : undefined}
          >
            <item.icon
              className={cn(
                'flex-shrink-0 h-6 w-6',
                isActive
                  ? 'text-gray-500 dark:text-gray-300'
                  : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300',
                collapsed ? 'mx-auto' : 'mr-3'
              )}
              aria-hidden="true"
            />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        );
      })}
    </nav>
  );
}