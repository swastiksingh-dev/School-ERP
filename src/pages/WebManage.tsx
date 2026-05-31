/* ─── WebManage Panel (Hidden) ───
 * Accessible ONLY via direct URL: /webmanage (no nav links anywhere).
 * Requires admin role. Provides:
 *   • System health dashboard with KPIs
 *   • Bug report triage (view, assign, resolve, close, delete)
 *   • User management (view all demo accounts)
 *   • AI configuration (API keys, feature toggles — NEVER hardcoded)
 *   • Activity logs
 *   • Security settings
 */

import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Bug,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  Flame,
  Key,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  Trash2,
  UserCheck,
  Users,
  Wifi,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import type { AIConfig, AIFeature, BugReport, SystemHealth, ManagementAction } from '../types';
import {
  getAllBugReports,
  updateBugReport,
  deleteBugReport,
  getBugStats,
} from '../services/bugReportService';
import { getAIConfig, saveAIConfig, clearAIConfig } from '../services/aiService';

/* ─── Constants ─── */
const ALL_AI_FEATURES: { key: AIFeature; label: string; desc: string }[] = [
  { key: 'chat_assistant', label: 'AI Chat Assistant', desc: 'Smart Q&A for students and teachers' },
  { key: 'grading_assistant', label: 'Grading Assistant', desc: 'AI-powered submission grading suggestions' },
  { key: 'content_recommendations', label: 'Content Recommendations', desc: 'Personalized learning resource suggestions' },
  { key: 'analytics_insights', label: 'Analytics Insights', desc: 'AI-driven performance analysis' },
  { key: 'smart_search', label: 'Smart Search', desc: 'AI-enhanced search across resources' },
  { key: 'lesson_planning', label: 'Lesson Planning', desc: 'AI-generated lesson plan outlines' },
];

/* ─── Tab IDs ─── */
type Tab = 'dashboard' | 'bugs' | 'users' | 'ai' | 'logs' | 'security';

