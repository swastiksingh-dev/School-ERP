/* ─── Bug Report Service ───
 * Manages bug reports submitted from all pages across the app.
 * Reports are stored in-memory (localStorage persisted) so the WebManage
 * panel can review, assign, and resolve them.
 */

import type { BugReport } from '../types';

const STORAGE_KEY = 'bbps-bug-reports';

let reports: BugReport[] = loadFromStorage();

function loadFromStorage(): BugReport[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch { /* quota exceeded – silently fail */ }
}

/* Simulated network delay for realistic async behavior */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/* ─── Public API ─── */

export async function submitBugReport(
  title: string,
  description: string,
  page: string,
  severity: BugReport['severity'],
  reportedBy: string
): Promise<BugReport> {
  await delay(200);
  const report: BugReport = {
    id: `bug-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    description,
    page,
    severity,
    status: 'open',
    reportedBy,
    reportedAt: new Date().toISOString(),
    browserInfo: navigator.userAgent,
  };
  reports.unshift(report);
  saveToStorage();
  return report;
}

export async function getAllBugReports(): Promise<BugReport[]> {
  await delay(150);
  return [...reports];
}

export async function getBugReportById(id: string): Promise<BugReport | undefined> {
  await delay(100);
  return reports.find(r => r.id === id);
}

export async function updateBugReport(
  id: string,
  updates: Partial<Pick<BugReport, 'status' | 'resolutionNotes' | 'assignee'>>
): Promise<BugReport> {
  await delay(200);
  const idx = reports.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('Bug report not found');
  reports[idx] = {
    ...reports[idx],
    ...updates,
    resolvedAt: updates.status === 'resolved' || updates.status === 'closed'
      ? new Date().toISOString()
      : reports[idx].resolvedAt,
  };
  saveToStorage();
  return reports[idx];
}

export async function deleteBugReport(id: string): Promise<void> {
  await delay(100);
  reports = reports.filter(r => r.id !== id);
  saveToStorage();
}

export async function getBugStats() {
  await delay(100);
  return {
    total: reports.length,
    open: reports.filter(r => r.status === 'open').length,
    inProgress: reports.filter(r => r.status === 'in_progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    closed: reports.filter(r => r.status === 'closed').length,
    critical: reports.filter(r => r.severity === 'critical').length,
  };
}
