import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Video,
  Link as LinkIcon,
  FileText,
  Filter,
  Clock,
  Calendar,
  Download,
  Bookmark,
  Timer,
  Play,
  Pause,
  RefreshCw,
  StickyNote,
  History,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { useAuth } from '../../hooks/useAuth';
import { useStudentById, useTimetable, useExams, useAssignments } from '../../hooks/queries';
import { contentResources } from '../../data/mock';
import type { ContentResource } from '../../types';

const STUDENT_ID = 's1';

const tabs = [
  { id: 'all', label: 'All', icon: Filter },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'reference', label: 'References', icon: LinkIcon },
] as const;

type TabId = (typeof tabs)[number]['id'];

const TYPE_ICONS: Record<string, typeof FileText> = {
  notes: FileText,
  video: Video,
  reference: LinkIcon,
};

const TYPE_COLORS: Record<string, string> = {
  notes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200',
  video: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200',
  reference: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
};

function getDaysRemaining(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getSubjectCompletion(resources: ContentResource[], subject: string) {
  const total = resources.length;
  const done = resources.filter((r) => r.type !== 'reference').length;
  const subj = resources.filter((r) => r.subject === subject);
  const subjTotal = subj.length;
  const subjDone = subj.filter((r) => r.type !== 'reference').length;
  return { total, done, pct: subjTotal > 0 ? Math.round((subjDone / subjTotal) * 100) : 0 };
}

const BOOKMARKS_KEY = 'bbps-study-bookmarks';
const RECENT_KEY = 'bbps-study-recent';
const NOTES_KEY = 'bbps-study-notes';

function getBookmarks(): string[] {
  try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]'); } catch { return []; }
}
function setBookmarks(ids: string[]) { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids)); }
function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function addRecent(id: string) {
  const list = getRecent().filter((i) => i !== id);
  list.unshift(id);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 20)));
}
function getNotes(): string {
  return localStorage.getItem(NOTES_KEY) || '';
}
function setNotes(v: string) { localStorage.setItem(NOTES_KEY, v); }

