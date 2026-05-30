import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area } from 'recharts';
import { Award, BookOpen, Calendar, CalendarCheck, CheckSquare, Clock, FileText, GraduationCap, PlusCircle, ScrollText, Star, Target, Users } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { useAuth } from '../../hooks/useAuth';
import { useAssignmentsByTeacher, useClassesByTeacher, useTimetable } from '../../hooks/queries';
import { attendanceRecords, attendanceSeries, exams, getStudentsByClass, submissions } from '../../data/mock';
import { useNavigate } from 'react-router-dom';

export function TeacherHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const teacherId = 't1';
  const { data: myClasses } = useClassesByTeacher(teacherId);
  const { data: myAssignments } = useAssignmentsByTeacher(teacherId);
  const classIds = useMemo(() => myClasses?.map(c => c.id) ?? [], [myClasses]);

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const firstClassId = myClasses?.[0]?.id;
  const { data: timetable } = useTimetable(firstClassId);
  const todaySlots = useMemo(() => (timetable ?? []).filter(s => s.day === todayName), [timetable, todayName]);

  const totalStudents = useMemo(() => {
    let count = 0;
    for (const cid of classIds) count += getStudentsByClass(cid).length;
    return count;
  }, [classIds]);

  const activeAssignments = useMemo(() => (myAssignments ?? []).filter(a => a.status === 'active').length, [myAssignments]);

  const pulseData = useMemo(() => {
    const classRecs = attendanceRecords.filter(r => classIds.includes(r.classId));
    const dayMap2: Record<string, { present: number; total: number }> = {};
    for (const r of classRecs) {
      if (!dayMap2[r.date]) dayMap2[r.date] = { present: 0, total: 0 };
      dayMap2[r.date].total++;
      if (r.status === 'present') dayMap2[r.date].present++;
    }
    return Object.entries(dayMap2).slice(-5).map(([date, d]) => ({
      day: date.slice(5),
      pct: Math.round((d.present / d.total) * 100),
    }));
  }, [classIds]);

  const pendingGrading = useMemo(() => {
    const myAssignmentIds = new Set((myAssignments ?? []).map(a => a.id));
    return submissions.filter(s => s.status === 'submitted' && myAssignmentIds.has(s.assignmentId)).length;
  }, [myAssignments]);

  const upcomingExamsCount = useMemo(() => {
    return exams.filter(e => e.status === 'upcoming' && classIds.includes(e.classId)).length;
  }, [classIds]);

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().slice(0, 10);
    const examEvts = exams.filter(e => classIds.includes(e.classId) && e.date >= today && e.date <= weekEndStr).map(e => ({
      title: e.title, date: e.date, type: 'exam' as const,
      className: myClasses?.find(c => c.id === e.classId)?.name ?? ''
    }));
    const assignEvts = (myAssignments ?? []).filter(a => a.dueDate >= today && a.dueDate <= weekEndStr).map(a => ({
      title: a.title, date: a.dueDate, type: 'assignment' as const,
      className: myClasses?.find(c => c.id === a.classId)?.name ?? ''
    }));
    return [...examEvts, ...assignEvts].sort((a, b) => a.date.localeCompare(b.date));
  }, [classIds, myClasses, myAssignments]);

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.firstName ?? 'Priya'}
          </h2>
          <p className="text-sm text-slate-500">
            {user?.department && (
              <><span className="font-semibold text-slate-700 dark:text-slate-200">{user.department}</span> Department · </>)}
            {myClasses?.map(c => c.name).join(', ')} · {totalStudents} students
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/teacher/classes')}>
            <Calendar className="h-4 w-4" /> Mark Attendance
          </Button>
          <Button onClick={() => navigate('/teacher/assignments')}>
            <FileText className="h-4 w-4" /> Create Assignment
          </Button>
        </div>
      </motion.div>

      <motion.div variants={STAGGER.item(1)} className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Students', value: totalStudents, icon: Users, color: 'bg-brand-100 text-brand-700' },
          { label: 'Active Assignments', value: activeAssignments, icon: BookOpen, color: 'bg-blue-100 text-blue-700' },
          { label: 'Classes Today', value: todaySlots.length, icon: Clock, color: 'bg-amber-100 text-amber-700' },
          { label: 'Exams Upcoming', value: '2', icon: GraduationCap, color: 'bg-purple-100 text-purple-700' },
        ].map((s) => (
          <Card key={s.label} interactive>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-slate-500">{s.label}</p>
              <div className={`rounded-lg p-2 ${s.color}`}><s.icon className="h-4 w-4" /></div>
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">{s.value}</p>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={STAGGER.item(2)}>
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Attendance Pulse</h3>
              <span className="text-xs text-slate-500">Last 5 days</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pulseData.length ? pulseData : attendanceSeries}>
                  <defs>
                    <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[80, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="pct" stroke="#10b981" fill="url(#pulseGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={STAGGER.item(3)}>
          <Card>
            <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
              Today's Schedule {todaySlots.length ? `(${todayName})` : ''}
            </h3>
            {todaySlots.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No classes scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {todaySlots.map((slot) => (
                  <div key={slot.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{slot.subject}</p>
                      <p className="text-xs text-slate-500">{slot.startTime}–{slot.endTime} · Room {slot.room}</p>
                    </div>
                    <span className="text-xs text-slate-400">{slot.teacher}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <motion.div variants={STAGGER.item(4)} className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              <CheckSquare className="mr-2 inline h-5 w-5 text-slate-400" />
              Pending Tasks
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-amber-50 p-3 dark:bg-amber-900/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <ScrollText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Assignments to Grade</p>
                  <p className="text-xs text-slate-500">{pendingGrading} submissions pending review</p>
                </div>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-bold text-amber-700">{pendingGrading}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Upcoming Exams</p>
                  <p className="text-xs text-slate-500">{upcomingExamsCount} exams scheduled</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-bold text-blue-700">{upcomingExamsCount}</span>
            </div>
          </div>
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              <Target className="mr-2 inline h-5 w-5 text-slate-400" />
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Mark Attendance', icon: CalendarCheck, color: 'bg-brand-100 text-brand-700', onClick: () => navigate('/teacher/classes') },
              { label: 'Create Assignment', icon: PlusCircle, color: 'bg-blue-100 text-blue-700', onClick: () => navigate('/teacher/assignments') },
              { label: 'Schedule Exam', icon: Award, color: 'bg-purple-100 text-purple-700', onClick: () => navigate('/teacher/exams') },
              { label: 'Publish Result', icon: Star, color: 'bg-amber-100 text-amber-700', onClick: () => navigate('/teacher/exams') },
            ].map(action => (
              <button key={action.label} onClick={action.onClick}
                className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-brand-50 dark:bg-slate-800 dark:hover:bg-brand-900/20"
              >
                <div className={`rounded-lg p-2.5 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{action.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={STAGGER.item(5)} className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              <Award className="mr-2 inline h-5 w-5 text-amber-500" />
              Student of the Week
            </h3>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Week 22</span>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-brand-50 to-blue-50 p-4 dark:from-brand-900/20 dark:to-blue-900/20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-200 text-2xl font-bold text-brand-700 dark:bg-brand-800 dark:text-brand-300">
              AS
            </div>
            <div className="flex-1">
              <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">Aarav Sharma</p>
              <p className="text-sm text-slate-500">Class 10-A · 95% Avg Score</p>
              <div className="mt-2 flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-4 w-4 ${i <= 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                ))}
              </div>
            </div>
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
              <Award className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <p className="mt-3 text-xs italic text-slate-400">Top performer with consistent academic excellence and 100% attendance this week.</p>
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
            <CalendarCheck className="mr-2 inline h-5 w-5 text-slate-400" />
            Upcoming Events
          </h3>
          {upcomingEvents.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">No upcoming events this week</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((evt, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${evt.type === 'exam' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {evt.type === 'exam' ? <GraduationCap className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{evt.title}</p>
                    <p className="text-xs text-slate-500">{evt.className} · {evt.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
