import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { FileText, Film, Link, Upload, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { useClassesByTeacher } from '../../hooks/queries';
import { contentResources, contentResources as mockResources } from '../../data/mock';
import toast from 'react-hot-toast';

const typeIcons: Record<string, typeof FileText> = {
  notes: FileText,
  video: Film,
  reference: Link,
  assignment: FileText,
};

const typeColors: Record<string, string> = {
  notes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  video: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  reference: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  assignment: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

export function TeacherContent() {
  const teacherId = 't1';
  const { data: myClasses } = useClassesByTeacher(teacherId);
  const classIds = useMemo(() => myClasses?.map(c => c.id) ?? [], [myClasses]);
  const myResources = useMemo(() => contentResources.filter(r => classIds.includes(r.classId)), [classIds]);

  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'notes' as 'notes' | 'video' | 'reference', classId: '', subject: '', url: '',
  });

  const grouped = useMemo(() => {
    const map: Record<string, Record<string, typeof myResources>> = {};
    for (const r of myResources) {
      const className = myClasses?.find(c => c.id === r.classId)?.name ?? r.classId;
      if (!map[className]) map[className] = {};
      if (!map[className][r.subject]) map[className][r.subject] = [];
      map[className][r.subject].push(r);
    }
    return map;
  }, [myResources, myClasses]);

  const subjectsForClass = useMemo(() => {
    if (!form.classId || !myClasses) return [];
    return myClasses.find(c => c.id === form.classId)?.subjects ?? [];
  }, [form.classId, myClasses]);

  const handleUpload = () => {
    if (!form.title || !form.classId || !form.subject) {
      toast.error('Please fill required fields'); return;
    }
    const newRes = {
      id: `cr${Date.now()}`,
      title: form.title,
      description: form.description,
      type: form.type,
      classId: form.classId,
      subjectId: subjectsForClass.find(s => s.name === form.subject)?.id ?? '',
      subject: form.subject,
      url: form.url || '#',
      uploadedBy: 'Priya Verma',
      uploadedAt: new Date().toISOString().slice(0, 10),
      fileSize: form.type === 'reference' ? undefined : '1.2 MB',
      tags: [],
    };
    mockResources.push(newRes);
    toast.success(`Resource "${form.title}" uploaded`);
    setShowUpload(false);
    setForm({ title: '', description: '', type: 'notes', classId: '', subject: '', url: '' });
  };

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Content Resources</h2>
          <p className="text-sm text-slate-500">{myResources.length} resources across {Object.keys(grouped).length} classes</p>
        </div>
        <Button onClick={() => setShowUpload(true)}><Upload className="h-4 w-4" /> Upload Resource</Button>
      </motion.div>

      {Object.entries(grouped).map(([className, subjects]) => (
        <motion.div key={className} variants={STAGGER.item(1)}>
          <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">{className}</h3>
          {Object.entries(subjects).map(([subject, resources]) => (
            <div key={subject} className="mb-4">
              <h4 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{subject}</h4>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((res) => {
                  const Icon = typeIcons[res.type] ?? FileText;
                  return (
                    <Card key={res.id} interactive>
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeColors[res.type] ?? typeColors.notes}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-slate-900 dark:text-white">{res.title}</p>
                          <p className="truncate text-xs text-slate-500">{res.subject}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                            <span className="capitalize">{res.type}</span>
                            {res.fileSize && <><span>·</span><span>{res.fileSize}</span></>}
                            <span>·</span><span>{res.uploadedAt}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>
      ))}

      <motion.div variants={STAGGER.item(2)}>
        <Card>
          <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">
            <Link className="mr-2 inline h-5 w-5 text-slate-400" />
            Reference Links
          </h3>
          <div className="space-y-2">
            {myResources.filter(r => r.type === 'reference').map(res => (
              <a key={res.id} href={res.url} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-brand-600 hover:bg-brand-50 dark:bg-slate-800 dark:text-brand-400">
                <Link className="h-4 w-4 shrink-0" />
                <span className="truncate">{res.title}</span>
                <span className="ml-auto shrink-0 text-xs text-slate-400">{res.subject}</span>
              </a>
            ))}
            {myResources.filter(r => r.type === 'reference').length === 0 && (
              <p className="py-4 text-center text-sm text-slate-400">No reference links yet</p>
            )}
          </div>
        </Card>
      </motion.div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowUpload(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Upload Resource</h3>
              <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'notes' | 'video' | 'reference' }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="notes">Notes</option>
                    <option value="video">Video</option>
                    <option value="reference">Reference</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Class</label>
                  <select value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value, subject: '' }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="">Select</option>
                    {(myClasses ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Subject</label>
                <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                  <option value="">Select</option>
                  {subjectsForClass.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">URL (optional)</label>
                <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <Button className="w-full" onClick={handleUpload}><Upload className="h-4 w-4" /> Upload</Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
