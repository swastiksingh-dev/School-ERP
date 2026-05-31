import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, ChevronDown, ChevronUp, Mail, Phone, MapPin, Calendar, Droplets, BookOpen, Briefcase, Upload, Download, ToggleLeft, Key, History, Activity, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { students, teachers, activityLogs } from '../../data/mock';
import { demoCredentials, changePassword } from '../../services/authService';
import type { Student, Teacher } from '../../types';

type Tab = 'students' | 'teachers' | 'admins' | 'audit';

const admins = [
  { id: 'a1', firstName: 'Admin', lastName: 'User', email: 'admin@bbps.edu', phone: '9999999999', department: 'Administration' },
];

export function AdminUsers() {
  const [tab, setTab] = useState<Tab>('students');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetData, setResetData] = useState({ newSchoolId: '', newPassword: '', confirmPassword: '' });
  const [viewProfileUser, setViewProfileUser] = useState<Student | Teacher | null>(null);
  const [userStatuses, setUserStatuses] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('bbps-user-statuses') || '{}'); }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('bbps-user-statuses', JSON.stringify(userStatuses));
  }, [userStatuses]);

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(s =>
      !q || s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) || s.schoolId.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredTeachers = useMemo(() => {
    const q = search.toLowerCase();
    return teachers.filter(t =>
      !q || t.firstName.toLowerCase().includes(q) || t.lastName.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) || t.department.toLowerCase().includes(q)
    );
  }, [search]);

  const findDemoCred = useCallback((schoolId: string) => {
    return demoCredentials.find(c => c.schoolId === schoolId || c.employeeId === schoolId || c.uid === schoolId);
  }, []);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'students', label: 'Students', count: students.length },
    { key: 'teachers', label: 'Teachers', count: teachers.length },
    { key: 'admins', label: 'Admins', count: admins.length },
    { key: 'audit', label: 'Audit Logs' },
  ];

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>
          <p className="text-sm text-slate-500">Manage students, teachers, and administrators.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { toast.success('Users exported as CSV'); }}>
            <Download className="h-4 w-4" />
            Export as CSV
          </Button>
          <Button variant="secondary" onClick={() => setShowImport(true)}>
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </motion.div>

      <motion.div variants={STAGGER.item(1)} className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setExpandedId(null); }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
            {t.count !== undefined && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs dark:bg-slate-600">{t.count}</span>}
          </button>
        ))}
      </motion.div>

      <motion.div variants={STAGGER.item(2)} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={`Search ${tab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
        />
      </motion.div>

      {tab === 'students' && (
        <motion.div variants={STAGGER.item(3)} className="space-y-3">
          {filteredStudents.map((s) => (
            <Card key={s.id} interactive onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 dark:text-white">{s.firstName} {s.lastName}</p>
                    <span className={`h-2 w-2 rounded-full ${userStatuses[s.id] !== false ? 'bg-green-500' : 'bg-slate-300'}`} />
                  </div>
                  <p className="truncate text-sm text-slate-500">{s.email} &middot; Roll {s.rollNumber} &middot; {s.schoolId}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="hidden sm:inline">{s.classId.toUpperCase()}</span>
                  {expandedId === s.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
              {expandedId === s.id && (
                <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="h-4 w-4 text-slate-400" /> {s.email}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="h-4 w-4 text-slate-400" /> {s.phone}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="h-4 w-4 text-slate-400" /> {s.address}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Calendar className="h-4 w-4 text-slate-400" /> DOB: {s.dob}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Droplets className="h-4 w-4 text-slate-400" /> Blood: {s.bloodGroup}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    Parent: {s.parentName} ({s.parentPhone})
                  </div>
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-3 sm:col-span-2 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <ToggleLeft className="h-4 w-4 text-slate-400" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setUserStatuses(prev => ({ ...prev, [s.id]: prev[s.id] === false ? true : false })); }}
                        className={`relative h-5 w-9 rounded-full transition-colors ${userStatuses[s.id] !== false ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      >
                        <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${userStatuses[s.id] !== false ? 'translate-x-4' : ''}`} />
                      </button>
                      <span className="text-xs text-slate-500">{userStatuses[s.id] !== false ? 'Active' : 'Inactive'}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setViewProfileUser(s); }}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Profile
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setResetUserId(s.schoolId); setResetData({ newSchoolId: '', newPassword: '', confirmPassword: '' }); }}
                      className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700"
                    >
                      <Key className="h-3.5 w-3.5" /> Reset Credentials
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
          {filteredStudents.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">No students found.</p>
          )}
        </motion.div>
      )}

      {tab === 'teachers' && (
        <motion.div variants={STAGGER.item(3)} className="space-y-3">
          {filteredTeachers.map((t) => (
            <Card key={t.id} interactive onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 dark:text-white">{t.firstName} {t.lastName}</p>
                    <span className={`h-2 w-2 rounded-full ${userStatuses[t.id] !== false ? 'bg-green-500' : 'bg-slate-300'}`} />
                  </div>
                  <p className="truncate text-sm text-slate-500">{t.email} &middot; {t.department}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="hidden sm:inline">{t.subjects.join(', ')}</span>
                  {expandedId === t.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
              {expandedId === t.id && (
                <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="h-4 w-4 text-slate-400" /> {t.email}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="h-4 w-4 text-slate-400" /> {t.phone}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Briefcase className="h-4 w-4 text-slate-400" /> {t.department}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <BookOpen className="h-4 w-4 text-slate-400" /> {t.subjects.join(', ')}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 sm:col-span-2">
                    Assigned classes: {t.assignedClasses.map(c => c.toUpperCase()).join(', ')}
                  </div>
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-3 sm:col-span-2 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <ToggleLeft className="h-4 w-4 text-slate-400" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setUserStatuses(prev => ({ ...prev, [t.id]: prev[t.id] === false ? true : false })); }}
                        className={`relative h-5 w-9 rounded-full transition-colors ${userStatuses[t.id] !== false ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      >
                        <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${userStatuses[t.id] !== false ? 'translate-x-4' : ''}`} />
                      </button>
                      <span className="text-xs text-slate-500">{userStatuses[t.id] !== false ? 'Active' : 'Inactive'}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setViewProfileUser(t); }}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Profile
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setResetUserId(t.id); setResetData({ newSchoolId: '', newPassword: '', confirmPassword: '' }); }}
                      className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700"
                    >
                      <Key className="h-3.5 w-3.5" /> Reset Credentials
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
          {filteredTeachers.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">No teachers found.</p>
          )}
        </motion.div>
      )}

      {tab === 'admins' && (
        <motion.div variants={STAGGER.item(3)} className="space-y-3">
          {admins.map((a) => (
            <Card key={a.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{a.firstName} {a.lastName}</p>
                  <p className="text-sm text-slate-500">{a.email} &middot; {a.department}</p>
                </div>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">Admin</span>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {tab === 'audit' && (
        <motion.div variants={STAGGER.item(3)}>
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <History className="h-5 w-5 text-brand-500" />
              Recent Activity Logs
            </h3>
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-200">{log.action}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{log.user} &middot; {log.role} &middot; {log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowImport(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Import CSV</h3>
            <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-slate-200 p-8 dark:border-slate-700">
              <Upload className="h-10 w-10 text-slate-300" />
              <p className="text-sm text-slate-500">Drag & drop CSV file here, or click to browse</p>
              <Button variant="secondary" onClick={() => { toast.success('CSV imported successfully'); setShowImport(false); }}>Browse Files</Button>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setShowImport(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {viewProfileUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setViewProfileUser(null)}>
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">User Profile</h3>
              <button onClick={() => setViewProfileUser(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                {'firstName' in viewProfileUser ? `${viewProfileUser.firstName[0]}${viewProfileUser.lastName[0]}` : ''}
              </div>
              <div>
                <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{viewProfileUser.firstName} {viewProfileUser.lastName}</p>
                {'schoolId' in viewProfileUser && <p className="text-xs text-slate-500">ID: {viewProfileUser.schoolId}</p>}
                {'department' in viewProfileUser && <p className="text-xs text-slate-500">{viewProfileUser.department}</p>}
                {'classId' in viewProfileUser && <p className="text-xs text-slate-500">Class: {viewProfileUser.classId}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Email</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{viewProfileUser.email}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Phone</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{viewProfileUser.phone}</p>
              </div>
              {'address' in viewProfileUser && (
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Address</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{viewProfileUser.address}</p>
                </div>
              )}
              {'classId' in viewProfileUser && (
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Roll No</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{viewProfileUser.rollNumber}</p>
                </div>
              )}
              {'dob' in viewProfileUser && (
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">DOB</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{viewProfileUser.dob}</p>
                </div>
              )}
              {'bloodGroup' in viewProfileUser && (
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Blood Group</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{viewProfileUser.bloodGroup}</p>
                </div>
              )}
              {'parentName' in viewProfileUser && (
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Parent</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{viewProfileUser.parentName}</p>
                </div>
              )}
              {'parentPhone' in viewProfileUser && (
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Parent Phone</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{viewProfileUser.parentPhone}</p>
                </div>
              )}
              {'department' in viewProfileUser && viewProfileUser.department && (
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Department</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{viewProfileUser.department}</p>
                </div>
              )}
              {'subjects' in viewProfileUser && (
                <div className="col-span-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Subjects</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{viewProfileUser.subjects.join(', ')}</p>
                </div>
              )}
              {'assignedClasses' in viewProfileUser && (
                <div className="col-span-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Assigned Classes</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{viewProfileUser.assignedClasses.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Add New User</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="First name" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                <input placeholder="Last name" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <input placeholder="Email" type="email" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              <select className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <input placeholder="Password" type="password" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button onClick={() => { setShowForm(false); }}>Create User</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {resetUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setResetUserId(null); setResetData({ newSchoolId: '', newPassword: '', confirmPassword: '' }); }}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-1 font-display text-lg font-semibold text-slate-900 dark:text-white">Reset Credentials</h3>
            <p className="mb-4 text-xs text-slate-500">Update School/Employee ID and/or password for this user.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500">New School/Employee ID</label>
                <input
                  type="text"
                  value={resetData.newSchoolId}
                  onChange={e => setResetData(p => ({ ...p, newSchoolId: e.target.value }))}
                  placeholder="Leave empty to keep current"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">New Password</label>
                <input
                  type="password"
                  value={resetData.newPassword}
                  onChange={e => setResetData(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Leave empty to keep current"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Confirm New Password</label>
                <input
                  type="password"
                  value={resetData.confirmPassword}
                  onChange={e => setResetData(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => { setResetUserId(null); setResetData({ newSchoolId: '', newPassword: '', confirmPassword: '' }); }}>Cancel</Button>
                <Button onClick={() => {
                  if (resetData.newPassword && resetData.newPassword.length < 6) {
                    toast.error('Password must be at least 6 characters');
                    return;
                  }
                  if (resetData.newPassword !== resetData.confirmPassword) {
                    toast.error('Passwords do not match');
                    return;
                  }
                  const cred = findDemoCred(resetUserId);
                  if (!cred) { toast.error('User not found in demo credentials'); setResetUserId(null); return; }
                  if (resetData.newPassword) {
                    const result = changePassword(cred.schoolId, cred.password, resetData.newPassword);
                    if (!result.success) { toast.error(result.error || 'Failed'); return; }
                  }
                  if (resetData.newSchoolId) {
                    cred.schoolId = resetData.newSchoolId;
                    if (cred.employeeId) cred.employeeId = resetData.newSchoolId;
                    const student = students.find(s => s.schoolId === resetUserId || s.id === resetUserId);
                    if (student) student.schoolId = resetData.newSchoolId;
                  }
                  toast.success('Credentials updated successfully!');
                  setResetUserId(null);
                  setResetData({ newSchoolId: '', newPassword: '', confirmPassword: '' });
                }}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
