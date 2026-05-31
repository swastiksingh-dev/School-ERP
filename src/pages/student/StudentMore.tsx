import { useState, useMemo, useEffect, useCallback } from 'react';
import BugReportModal from '../../components/BugReportModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Images,
  Users,
  CreditCard,
  Bus,
  Ticket,
  Download,
  Bell,
  BookOpen,
  Gift,
  FileText,
  Share2,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Phone,
  Clock as ClockIcon,
  User,
  CheckCircle,
  XCircle,
  Building,
  Bug,
  Loader2,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { useStudentById, useStudentsByClass, useFeeInvoices, useGallery, useDownloads, useAnnouncements, useTimetable } from '../../hooks/queries';
import {
  galleryItems,
  gatePasses,
  transportRoutes,
  students,
} from '../../data/mock';
import type { GalleryItem, LeaveApplication } from '../../types';
import { submitLeaveApplication, getLeavesByStudent } from '../../services/leaveService';
import toast from 'react-hot-toast';

const STUDENT_ID = 's1';

const PIE_COLORS: Record<string, string> = {
  paid: '#10b981',
  partial: '#f59e0b',
  overdue: '#ef4444',
  pending: '#94a3b8',
};

const DOWNLOAD_TYPE_BADGES: Record<string, string> = {
  circular: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200',
  form: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200',
  report: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
  other: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

const GATE_STATUS: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  approved: { icon: CheckCircle, color: 'text-emerald-600', label: 'Approved' },
  pending: { icon: ClockIcon, color: 'text-amber-600', label: 'Pending' },
  rejected: { icon: XCircle, color: 'text-red-600', label: 'Rejected' },
};

