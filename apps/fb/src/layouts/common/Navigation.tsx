// Navigation component for the feedback portal

import { MessageSquare, MessageSquarePlus } from 'lucide-react';
import { usePathname } from 'next/navigation';

import Link from '@/components/common/Link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();
  const navItems = [
    {
      href: '/feedback',
      label: 'View Feedback',
      icon: MessageSquare,
      description: 'Browse community feedback',
    },
    {
      href: '/submit',
      label: 'Submit Feedback',
      icon: MessageSquarePlus,
      description: 'Share your thoughts',
    },
  ];

  return (
    <nav className="bg-card border-border border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 py-4">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? 'default' : 'ghost'}
                size="lg"
                className={cn('transition-all duration-200', isActive && 'shadow-md')}
              >
                <Link to={item.href} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
