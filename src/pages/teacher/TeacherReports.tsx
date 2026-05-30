import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Bar, BarChart, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart3, Download, PieChart as PieIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { useClassesByTeacher, useExams } from '../../hooks/queries';
import { attendanceRecords, examResults, submissions } from '../../data/mock';
import toast from 'react-hot-toast';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

export function TeacherReports() {
  const teacherId = 't1';
  const { data: myClasses } = useClassesByTeacher(teacherId);
  const classIds = useMemo(() => myClasses?.map(c => c.id) ?? [], [myClasses]);
  const { data: allExams } = useExams();

  const [selectedClass, setSelectedClass] = useState<string>('all');

  const classExams = useMemo(() => {
    let filtered = allExams ?? [];
    if (selectedClass !== 'all') filtered = filtered.filter(e => e.classId === selectedClass);
    return filtered;
  }, [allExams, selectedClass]);

  const performanceData = useMemo(() => {
    const examIds = classExams.map(e => e.id);
    const results = examResults.filter(r => examIds.includes(r.examId));
    const bySubject: Record<string, { total: number; count: number }> = {};
    for (const r of results) {
      if (!bySubject[r.subject]) bySubject[r.subject] = { total: 0, count: 0 };
      bySubject[r.subject].total += r.percentage;
      bySubject[r.subject].count++;
    }
    return Object.entries(bySubject).map(([subject, data]) => ({
      subject,
      avg: Math.round(data.total / data.count),
    }));
  }, [classExams]);

  const attData = useMemo(() => {
    const targetIds = selectedClass === 'all' ? classIds : [selectedClass];
    const recs = attendanceRecords.filter(r => targetIds.includes(r.classId));
    const byDay: Record<string, { present: number; total: number }> = {};
    for (const r of recs) {
      const day = r.date.slice(5);
      if (!byDay[day]) byDay[day] = { present: 0, total: 0 };
      byDay[day].total++;
      if (r.status === 'present') byDay[day].present++;
    }
    return Object.entries(byDay).slice(-7).map(([day, d]) => ({
      day,
      pct: Math.round((d.present / d.total) * 100),
    }));
  }, [selectedClass, classIds]);

  const submissionRate = useMemo(() => {
    const total = submissions.length;
    const graded = submissions.filter(s => s.status === 'graded').length;
    const pending = total - graded;
    return [
      { name: 'Graded', value: graded },
      { name: 'Pending', value: pending },
    ];
  }, []);

  const handleExport = () => {
    toast.success('Report downloaded as PDF');
  };

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h2>
          <p className="text-sm text-slate-500">Performance, attendance, and submission insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
            <option value="all">All Classes</option>
            {(myClasses ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Button variant="secondary" onClick={handleExport}><Download className="h-4 w-4" /> Export</Button>
        </div>
      </motion.div>

      <motion.div variants={STAGGER.item(1)} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              <BarChart3 className="mr-2 inline h-5 w-5 text-slate-400" />
              Avg Performance by Subject
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="avg" fill="#10b981" radius={[8, 8, 0, 0]} isAnimationActive>
                  {performanceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              <PieIcon className="mr-2 inline h-5 w-5 text-slate-400" />
              Assignment Submission Rate
            </h3>
          </div>
          <div className="flex h-64 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={submissionRate} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {submissionRate.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#10b981' : '#f59e0b'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Weekly Attendance %</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="pct" fill="#10b981" radius={[6, 6, 0, 0]} isAnimationActive />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Summary</h3>
          <div className="space-y-4">
            {[
              { label: 'Total Exams', value: classExams.length },
              { label: 'Total Submissions', value: submissions.length },
              { label: 'Avg Attendance', value: attData.length ? `${Math.round(attData.reduce((a, d) => a + d.pct, 0) / attData.length)}%` : 'N/A' },
              { label: 'Graded Rate', value: submissionRate[0]?.value && submissionRate[1]?.value
                ? `${Math.round((submissionRate[0].value / (submissionRate[0].value + submissionRate[1].value)) * 100)}%` : 'N/A' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
                <span className="text-sm text-slate-600 dark:text-slate-300">{s.label}</span>
                <span className="font-display text-lg font-bold text-slate-900 dark:text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
