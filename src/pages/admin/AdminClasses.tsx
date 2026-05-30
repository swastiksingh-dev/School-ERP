import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, MapPin, ChevronDown, ChevronUp, UserPlus, GraduationCap, CalendarDays, Sliders, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { classes, students, teachers, examResults } from '../../data/mock';

type ExtraTab = 'performance' | 'holidays' | 'grading' | 'sessions';

export function AdminClasses() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rosterId, setRosterId] = useState<string | null>(null);
  const [showAssign, setShowAssign] = useState(false);
  const [assignClass, setAssignClass] = useState('');
  const [assignSubject, setAssignSubject] = useState('');
  const [assignTeacher, setAssignTeacher] = useState('');
  const [extraTab, setExtraTab] = useState<ExtraTab>('performance');
  const [gradeBounds, setGradeBounds] = useState({ A: { min: 90, max: 100 }, B: { min: 75, max: 89 }, C: { min: 60, max: 74 }, D: { min: 40, max: 59 }, F: { min: 0, max: 39 } });

  const chartData = classes.map((c) => ({
    name: c.name,
    students: c.studentCount,
  }));

  const roster = rosterId ? students.filter((s) => s.classId === rosterId) : [];
  const rosterClass = rosterId ? classes.find((c) => c.id === rosterId) : null;

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Class Management</h2>
          <p className="text-sm text-slate-500">{classes.length} active classes across {new Set(classes.map(c => c.grade)).size} grades.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowAssign(true)}>
            <UserPlus className="h-4 w-4" />
            Assign Teacher
          </Button>
          <Button>Create Class</Button>
        </div>
      </motion.div>

      <motion.div variants={STAGGER.item(1)}>
        <Card>
          <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Student distribution</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="students" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {rosterId && rosterClass && (
        <motion.div variants={STAGGER.item(2)}>
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {rosterClass.name} — Student Roster
              </h3>
              <Button variant="ghost" onClick={() => setRosterId(null)}>Close</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-medium">Roll</th>
                    <th className="pb-2 pr-4 font-medium">Name</th>
                    <th className="pb-2 pr-4 font-medium">Parent</th>
                    <th className="pb-2 font-medium">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((s) => (
                    <tr key={s.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">{s.rollNumber}</td>
                      <td className="py-2 pr-4 font-medium text-slate-900 dark:text-white">{s.firstName} {s.lastName}</td>
                      <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">{s.parentName}</td>
                      <td className="py-2 text-slate-600 dark:text-slate-300">{s.parentPhone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div variants={STAGGER.item(3)} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {classes.map((c) => (
          <Card key={c.id} interactive onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">{c.name}</p>
                <p className="text-sm text-slate-500">Grade {c.grade} &middot; Section {c.section}</p>
              </div>
              {expandedId === c.id ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> {c.room}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-slate-400" /> {c.studentCount} students
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-slate-400" /> {c.subjects.length} subjects
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Class teacher: {c.classTeacherName}</p>
            <button
              onClick={(e) => { e.stopPropagation(); setRosterId(rosterId === c.id ? null : c.id); }}
              className="mt-2 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              {rosterId === c.id ? 'Hide roster' : 'View student roster'}
            </button>

            {expandedId === c.id && (
              <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Subjects</p>
                <div className="space-y-1.5">
                  {c.subjects.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">
                      <span className="text-slate-700 dark:text-slate-200">{sub.name} ({sub.code})</span>
                      <span className="text-xs text-slate-400">{sub.teacherName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </motion.div>

      {showAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowAssign(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Assign Teacher to Subject</h3>
            <div className="space-y-3">
              <select
                value={assignClass}
                onChange={(e) => setAssignClass(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select
                value={assignSubject}
                onChange={(e) => setAssignSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">Select subject</option>
                {classes.find(c => c.id === assignClass)?.subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <select
                value={assignTeacher}
                onChange={(e) => setAssignTeacher(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">Select teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.firstName} {t.lastName} — {t.department}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setShowAssign(false)}>Cancel</Button>
                <Button onClick={() => { setShowAssign(false); }}>Assign</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <motion.div variants={STAGGER.item(4)}>
        <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {[
            { key: 'performance' as ExtraTab, label: 'Class Performance', icon: GraduationCap },
            { key: 'holidays' as ExtraTab, label: 'Holiday Calendar', icon: CalendarDays },
            { key: 'grading' as ExtraTab, label: 'Grading Scale', icon: Sliders },
            { key: 'sessions' as ExtraTab, label: 'Academic Sessions', icon: Layers },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setExtraTab(t.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                extraTab === t.key
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      {extraTab === 'performance' && (
        <motion.div variants={STAGGER.item(5)}>
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Class Performance Comparison</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classes.map(c => ({
                  name: c.name,
                  avgScore: Math.round(
                    examResults
                      .filter(er => students.filter(s => s.classId === c.id).some(s => s.id === er.studentId))
                      .reduce((sum, er) => sum + er.percentage, 0) /
                    Math.max(1, examResults.filter(er => students.filter(s => s.classId === c.id).some(s => s.id === er.studentId)).length)
                  ),
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      )}

      {extraTab === 'holidays' && (
        <motion.div variants={STAGGER.item(5)}>
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Holiday Calendar 2026-2027</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { date: '26 Jan 2026', name: 'Republic Day', type: 'National' },
                { date: '1 Mar 2026', name: 'Maha Shivaratri', type: 'Festival' },
                { date: '14 Mar 2026', name: 'Holi', type: 'Festival' },
                { date: '31 Mar 2026', name: 'Ram Navami', type: 'Festival' },
                { date: '14 Apr 2026', name: 'Ambedkar Jayanti', type: 'National' },
                { date: '1 May 2026', name: 'Labour Day', type: 'National' },
                { date: '15 Aug 2026', name: 'Independence Day', type: 'National' },
                { date: '22 Aug 2026', name: 'Janmashtami', type: 'Festival' },
                { date: '2 Oct 2026', name: 'Gandhi Jayanti', type: 'National' },
                { date: '12 Oct 2026', name: 'Dussehra', type: 'Festival' },
                { date: '1 Nov 2026', name: 'Diwali', type: 'Festival' },
                { date: '15 Nov 2026', name: 'Guru Nanak Jayanti', type: 'Festival' },
                { date: '25 Dec 2026', name: 'Christmas', type: 'Festival' },
                { date: '24 Dec 2026', name: 'Winter Break Start', type: 'Vacation' },
                { date: '2 Jan 2027', name: 'Winter Break End', type: 'Vacation' },
              ].map((h) => (
                <div key={h.date} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{h.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      h.type === 'National' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                      h.type === 'Festival' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    }`}>{h.type}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{h.date}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {extraTab === 'grading' && (
        <motion.div variants={STAGGER.item(5)}>
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Grading Scale Configuration</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(gradeBounds).map(([grade, bounds]) => (
                <div key={grade} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <p className="mb-2 font-display text-xl font-bold text-slate-900 dark:text-white">{grade}</p>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-slate-500">Min</label>
                      <input
                        type="number"
                        value={bounds.min}
                        onChange={(e) => setGradeBounds(prev => ({ ...prev, [grade]: { ...prev[grade as keyof typeof gradeBounds], min: +e.target.value } }))}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-brand-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Max</label>
                      <input
                        type="number"
                        value={bounds.max}
                        onChange={(e) => setGradeBounds(prev => ({ ...prev, [grade]: { ...prev[grade as keyof typeof gradeBounds], max: +e.target.value } }))}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-brand-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => toast.success('Grading scale saved')}>Save Grading Scale</Button>
            </div>
          </Card>
        </motion.div>
      )}

      {extraTab === 'sessions' && (
        <motion.div variants={STAGGER.item(5)}>
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Academic Sessions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/20">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">2026-2027</p>
                  <p className="text-xs text-brand-600">Current Session</p>
                </div>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">Active</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">2025-2026</p>
                  <p className="text-xs text-slate-400">Completed</p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => toast.success('New session 2027-2028 created')}>Create New Session</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
