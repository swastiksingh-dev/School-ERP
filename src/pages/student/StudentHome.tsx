import { motion } from 'framer-motion';
import { BookOpenCheck, ClipboardList, LineChart, Sparkles } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../../components/ui/Card';
import { STAGGER } from '../../constants/animations';
import { announcements, performanceTrend, todaySchedule } from '../../data/mock';
import { useAuth } from '../../hooks/useAuth';

export function StudentHome() {
  const { user } = useAuth();

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-brand-700 dark:text-brand-300">Student dashboard</p>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Hi {user?.firstName}, ready to learn?
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Session <span className="font-semibold text-slate-700 dark:text-slate-200">2026–2027</span>
            {user?.section && (
              <>
                {' '}
                · Class <span className="font-semibold text-slate-700 dark:text-slate-200">{user.section}</span>
              </>
            )}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 ring-1 ring-brand-100 dark:bg-brand-900/30 dark:text-brand-100 dark:ring-brand-800">
          <Sparkles className="h-3.5 w-3.5" />
          Streak: 5 days
        </div>
      </motion.div>

      <motion.div variants={STAGGER.item(1)} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Today's classes", value: '4', icon: BookOpenCheck },
          { label: 'Assignments due', value: '2', icon: ClipboardList },
          { label: 'Avg. performance', value: '86%', icon: LineChart },
          { label: 'Attendance', value: '98%', icon: Sparkles },
        ].map((s, i) => (
          <Card key={s.label} interactive className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{s.label}</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              </div>
              <div className="rounded-xl bg-brand-50 p-2 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <motion.div
              className="pointer-events-none absolute -right-6 -bottom-10 h-24 w-24 rounded-full bg-brand-400/15"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
            />
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div variants={STAGGER.item(2)} className="xl:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Performance trend
              </h3>
              <span className="text-xs font-medium text-slate-500">Recharts · animated</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#059669"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={STAGGER.item(3)} className="space-y-4">
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">
              Today&apos;s schedule
            </h3>
            <ul className="space-y-3">
              {todaySchedule.map((row) => (
                <li
                  key={row.time}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm dark:border-slate-800"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{row.subject}</p>
                    <p className="text-xs text-slate-500">{row.room}</p>
                  </div>
                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {row.time}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">
              Announcements
            </h3>
            <ul className="space-y-2">
              {announcements.map((a) => (
                <li key={a.id} className="rounded-xl border border-slate-100 p-3 text-sm dark:border-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-white">{a.title}</p>
                  <p className="text-xs text-slate-500">{a.date}</p>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
