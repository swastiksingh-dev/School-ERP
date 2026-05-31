import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CalendarDays, GraduationCap, Plus, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { subjects, exams, classes, teachers } from '../../data/mock';

type Tab = 'subjects' | 'exams' | 'calendar';

const holidays = [
  { date: '2026-08-15', title: 'Independence Day' },
  { date: '2026-10-02', title: 'Gandhi Jayanti' },
  { date: '2026-11-14', title: 'Children\'s Day' },
  { date: '2026-12-25', title: 'Christmas' },
  { date: '2026-01-26', title: 'Republic Day' },
];

export function AdminAcademic() {
  const [tab, setTab] = useState<Tab>('subjects');
  const [showExamForm, setShowExamForm] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', code: '', classId: '', teacherId: '' });

  const tabs: { key: Tab; label: string; icon: typeof BookOpen }[] = [
    { key: 'subjects', label: 'Subjects', icon: BookOpen },
    { key: 'exams', label: 'Exams', icon: GraduationCap },
    { key: 'calendar', label: 'Calendar', icon: CalendarDays },
  ];

  type CalendarEvent = { date: string; title: string; type: 'exam' | 'holiday'; class: string };

  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = exams.map((e) => ({
      date: e.date,
      title: `${e.title} (${e.subject})`,
      type: 'exam',
      class: classes.find(c => c.id === e.classId)?.name || '',
    }));
    holidays.forEach((h) => {
      events.push({ date: h.date, title: h.title, type: 'holiday', class: '' });
    });
    return events.sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Academic Management</h2>
          <p className="text-sm text-slate-500">{subjects.length} subjects, {exams.length} exams scheduled.</p>
        </div>
      </motion.div>

      <motion.div variants={STAGGER.item(1)} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Subjects', value: subjects.length, color: 'text-brand-600' },
          { label: 'Exams This Term', value: exams.filter(e => e.status === 'upcoming').length, color: 'text-amber-600' },
          { label: 'Teachers', value: teachers.length, color: 'text-violet-600' },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-xs font-semibold uppercase text-slate-500">{s.label}</p>
            <p className={`mt-1 font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={STAGGER.item(2)} className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </motion.div>

      {tab === 'subjects' && (
        <motion.div variants={STAGGER.item(3)} className="space-y-4">
          <Card>
            <h3 className="mb-3 font-display text-base font-semibold text-slate-900 dark:text-white">Add Subject</h3>
            <div className="flex flex-wrap gap-3">
              <input
                placeholder="Subject name"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <input
                placeholder="Code"
                value={newSubject.code}
                onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <select
                value={newSubject.classId}
                onChange={(e) => setNewSubject({ ...newSubject, classId: e.target.value })}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">Class</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select
                value={newSubject.teacherId}
                onChange={(e) => setNewSubject({ ...newSubject, teacherId: e.target.value })}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">Teacher</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
              </select>
              <Button onClick={() => setNewSubject({ name: '', code: '', classId: '', teacherId: '' })}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </Card>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Teacher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subjects.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{s.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{s.code}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{classes.find(c => c.id === s.classId)?.name || s.classId}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{s.teacherName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {tab === 'exams' && (
        <motion.div variants={STAGGER.item(3)} className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowExamForm(true)}>
              <Plus className="h-4 w-4" /> Add Exam
            </Button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Marks</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {exams.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{e.title}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{e.subject}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{classes.find(c => c.id === e.classId)?.name || e.classId}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{e.date}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{e.maxMarks}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        e.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                        e.status === 'upcoming' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showExamForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowExamForm(false)}>
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Add Exam</h3>
                  <button onClick={() => setShowExamForm(false)}><X className="h-5 w-5 text-slate-400" /></button>
                </div>
                <div className="space-y-3">
                  <input placeholder="Exam title" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                  <div className="grid grid-cols-2 gap-3">
                    <select className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                      <option value="">Class</option>
                      {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                      <option value="">Subject</option>
                      {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    <input type="number" placeholder="Max marks" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setShowExamForm(false)}>Cancel</Button>
                    <Button onClick={() => setShowExamForm(false)}>Create Exam</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {tab === 'calendar' && (
        <motion.div variants={STAGGER.item(3)} className="space-y-3">
          {calendarEvents.map((ev, i) => (
            <Card key={`${ev.date}-${i}`}>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 flex-col items-center justify-center rounded-xl text-xs font-bold ${
                  ev.type === 'holiday' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
                }`}>
                  <span>{ev.date.split('-')[2]}</span>
                  <span className="text-[10px] font-normal">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{ev.title}</p>
                  <p className="text-xs text-slate-500">
                    {ev.type === 'holiday' ? 'Holiday' : `Exam — ${ev.class}`}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  ev.type === 'holiday' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
                }`}>
                  {ev.type === 'holiday' ? 'Holiday' : 'Exam'}
                </span>
              </div>
            </Card>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
