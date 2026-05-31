/* ─── Bug Report Modal ───
 * Floating "Report Bug" button + modal accessible from every page.
 * Reports flow into the WebManage panel for triage and resolution.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, X, Send, AlertTriangle, Info, AlertCircle, Flame } from 'lucide-react';
import { submitBugReport } from '../services/bugReportService';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const severityIcons = {
  low: Info,
  medium: AlertTriangle,
  high: AlertCircle,
  critical: Flame,
};

const severityColors = {
  low: 'text-blue-500 border-blue-300 bg-blue-50 dark:bg-blue-900/20',
  medium: 'text-yellow-500 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20',
  high: 'text-orange-500 border-orange-300 bg-orange-50 dark:bg-orange-900/20',
  critical: 'text-red-500 border-red-300 bg-red-50 dark:bg-red-900/20',
};

export default function BugReportModal({ inline = false }: { inline?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<BugReportSeverity>('medium');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const currentPage = window.location.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      await submitBugReport(
        title.trim(),
        description.trim(),
        currentPage,
        severity,
        user?.firstName ? `${user.firstName} ${user.lastName}` : 'Anonymous'
      );
      toast.success('Bug report submitted! Thank you for helping improve BBPS ERP.');
      setTitle('');
      setDescription('');
      setSeverity('medium');
      setIsOpen(false);
    } catch {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ─── Trigger Button ─── */}
      {inline ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-red-300 bg-red-50/50 px-6 py-5 text-sm font-semibold text-red-700 transition-all hover:border-red-400 hover:bg-red-50 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300 dark:hover:border-red-700 dark:hover:bg-red-900/30"
        >
          <Bug className="h-5 w-5" />
          Report a Bug / Give Feedback
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700 transition-all duration-200 group"
          title="Report a bug"
        >
          <Bug className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium">
            Report Bug
          </span>
        </button>
      )}

      {/* ─── Modal ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Bug className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white">Report a Bug</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Help us improve BBPS ERP</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Brief description of the issue"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="What happened? What did you expect? Steps to reproduce..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Severity</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(severityIcons) as BugReportSeverity[]).map(s => {
                      const Icon = severityIcons[s];
                      const isSelected = severity === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSeverity(s)}
                          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                            isSelected
                              ? `border-2 ${severityColors[s].replace('border-', '')}`
                              : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-xs text-gray-400 dark:text-gray-500">
                  <span className="font-medium">Page:</span> {currentPage}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submitting ? 'Submitting...' : 'Submit Bug Report'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

type BugReportSeverity = 'low' | 'medium' | 'high' | 'critical';
