import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { ClipboardList, Plus, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { useExams, useExamResultsByExam, useClassesByTeacher, useStudentsByClass } from '../../hooks/queries';
import { exams as mockExams, examResults as mockExamResults } from '../../data/mock';
import toast from 'react-hot-toast';

export function TeacherExams() {
  const teacherId = 't1';
  const { data: myClasses } = useClassesByTeacher(teacherId);
  const classIds = useMemo(() => myClasses?.map(c => c.id) ?? [], [myClasses]);
  const { data: allExams } = useExams();
  const myExams = useMemo(() => (allExams ?? []).filter(e => classIds.includes(e.classId)), [allExams, classIds]);

  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [marksMode, setMarksMode] = useState(false);
  const [marks, setMarks] = useState<Record<string, string>>({});

  const { data: results } = useExamResultsByExam(selectedExamId ?? undefined);
  const selectedExam = useMemo(() => myExams.find(e => e.id === selectedExamId), [myExams, selectedExamId]);
  const { data: roster } = useStudentsByClass(selectedExam?.classId ?? undefined);

  const stats = useMemo(() => ({
    upcoming: myExams.filter(e => e.status === 'upcoming').length,
    ongoing: myExams.filter(e => e.status === 'ongoing').length,
    completed: myExams.filter(e => e.status === 'completed').length,
  }), [myExams]);

  const [form, setForm] = useState({
    title: '', classId: '', subject: '', date: '', duration: 60, maxMarks: 100,
  });

  const subjectsForClass = useMemo(() => {
    if (!form.classId || !myClasses) return [];
    return myClasses.find(c => c.id === form.classId)?.subjects ?? [];
  }, [form.classId, myClasses]);

  const handleCreateExam = () => {
    if (!form.title || !form.classId || !form.subject || !form.date) {
      toast.error('Please fill all required fields'); return;
    }
    const cls = myClasses?.find(c => c.id === form.classId);
    const newExam = {
      id: `e${Date.now()}`,
      title: form.title,
      description: '',
      classId: form.classId,
      subjectId: subjectsForClass.find(s => s.name === form.subject)?.id ?? '',
      subject: form.subject,
      date: form.date,
      duration: form.duration,
      maxMarks: form.maxMarks,
      type: 'unit_test' as const,
      status: 'upcoming' as const,
    };
    mockExams.push(newExam);
    toast.success(`Exam "${form.title}" created for ${cls?.name ?? form.classId}`);
    setShowCreate(false);
    setForm({ title: '', classId: '', subject: '', date: '', duration: 60, maxMarks: 100 });
  };

  const handleSaveMarks = () => {
    if (!selectedExam || !roster) return;
    const entries = Object.entries(marks).filter(([, s]) => s !== '');
    if (!entries.length) { toast.error('No marks to save'); return; }
    for (const [studentId, scoreStr] of entries) {
      const score = Number(scoreStr);
      const student = roster.find(s => s.id === studentId);
      if (!student) continue;
      const existing = mockExamResults.findIndex(r => r.examId === selectedExam.id && r.studentId === studentId);
      const pct = Math.round((score / selectedExam.maxMarks) * 100);
      const grade = pct >= 90 ? 'A+' : pct >= 75 ? 'A' : pct >= 60 ? 'B+' : pct >= 45 ? 'B' : 'C';
      const result = {
        id: `er${Date.now()}_${studentId}`,
        examId: selectedExam.id,
        examTitle: selectedExam.title,
        studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        subject: selectedExam.subject,
        score,
        maxMarks: selectedExam.maxMarks,
        percentage: pct,
        grade,
      };
      if (existing >= 0) mockExamResults[existing] = result;
      else mockExamResults.push(result);
    }
    toast.success(`Marks saved for ${entries.length} student(s)`);
    setMarks({});
    setMarksMode(false);
  };

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Exams</h2>
          <p className="text-sm text-slate-500">Manage exams and enter marks</p>
        </div>
        <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> New Exam</Button>
      </motion.div>

      <motion.div variants={STAGGER.item(1)} className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Upcoming', value: stats.upcoming, color: 'text-amber-600' },
          { label: 'Ongoing', value: stats.ongoing, color: 'text-blue-600' },
          { label: 'Completed', value: stats.completed, color: 'text-brand-600' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-xs font-semibold uppercase text-slate-500">{s.label}</p>
            <p className={`mt-2 font-display text-3xl font-bold ${s.color} dark:text-white`}>{s.value}</p>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={STAGGER.item(2)} className="space-y-3">
        {myExams.map((exam) => (
          <Card key={exam.id} interactive onClick={() => setSelectedExamId(selectedExamId === exam.id ? null : exam.id)}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">{exam.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    exam.status === 'upcoming' ? 'bg-amber-100 text-amber-700'
                      : exam.status === 'ongoing' ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>{exam.status}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {exam.subject} · {myClasses?.find(c => c.id === exam.classId)?.name ?? exam.classId} · {exam.date} · {exam.duration}min
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-400">Max {exam.maxMarks}</span>
            </div>

            {selectedExamId === exam.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 overflow-hidden">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">Results</h4>
                  <Button variant="secondary" onClick={() => { setMarksMode(!marksMode); setMarks({}); }}>
                    <ClipboardList className="h-4 w-4" /> {marksMode ? 'View Results' : 'Enter Marks'}
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 dark:border-slate-700">
                        <th className="py-2 pr-3">Student</th>
                        <th className="py-2 pr-3">Score</th>
                        <th className="py-2 pr-3">Max</th>
                        <th className="py-2 pr-3">%</th>
                        <th className="py-2">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(roster ?? []).map(student => {
                        const result = (results ?? []).find(r => r.studentId === student.id);
                        const isEditing = marksMode && selectedExamId === exam.id;
                        return (
                          <tr key={student.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-2 pr-3 font-medium text-slate-900 dark:text-white">{student.firstName} {student.lastName}</td>
                            <td className="py-2 pr-3">
                              {isEditing ? (
                                <input
                                  type="number" min={0} max={exam.maxMarks}
                                  defaultValue={result?.score ?? ''}
                                  onChange={e => setMarks(m => ({ ...m, [student.id]: e.target.value }))}
                                  className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                />
                              ) : (
                                <span>{result?.score ?? '-'}</span>
                              )}
                            </td>
                            <td className="py-2 pr-3 text-slate-500">{exam.maxMarks}</td>
                            <td className="py-2 pr-3 text-slate-500">{result ? `${result.percentage}%` : '-'}</td>
                            <td className="py-2">
                              {result ? (
                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  result.grade === 'A+' ? 'bg-green-100 text-green-700'
                                    : result.grade === 'A' ? 'bg-blue-100 text-blue-700'
                                    : result.grade === 'B+' ? 'bg-amber-100 text-amber-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>{result.grade}</span>
                              ) : <span className="text-slate-400">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {marksMode && <Button className="mt-3" onClick={handleSaveMarks}><ClipboardList className="h-4 w-4" /> Save Marks</Button>}
              </motion.div>
            )}
          </Card>
        ))}
      </motion.div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">New Exam</h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Class</label>
                  <select value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value, subject: '' }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="">Select</option>
                    {(myClasses ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Subject</label>
                  <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="">Select</option>
                    {subjectsForClass.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Duration (min)</label>
                  <input type="number" min={15} step={15} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Max Marks</label>
                  <input type="number" min={1} value={form.maxMarks} onChange={e => setForm(f => ({ ...f, maxMarks: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
              </div>
              <Button className="w-full" onClick={handleCreateExam}><Plus className="h-4 w-4" /> Create Exam</Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