const libraryBooks = [
  { id: 'b1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', available: true },
  { id: 'b2', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', available: true },
  { id: 'b3', title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', available: false },
  { id: 'b4', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0-14-143951-8', available: true },
  { id: 'b5', title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0-316-76948-0', available: false },
  { id: 'b6', title: 'Mathematics for Class 10', author: 'R.D. Sharma', isbn: '978-8-19-282740-6', available: true },
];

const socialLinks = [
  { name: 'School Facebook', url: '#', icon: '📘' },
  { name: 'School Instagram', url: '#', icon: '📸' },
  { name: 'School YouTube', url: '#', icon: '▶️' },
  { name: 'School Twitter', url: '#', icon: '🐦' },
];

function getInitials(first: string, last: string) {
  return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
}

const AVATAR_COLORS = [
  'bg-brand-500', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-orange-500',
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function SectionCard({
  icon: Icon,
  title,
  children,
  defaultOpen = false,
}: {
  icon: typeof Images;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card interactive className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-brand-50 p-2 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function GallerySection() {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const { data: items } = useGallery();
  const data = items ?? galleryItems;
  return (
    <>
      <div className="mb-3 flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/50 p-3 dark:border-brand-900/30 dark:bg-brand-900/20">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg shadow-sm ring-1 ring-black/10">
          <img src="/logo.jpeg" alt="School Logo" className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="font-display text-sm font-bold text-slate-900 dark:text-white">Blooming Bud Public School</p>
          <p className="text-xs text-slate-500">Est. 2002 · CBSE Affiliated</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {data.slice(0, 6).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightbox(item)}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <img
              src={item.url}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/e2e8f0/94a3b8?text=Photo';
              }}
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
          </button>
        ))}
      </div>
      {data.length > 6 && (
        <p className="mt-2 text-center text-xs text-slate-400">+{data.length - 6} more photos</p>
      )}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-2xl bg-white p-2 shadow-2xl dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={lightbox.url}
                alt={lightbox.title}
                className="max-h-[70vh] w-full rounded-xl object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image';
                }}
              />
              <div className="p-3 text-center">
                <p className="font-display text-sm font-semibold text-slate-900 dark:text-white">{lightbox.title}</p>
                <p className="text-xs text-slate-500">{lightbox.category} · {new Date(lightbox.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ClassmatesSection() {
  const { data: student } = useStudentById(STUDENT_ID);
  const { data: classmates } = useStudentsByClass(student?.classId);
  return (
    <div className="space-y-2">
      {(classmates ?? []).length === 0 ? (
        <p className="text-sm text-slate-400">No classmates found.</p>
      ) : (
        (classmates ?? []).map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(s.id)}`}>
              {getInitials(s.firstName, s.lastName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.firstName} {s.lastName}</p>
              <p className="text-xs text-slate-500">Roll: {s.rollNumber}</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>{s.phone}</p>
              <p className="text-[11px]">{s.parentName}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function FeeSection() {
  const { data: invoices } = useFeeInvoices();
  const myInvoices = (invoices ?? []).filter((f) => f.studentId === STUDENT_ID);
  const pieData = useMemo(() => {
    const statuses: Record<string, number> = { paid: 0, pending: 0, overdue: 0, partial: 0 };
    myInvoices.forEach((f) => { statuses[f.status] = (statuses[f.status] || 0) + f.amount; });
    return Object.entries(statuses)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: v, color: PIE_COLORS[k] || '#94a3b8' }));
  }, [myInvoices]);
  return (
    <div className="space-y-4">
      {pieData.length > 0 && (
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value" isAnimationActive>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="space-y-2">
        {myInvoices.map((f) => (
          <div key={f.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">₹{f.amount.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Due: {new Date(f.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              f.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' :
              f.status === 'partial' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200' :
              f.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200' :
              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}>{f.status}</span>
          </div>
        ))}
        {myInvoices.length === 0 && <p className="text-sm text-slate-400">No fee invoices.</p>}
      </div>
    </div>
  );
}

function TransportSection() {
  return (
    <div className="space-y-3">
      {transportRoutes.map((route) => (
        <div key={route.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-sm font-semibold text-slate-900 dark:text-white">{route.name}</p>
              <p className="text-xs text-slate-500">{route.vehicleNo}</p>
            </div>
            <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">₹{route.fee}/yr</span>
          </div>
          <div className="mt-2 space-y-1">
            {route.stops.map((stop, i) => (
              <div key={stop.name} className="flex items-center gap-2 text-xs text-slate-500">
                <div className={`h-2 w-2 shrink-0 rounded-full ${i === route.stops.length - 1 ? 'bg-brand-500' : 'bg-slate-300'}`} />
                <span className="flex-1">{stop.name}</span>
                <span>{stop.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><User className="h-3 w-3" />{route.driverName}</span>
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{route.driverPhone}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function GatePassSection() {
  const [reason, setReason] = useState('');
  const [gpDate, setGpDate] = useState('');
  const myPasses = gatePasses.filter((g) => g.studentId === STUDENT_ID);
  const handleSubmit = () => {
    if (!reason.trim() || !gpDate) return;
    toast.success('Gate pass request submitted!');
    setReason('');
    setGpDate('');
  };
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for leaving…"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <input
          type="date"
          value={gpDate}
          onChange={(e) => setGpDate(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <Button variant="primary" className="w-full" onClick={handleSubmit} disabled={!reason.trim() || !gpDate}>
          Request gate pass
        </Button>
      </div>
      <div className="space-y-2">
        {myPasses.map((gp) => {
          const st = GATE_STATUS[gp.status] || GATE_STATUS.pending;
          const Icon = st.icon;
          return (
            <div key={gp.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{gp.reason}</p>
                <p className="text-xs text-slate-500">{new Date(gp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {gp.time}</p>
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${st.color}`}>
                <Icon className="h-3.5 w-3.5" />
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DownloadsSection() {
  const { data: items } = useDownloads();
  const data = items ?? [];
  return (
    <div className="space-y-2">
      {data.length === 0 ? (
        <p className="text-sm text-slate-400">No downloads available.</p>
      ) : (
        data.map((d) => (
          <div key={d.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{d.title}</p>
              <p className="truncate text-xs text-slate-500">{d.description}</p>
            </div>
            <div className="ml-3 flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${DOWNLOAD_TYPE_BADGES[d.type] || 'bg-slate-100 text-slate-600'}`}>
                {d.type}
              </span>
              <span className="text-[11px] text-slate-400">{d.fileSize}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function NoticeBoardSection() {
  const { data: anns } = useAnnouncements();
  const data = (anns ?? []).filter((a) => a.target === 'all' || a.targetClass === 'c1');
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {data.length === 0 ? (
        <p className="text-sm text-slate-400 sm:col-span-2">No announcements.</p>
      ) : (
        data.map((a) => (
          <div
            key={a.id}
            className={`rounded-xl border p-3 ${
              a.priority === 'high'
                ? 'border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20'
                : a.priority === 'medium'
                  ? 'border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{a.title}</p>
              {a.pinned && <span className="shrink-0 text-[10px] text-brand-600">📌</span>}
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{a.body}</p>
            <p className="mt-2 text-[10px] text-slate-400">{a.date} · {a.author}</p>
          </div>
        ))
      )}
    </div>
  );
}

function LibrarySection() {
  const [query, setQuery] = useState('');
  const results = query.trim()
    ? libraryBooks.filter((b) => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()))
    : libraryBooks;
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books…"
          className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
      <div className="max-h-48 space-y-2 overflow-y-auto">
        {results.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">{b.title}</p>
              <p className="text-xs text-slate-500">{b.author}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              b.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>{b.available ? 'Available' : 'Issued'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BirthdaySection() {
  const birthdays = useMemo(() => {
    const thisMonth = new Date().getMonth();
    return students
      .filter((s) => new Date(s.dob).getMonth() === thisMonth)
      .slice(0, 5);
  }, [students]);
  return (
    <div className="space-y-2">
      {birthdays.length === 0 ? (
        <p className="text-sm text-slate-400">No birthdays this month.</p>
      ) : (
        birthdays.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">
            <span className="text-lg">🎂</span>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.firstName} {s.lastName}</p>
              <p className="text-xs text-slate-500">{new Date(s.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function LeaveSection() {
  const [reason, setReason] = useState('');
  const [leaveType, setLeaveType] = useState<'sick' | 'personal' | 'emergency' | 'other'>('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [myLeaves, setMyLeaves] = useState<LeaveApplication[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  const loadLeaves = useCallback(async () => {
    setLoadingLeaves(true);
    try {
      const data = await getLeavesByStudent(STUDENT_ID);
      setMyLeaves(data);
    } catch { /* ignore */ }
    setLoadingLeaves(false);
  }, []);

  useEffect(() => { loadLeaves(); }, [loadLeaves]);

  const handleSubmit = async () => {
    if (!reason.trim() || !startDate || !endDate) {
      toast.error('Please fill all fields');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date must be after start date');
      return;
    }
    setSubmitting(true);
    try {
      await submitLeaveApplication({
        studentId: STUDENT_ID, studentName: 'Aarav Sharma',
        classId: 'c1', className: '10-A',
        reason: reason.trim(), type: leaveType,
        startDate, endDate,
      });
      toast.success('Leave application submitted!');
      setReason(''); setStartDate(''); setEndDate('');
      await loadLeaves();
    } catch { toast.error('Failed to submit leave'); }
    setSubmitting(false);
  };

  const statusBadge = (status: LeaveApplication['status']) => {
    const map: Record<string, string> = {
      pending_teacher: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
      pending_principal: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200',
      approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200',
    };
    const labels: Record<string, string> = {
      pending_teacher: 'Teacher pending',
      pending_principal: 'Principal pending',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return (
      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${map[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for leave…"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as typeof leaveType)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal Leave</option>
            <option value="emergency">Emergency</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
        </div>
        <Button variant="primary" className="w-full" onClick={handleSubmit} disabled={submitting || !reason.trim() || !startDate || !endDate}>
          {submitting ? 'Submitting…' : 'Submit Leave'}
        </Button>
      </div>
      <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">My Leaves</p>
        {loadingLeaves ? (
          <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div>
        ) : myLeaves.length === 0 ? (
          <p className="text-sm text-slate-400">No leave applications yet.</p>
        ) : (
          <div className="space-y-2">
            {myLeaves.slice(0, 5).map((lv) => (
              <div key={lv.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{lv.reason}</p>
                  <p className="text-xs text-slate-500">{lv.startDate} → {lv.endDate} ({lv.daysCount}d) · {lv.type}</p>
                </div>
                {statusBadge(lv.status)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SocialSection() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          className="flex items-center gap-2 rounded-xl border border-slate-100 p-3 text-sm transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
        >
          <span className="text-lg">{link.icon}</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{link.name}</span>
        </a>
      ))}
    </div>
  );
}

function TimetableQuickSection() {
  const { data: student } = useStudentById(STUDENT_ID);
  const classId = student?.classId || 'c1';
  const { data: timetable } = useTimetable(classId);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[new Date().getDay()];
  const todaysSlots = (timetable ?? []).filter((s) => s.day === todayName);
  return (
    <div className="space-y-2">
      {todaysSlots.length === 0 ? (
        <p className="text-sm text-slate-400">No classes today.</p>
      ) : (
        todaysSlots.map((slot) => (
          <div key={slot.id} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
              {slot.startTime.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">{slot.subject}</p>
              <p className="text-xs text-slate-500">{slot.teacher} · {slot.room}</p>
            </div>
            <span className="text-xs text-slate-400">{slot.startTime}–{slot.endTime}</span>
          </div>
        ))
      )}
    </div>
  );
}

function HostelInfoSection() {
  const hostel = {
    name: 'Green Valley Hostel',
    warden: 'Mr. Ramesh Verma',
    room: 'H-204',
    capacity: 4,
    occupants: 3,
    facilities: ['Wi-Fi', 'Gym', 'Mess', 'Laundry', 'Study Room', 'TV Lounge'],
    contact: '9876500999',
  };
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4 dark:border-brand-900/30 dark:bg-brand-900/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-base font-bold text-slate-900 dark:text-white">{hostel.name}</p>
            <p className="text-xs text-slate-500">Room {hostel.room} · {hostel.occupants}/{hostel.capacity} occupants</p>
          </div>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">Active</span>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">RV</div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{hostel.warden}</p>
          <p className="text-xs text-slate-500">Warden · {hostel.contact}</p>
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Facilities</p>
        <div className="flex flex-wrap gap-1.5">
          {hostel.facilities.map((f) => (
            <span key={f} className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const sections = [
  { id: 'gallery', title: 'Gallery', icon: Images, component: GallerySection },
  { id: 'classmates', title: 'Classmates', icon: Users, component: ClassmatesSection },
  { id: 'fee', title: 'Pay Fee', icon: CreditCard, component: FeeSection },
  { id: 'transport', title: 'Transport', icon: Bus, component: TransportSection },
  { id: 'gatepass', title: 'Gate Pass', icon: Ticket, component: GatePassSection },
  { id: 'downloads', title: 'Downloads', icon: Download, component: DownloadsSection },
  { id: 'notices', title: 'Notice Board', icon: Bell, component: NoticeBoardSection },
  { id: 'library', title: 'Library Catalog', icon: BookOpen, component: LibrarySection },
  { id: 'birthdays', title: 'Birthday Calendar', icon: Gift, component: BirthdaySection },
  { id: 'leave', title: 'Leave Application', icon: FileText, component: LeaveSection },
  { id: 'social', title: 'Social Links', icon: Share2, component: SocialSection },
  { id: 'timetable', title: 'Timetable Quick View', icon: Calendar, component: TimetableQuickSection },
  { id: 'hostel', title: 'Hostel Info', icon: Building, component: HostelInfoSection },
  { id: 'bugreport', title: 'Report Bug', icon: Bug, component: () => <BugReportModal inline /> },
];

export function StudentMore() {
  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)}>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Quick access</h2>
        <p className="text-sm text-slate-500">Everything you need, all in one place.</p>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((sec, i) => (
          <motion.div key={sec.id} variants={STAGGER.item(i + 1)}>
            <SectionCard icon={sec.icon} title={sec.title}>
              <sec.component />
            </SectionCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
