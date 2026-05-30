import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, AlertTriangle, Clock, ArrowUpRight, ArrowDownRight, Percent, Building2, Target, Bell, Download } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { feeInvoices, feeTransactions } from '../../data/mock';

type FinanceTab = 'overview' | 'discounts' | 'feeStructure';

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#94a3b8'];

const statusColor: Record<string, string> = {
  paid: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  partial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  pending: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

export function AdminFinance() {
  const [filter, setFilter] = useState<string>('all');
  const [financeTab, setFinanceTab] = useState<FinanceTab>('overview');

  const totals = useMemo(() => {
    const collected = feeInvoices.reduce((s, i) => s + i.paid, 0);
    const pending = feeInvoices.reduce((s, i) => s + (i.amount - i.paid), 0);
    const overdueAmount = feeInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amount - i.paid), 0);
    return { collected, pending, overdue: overdueAmount, total: collected + pending };
  }, []);

  const monthlyData = useMemo(() => {
    const map = new Map<string, number>();
    feeTransactions.forEach((t) => {
      const m = t.date.slice(0, 7);
      map.set(m, (map.get(m) || 0) + t.amount);
    });
    return Array.from(map.entries()).map(([month, amount]) => ({ month, amount }));
  }, []);

  const pieData = useMemo(() => {
    const counts: Record<string, number> = { paid: 0, partial: 0, overdue: 0, pending: 0 };
    feeInvoices.forEach((i) => { counts[i.status] = (counts[i.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, []);

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return feeTransactions;
    return feeTransactions.filter((t) => t.method === filter);
  }, [filter]);

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Finance Dashboard</h2>
          <p className="text-sm text-slate-500">Fee collections, invoices, and transaction history.</p>
        </div>
        <Button variant="secondary" onClick={() => toast.success('Financial report PDF generated')}>
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </motion.div>

      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {[
          { key: 'overview' as FinanceTab, label: 'Overview' },
          { key: 'discounts' as FinanceTab, label: 'Discounts' },
          { key: 'feeStructure' as FinanceTab, label: 'Fee Structure' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFinanceTab(t.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              financeTab === t.key
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </motion.div>

      {financeTab === 'overview' && (
        <>
          <motion.div variants={STAGGER.item(1)} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card interactive>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Total Collected</p>
                  <p className="mt-2 font-display text-2xl font-bold text-green-600">₹{(totals.collected / 1000).toFixed(1)}K</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/40">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <span className="mt-2 flex items-center gap-1 text-xs text-green-600"><ArrowUpRight className="h-3 w-3" /> +12% from last term</span>
            </Card>
            <Card interactive>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Pending</p>
                  <p className="mt-2 font-display text-2xl font-bold text-amber-600">₹{(totals.pending / 1000).toFixed(1)}K</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </Card>
            <Card interactive>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Overdue</p>
                  <p className="mt-2 font-display text-2xl font-bold text-red-600">₹{(totals.overdue / 1000).toFixed(1)}K</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/40">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
              <span className="mt-2 flex items-center gap-1 text-xs text-red-600"><ArrowDownRight className="h-3 w-3" /> {feeInvoices.filter(i => i.status === 'overdue').length} overdue invoices</span>
            </Card>
            <Card interactive>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Total Revenue</p>
                  <p className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">₹{(totals.total / 1000).toFixed(1)}K</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/40">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div variants={STAGGER.item(2)}>
              <Card>
                <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Monthly collections</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="amount" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={STAGGER.item(3)}>
              <Card>
                <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Payment status</h3>
                <div className="flex items-center gap-6">
                  <div className="h-40 w-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie dataKey="value" data={pieData} innerRadius={35} outerRadius={60} paddingAngle={3}>
                          {pieData.map((entry, index) => (
                            <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 text-xs">
                    {pieData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                        <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                        <span className="font-medium text-slate-900 dark:text-white">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={STAGGER.item(4)}>
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Invoices</h3>
              </div>
              <div className="space-y-3">
                {feeInvoices.map((inv) => {
                  const pct = Math.round((inv.paid / inv.amount) * 100);
                  return (
                    <div key={inv.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{inv.studentName}</p>
                          <p className="text-xs text-slate-500">Due: {inv.dueDate} &middot; ₹{inv.amount.toLocaleString()}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[inv.status]}`}>
                          {inv.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div className={`h-full rounded-full transition-all ${
                            inv.status === 'paid' ? 'bg-green-500' : inv.status === 'overdue' ? 'bg-red-500' : 'bg-amber-500'
                          }`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">₹{inv.paid.toLocaleString()} / ₹{inv.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Outstanding Alerts */}
          <motion.div variants={STAGGER.item(4)}>
            <Card>
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Outstanding Alerts
              </h3>
              <div className="space-y-3">
                {feeInvoices.filter(i => i.status === 'overdue' || i.status === 'partial').map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-3 dark:border-red-900/40 dark:bg-red-900/20">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{inv.studentName}</p>
                      <p className="text-xs text-red-600">₹{(inv.amount - inv.paid).toLocaleString()} outstanding &middot; Due: {inv.dueDate}</p>
                    </div>
                    <Button variant="ghost" onClick={() => toast.success(`Reminder sent to ${inv.studentName}`)}>
                      <Bell className="h-4 w-4" />
                      Send Reminder
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Monthly Collection Goal */}
          <motion.div variants={STAGGER.item(4)}>
            <Card>
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                <Target className="h-5 w-5 text-brand-500" />
                Monthly Collection Goal
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">Collected</span>
                  <span className="font-medium text-slate-900 dark:text-white">₹4.5L of ₹6L target</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: '75%' }} />
                </div>
                <p className="text-xs text-slate-400">75% of monthly target achieved</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={STAGGER.item(5)}>
            <Card>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Transactions</h3>
                <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
                  {['all', 'cash', 'online', 'cheque'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setFilter(m)}
                      className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${
                        filter === m ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-700">
                      <th className="pb-2 pr-4 font-medium">Date</th>
                      <th className="pb-2 pr-4 font-medium">Student</th>
                      <th className="pb-2 pr-4 font-medium">Amount</th>
                      <th className="pb-2 pr-4 font-medium">Method</th>
                      <th className="pb-2 pr-4 font-medium">Receipt</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t) => (
                      <tr key={t.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                        <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{t.date}</td>
                        <td className="py-2.5 pr-4 font-medium text-slate-900 dark:text-white">{t.studentName}</td>
                        <td className="py-2.5 pr-4 text-slate-900 dark:text-white">₹{t.amount.toLocaleString()}</td>
                        <td className="py-2.5 pr-4 capitalize text-slate-600 dark:text-slate-300">{t.method}</td>
                        <td className="py-2.5 pr-4 text-xs text-slate-400">{t.receiptNo}</td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            t.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                            t.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                            'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}>{t.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </>
      )}

      {financeTab === 'discounts' && (
        <motion.div variants={STAGGER.item(2)}>
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <Percent className="h-5 w-5 text-brand-500" />
              Discount Management
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Sibling Discount', desc: '15% off tuition for second child', applicable: 'All classes', value: '15%' },
                { name: 'Merit Scholarship', desc: '25% off for students with 90%+ in previous year', applicable: 'Classes 8-10', value: '25%' },
                { name: 'Need-based Aid', desc: 'Up to 50% based on family income assessment', applicable: 'All classes', value: 'Up to 50%' },
              ].map((d) => (
                <div key={d.name} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{d.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{d.desc}</p>
                      <p className="mt-0.5 text-xs text-slate-400">Applicable: {d.applicable}</p>
                    </div>
                    <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">{d.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="secondary">Add Discount</Button>
            </div>
          </Card>
        </motion.div>
      )}

      {financeTab === 'feeStructure' && (
        <motion.div variants={STAGGER.item(2)}>
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <Building2 className="h-5 w-5 text-brand-500" />
              Fee Structure per Class
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-medium">Fee Head</th>
                    <th className="pb-2 pr-4 font-medium">Class 8</th>
                    <th className="pb-2 pr-4 font-medium">Class 9</th>
                    <th className="pb-2 font-medium">Class 10</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { head: 'Tuition', c8: 12000, c9: 15000, c10: 18000 },
                    { head: 'Library', c8: 1500, c9: 2000, c10: 2000 },
                    { head: 'Sports', c8: 2000, c9: 2500, c10: 3000 },
                    { head: 'Transport', c8: 4000, c9: 4000, c10: 5000 },
                    { head: 'Hostel', c8: 8000, c9: 8000, c10: 10000 },
                  ].map((row) => (
                    <tr key={row.head} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="py-2.5 pr-4 font-medium text-slate-900 dark:text-white">{row.head}</td>
                      <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">₹{row.c8.toLocaleString()}</td>
                      <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">₹{row.c9.toLocaleString()}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">₹{row.c10.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" onClick={() => toast.success('Fee structure updated')}>Update Fee Structure</Button>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
