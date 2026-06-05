'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import TabBarItem from '../molecules/MobileNavItem';

interface NavItem {
  href: string;
  labelKey: string;
  icon: string;
}

interface TabBarProps {
  navItems: NavItem[];
  lowPerformanceMode: boolean;
  t: (key: string) => string;
}

export default function TabBar({ navItems, lowPerformanceMode, t }: TabBarProps) {
  const pathname = usePathname();

  const handleNavigate = (href: string) => {
    if (pathname !== href) {
      window.dispatchEvent(new Event('app:navigation-start'));
    }
  };

  const transition = lowPerformanceMode ? { duration: 0 } : { duration: 0.5 };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={transition}
      className="md:hidden fixed bottom-0 left-0 right-0 z-[10001] flex justify-center pointer-events-none"
      style={{ paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)', paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.75rem)' }}
    >
      <div className="relative w-full mx-3 px-3 pt-3 pb-2 rounded-[1.75rem] border border-white/10 bg-background-surface/70 backdrop-blur-3xl pointer-events-auto shadow-2xl shadow-black/30 overflow-visible"
      >
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <TabBarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={t(item.labelKey)}
              isActive={pathname === item.href}
              onNavigate={() => handleNavigate(item.href)}
            />
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
