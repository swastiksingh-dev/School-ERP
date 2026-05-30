import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChevronDown, ChevronUp, ClipboardCheck, MapPin, Save, Users } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { useClassesByTeacher, useStudentsByClass } from '../../hooks/queries';
import { attendanceRecords, getAttendanceByStudent } from '../../data/mock';
import toast from 'react-hot-toast';

type AttendanceStatus = 'present' | 'absent' | 'late';

export function TeacherClasses() {
  const teacherId = 't1';
  const { data: myClasses } = useClassesByTeacher(teacherId);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});

  const expandedClass = myClasses?.find(c => c.id === expanded);
  const { data: roster } = useStudentsByClass(expanded ?? undefined);

  const attSummary = useMemo(() => {
    if (!expandedClass) return [];
    const recs = attendanceRecords.filter(r => r.classId === expandedClass.id);
    const byDate: Record<string, { present: number; total: number }> = {};
    for (const r of recs) {
      if (!byDate[r.date]) byDate[r.date] = { present: 0, total: 0 };
      byDate[r.date].total++;
      if (r.status === 'present') byDate[r.date].present++;
    }
    return Object.entries(byDate).slice(-7).map(([date, d]) => ({
      date: date.slice(5),
      pct: Math.round((d.present / d.total) * 100),
    }));
  }, [expandedClass]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    const marked = Object.keys(attendanceMap).length;
    if (marked === 0) { toast.error('No attendance changes to save'); return; }
    toast.success(`Attendance saved for ${marked} student(s) on ${attendanceDate}`);
    setAttendanceMap({});
  };

  const getStudentAttPct = (studentId: string) => {
    const recs = getAttendanceByStudent(studentId);
    if (!recs.length) return 0;
    return Math.round((recs.filter(r => r.status === 'present').length / recs.length) * 100);
  };

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)}>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Classes</h2>
        <p className="text-sm text-slate-500">{myClasses?.length ?? 0} classes assigned</p>
      </motion.div>

      <motion.div variants={STAGGER.item(1)} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(myClasses ?? []).map((cls) => (
          <Card key={cls.id} interactive onClick={() => setExpanded(expanded === cls.id ? null : cls.id)}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{cls.name}</h3>
                <p className="text-xs text-slate-500">Grade {cls.grade} · Section {cls.section}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                {expanded === cls.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {cls.room}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {cls.studentCount}</span>
            </div>
          </Card>
        ))}
      </motion.div>

      {expandedClass && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card>
            <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
              {expandedClass.name} — Attendance Summary
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attSummary}>
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="pct" fill="#10b981" radius={[6, 6, 0, 0]} isAnimationActive />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                <ClipboardCheck className="mr-2 inline h-5 w-5 text-slate-400" />
                Mark Attendance
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <Button onClick={handleSaveAttendance}><Save className="h-4 w-4" /> Save</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 dark:border-slate-700">
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Roll</th>
                    <th className="py-3 pr-4">Parent Phone</th>
                    <th className="py-3 pr-4">Overall Att.</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(roster ?? []).map((s) => (
                    <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{s.firstName} {s.lastName}</td>
                      <td className="py-3 pr-4 text-slate-500">{s.rollNumber}</td>
                      <td className="py-3 pr-4 text-slate-500">{s.parentPhone}</td>
                      <td className="py-3 pr-4 text-slate-500">{getStudentAttPct(s.id)}%</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          {(['present', 'absent', 'late'] as AttendanceStatus[]).map(st => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(s.id, st)}
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                attendanceMap[s.id] === st
                                  ? st === 'present' ? 'bg-green-500 text-white'
                                    : st === 'absent' ? 'bg-red-500 text-white'
                                    : 'bg-amber-500 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {st.charAt(0).toUpperCase() + st.slice(1)}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Subjects</h3>
            <div className="flex flex-wrap gap-2">
              {expandedClass.subjects.map(sub => (
                <span key={sub.id} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-300">
                  {sub.name} ({sub.teacherName})
                </span>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