/* ─── Component ─── */
export function WebManage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  /* ── State ── */
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [bugStats, setBugStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0, critical: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [assignee, setAssignee] = useState('');
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [logs, setLogs] = useState<ManagementAction[]>([]);

  /* ── Load data (defined before hooks, before conditional return) ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bugList, stats, config] = await Promise.all([
        getAllBugReports(),
        getBugStats(),
        Promise.resolve(getAIConfig()),
      ]);
      setBugs(bugList);
      setBugStats(stats);
      setAiConfig(config);
      setLogs(generateMockLogs());
    } catch (err) {
      console.error('WebManage load error:', err);
      toast.error('Failed to load management data');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Derived data ── */
  const filteredBugs = useMemo(() => {
    if (!searchQuery.trim()) return bugs;
    const q = searchQuery.toLowerCase();
    return bugs.filter(
      b =>
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.page.toLowerCase().includes(q) ||
        b.reportedBy.toLowerCase().includes(q),
    );
  }, [bugs, searchQuery]);

  /* ── Hooks must be at top level, before conditional returns ── */
  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ── Redirect if not admin ── */
  if (!authLoading && (!user || user.role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }

  const systemHealth: SystemHealth = {
    status: bugStats.critical > 0 ? 'critical' : bugStats.open > 5 ? 'warning' : 'healthy',
    uptime: '99.97%',
    lastBackup: new Date(Date.now() - 86400000).toLocaleDateString(),
    activeUsers: 42,
    apiStatus: {
      database: 'connected',
      auth: 'connected',
      storage: 'connected',
      ai: aiConfig?.apiKey ? 'connected' : 'disconnected',
    },
    memoryUsage: 34,
    version: '2.0.0',
  };

  /* ── Handlers ── */
  const handleUpdateBug = async (id: string, updates: Partial<Pick<BugReport, 'status' | 'resolutionNotes' | 'assignee'>>) => {
    try {
      await updateBugReport(id, updates);
      toast.success('Bug report updated');
      loadData();
      setSelectedBug(null);
    } catch {
      toast.error('Failed to update bug report');
    }
  };

  const handleDeleteBug = async (id: string) => {
    if (!confirm('Delete this bug report permanently?')) return;
    try {
      await deleteBugReport(id);
      toast.success('Bug report deleted');
      loadData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSaveAIConfig = (config: AIConfig) => {
    saveAIConfig(config);
    setAiConfig(config);
    toast.success('AI configuration saved (stored in localStorage only)');
  };

  const handleClearAIConfig = () => {
    if (!confirm('Clear all AI configuration? This disables all AI features.')) return;
    clearAIConfig();
    setAiConfig(null);
    toast.success('AI configuration cleared');
  };

  /* ── Loading Screen ── */
  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-500" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Loading management panel…</p>
        </div>
      </div>
    );
  }

  /* ── Tabs ── */
  const tabs: { key: Tab; label: string; icon: typeof Activity }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: Activity },
    { key: 'bugs', label: 'Bug Reports', icon: Bug },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'ai', label: 'AI Config', icon: Zap },
    { key: 'logs', label: 'Activity Logs', icon: Database },
    { key: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* ─── Top Bar ─── */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white">WebManage</h1>
              <p className="text-[10px] text-slate-400">Hidden admin panel · Direct URL access only</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-400 sm:inline">
              {user?.firstName} {user?.lastName}
            </span>
            <Button type="button" variant="ghost" onClick={() => navigate('/admin')}>
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Main Admin</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ─── Status Banner ─── */}
        {systemHealth.status !== 'healthy' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
              systemHealth.status === 'critical'
                ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200'
                : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
            }`}
          >
            {systemHealth.status === 'critical' ? <Flame className="h-5 w-5 shrink-0" /> : <AlertTriangle className="h-5 w-5 shrink-0" />}
            <span>
              {systemHealth.status === 'critical'
                ? '⚠️ Critical issues detected — review bug reports immediately.'
                : '⚠️ System warning — multiple open bug reports need attention.'}
            </span>
          </motion.div>
        )}

        {/* ─── Tab Navigation ─── */}
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.key === 'bugs' && bugStats.open > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {bugStats.open}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => navigate('/login')}
            className="ml-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* ─────────────────────────────────────────────── */}
        {/* TAB: DASHBOARD */}
        {/* ─────────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Health Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {([
                { label: 'System Status', value: systemHealth.status.toUpperCase(), icon: Server, color: systemHealth.status === 'healthy' ? 'text-green-500' : systemHealth.status === 'warning' ? 'text-amber-500' : 'text-red-500' },
                { label: 'Active Users', value: systemHealth.activeUsers.toString(), icon: Users, color: 'text-blue-500' },
                { label: 'AI Status', value: aiConfig?.apiKey ? 'CONNECTED' : 'DISCONNECTED', icon: Cpu, color: aiConfig?.apiKey ? 'text-green-500' : 'text-slate-400' },
                { label: 'Uptime', value: systemHealth.uptime, icon: Wifi, color: 'text-emerald-500' },
              ]).map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{stat.label}</p>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className={`mt-2 font-display text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Bug Stats + System Info */}
            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
              >
                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">Bug Report Overview</h3>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {[
                    { label: 'Open', value: bugStats.open, color: 'text-red-500' },
                    { label: 'In Progress', value: bugStats.inProgress, color: 'text-amber-500' },
                    { label: 'Resolved', value: bugStats.resolved, color: 'text-green-500' },
                    { label: 'Closed', value: bugStats.closed, color: 'text-slate-500' },
                    { label: 'Critical', value: bugStats.critical, color: 'text-red-600' },
                    { label: 'Total', value: bugStats.total, color: 'text-brand-600' },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className={`font-display text-xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-[11px] text-slate-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
              >
                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">System Information</h3>
                <div className="mt-4 space-y-3 text-sm">
                  {[
                    { label: 'Version', value: systemHealth.version },
                    { label: 'Last Backup', value: systemHealth.lastBackup },
                    { label: 'Memory Usage', value: `${systemHealth.memoryUsage}%` },
                    { label: 'Database', value: systemHealth.apiStatus.database },
                    { label: 'Auth Service', value: systemHealth.apiStatus.auth },
                    { label: 'AI Service', value: systemHealth.apiStatus.ai },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
                      <span className="text-slate-500">{s.label}</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{s.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="button" variant="primary" onClick={() => setActiveTab('bugs')}>
                  <Bug className="h-4 w-4" /> View Bug Reports
                </Button>
                <Button type="button" variant="secondary" onClick={() => setActiveTab('ai')}>
                  <Zap className="h-4 w-4" /> Configure AI
                </Button>
                <Button type="button" variant="secondary" onClick={() => setActiveTab('users')}>
                  <Users className="h-4 w-4" /> Manage Users
                </Button>
                <Button type="button" variant="secondary" onClick={loadData}>
                  <RefreshCw className="h-4 w-4" /> Refresh All Data
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ─────────────────────────────────────────────── */}
        {/* TAB: BUG REPORTS */}
        {/* ─────────────────────────────────────────────── */}
        {activeTab === 'bugs' && (
          <div className="space-y-6">
            {/* Search + Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search bug reports…"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                onChange={e => {
                  const v = e.target.value;
                  if (v === 'all') setSearchQuery('');
                  else setSearchQuery(v);
                }}
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* List */}
            {filteredBugs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-16 dark:border-slate-700">
                <CheckCircle2 className="h-12 w-12 text-green-400" />
                <p className="mt-3 font-display text-lg font-semibold text-slate-700 dark:text-slate-300">No bug reports</p>
                <p className="text-sm text-slate-500">
                  {searchQuery ? 'No results match your search.' : 'Everything looks clean! No bugs reported.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBugs.map((bug, i) => (
                  <motion.div
                    key={bug.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={`rounded-xl border bg-white p-4 dark:bg-slate-800 transition-all hover:shadow-md ${
                      bug.status === 'open'
                        ? 'border-l-4 border-l-red-500 dark:border-l-red-400'
                        : bug.status === 'in_progress'
                          ? 'border-l-4 border-l-amber-500 dark:border-l-amber-400'
                          : bug.status === 'resolved'
                            ? 'border-l-4 border-l-green-500 dark:border-l-green-400'
                            : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{bug.title}</h4>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            bug.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                            bug.severity === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                            bug.severity === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          }`}>
                            {bug.severity}
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            bug.status === 'open' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                            bug.status === 'in_progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                            bug.status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {bug.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{bug.description}</p>
                        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-400">
                          <span>📄 {bug.page}</span>
                          <span>👤 {bug.reportedBy}</span>
                          <span>🕐 {new Date(bug.reportedAt).toLocaleDateString()}</span>
                          {bug.assignee && <span>✋ {bug.assignee}</span>}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => setSelectedBug(selectedBug?.id === bug.id ? null : bug)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
                          title="Manage"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBug(bug.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* ─── Inline Management Panel ─── */}
                    {selectedBug?.id === bug.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700"
                      >
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-medium text-slate-500">Status</label>
                            <select
                              value={bug.status}
                              onChange={e => handleUpdateBug(bug.id, { status: e.target.value as BugReport['status'] })}
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            >
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500">Assign To</label>
                            <input
                              type="text"
                              value={assignee || bug.assignee || ''}
                              onChange={e => setAssignee(e.target.value)}
                              placeholder="Team member name"
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            <button
                              onClick={() => {
                                if (assignee.trim()) {
                                  handleUpdateBug(bug.id, { assignee: assignee.trim() });
                                  setAssignee('');
                                }
                              }}
                              className="mt-1 text-xs text-brand-600 hover:text-brand-700"
                            >
                              Assign
                            </button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-slate-500">Resolution Notes</label>
                          <textarea
                            value={resolutionNotes || bug.resolutionNotes || ''}
                            onChange={e => setResolutionNotes(e.target.value)}
                            rows={2}
                            placeholder="Notes on how this was resolved…"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          />
                          <button
                            onClick={() => {
                              if (resolutionNotes.trim()) {
                                handleUpdateBug(bug.id, { resolutionNotes: resolutionNotes.trim() });
                                setResolutionNotes('');
                              }
                            }}
                            className="mt-1 text-xs text-brand-600 hover:text-brand-700"
                          >
                            Save Notes
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────── */}
        {/* TAB: USERS */}
        {/* ─────────────────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Demo user accounts loaded from auth service</p>
              <span className="text-xs text-slate-400">Total: 6 accounts</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getDemoUsers().map((u, i) => (
                <motion.div
                  key={u.schoolId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${
                      u.role === 'admin' ? 'bg-purple-500' : u.role === 'teacher' ? 'bg-brand-500' : 'bg-blue-500'
                    }`}>
                      {u.firstName[0]}{u.lastName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{u.schoolId}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40' :
                      u.role === 'teacher' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-slate-400">
                    <p>Password: {u.role === 'student' ? 'student123' : u.role === 'teacher' ? 'teacher123' : 'admin123'}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button type="button" variant="ghost" className="flex-1">
                      <UserCheck className="h-3 w-3" /> Active
                    </Button>
                    <Button type="button" variant="ghost" className="flex-1">
                      <Key className="h-3 w-3" /> Reset
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────── */}
        {/* TAB: AI CONFIG */}
        {/* ─────────────────────────────────────────────── */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              <strong>🔒 API Key Security:</strong> Keys are stored in <strong>localStorage</strong> only. Never committed to source code.
              All AI features are <strong>disabled by default</strong> until you configure an API key below.
            </div>

            {/* API Key Form */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">AI Provider Configuration</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-500">Provider</label>
                  <select
                    value={(aiConfig?.provider as string) || 'openai'}
                    onChange={e =>
                      setAiConfig(prev => ({ ...(prev || { apiKey: '', enabledFeatures: [] }), provider: e.target.value as AIConfig['provider'] }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="openai">OpenAI (GPT-4, GPT-3.5)</option>
                    <option value="gemini">Google Gemini</option>
                    <option value="claude">Anthropic Claude</option>
                    <option value="custom">Custom Endpoint</option>
                  </select>
                </div>
                {aiConfig?.provider === 'custom' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500">Custom Endpoint URL</label>
                    <input
                      type="url"
                      value={aiConfig?.endpoint || ''}
                      onChange={e =>
                        setAiConfig(prev => ({ ...prev!, endpoint: e.target.value }))
                      }
                      placeholder="https://your-api.com/v1/chat"
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-500">API Key</label>
                <div className="relative mt-1">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={aiConfig?.apiKey || ''}
                    onChange={e =>
                      setAiConfig(prev => ({ ...(prev || { provider: 'openai', enabledFeatures: [] }), apiKey: e.target.value }))
                    }
                    placeholder={aiConfig?.apiKey ? '••••••••••••••••' : 'sk-... or your API key'}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-[10px] text-slate-400">Your key stays on this device. Never shared with anyone.</p>
              </div>

              {/* Feature Toggles */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Enable AI Features</h4>
                <p className="text-xs text-slate-500">Toggle features you want active across the ERP</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {ALL_AI_FEATURES.map(f => {
                    const isEnabled = aiConfig?.enabledFeatures?.includes(f.key) || false;
                    return (
                      <label
                        key={f.key}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                          isEnabled
                            ? 'border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-900/20'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={e => {
                            const features = aiConfig?.enabledFeatures || [];
                            const updated = e.target.checked
                              ? [...features, f.key]
                              : features.filter(k => k !== f.key);
                            setAiConfig(prev => ({ ...(prev || { provider: 'openai', apiKey: '' }), enabledFeatures: updated }));
                          }}
                          className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{f.label}</p>
                          <p className="text-[11px] text-slate-500">{f.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    if (!aiConfig?.apiKey) {
                      toast.error('Please enter an API key first');
                      return;
                    }
                    handleSaveAIConfig(aiConfig as AIConfig);
                  }}
                  disabled={!aiConfig?.apiKey}
                >
                  <Key className="h-4 w-4" /> Save Configuration
                </Button>
                <Button type="button" variant="ghost" onClick={handleClearAIConfig}>
                  <Trash2 className="h-4 w-4" /> Clear All Keys
                </Button>
                <Button type="button" variant="secondary" onClick={() => setAiConfig(getAIConfig())}>
                  <RefreshCw className="h-4 w-4" /> Reload Saved
                </Button>
              </div>

              {/* Status */}
              <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
                <p className="text-xs text-slate-500">
                  Status:{' '}
                  {aiConfig?.apiKey
                    ? `✅ AI configured (${aiConfig.enabledFeatures?.length || 0}/${ALL_AI_FEATURES.length} features enabled)`
                    : '❌ No API key configured — all AI features disabled'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────── */}
        {/* TAB: ACTIVITY LOGS */}
        {/* ─────────────────────────────────────────────── */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Recent system activity and management actions</p>
              <Button type="button" variant="ghost" onClick={() => setLogs(generateMockLogs())}>
                <RefreshCw className="h-3 w-3" /> Refresh
              </Button>
            </div>
            <div className="space-y-2">
              {logs.map((log, i) => (
                <motion.div
                  key={`${log.id}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    log.type === 'bug_fix' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                    log.type === 'user_action' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                    log.type === 'system_update' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                    'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                  }`}>
                    {log.type === 'bug_fix' ? <Bug className="h-4 w-4" /> :
                     log.type === 'user_action' ? <Users className="h-4 w-4" /> :
                     log.type === 'system_update' ? <RefreshCw className="h-4 w-4" /> :
                     <Shield className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-800 dark:text-slate-200">{log.description}</p>
                    <p className="text-xs text-slate-400">
                      {log.performedBy} · {new Date(log.performedAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    log.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40' :
                    log.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40' :
                    'bg-red-100 text-red-700 dark:bg-red-900/40'
                  }`}>
                    {log.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────── */}
        {/* TAB: SECURITY */}
        {/* ─────────────────────────────────────────────── */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">🔐 Security Overview</h3>
              <div className="mt-4 space-y-4 text-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Authentication</p>
                    <p className="text-xs text-slate-500">School ID + Password · Demo mode</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">Active</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">API Key Storage</p>
                    <p className="text-xs text-slate-500">localStorage · Never sent to our servers</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">Secure</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Data Storage</p>
                    <p className="text-xs text-slate-500">In-memory + localStorage (demo) · No external database</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Demo Only</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Session Management</p>
                    <p className="text-xs text-slate-500">Zustand persist · localStorage (bbps-auth key)</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">Active</span>
                </div>
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">XSS Protection</p>
                    <p className="text-xs text-slate-500">React's built-in escaping · No dangerouslySetInnerHTML</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">Protected</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">🛡️ Security Recommendations</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>All user inputs are sanitized by React — no raw HTML injection possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>API keys stored in localStorage — never in source code or version control</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Role-based access control via ProtectedRoute — admin routes guarded</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span>For production: add real authentication with JWT, HTTPS, rate limiting</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span>For production: move to a proper backend (Node.js/Express + MongoDB)</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center dark:border-slate-700 dark:bg-slate-900">
        <a
          href="https://www.youtube.com/@Next-Token-AI"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 dark:hover:text-brand-400"
        >
          🚀 Built by <span className="font-bold text-brand-600 dark:text-brand-400">Next-Token-AI</span>
        </a>
        <p className="mt-1 text-[10px] text-slate-400">WebManage v2.0 · Hidden management panel · Direct URL access only</p>
      </footer>
    </div>
  );
}

/* ─── Helpers ─── */

function getDemoUsers() {
  return [
    { firstName: 'Aarav', lastName: 'Sharma', schoolId: 'BBPS-1001', role: 'student' as const },
    { firstName: 'Priya', lastName: 'Singh', schoolId: 'BBPS-1002', role: 'student' as const },
    { firstName: 'Rohan', lastName: 'Verma', schoolId: 'BBPS-1003', role: 'student' as const },
    { firstName: 'Priya', lastName: 'Verma', schoolId: 'TCH-001', role: 'teacher' as const },
    { firstName: 'Vikram', lastName: 'Singh', schoolId: 'TCH-002', role: 'teacher' as const },
    { firstName: 'Admin', lastName: 'User', schoolId: 'ADM-001', role: 'admin' as const },
  ];
}

function generateMockLogs(): ManagementAction[] {
  const actions: ManagementAction[] = [
    { id: 'log-1', type: 'bug_fix', description: 'Fixed login redirect issue on Safari browser', performedBy: 'Admin User', performedAt: new Date(Date.now() - 3600000).toISOString(), status: 'completed' },
    { id: 'log-2', type: 'user_action', description: 'Reset password for student BBPS-1003', performedBy: 'Admin User', performedAt: new Date(Date.now() - 7200000).toISOString(), status: 'completed' },
    { id: 'log-3', type: 'system_update', description: 'Updated system configuration: session timeout set to 60 min', performedBy: 'System', performedAt: new Date(Date.now() - 14400000).toISOString(), status: 'completed' },
    { id: 'log-4', type: 'content_moderation', description: 'Removed inappropriate gallery image uploaded by student', performedBy: 'Priya Verma', performedAt: new Date(Date.now() - 28800000).toISOString(), status: 'completed' },
    { id: 'log-5', type: 'bug_fix', description: 'Fixed timetable display on mobile devices', performedBy: 'Admin User', performedAt: new Date(Date.now() - 57600000).toISOString(), status: 'completed' },
    { id: 'log-6', type: 'user_action', description: 'Bulk import of 15 new student records', performedBy: 'Admin User', performedAt: new Date(Date.now() - 86400000).toISOString(), status: 'pending' },
    { id: 'log-7', type: 'system_update', description: 'AI feature toggle updated: grading assistant disabled', performedBy: 'Admin User', performedAt: new Date(Date.now() - 172800000).toISOString(), status: 'completed' },
    { id: 'log-8', type: 'bug_fix', description: 'Fixed 404 error on teacher reports export', performedBy: 'System', performedAt: new Date(Date.now() - 259200000).toISOString(), status: 'failed' },
  ];
  return actions.sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
}


