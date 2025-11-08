'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'font-orbitron text-fluid-sm uppercase tracking-widest transition-all duration-300',
        'hover:text-cyber-red hover:translate-x-1',
        isActive ? 'text-cyber-red font-bold' : 'text-text-secondary',
        className
      )}
    >
      {children}
    </Link>
  );
}
