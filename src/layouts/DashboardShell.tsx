/* ─── Dashboard Shell ───
 * Layout wrapper for all authenticated pages.
 * Provides sidebar navigation (role-specific), header, mobile bottom nav,
 * dark mode toggle, sign out, bug report FAB, and "Built by Next-Token-AI" credits.
 */

import { motion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LineChart,
  LogOut,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  Users,
  Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { PageTransition } from '../components/PageTransition';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';

type NavItem = { to: string; label: string; icon: typeof Home };

const studentNav: NavItem[] = [
  { to: '/student', label: 'Home', icon: Home },
  { to: '/student/study', label: 'Study Zone', icon: BookOpen },
  { to: '/student/academics', label: 'Academics', icon: GraduationCap },
  { to: '/student/messages', label: 'Messages', icon: MessageSquare },
  { to: '/student/more', label: 'More', icon: ImageIcon },
  { to: '/student/profile', label: 'Profile', icon: Settings },
];

const teacherNav: NavItem[] = [
  { to: '/teacher', label: 'Home', icon: LayoutDashboard },
  { to: '/teacher/classes', label: 'Classes', icon: Users },
  { to: '/teacher/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/teacher/exams', label: 'Exams', icon: BookOpen },
  { to: '/teacher/content', label: 'Content', icon: CalendarDays },
  { to: '/teacher/reports', label: 'Reports', icon: LineChart },
  { to: '/teacher/messages', label: 'Comms', icon: MessageSquare },
  { to: '/teacher/profile', label: 'Profile', icon: Settings },
];

const adminNav: NavItem[] = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/classes', label: 'Classes', icon: GraduationCap },
  { to: '/admin/academic', label: 'Academic', icon: BookOpen },
  { to: '/admin/finance', label: 'Finance', icon: Wallet },
  { to: '/admin/comms', label: 'Broadcast', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function navFor(role: UserRole): NavItem[] {
  if (role === 'admin') return adminNav;
  if (role === 'teacher') return teacherNav;
  return studentNav;
}

export function DashboardShell({ role }: { role: UserRole }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = useMemo(() => navFor(role), [role]);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('bbps-theme');
    const isDark = saved === 'dark';
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('bbps-theme', next ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen bg-slate-50 dark:bg-ink-950"
    >
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white/90 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 lg:flex lg:flex-col"
      >
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-8 flex items-center gap-3 px-1"
        >
          <Logo size="md" />
          <div>
            <p className="font-display text-sm font-semibold text-slate-900 dark:text-white">
              BBPS ERP
            </p>
            <p className="text-xs text-slate-500">Blooming Bud Public School</p>
          </div>
        </motion.div>
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex flex-1 flex-col gap-1"
        >
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/student` || item.to === `/teacher` || item.to === `/admin`}
              className={({ isActive }) =>
                `flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-100 dark:bg-brand-900/30 dark:text-brand-100 dark:ring-brand-800'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0 opacity-80" />
              {item.label}
            </NavLink>
          ))}
        </motion.nav>
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800"
        >
          <Button type="button" variant="secondary" className="w-full" onClick={toggleTheme}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {dark ? 'Light mode' : 'Dark mode'}
          </Button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-slate-300 dark:hover:bg-red-900/20 dark:hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </motion.button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="mt-2 border-t border-slate-100 pt-3 text-center dark:border-slate-800"
        >
          <a
            href="https://www.youtube.com/@Next-Token-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-slate-400 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 tracking-tight"
          >
            🚀 Built by <span className="text-brand-500">Next-Token-AI</span>
          </a>
        </motion.div>
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <motion.header
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 lg:px-8"
        >
          <div className="flex items-center gap-3 lg:hidden">
            <Logo size="sm" />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-slate-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs capitalize text-slate-500">{user?.role}</p>
            </div>
          </div>
          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              Welcome back, {user?.firstName}
            </p>
            <p className="text-sm text-slate-500">
              Session <span className="font-medium text-slate-700 dark:text-slate-200">2026–2027</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-100">
                Demo mode
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-900"
              />
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.button>
          </div>
        </motion.header>

        <motion.main
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 overflow-auto px-3 py-5 sm:px-4 sm:py-6 lg:px-8"
        >
          <PageTransition>
            <Outlet />
          </PageTransition>
        </motion.main>

        <motion.nav
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="sticky bottom-0 z-20 flex items-center border-t border-slate-200/80 bg-white/95 px-1 pb-1 pt-1 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden"
        >
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/student` || item.to === `/teacher` || item.to === `/admin`}
              className={({ isActive }) =>
                `flex min-h-[44px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-[10px] font-medium transition-all duration-150 ${
                  isActive ? 'text-brand-700 dark:text-brand-300' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate px-0.5 leading-tight">{item.label}</span>
            </NavLink>
          ))}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="flex min-h-[44px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-[10px] font-medium text-slate-500 transition-colors hover:text-red-600 dark:hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            <span className="truncate px-0.5 leading-tight">Logout</span>
          </motion.button>
        </motion.nav>
      </div>
    </motion.div>
  );
}
