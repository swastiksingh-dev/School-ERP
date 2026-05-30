import { motion } from 'framer-motion';
import { Activity, Bell, Plus, Users2, FileText, ClipboardList, CalendarDays } from 'lucide-react';
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { schoolKpis, activityLogs } from '../../data/mock';

const pie = [
  { name: 'Present', value: 96 },
  { name: 'Absent', value: 4 },
];
const COLORS = ['#10b981', '#e2e8f0'];

const actions = [
  { label: 'Add User', icon: Plus, color: 'bg-brand-500' },
  { label: 'Create Class', icon: ClipboardList, color: 'bg-violet-500' },
  { label: 'Send Announcement', icon: Bell, color: 'bg-amber-500' },
  { label: 'Generate Report', icon: FileText, color: 'bg-cyan-500' },
];

const weeklyAttendance = [
  { day: 'Mon', pct: 96 }, { day: 'Tue', pct: 94 },
  { day: 'Wed', pct: 98 }, { day: 'Thu', pct: 95 },
  { day: 'Fri', pct: 97 },
];

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function AdminHome() {
  const recentLogs = activityLogs.slice(0, 6);

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Administration overview</h2>
          <p className="text-sm text-slate-500">KPIs, health, and quick actions for the whole school.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-100 dark:ring-emerald-800">
          <Activity className="h-3.5 w-3.5" />
          All systems nominal
        </div>
      </motion.div>

      <motion.div variants={STAGGER.item(1)} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {schoolKpis.map((k) => (
          <Card key={k.label} interactive>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">{k.label}</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
                  {k.value}
                  {k.suffix ?? ''}
                </p>
              </div>
              <Users2 className="h-5 w-5 text-slate-400" />
            </div>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={STAGGER.item(2)} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((a) => (
          <Button key={a.label} variant="secondary" className="justify-start gap-3">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${a.color}`}>
              <a.icon className="h-4 w-4" />
            </span>
            {a.label}
          </Button>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={STAGGER.item(3)}>
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">School-wide attendance</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={pie} innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {pie.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Present 96%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" /> Absent 4%
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={STAGGER.item(4)}>
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Weekly attendance trend</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="pct" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={STAGGER.item(5)}>
        <Card>
          <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Recent activity</h3>
          <ul className="space-y-3">
            {recentLogs.map((log) => (
              <li key={log.id} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-200">{log.action}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{log.user} &middot; {timeAgo(log.timestamp)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      <motion.div variants={STAGGER.item(6)}>
        <Card>
          <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Enrollment Trend</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{ year: '2024-25', students: 1180 }, { year: '2025-26', students: 1220 }, { year: '2026-27', students: 1240 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={STAGGER.item(7)}>
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Gender Ratio</h3>
            <div className="flex items-center gap-6">
              <div className="h-36 w-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" data={[{ name: 'Boys', value: 60 }, { name: 'Girls', value: 40 }]} innerRadius={30} outerRadius={55}>
                      <Cell fill="#6366f1" />
                      <Cell fill="#f472b6" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-sm">
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-indigo-500" /> Boys 60%</span>
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-pink-400" /> Girls 40%</span>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div variants={STAGGER.item(8)}>
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Teacher-to-Student Ratio</h3>
            <div className="flex h-36 items-center justify-center">
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-brand-600">1:15</p>
                <p className="mt-1 text-sm text-slate-500">{schoolKpis[0].value} students / {schoolKpis[1].value} teachers</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={STAGGER.item(9)} className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40"><Activity className="h-4 w-4" /></span>
            <div>
              <p className="text-xs text-slate-500">Server Status</p>
              <p className="font-medium text-green-600">Online</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40"><Activity className="h-4 w-4" /></span>
            <div>
              <p className="text-xs text-slate-500">Database</p>
              <p className="font-medium text-green-600">Connected</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/40"><Activity className="h-4 w-4" /></span>
            <div>
              <p className="text-xs text-slate-500">Last Backup</p>
              <p className="font-medium text-amber-600">Today</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={STAGGER.item(10)}>
        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
            <CalendarDays className="h-5 w-5 text-brand-500" />
            Annual Events Calendar
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { month: 'Jan', event: 'Republic Day Celebration', date: '26 Jan' },
              { month: 'Mar', event: 'Annual Day', date: '15 Mar' },
              { month: 'Apr', event: 'New Session Start', date: '1 Apr' },
              { month: 'May', event: 'Summer Camp', date: '10 May' },
              { month: 'Jun', event: 'Science Exhibition', date: '20 Jun' },
              { month: 'Aug', event: 'Independence Day', date: '15 Aug' },
              { month: 'Sep', event: 'Teacher\'s Day', date: '5 Sep' },
              { month: 'Dec', event: 'Winter Break', date: '24 Dec' },
            ].map((ev) => (
              <div key={ev.month} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <p className="text-xs font-semibold text-brand-600">{ev.month}</p>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{ev.event}</p>
                <p className="text-xs text-slate-400">{ev.date}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
