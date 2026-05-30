import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Hash,
  BadgeCheck,
  Calendar,
  Droplets,
  Users,
  MapPin,
  PhoneCall,
  Lock,
  Eye,
  EyeOff,
  Save,
  Pencil,
  X,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { useAuth } from '../../hooks/useAuth';
import { useStudentById } from '../../hooks/queries';
import { changePassword } from '../../services/authService';
import toast from 'react-hot-toast';

const STUDENT_ID = 's1';

function getInitials(first: string, last: string) {
  return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
}

function InfoRow({
  icon: Icon,
  label,
  value,
  editable,
  name,
  onChange,
}: {
  icon: typeof User;
  label: string;
  value: string;
  editable?: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <dt className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd>
        {editable && name ? (
          <input
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none dark:text-white"
          />
        ) : (
          <span className="text-sm font-medium text-slate-900 dark:text-white">{value || '—'}</span>
        )}
      </dd>
    </div>
  );
}

export function StudentProfile() {
  const { user, setUser } = useAuth();
  const { data: student, isLoading } = useStudentById(STUDENT_ID);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    parentName: '',
    parentPhone: '',
    emergencyContact: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const startEditing = () => {
    setForm({
      firstName: student?.firstName || user?.firstName || '',
      lastName: student?.lastName || user?.lastName || '',
      email: student?.email || user?.email || '',
      phone: student?.phone || user?.phone || '',
      address: student?.address || '',
      parentName: student?.parentName || '',
      parentPhone: student?.parentPhone || '',
      emergencyContact: student?.emergencyContact || '',
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveProfile = () => {
    if (user && setUser) {
      setUser({
        ...user,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      });
    }
    toast.success('Profile updated successfully!');
    setEditing(false);
  };

  const handlePasswordChange = () => {
    const schoolId = user?.schoolId || student?.schoolId || '';
    if (!schoolId) {
      toast.error('School ID not found');
      return;
    }
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
      toast.error('Please fill all password fields');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPass.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    const result = changePassword(schoolId, passwordForm.current, passwordForm.newPass);
    if (result.success) {
      toast.success('Password changed successfully!');
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    } else {
      toast.error(result.error || 'Failed to change password');
    }
  };

  if (isLoading) {
    return (
      <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="mx-auto max-w-2xl space-y-6">
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="mx-auto max-w-2xl space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My profile</h2>
          <p className="text-sm text-slate-500">Manage your personal information and security.</p>
        </div>
        {!editing ? (
          <Button variant="secondary" onClick={startEditing} className="shrink-0">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={cancelEditing}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button variant="primary" onClick={saveProfile}>
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </motion.div>

      <motion.div variants={STAGGER.item(1)}>
        <Card>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-3xl font-bold text-brand-700 ring-4 ring-white shadow-lg dark:bg-brand-900/40 dark:text-brand-200 dark:ring-slate-900">
              {getInitials(student?.firstName || user?.firstName || '', student?.lastName || user?.lastName || '')}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                {student?.firstName || user?.firstName} {student?.lastName || user?.lastName}
              </h3>
              <p className="text-sm text-slate-500">{student?.email || user?.email}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-brand-50 px-3 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
                  Student
                </span>
                {student?.classId && (
                  <span className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                    Class {student.classId}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={STAGGER.item(2)}>
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
            Personal information
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow icon={User} label="First name" value={editing ? form.firstName : (student?.firstName || user?.firstName || '')} editable={editing} name="firstName" onChange={handleFormChange} />
            <InfoRow icon={User} label="Last name" value={editing ? form.lastName : (student?.lastName || user?.lastName || '')} editable={editing} name="lastName" onChange={handleFormChange} />
            <InfoRow icon={Mail} label="Email" value={editing ? form.email : (student?.email || user?.email || '')} editable={editing} name="email" onChange={handleFormChange} />
            <InfoRow icon={Phone} label="Phone" value={editing ? form.phone : (student?.phone || user?.phone || '')} editable={editing} name="phone" onChange={handleFormChange} />
            <InfoRow icon={BookOpen} label="Class" value={student?.classId || '—'} />
            <InfoRow icon={Hash} label="Roll number" value={student?.rollNumber || '—'} />
            <InfoRow icon={BadgeCheck} label="School ID" value={student?.schoolId || user?.schoolId || '—'} />
            <InfoRow icon={Calendar} label="Date of birth" value={student?.dob ? new Date(student.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} />
            <InfoRow icon={Droplets} label="Blood group" value={student?.bloodGroup || '—'} />
            <InfoRow icon={Users} label="Parent name" value={editing ? form.parentName : (student?.parentName || '—')} editable={editing} name="parentName" onChange={handleFormChange} />
            <InfoRow icon={Phone} label="Parent phone" value={editing ? form.parentPhone : (student?.parentPhone || '—')} editable={editing} name="parentPhone" onChange={handleFormChange} />
            <InfoRow icon={MapPin} label="Address" value={editing ? form.address : (student?.address || '—')} editable={editing} name="address" onChange={handleFormChange} />
            <InfoRow icon={PhoneCall} label="Emergency contact" value={editing ? form.emergencyContact : (student?.emergencyContact || '—')} editable={editing} name="emergencyContact" onChange={handleFormChange} />
            <InfoRow icon={BookOpen} label="Section" value={user?.section || '—'} />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={STAGGER.item(3)}>
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
            Change password
          </h3>
          <div className="space-y-3">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="Current password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="New password"
                value={passwordForm.newPass}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPass: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button variant="primary" className="w-full" onClick={handlePasswordChange}>
              Update password
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
