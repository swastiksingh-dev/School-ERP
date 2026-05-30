import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Sun, Moon, Info, Bell, Shield, Smartphone, Download, Upload, AlertCircle, Server, Key, Palette, ZoomIn, Wifi } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { activityLogs } from '../../data/mock';

type SettingsTab = 'general' | 'backup' | 'logs' | 'security' | 'integrations' | 'theme';

type Toggle = {
  label: string;
  key: string;
  enabled: boolean;
};

export function AdminSettings() {
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('general');
  const [schoolName, setSchoolName] = useState('Blooming Bud Public School');
  const [address, setAddress] = useState('123 Education Lane, Knowledge City, KA 560001');
  const [phone, setPhone] = useState('+91 80 2345 6789');
  const [email, setEmail] = useState('admin@bbps.edu');
  const [session, setSession] = useState('2026-2027');
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [toggles, setToggles] = useState<Toggle[]>([
    { label: 'Online Fee Payment', key: 'fee', enabled: true },
    { label: 'Gallery Module', key: 'gallery', enabled: true },
    { label: 'Transport Module', key: 'transport', enabled: false },
    { label: 'Library Module', key: 'library', enabled: true },
  ]);
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [backupProgress, setBackupProgress] = useState(0);
  const [backingUp, setBackingUp] = useState(false);
  const [brandColor, setBrandColor] = useState(() => localStorage.getItem('bbps-brand-color') || '#10b981');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('bbps-font-size') || 'medium');
  const [pwdMinLength, setPwdMinLength] = useState(true);
  const [pwdSpecialChars, setPwdSpecialChars] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  const recentBackups = [
    { date: '2026-05-30 14:30', size: '256 MB', type: 'Full' },
    { date: '2026-05-29 02:00', size: '250 MB', type: 'Automated' },
    { date: '2026-05-28 02:00', size: '248 MB', type: 'Automated' },
    { date: '2026-05-27 14:00', size: '245 MB', type: 'Manual' },
  ];

  const systemLogs = activityLogs.slice(0, 8).map((log, i) => ({
    ...log,
    severity: i % 3 === 0 ? 'warning' as const : i % 5 === 0 ? 'error' as const : 'info' as const,
  }));

  const integrations = [
    { name: 'Payment Gateway', provider: 'Razorpay', status: 'connected' as const, icon: Wifi },
    { name: 'SMS Gateway', provider: 'MSG91', status: 'connected' as const, icon: Wifi },
    { name: 'Email Service', provider: 'SendGrid', status: 'disconnected' as const, icon: Wifi },
  ];

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('bbps-theme', next ? 'dark' : 'light');
  };

  const handleSave = () => {
    toast.success('Settings saved successfully.');
  };

  const handleCreateSession = () => {
    setSession('2027-2028');
    toast.success('New session created: 2027-2028');
  };

  const handleToggle = (key: string) => {
    setToggles((prev) => prev.map((t) => (t.key === key ? { ...t, enabled: !t.enabled } : t)));
  };

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)}>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-sm text-slate-500">Manage school profile, features, and system preferences.</p>
      </motion.div>

      <motion.div variants={STAGGER.item(0)} className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {[
          { key: 'general' as SettingsTab, label: 'General', icon: Save },
          { key: 'backup' as SettingsTab, label: 'Backup & Restore', icon: Download },
          { key: 'logs' as SettingsTab, label: 'System Logs', icon: Server },
          { key: 'security' as SettingsTab, label: 'Security', icon: Shield },
          { key: 'integrations' as SettingsTab, label: 'Integrations', icon: Wifi },
          { key: 'theme' as SettingsTab, label: 'Theme', icon: Palette },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setSettingsTab(t.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              settingsTab === t.key
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </motion.div>

      {settingsTab === 'general' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={STAGGER.item(1)} className="space-y-6">
            <Card>
              <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">School Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">School Name</label>
                  <input
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Address</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">Phone</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Session Management</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Current Session</p>
                  <p className="text-xs text-slate-500">{session}</p>
                </div>
                <Button variant="secondary" onClick={handleCreateSession}>
                  Create New Session
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Email Notifications</p>
                      <p className="text-xs text-slate-500">Receive email alerts for system events</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, email: !prev.email }))}
                    className={`relative h-6 w-11 rounded-full transition-colors ${notifications.email ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${notifications.email ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">SMS Notifications</p>
                      <p className="text-xs text-slate-500">Receive SMS alerts for urgent updates</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, sms: !prev.sms }))}
                    className={`relative h-6 w-11 rounded-full transition-colors ${notifications.sms ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${notifications.sms ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={STAGGER.item(2)} className="space-y-6">
            <Card>
              <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Feature Toggles</h3>
              <div className="space-y-4">
                {toggles.map((t) => (
                  <div key={t.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{t.label}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle(t.key)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${t.enabled ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${t.enabled ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Appearance</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="h-5 w-5 text-slate-400" /> : <Sun className="h-5 w-5 text-slate-400" />}
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Dark Mode</p>
                    <p className="text-xs text-slate-500">Toggle dark theme</p>
                  </div>
                </div>
                <button
                  onClick={toggleDark}
                  className={`relative h-6 w-11 rounded-full transition-colors ${darkMode ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${darkMode ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                <Info className="h-5 w-5 text-brand-500" />
                System Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-500">Version</span>
                  <span className="font-medium text-slate-900 dark:text-white">1.0.0</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-500">Build Date</span>
                  <span className="font-medium text-slate-900 dark:text-white">May 2026</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-500">Framework</span>
                  <span className="font-medium text-slate-900 dark:text-white">React 18 + TypeScript</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Environment</span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Demo</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Danger Zone</h3>
              <p className="mb-3 text-sm text-slate-500">Irreversible actions — use with caution.</p>
              <div className="flex gap-3">
                <Button variant="danger" className="flex-1">Reset All Data</Button>
                <Button variant="ghost" className="flex-1">Export Data</Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {settingsTab === 'backup' && (
        <motion.div variants={STAGGER.item(3)} className="space-y-4">
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <Download className="h-5 w-5 text-brand-500" />
              Create Backup
            </h3>
            <div className="space-y-3">
              <Button
                disabled={backingUp}
                onClick={() => {
                  setBackingUp(true);
                  let p = 0;
                  const int = setInterval(() => {
                    p += 10;
                    setBackupProgress(p);
                    if (p >= 100) {
                      clearInterval(int);
                      setBackingUp(false);
                      toast.success('Backup created successfully');
                    }
                  }, 400);
                }}
              >
                <Upload className="h-4 w-4" />
                {backingUp ? 'Creating Backup...' : 'Create Backup'}
              </Button>
              {backingUp && (
                <div className="space-y-1">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${backupProgress}%` }} />
                  </div>
                  <p className="text-xs text-slate-400">{backupProgress}% complete</p>
                </div>
              )}
            </div>
          </Card>
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <Upload className="h-5 w-5 text-brand-500" />
              Restore from Backup
            </h3>
            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 p-6 dark:border-slate-700">
              <Upload className="h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-500">Select a backup file to restore</p>
              <Button variant="secondary" onClick={() => toast.success('Backup file selected. Restore process will begin.')}>Choose File</Button>
            </div>
          </Card>
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Recent Backups</h3>
            <div className="space-y-2">
              {recentBackups.map((b, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-sm dark:border-slate-800">
                  <div>
                    <p className="text-slate-900 dark:text-white">{b.date}</p>
                    <p className="text-xs text-slate-400">{b.size} &middot; {b.type}</p>
                  </div>
                  <Button variant="ghost" onClick={() => toast.success('Restore from this backup initiated')}>Restore</Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {settingsTab === 'logs' && (
        <motion.div variants={STAGGER.item(3)}>
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <Server className="h-5 w-5 text-brand-500" />
              System Logs
            </h3>
            <div className="space-y-3">
              {systemLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800">
                  <span className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    log.severity === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/40' :
                    log.severity === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40' :
                    'bg-slate-100 text-slate-500 dark:bg-slate-800'
                  }`}>
                    <AlertCircle className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-200">{log.action}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{log.timestamp}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                    log.severity === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                    log.severity === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                    'bg-slate-100 text-slate-500 dark:bg-slate-800'
                  }`}>{log.severity}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {settingsTab === 'security' && (
        <motion.div variants={STAGGER.item(3)} className="space-y-4">
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <Key className="h-5 w-5 text-brand-500" />
              Password Policy
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Minimum Length (8 chars)</p>
                  <p className="text-xs text-slate-500">Require passwords to be at least 8 characters</p>
                </div>
                <button
                  onClick={() => setPwdMinLength(!pwdMinLength)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${pwdMinLength ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${pwdMinLength ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Special Characters Required</p>
                  <p className="text-xs text-slate-500">Require at least one special character</p>
                </div>
                <button
                  onClick={() => setPwdSpecialChars(!pwdSpecialChars)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${pwdSpecialChars ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${pwdSpecialChars ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <Shield className="h-5 w-5 text-brand-500" />
              Two-Factor Authentication
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">Enable 2FA for all admin accounts</p>
              </div>
              <button
                onClick={() => { setTwoFA(!twoFA); toast('2FA feature coming soon', { icon: '🔜' }); }}
                className={`relative h-6 w-11 rounded-full transition-colors ${twoFA ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${twoFA ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </Card>
        </motion.div>
      )}

      {settingsTab === 'integrations' && (
        <motion.div variants={STAGGER.item(3)} className="space-y-4">
          {integrations.map((int) => (
            <Card key={int.name}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    int.status === 'connected' ? 'bg-green-100 text-green-600 dark:bg-green-900/40' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                  }`}>
                    <int.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{int.name}</p>
                    <p className="text-xs text-slate-500">{int.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    int.status === 'connected'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  }`}>{int.status === 'connected' ? 'Connected' : 'Disconnected'}</span>
                  <Button variant="secondary" onClick={() => toast.success(`${int.name} test successful`)}>Test</Button>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {settingsTab === 'theme' && (
        <motion.div variants={STAGGER.item(3)} className="space-y-4">
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <Palette className="h-5 w-5 text-brand-500" />
              Brand Color
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => {
                  setBrandColor(e.target.value);
                  localStorage.setItem('bbps-brand-color', e.target.value);
                  document.documentElement.style.setProperty('--brand-color', e.target.value);
                  toast.success('Brand color updated');
                }}
                className="h-12 w-12 cursor-pointer rounded-lg border border-slate-200 p-1 dark:border-slate-700"
              />
              <div className="flex gap-2">
                {['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setBrandColor(c);
                      localStorage.setItem('bbps-brand-color', c);
                      toast.success('Brand color updated');
                    }}
                    className="h-8 w-8 rounded-full ring-2 ring-transparent transition-all hover:scale-110"
                    style={{ backgroundColor: c, ...(brandColor === c ? { ringColor: c, boxShadow: `0 0 0 2px ${c}` } : {}) }}
                  />
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <ZoomIn className="h-5 w-5 text-brand-500" />
              Font Size
            </h3>
            <div className="flex gap-3">
              {[
                { key: 'small', label: 'Small', desc: '14px' },
                { key: 'medium', label: 'Medium', desc: '16px' },
                { key: 'large', label: 'Large', desc: '18px' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setFontSize(opt.key);
                    localStorage.setItem('bbps-font-size', opt.key);
                    toast.success(`Font size set to ${opt.label}`);
                  }}
                  className={`flex-1 rounded-xl border p-3 text-center transition-colors ${
                    fontSize === opt.key
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{opt.label}</p>
                  <p className="text-xs text-slate-400">{opt.desc}</p>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
