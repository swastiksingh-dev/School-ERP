import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2, Edit3, FileText, Megaphone, MessageSquare, Clock, BarChart3, History, Bell, Mail, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { announcements, classes } from '../../data/mock';
import type { Announcement } from '../../types';

type CommsTab = 'announcements' | 'scheduled' | 'history';

const templates = [
  { title: 'Exam Schedule', body: 'The upcoming examination schedule has been published. Please check the notice board for details.' },
  { title: 'Holiday Notice', body: 'Please note that the school will remain closed on [date] on account of [holiday]. Regular classes will resume on [date].' },
  { title: 'Event Reminder', body: 'This is a reminder about the upcoming [event name] scheduled for [date]. All students are requested to participate actively.' },
];

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

export function AdminComms() {
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>(announcements);
  const [editId, setEditId] = useState<string | null>(null);
  const [commsTab, setCommsTab] = useState<CommsTab>('announcements');
  const [form, setForm] = useState({ title: '', body: '', priority: 'medium' as Announcement['priority'], target: 'all' as Announcement['target'], targetClass: '' });
  const [notifSettings, setNotifSettings] = useState({ email: true, sms: false, push: true });
  const [scheduledMessages] = useState([
    { id: 'sm1', title: 'Exam Reminder', scheduledFor: '2026-06-10 09:00', audience: 'All Students', priority: 'high' as const },
    { id: 'sm2', title: 'PTM Update', scheduledFor: '2026-06-15 14:00', audience: 'Class 10 Parents', priority: 'medium' as const },
    { id: 'sm3', title: 'Summer Camp Info', scheduledFor: '2026-06-20 10:00', audience: 'All', priority: 'low' as const },
  ]);

  const resetForm = () => setForm({ title: '', body: '', priority: 'medium', target: 'all', targetClass: '' });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Title and body are required.');
      return;
    }
    if (editId) {
      setAnnouncementsList((prev) =>
        prev.map((a) => (a.id === editId ? { ...a, ...form, date: new Date().toISOString().slice(0, 10) } : a))
      );
      toast.success('Announcement updated.');
      setEditId(null);
    } else {
      const newAnn: Announcement = {
        id: `an${Date.now()}`,
        title: form.title,
        body: form.body,
        date: new Date().toISOString().slice(0, 10),
        priority: form.priority,
        target: form.target,
        targetClass: form.targetClass || undefined,
        author: 'Admin',
        pinned: false,
      };
      setAnnouncementsList((prev) => [newAnn, ...prev]);
      toast.success('Announcement created.');
    }
    resetForm();
  };

  const handleEdit = (ann: Announcement) => {
    setEditId(ann.id);
    setForm({ title: ann.title, body: ann.body, priority: ann.priority, target: ann.target, targetClass: ann.targetClass || '' });
  };

  const handleDelete = (id: string) => {
    setAnnouncementsList((prev) => prev.filter((a) => a.id !== id));
    toast.success('Announcement deleted.');
    if (editId === id) { setEditId(null); resetForm(); }
  };

  const handleTemplate = (t: typeof templates[0]) => {
    setForm((prev) => ({ ...prev, title: t.title, body: t.body }));
  };

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)}>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Communications</h2>
        <p className="text-sm text-slate-500">Create announcements, manage broadcasts, and use message templates.</p>
      </motion.div>

      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {[
          { key: 'announcements' as CommsTab, label: 'Announcements', icon: Megaphone },
          { key: 'scheduled' as CommsTab, label: 'Scheduled', icon: Clock },
          { key: 'history' as CommsTab, label: 'Broadcast History', icon: History },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setCommsTab(t.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              commsTab === t.key
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </motion.div>

      {commsTab === 'announcements' && (
        <div className="grid gap-6 lg:grid-cols-5">
          <motion.div variants={STAGGER.item(1)} className="space-y-4 lg:col-span-3">
            <Card>
              <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                <Megaphone className="h-5 w-5 text-brand-500" />
                {editId ? 'Edit Announcement' : 'Create Announcement'}
              </h3>
              <div className="space-y-3">
                <input
                  placeholder="Announcement title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <textarea
                  placeholder="Write your announcement..."
                  rows={4}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <div className="flex flex-wrap gap-3">
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as Announcement['priority'] })}
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="low">Low priority</option>
                    <option value="medium">Medium priority</option>
                    <option value="high">High priority</option>
                  </select>
                  <select
                    value={form.target}
                    onChange={(e) => setForm({ ...form, target: e.target.value as Announcement['target'] })}
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="all">All</option>
                    <option value="class">Class</option>
                    <option value="teacher">Teachers only</option>
                  </select>
                  {form.target === 'class' && (
                    <select
                      value={form.targetClass}
                      onChange={(e) => setForm({ ...form, targetClass: e.target.value })}
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">Select class</option>
                      {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  {editId && <Button variant="ghost" onClick={() => { setEditId(null); resetForm(); }}>Cancel</Button>}
                  <Button onClick={handleSubmit}>
                    <Send className="h-4 w-4" />
                    {editId ? 'Update' : 'Publish'}
                  </Button>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              {announcementsList.map((ann, i) => (
                <motion.div key={ann.id} variants={STAGGER.item(i)}>
                  <Card>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="font-medium text-slate-900 dark:text-white">{ann.title}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${priorityColors[ann.priority]}`}>
                            {ann.priority}
                          </span>
                          {ann.pinned && (
                            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">Pinned</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{ann.body}</p>
                        <p className="mt-1 text-xs text-slate-400">{ann.author} &middot; {ann.date} &middot; Target: {ann.target}{ann.targetClass ? ` (${ann.targetClass})` : ''}</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button onClick={() => handleEdit(ann)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(ann.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={STAGGER.item(2)} className="space-y-4 lg:col-span-2">
            <Card>
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                <FileText className="h-5 w-5 text-brand-500" />
                Templates
              </h3>
              <p className="mb-3 text-xs text-slate-500">Click a template to pre-fill the form.</p>
              <div className="space-y-2">
                {templates.map((t) => (
                  <button
                    key={t.title}
                    onClick={() => handleTemplate(t)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-brand-300 hover:bg-brand-50 dark:border-slate-700 dark:hover:border-brand-700 dark:hover:bg-brand-900/20"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-brand-500" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{t.title}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-1">{t.body}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="mb-2 font-display text-lg font-semibold text-slate-900 dark:text-white">Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Total announcements</span>
                  <span className="font-medium text-slate-900 dark:text-white">{announcementsList.length}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>High priority</span>
                  <span className="font-medium text-red-600">{announcementsList.filter(a => a.priority === 'high').length}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Pinned</span>
                  <span className="font-medium text-slate-900 dark:text-white">{announcementsList.filter(a => a.pinned).length}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                <Bell className="h-5 w-5 text-brand-500" />
                Notification Settings
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive email alerts for broadcasts', icon: Mail },
                  { key: 'sms', label: 'SMS Notifications', desc: 'Receive SMS for urgent messages', icon: Smartphone },
                  { key: 'push', label: 'Push Notifications', desc: 'Receive push alerts on dashboard', icon: Bell },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <n.icon className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{n.label}</p>
                        <p className="text-xs text-slate-500">{n.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifSettings(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                      className={`relative h-6 w-11 rounded-full transition-colors ${notifSettings[n.key as keyof typeof notifSettings] ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${notifSettings[n.key as keyof typeof notifSettings] ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                <BarChart3 className="h-5 w-5 text-brand-500" />
                Delivery Analytics
              </h3>
              <div className="space-y-3">
                {announcementsList.map((ann) => (
                  <div key={ann.id} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{ann.title}</p>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-slate-400">Sent to</p>
                        <p className="font-medium text-slate-700 dark:text-slate-200">1,240</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Opened</p>
                        <p className="font-medium text-green-600">{Math.floor(Math.random() * 30 + 60)}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Read</p>
                        <p className="font-medium text-brand-600">{Math.floor(Math.random() * 20 + 40)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {commsTab === 'scheduled' && (
        <motion.div variants={STAGGER.item(3)}>
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <Clock className="h-5 w-5 text-brand-500" />
              Scheduled Messages
            </h3>
            <div className="space-y-3">
              {scheduledMessages.map((sm) => (
                <div key={sm.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{sm.title}</p>
                    <p className="mt-1 text-xs text-slate-400">Scheduled: {sm.scheduledFor} &middot; Audience: {sm.audience}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    sm.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                    sm.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                    'bg-slate-100 text-slate-600 dark:bg-slate-800'
                  }`}>{sm.priority}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {commsTab === 'history' && (
        <motion.div variants={STAGGER.item(3)}>
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <History className="h-5 w-5 text-brand-500" />
              Broadcast History
            </h3>
            <div className="space-y-3">
              {announcementsList.map((ann) => (
                <div key={ann.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-white">{ann.title}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${priorityColors[ann.priority]}`}>{ann.priority}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{ann.date} &middot; Target: {ann.target}{ann.targetClass ? ` (${ann.targetClass})` : ''} &middot; By: {ann.author}</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">Delivered</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
