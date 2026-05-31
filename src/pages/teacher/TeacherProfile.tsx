import { motion } from 'framer-motion';
import { useState } from 'react';
import { Lock, Mail, Phone, BookOpen, Building2, Save } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { useAuth } from '../../hooks/useAuth';
import { changePassword } from '../../services/authService';
import toast from 'react-hot-toast';
import { getTeacherById } from '../../data/mock';

export function TeacherProfile() {
  const { user } = useAuth();
  const teacher = getTeacherById('t1');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (newPw.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    const result = changePassword(user?.schoolId ?? 'TCH-001', currentPw, newPw);
    await new Promise(r => setTimeout(r, 400));
    setSaving(false);
    if (result.success) {
      toast.success('Password changed successfully');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } else {
      toast.error(result.error ?? 'Failed to change password');
    }
  };

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="mx-auto max-w-3xl space-y-6">
      <motion.div variants={STAGGER.item(0)}>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Profile</h2>
      </motion.div>

      <motion.div variants={STAGGER.item(1)}>
        <Card>
          <div className="flex flex-wrap items-start gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-3xl font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1">
              <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /> {user?.email}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /> {teacher?.phone ?? user?.phone}</div>
                <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-400" /> {user?.department} Department</div>
                <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-slate-400" /> {teacher?.subjects?.join(', ')}</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={STAGGER.item(2)}>
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
            <Lock className="mr-2 inline h-5 w-5 text-slate-400" />
            Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Current Password</label>
              <input
                type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none ring-1 ring-transparent transition-all focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">New Password</label>
                <input
                  type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none ring-1 ring-transparent transition-all focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Confirm New Password</label>
                <input
                  type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required minLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none ring-1 ring-transparent transition-all focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Update Password'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
