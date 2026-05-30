import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Grid3X3,
  IdCard,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import toast from 'react-hot-toast';
import {
  useStudentById,
  useExamResults,
  useAssignments,
  useTimetable,
  useAttendance,
  useExams,
} from '../../hooks/queries';

const STUDENT_ID = 's1';

const tabs = [
  { id: 'results', label: 'Results', icon: GraduationCap },
  { id: 'homework', label: 'Homework', icon: BookOpen },
  { id: 'timetable', label: 'Timetable', icon: Grid3X3 },
  { id: 'attendance', label: 'Attendance', icon: Calendar },
  { id: 'analytics', label: 'Performance', icon: TrendingUp },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'admit-card', label: 'Admit Card', icon: IdCard },
] as const;

type TabId = (typeof tabs)[number]['id'];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: 'bg-blue-500',
  Physics: 'bg-purple-500',
  Chemistry: 'bg-emerald-500',
  English: 'bg-rose-500',
  'Computer Science': 'bg-cyan-500',
  'Physical Education': 'bg-orange-500',
};

const GRADE_COLORS: Record<string, string> = {
  'A+': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  A: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  'B+': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  B: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
  'C+': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  C: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
  D: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  F: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
const TIME_SLOTS = ['09:00', '10:00', '11:15', '12:45'] as const;

function getDaysRemaining(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getGradeColor(grade: string) {
  return GRADE_COLORS[grade] || GRADE_COLORS['F'];
}

function getSubjectColor(subject: string) {
  return SUBJECT_COLORS[subject] || 'bg-slate-400';
}

function getInitials(first: string, last: string) {
  return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
}

function ResultsTab({ studentId }: { studentId: string }) {
  const { data: results, isLoading } = useExamResults(studentId);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!results?.length) {
    return (
      <Card className="text-center">
        <GraduationCap className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">No results yet</p>
        <p className="text-sm text-slate-500">Exam results will appear here once published.</p>
      </Card>
    );
  }

  const chartData = results.map((r) => ({
    name: r.subject.slice(0, 8),
    subject: r.subject,
    score: r.score,
    max: r.maxMarks,
    percentage: Math.round(r.percentage),
  }));

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Score overview</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                }}
                formatter={(value: number, name: string) => [value, name === 'score' ? 'Score' : name]}
              />
              <Bar dataKey="max" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Max" />
              <Bar dataKey="score" fill="#059669" radius={[4, 4, 0, 0]} name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((r, i) => (
          <motion.div key={r.id} variants={STAGGER.item(i)}>
            <Card interactive>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-display text-base font-semibold text-slate-900 dark:text-white">{r.examTitle}</p>
                  <p className="text-sm text-slate-500">{r.subject}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${getGradeColor(r.grade)}`}
                >
                  {r.grade}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">{r.score}</span>
                  <span className="text-slate-400">/{r.maxMarks}</span>
                </span>
                <span className="text-slate-500">
                  {Math.round(r.percentage)}%
                </span>
                {r.rank !== undefined && (
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                    Rank #{r.rank}
                  </span>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function HomeworkTab({ classId }: { classId: string }) {
  const { data: assignments, isLoading } = useAssignments(classId);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!assignments?.length) {
    return (
      <Card className="text-center">
        <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">No homework</p>
        <p className="text-sm text-slate-500">You are all caught up!</p>
      </Card>
    );
  }

  const sorted = [...assignments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-4">
      {sorted.map((a, i) => {
        const daysLeft = getDaysRemaining(a.dueDate);
        const overdue = daysLeft < 0;
        const dueSoon = daysLeft >= 0 && daysLeft <= 2;

        let statusLabel: string;
        let statusClass: string;
        if (overdue) {
          statusLabel = 'Overdue';
          statusClass = 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200';
        } else if (dueSoon) {
          statusLabel = `${daysLeft}d left`;
          statusClass = 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200';
        } else {
          statusLabel = `${daysLeft}d left`;
          statusClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200';
        }

        const dotColor = overdue
          ? 'bg-red-500'
          : dueSoon
            ? 'bg-amber-500'
            : 'bg-emerald-500';

        return (
          <motion.div key={a.id} variants={STAGGER.item(i)}>
            <Card interactive className="relative overflow-hidden pl-4">
              <div className={`absolute left-0 top-0 h-full w-1 ${dotColor}`} />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-semibold text-slate-900 dark:text-white">{a.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span>{a.subject}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Due {new Date(a.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span>{a.maxScore} pts</span>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass}`}>
                  {statusLabel}
                </span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function TimetableTab({ classId }: { classId: string }) {
  const { data: slots, isLoading } = useTimetable(classId);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!slots?.length) {
    return (
      <Card className="text-center">
        <Grid3X3 className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">No timetable</p>
        <p className="text-sm text-slate-500">Timetable has not been published yet.</p>
      </Card>
    );
  }

  const getSlot = (day: string, time: string) =>
    slots.find((s) => s.day === day && s.startTime === time);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2">
          <div className="flex items-center justify-center rounded-xl bg-slate-100 p-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Time
          </div>
          {DAYS.map((day) => (
            <div
              key={day}
              className="rounded-xl bg-brand-50 p-3 text-center font-display text-sm font-bold text-brand-800 dark:bg-brand-900/30 dark:text-brand-200"
            >
              {day.slice(0, 3)}
            </div>
          ))}
          {TIME_SLOTS.map((time) => (
            <>
              <div
                key={time}
                className="flex items-center justify-center rounded-xl bg-slate-50 p-2 text-xs font-semibold text-slate-500 dark:bg-slate-800/50 dark:text-slate-400"
              >
                {time}
              </div>
              {DAYS.map((day) => {
                const slot = getSlot(day, time);
                return (
                  <div
                    key={`${day}-${time}`}
                    className={`flex min-h-[80px] flex-col justify-center rounded-xl border p-2 text-center text-xs ${
                      slot
                        ? 'border-transparent bg-white shadow-sm dark:bg-slate-900'
                        : 'border-dashed border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {slot ? (
                      <>
                        <span
                          className={`mx-auto mb-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${getSubjectColor(slot.subject)}`}
                        >
                          {slot.subject}
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{slot.teacher.split(' ')[0]}</span>
                        <span className="text-slate-400">{slot.room}</span>
                      </>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

function AttendanceTab({ studentId }: { studentId: string }) {
  const { data: records, isLoading } = useAttendance(studentId);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!records?.length) {
    return (
      <Card className="text-center">
        <Calendar className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">No attendance data</p>
        <p className="text-sm text-slate-500">Attendance records will appear here once marked.</p>
      </Card>
    );
  }

  const total = records.length;
  const presentCount = records.filter((r) => r.status === 'present').length;
  const absentCount = records.filter((r) => r.status === 'absent').length;
  const lateCount = records.filter((r) => r.status === 'late').length;
  const holidayCount = records.filter((r) => r.status === 'holiday').length;
  const presentPercent = total > 0 ? Math.round((presentCount / (total - holidayCount)) * 100) : 0;

  const pieData = [
    { name: 'Present', value: presentCount, color: '#10b981' },
    { name: 'Absent', value: absentCount, color: '#ef4444' },
    { name: 'Late', value: lateCount, color: '#f59e0b' },
  ].filter((d) => d.value > 0);

  const days = records
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      ...r,
      day: new Date(r.date).getDate(),
    }));

  const STATUS_DOT: Record<string, string> = {
    present: 'bg-emerald-500',
    absent: 'bg-red-500',
    late: 'bg-amber-500',
    holiday: 'bg-slate-300 dark:bg-slate-600',
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total days</p>
          <p className="mt-1 font-display text-3xl font-bold text-slate-900 dark:text-white">{total}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Present %</p>
          <p className="mt-1 font-display text-3xl font-bold text-brand-700 dark:text-brand-300">{presentPercent}%</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Absent</p>
          <p className="mt-1 font-display text-3xl font-bold text-red-600 dark:text-red-400">{absentCount}</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Attendance breakdown</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  isAnimationActive
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Daily log</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d) => (
              <div
                key={d.id}
                className="flex flex-col items-center gap-1 rounded-lg p-1.5"
              >
                <span className="text-[10px] font-medium text-slate-500">{d.day}</span>
                <span className={`h-3 w-3 rounded-full ${STATUS_DOT[d.status]}`} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdmitCardTab({ student }: { student: { id: string; firstName: string; lastName: string; classId: string; rollNumber: string; schoolId: string; dob: string; bloodGroup: string } }) {
  const initials = getInitials(student.firstName, student.lastName);

  return (
    <div className="mx-auto max-w-lg">
      <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 p-6 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Blooming Bud Public School</p>
          <h2 className="mt-1 font-display text-xl font-bold">Student Admit Card</h2>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
              {initials}
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Student Name', value: `${student.firstName} ${student.lastName}` },
              { label: 'Class', value: student.classId },
              { label: 'Roll Number', value: student.rollNumber },
              { label: 'School ID', value: student.schoolId },
              { label: 'Date of Birth', value: new Date(student.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
              { label: 'Blood Group', value: student.bloodGroup },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 dark:border-slate-800"
              >
                <span className="text-sm font-medium text-slate-500">{row.label}</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-400 dark:border-slate-800">
            This is a computer-generated document. Verify on school portal.
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformanceAnalyticsTab({ studentId }: { studentId: string }) {
  const { data: results } = useExamResults(studentId);

  if (!results?.length) {
    return (
      <Card className="text-center">
        <TrendingUp className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">No performance data</p>
        <p className="text-sm text-slate-500">Exam results will appear here once published.</p>
      </Card>
    );
  }

  const subjects = [...new Set(results.map((r) => r.subject))];
  const subjectAverages = subjects.map((sub) => {
    const subResults = results.filter((r) => r.subject === sub);
    const avg = subResults.reduce((s, r) => s + r.percentage, 0) / subResults.length;
    return { subject: sub, score: Math.round(avg) };
  });

  const overallGPA = Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length);

  const termData = [
    { term: 'Quiz 1', score: 68 },
    { term: 'Midterm', score: 74 },
    { term: 'Quiz 2', score: 79 },
    { term: 'Pre-final', score: 82 },
    { term: 'Final', score: overallGPA },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-6">
        <Card className="flex flex-col items-center">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" className="dark:stroke-slate-700" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="#059669" strokeWidth="8"
                strokeDasharray={`${(overallGPA / 100) * 264} 264`} strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">{overallGPA}%</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">GPA</p>
            </div>
          </div>
        </Card>
        <div className="flex flex-wrap gap-3">
          {subjects.map((sub) => {
            const avg = subjectAverages.find((s) => s.subject === sub)?.score || 0;
            const color = SUBJECT_COLORS[sub] || 'bg-slate-400';
            return (
              <div key={sub} className="rounded-xl border border-slate-100 px-4 py-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{sub}</span>
                </div>
                <p className="mt-1 text-lg font-bold text-brand-700 dark:text-brand-300">{avg}%</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Subject-wise scores</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAverages} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}
                />
                <Bar dataKey="score" fill="#059669" radius={[6, 6, 0, 0]} name="Average %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Progress trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={termData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="term" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}
                />
                <Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669', r: 4 }} name="Score %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {results.slice(0, 4).map((r, i) => (
          <motion.div key={r.id} variants={STAGGER.item(i)}>
            <Card interactive>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{r.examTitle}</p>
              <p className="text-xs text-slate-500">{r.subject}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-bold text-brand-700 dark:text-brand-300">{Math.round(r.percentage)}%</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${getGradeColor(r.grade)}`}>
                  {r.grade}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CalendarTab({ classId }: { classId: string }) {
  const { data: exams } = useExams(classId);
  const { data: assignments } = useAssignments(classId);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const prevMonth = () => { if (month === 0) { setYear((y) => y - 1); setMonth(11); } else { setMonth((m) => m - 1); } };
  const nextMonth = () => { if (month === 11) { setYear((y) => y + 1); setMonth(0); } else { setMonth((m) => m + 1); } };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const examDates = (exams ?? []).reduce<Record<string, { title: string; type: string }[]>>((acc: Record<string, { title: string; type: string }[]>, e) => {
    const d = e.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push({ title: e.subject, type: 'exam' });
    return acc;
  }, {});

  const assignmentDates = (assignments ?? []).reduce<Record<string, { title: string; type: string }[]>>((acc: Record<string, { title: string; type: string }[]>, a) => {
    const d = a.dueDate;
    if (!acc[d]) acc[d] = [];
    acc[d].push({ title: a.subject, type: 'assignment' });
    return acc;
  }, {});

  const allEvents = { ...examDates };
  for (const [date, items] of Object.entries(assignmentDates)) {
    if (!allEvents[date]) allEvents[date] = [];
    allEvents[date].push(...items);
  }

  const days: ({ day: number; events: { title: string; type: string }[] } | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ day: d, events: allEvents[dateStr] || [] });
  }

  const today = new Date();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={prevMonth} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
          {monthNames[month]} {year}
        </h3>
        <button type="button" onClick={nextMonth} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />;
          const isToday = d.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div
              key={`day-${d.day}`}
              className={`min-h-[72px] rounded-xl border p-1.5 text-sm transition-colors ${
                isToday
                  ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/20'
                  : 'border-slate-100 dark:border-slate-800'
              }`}
            >
              <span className={`font-semibold ${isToday ? 'text-brand-700 dark:text-brand-200' : 'text-slate-700 dark:text-slate-300'}`}>
                {d.day}
              </span>
              <div className="mt-1 space-y-0.5">
                {d.events.slice(0, 2).map((ev, ei) => (
                  <span
                    key={ei}
                    className={`block truncate rounded px-1 py-0.5 text-[10px] font-semibold ${
                      ev.type === 'exam'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                    }`}
                  >
                    {ev.title}
                  </span>
                ))}
                {d.events.length > 2 && (
                  <span className="text-[10px] text-slate-400">+{d.events.length - 2} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StudentAcademics() {
  const [activeTab, setActiveTab] = useState<TabId>('results');

  const studentId = STUDENT_ID;
  const { data: student, isLoading: studentLoading } = useStudentById(studentId);

  const classId = student?.classId || 'c1';

  const handleDownloadReports = () => {
    toast.success('Report download started! Check your downloads folder.');
  };

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My academics</h2>
          <p className="text-sm text-slate-500">Admit cards, results, homework, timetable, and analytics.</p>
        </div>
        <Button variant="secondary" onClick={handleDownloadReports} className="gap-2 text-xs">
          <Download className="h-4 w-4" />
          Download reports
        </Button>
      </motion.div>

      <motion.div variants={STAGGER.item(1)}>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm ring-1 ring-brand-600/20'
                    : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={STAGGER.item(2)} key={activeTab}>
        {activeTab === 'results' && <ResultsTab studentId={studentId} />}
        {activeTab === 'homework' && <HomeworkTab classId={classId} />}
        {activeTab === 'timetable' && <TimetableTab classId={classId} />}
        {activeTab === 'attendance' && <AttendanceTab studentId={studentId} />}
        {activeTab === 'analytics' && <PerformanceAnalyticsTab studentId={studentId} />}
        {activeTab === 'calendar' && <CalendarTab classId={classId} />}
        {activeTab === 'admit-card' && student && (
          <AdmitCardTab student={student} />
        )}
        {activeTab === 'admit-card' && !student && !studentLoading && (
          <Card className="text-center">
            <IdCard className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">Student not found</p>
            <p className="text-sm text-slate-500">Could not load student information.</p>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