function ResourceCard({ resource }: { resource: ContentResource }) {
  const Icon = TYPE_ICONS[resource.type] || FileText;
  const [bookmarked, setBookmarked] = useState(getBookmarks().includes(resource.id));

  const toggleBookmark = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const list = getBookmarks();
    const next = list.includes(resource.id) ? list.filter((i) => i !== resource.id) : [...list, resource.id];
    setBookmarks(next);
    setBookmarked(!bookmarked);
  }, [resource.id, bookmarked]);

  const handleClick = useCallback(() => {
    addRecent(resource.id);
  }, [resource.id]);

  return (
    <Card interactive className="group relative overflow-hidden" onClick={handleClick}>
      <div className="flex items-start gap-3">
        <div className={`rounded-xl p-2.5 ${TYPE_COLORS[resource.type] || 'bg-slate-100 text-slate-600'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
              {resource.title}
            </h4>
            <button
              type="button"
              onClick={toggleBookmark}
              className={`shrink-0 rounded-lg p-1.5 transition-colors ${
                bookmarked
                  ? 'text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                  : 'text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-500 dark:text-slate-600'
              }`}
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{resource.subject}</p>
          <p className="mt-1 line-clamp-2 text-xs text-slate-400">{resource.description}</p>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
            {resource.fileSize && (
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {resource.fileSize}
              </span>
            )}
            <span>{resource.uploadedBy}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function StudentStudy() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const { data: student } = useStudentById(STUDENT_ID);
  const classId = student?.classId || 'c1';
  const { data: timetable } = useTimetable(classId);
  const { data: exams } = useExams(classId);
  const { data: assignments } = useAssignments(classId);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[new Date().getDay()];
  const todaysSlots = timetable?.filter((s) => s.day === todayName) ?? [];

  const upcomingExams = useMemo(
    () => (exams ?? []).filter((e) => e.status === 'upcoming'),
    [exams]
  );

  const filtered = useMemo(() => {
    if (activeTab === 'all') return contentResources;
    return contentResources.filter((r) => r.type === activeTab);
  }, [activeTab]);

  const subjects = useMemo(
    () => [...new Set(contentResources.map((r) => r.subject))],
    []
  );

  const references = useMemo(
    () => contentResources.filter((r) => r.type === 'reference'),
    []
  );

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)}>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Study zone</h2>
        <p className="text-sm text-slate-500">
          Hi {user?.firstName || 'Student'}, here is your learning hub.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Resources', value: contentResources.length, icon: BookOpen },
          { label: 'Subjects', value: subjects.length, icon: BookOpen },
          { label: 'Assignments', value: assignments?.length ?? 0, icon: FileText },
          { label: 'Upcoming exams', value: upcomingExams.length, icon: Calendar },
        ].map((s, i) => (
          <motion.div key={s.label} variants={STAGGER.item(i + 1)}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{s.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                </div>
                <div className="rounded-xl bg-brand-50 p-2 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <motion.div variants={STAGGER.item(2)}>
            <Card>
              <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                E-content library
              </h3>
              <div className="mb-4 flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <tab.icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {filtered.map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-400">No resources found.</div>
              )}
            </Card>
          </motion.div>

          <motion.div variants={STAGGER.item(3)}>
            <Card>
              <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                Syllabus progress
              </h3>
              <div className="space-y-3">
                {subjects.map((sub) => {
                  const { pct } = getSubjectCompletion(contentResources, sub);
                  return (
                    <div key={sub}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{sub}</span>
                        <span className="text-xs text-slate-500">{pct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full bg-brand-600"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={STAGGER.item(4)}>
            <Card>
              <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">
                Reference links
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {references.map((r) => (
                  <a
                    key={r.id}
                    href={r.url}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    <div className="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                      <LinkIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{r.title}</p>
                      <p className="truncate text-xs text-slate-500">{r.subject}</p>
                    </div>
                  </a>
                ))}
              </div>
              {references.length === 0 && (
                <div className="py-4 text-center text-sm text-slate-400">No reference links available.</div>
              )}
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={STAGGER.item(5)}>
            <Card>
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  <Clock className="h-3.5 w-3.5" />
                </span>
                Live class today
              </h3>
              {todaysSlots.length > 0 ? (
                <div className="space-y-3">
                  {todaysSlots.slice(0, 2).map((slot) => (
                    <div
                      key={slot.id}
                      className="rounded-xl border border-brand-100 bg-brand-50/50 p-3 dark:border-brand-900/40 dark:bg-brand-900/20"
                    >
                      <p className="font-display text-base font-bold text-brand-800 dark:text-brand-200">
                        {slot.subject}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span>{slot.room}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">{slot.teacher}</p>
                      <Button variant="primary" className="mt-2 w-full text-xs">
                        Join class
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-400 dark:bg-slate-800/50">
                  <Calendar className="mx-auto mb-1 h-6 w-6 text-slate-300" />
                  No classes scheduled for today
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div variants={STAGGER.item(6)}>
            <Card>
              <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">
                Upcoming exams
              </h3>
              {upcomingExams.length > 0 ? (
                <div className="space-y-3">
                  {upcomingExams.map((exam) => {
                    const daysLeft = getDaysRemaining(exam.date);
                    const urgent = daysLeft <= 3;
                    return (
                      <div
                        key={exam.id}
                        className={`rounded-xl border p-3 ${
                          urgent
                            ? 'border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20'
                            : 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{exam.title}</p>
                            <p className="text-xs text-slate-500">{exam.subject}</p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              urgent
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                            }`}
                          >
                            {daysLeft > 0 ? `${daysLeft}d left` : 'Today'}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {exam.duration} min
                          </span>
                          <span>{exam.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-slate-400">No upcoming exams.</div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>

      <motion.div variants={STAGGER.item(7)} className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
              <Timer className="h-3.5 w-3.5" />
            </span>
            Study timer
          </h3>
          <PomodoroTimer />
        </Card>

        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
              <StickyNote className="h-3.5 w-3.5" />
            </span>
            Quick notes
          </h3>
          <QuickNotes />
        </Card>
      </motion.div>

      <motion.div variants={STAGGER.item(8)} className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
              <Bookmark className="h-3.5 w-3.5" />
            </span>
            Bookmarked resources
          </h3>
          <BookmarkedResources resources={contentResources} />
        </Card>

        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
              <History className="h-3.5 w-3.5" />
            </span>
            Recent study activity
          </h3>
          <RecentActivity resources={contentResources} />
        </Card>
      </motion.div>
    </motion.div>
  );
}

function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalSeconds = minutes * 60 + seconds;
  const pct = 1 - totalSeconds / (25 * 60);

  useEffect(() => {
    if (running && totalSeconds > 0) {
      interval.current = setInterval(() => {
        setSeconds((s) => {
          if (s === 0) {
            setMinutes((m) => {
              if (m === 0) { setRunning(false); return 0; }
              return m - 1;
            });
            return 59;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (interval.current) clearInterval(interval.current); };
  }, [running, totalSeconds]);

  const start = () => { if (totalSeconds === 0) { setMinutes(25); setSeconds(0); } setRunning(true); };
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setMinutes(25); setSeconds(0); };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="6" className="dark:stroke-slate-700" />
          <circle
            cx="50" cy="50" r="42" fill="none" stroke="#059669" strokeWidth="6"
            strokeDasharray={`${pct * 264} 264`} strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <span className="font-display text-3xl font-bold text-slate-900 dark:text-white">
          {pad(minutes)}:{pad(seconds)}
        </span>
      </div>
      <div className="flex gap-2">
        {!running ? (
          <Button variant="primary" onClick={start} className="min-h-[36px] gap-1.5 px-3 py-1.5 text-xs">
            <Play className="h-3.5 w-3.5" /> {totalSeconds === 0 || totalSeconds < 25 * 60 ? 'Resume' : 'Start'}
          </Button>
        ) : (
          <Button variant="secondary" onClick={pause} className="min-h-[36px] gap-1.5 px-3 py-1.5 text-xs">
            <Pause className="h-3.5 w-3.5" /> Pause
          </Button>
        )}
        <Button variant="ghost" onClick={reset} className="min-h-[36px] gap-1.5 px-3 py-1.5 text-xs">
          <RefreshCw className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>
    </div>
  );
}

function QuickNotes() {
  const [text, setText] = useState(getNotes);

  const save = useCallback((val: string) => {
    setText(val);
    setNotes(val);
  }, []);

  return (
    <textarea
      value={text}
      onChange={(e) => save(e.target.value)}
      placeholder="Type your notes here…"
      rows={4}
      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500"
    />
  );
}

function BookmarkedResources({ resources }: { resources: ContentResource[] }) {
  const ids = getBookmarks();
  const items = resources.filter((r) => ids.includes(r.id));
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">No bookmarked resources yet. Click the bookmark icon on any resource to save it.</p>;
  }
  return (
    <div className="space-y-2">
      {items.map((r) => (
        <div key={r.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 dark:border-slate-800">
          <div className={`rounded-lg p-1.5 ${TYPE_COLORS[r.type] || 'bg-slate-100 text-slate-600'}`}>
            <FileText className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{r.title}</p>
            <p className="text-xs text-slate-500">{r.subject}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentActivity({ resources }: { resources: ContentResource[] }) {
  const ids = getRecent();
  const items = ids.map((id) => resources.find((r) => r.id === id)).filter(Boolean) as ContentResource[];
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">No recent activity. Start exploring resources to see your history.</p>;
  }
  return (
    <div className="space-y-2">
      {items.slice(0, 5).map((r) => (
        <div key={r.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 dark:border-slate-800">
          <div className={`rounded-lg p-1.5 ${TYPE_COLORS[r.type] || 'bg-slate-100 text-slate-600'}`}>
            <FileText className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{r.title}</p>
            <p className="text-xs text-slate-500">{r.subject}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
