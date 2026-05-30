import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Plus, Send, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { useAssignmentsByTeacher, useSubmissions, useClassesByTeacher } from '../../hooks/queries';
import { assignments as mockAssignments, submissions as mockSubmissions } from '../../data/mock';
import toast from 'react-hot-toast';

export function TeacherAssignments() {
  const teacherId = 't1';
  const { data: myAssignments } = useAssignmentsByTeacher(teacherId);
  const { data: myClasses } = useClassesByTeacher(teacherId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [grades, setGrades] = useState<Record<string, { score: string; feedback: string }>>({});

  const { data: submissions } = useSubmissions(selectedId ?? undefined);

  const stats = useMemo(() => {
    const all = myAssignments ?? [];
    return {
      total: all.length,
      active: all.filter(a => a.status === 'active').length,
      closed: all.filter(a => a.status === 'closed').length,
    };
  }, [myAssignments]);

  const [form, setForm] = useState({
    title: '', description: '', classId: '', subject: '', dueDate: '', maxScore: 50,
  });

  const handleGradeChange = (submissionId: string, field: 'score' | 'feedback', value: string) => {
    setGrades(prev => ({ ...prev, [submissionId]: { ...prev[submissionId], [field]: value } }));
  };

  const handleSaveGrades = () => {
    const entries = Object.entries(grades).filter(([, g]) => g.score !== '');
    if (!entries.length) { toast.error('No grades to save'); return; }
    toast.success(`Grades saved for ${entries.length} student(s)`);
    setGrades({});
  };

  const handleCreateAssignment = () => {
    if (!form.title || !form.classId || !form.subject || !form.dueDate) {
      toast.error('Please fill all required fields'); return;
    }
    const cls = (myClasses ?? []).find(c => c.id === form.classId);
    const newAssignment = {
      id: `a${Date.now()}`,
      title: form.title,
      description: form.description,
      classId: form.classId,
      subjectId: '',
      subject: form.subject,
      teacherId: teacherId,
      teacherName: 'Priya Verma',
      dueDate: form.dueDate,
      createdAt: new Date().toISOString().slice(0, 10),
      maxScore: form.maxScore,
      attachments: [],
      status: 'active' as const,
    };
    mockAssignments.push(newAssignment);
    toast.success(`Assignment "${form.title}" created for ${cls?.name ?? form.classId}`);
    setShowCreate(false);
    setForm({ title: '', description: '', classId: '', subject: '', dueDate: '', maxScore: 50 });
  };

  const subjectsForClass = useMemo(() => {
    if (!form.classId || !myClasses) return [];
    const cls = myClasses.find(c => c.id === form.classId);
    return cls?.subjects ?? [];
  }, [form.classId, myClasses]);

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Assignments</h2>
          <p className="text-sm text-slate-500">Create, view, and grade assignments</p>
        </div>
        <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> New Assignment</Button>
      </motion.div>

      <motion.div variants={STAGGER.item(1)} className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-slate-900' },
          { label: 'Active', value: stats.active, color: 'text-brand-600' },
          { label: 'Closed', value: stats.closed, color: 'text-slate-500' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-xs font-semibold uppercase text-slate-500">{s.label}</p>
            <p className={`mt-2 font-display text-3xl font-bold ${s.color} dark:text-white`}>{s.value}</p>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={STAGGER.item(2)} className="space-y-3">
        {(myAssignments ?? []).map((a) => (
          <Card key={a.id} interactive onClick={() => setSelectedId(selectedId === a.id ? null : a.id)}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">{a.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    a.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>{a.status}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {a.subject} · {myClasses?.find(c => c.id === a.classId)?.name ?? a.classId} · Due {a.dueDate}
                </p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <p>Max {a.maxScore}</p>
                <p>{mockSubmissions.filter(s => s.assignmentId === a.id).length} submitted</p>
              </div>
            </div>

            {selectedId === a.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 overflow-hidden">
                <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">{a.description}</p>
                <h4 className="mb-2 font-display text-sm font-semibold text-slate-900 dark:text-white">Submissions</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 dark:border-slate-700">
                        <th className="py-2 pr-3">Student</th>
                        <th className="py-2 pr-3">Submitted</th>
                        <th className="py-2 pr-3">Status</th>
                        <th className="py-2 pr-3">Score</th>
                        <th className="py-2 pr-3">Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(submissions ?? []).map(sub => (
                        <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2 pr-3 font-medium text-slate-900 dark:text-white">{sub.studentName}</td>
                          <td className="py-2 pr-3 text-xs text-slate-500">{sub.submittedAt.slice(0, 10)}</td>
                          <td className="py-2 pr-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              sub.status === 'graded' ? 'bg-green-100 text-green-700'
                                : sub.status === 'late' ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>{sub.status}</span>
                          </td>
                          <td className="py-2 pr-3">
                            <input
                              type="number" min={0} max={a.maxScore}
                              defaultValue={sub.score ?? ''}
                              onChange={e => handleGradeChange(sub.id, 'score', e.target.value)}
                              className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="py-2">
                            <textarea
                              rows={1} defaultValue={sub.feedback ?? ''}
                              onChange={e => handleGradeChange(sub.id, 'feedback', e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {selectedId && submissions && submissions.length > 0 && (
                  <Button className="mt-3" onClick={handleSaveGrades}><Send className="h-4 w-4" /> Save Grades</Button>
                )}
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
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">New Assignment</h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Class</label>
                  <select value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value, subject: '' }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="">Select class</option>
                    {(myClasses ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Subject</label>
                  <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="">Select subject</option>
                    {subjectsForClass.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Max Score</label>
                  <input type="number" min={1} value={form.maxScore} onChange={e => setForm(f => ({ ...f, maxScore: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
              </div>
              <Button className="w-full" onClick={handleCreateAssignment}><Plus className="h-4 w-4" /> Create Assignment</Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
