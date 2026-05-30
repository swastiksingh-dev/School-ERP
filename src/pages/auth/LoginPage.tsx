import { motion } from 'framer-motion';
import { GraduationCap, Shield, UserCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { loginWithCredentials, demoCredentials } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { STAGGER } from '../../constants/animations';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [schoolId, setSchoolId] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-ink-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (user) {
    const home = user.role === 'admin' ? '/admin' : user.role === 'teacher' ? '/teacher' : '/student';
    return <Navigate to={home} replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId.trim() || !password.trim()) {
      toast.error('Please enter your School/Employee ID and password');
      return;
    }
    setBusy(true);
    const result = loginWithCredentials(schoolId.trim(), password);
    if (result.success) {
      setUser(result.user);
      toast.success(`Welcome, ${result.user.firstName}!`);
      const home = result.user.role === 'admin' ? '/admin' : result.user.role === 'teacher' ? '/teacher' : '/student';
      navigate(home, { replace: true });
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
    setBusy(false);
  };

  const handleQuickLogin = (schoolId: string) => {
    setSchoolId(schoolId);
    setPassword(schoolId.startsWith('BBPS') ? 'student123' : schoolId.startsWith('TCH') ? 'teacher123' : 'admin123');
  };

  const demoStudents = demoCredentials.filter((c) => c.role === 'student');
  const demoTeachers = demoCredentials.filter((c) => c.role === 'teacher');
  const demoAdmins = demoCredentials.filter((c) => c.role === 'admin');

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-slate-100 px-4 py-12 dark:from-ink-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_35%)]" />
      <motion.div
        variants={STAGGER.container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-md"
      >
        <motion.div variants={STAGGER.item(0)} className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" className="mb-4" />
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Blooming Bud Public School
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            ERP Portal — Sign in with your School/Employee ID
          </p>
        </motion.div>

        <motion.div variants={STAGGER.item(1)}>
          <Card className="p-6 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  School / Employee ID
                </label>
                <input
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  type="text"
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-brand-500/30 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="e.g. BBPS-1001 or TCH-001"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-brand-500/30 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" variant="primary" disabled={busy} className="w-full">
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </Card>
        </motion.div>

        <motion.div variants={STAGGER.item(2)} className="mt-6">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            Demo quick login — click to auto-fill
          </p>

          <div className="mb-3">
            <p className="mb-2 text-xs font-medium text-slate-400">Students</p>
            <div className="grid grid-cols-2 gap-2">
              {demoStudents.map((s) => (
                <button
                  key={s.schoolId}
                  type="button"
                  onClick={() => handleQuickLogin(s.schoolId)}
                  className="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white/90 p-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-brand-200 hover:bg-brand-50/80 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-800"
                >
                  <GraduationCap className="h-4 w-4 text-brand-600" />
                  <span>{s.firstName} {s.lastName}</span>
                  <span className="text-[10px] font-normal text-slate-400">{s.schoolId}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 text-xs font-medium text-slate-400">Teachers</p>
            <div className="grid grid-cols-2 gap-2">
              {demoTeachers.map((t) => (
                <button
                  key={t.schoolId}
                  type="button"
                  onClick={() => handleQuickLogin(t.schoolId)}
                  className="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white/90 p-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-brand-200 hover:bg-brand-50/80 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-800"
                >
                  <UserCircle2 className="h-4 w-4 text-brand-600" />
                  <span>{t.firstName} {t.lastName}</span>
                  <span className="text-[10px] font-normal text-slate-400">{t.schoolId}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-slate-400">Administrators</p>
            <div className="grid grid-cols-1 gap-2">
              {demoAdmins.map((a) => (
                <button
                  key={a.schoolId}
                  type="button"
                  onClick={() => handleQuickLogin(a.schoolId)}
                  className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white/90 p-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-brand-200 hover:bg-brand-50/80 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-800"
                >
                  <Shield className="h-4 w-4 text-brand-600" />
                  <span>{a.firstName} {a.lastName}</span>
                  <span className="text-[10px] font-normal text-slate-400">{a.schoolId}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={STAGGER.item(2)} className="mt-8 text-center">
          <a
            href="https://www.youtube.com/@Next-Token-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2"
          >
            <span className="text-2xl">🚀</span>
            <div>
              <p className="text-base font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Built by <span className="text-brand-600 dark:text-brand-400">Next-Token-AI</span>
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                YouTube · Open Source · MIT License
              </p>
            </div>
          </a>
          <p className="mt-3 text-[10px] text-slate-400 dark:text-slate-600">
            Blooming Bud Public School ERP — Educational Management System
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
