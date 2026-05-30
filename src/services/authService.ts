/* ─── authService ───
 * Demo-mode authentication service with hardcoded credentials.
 * Provides login, password change, sign-out, and Firebase config checks.
 */

import type { AppUser, UserRole } from '../types';

interface DemoCredential {
  uid: string;
  schoolId: string;
  employeeId?: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  section?: string;
  classId?: string;
  studentId?: string;
  teacherId?: string;
}

// ── Demo credentials ──
export const demoCredentials: DemoCredential[] = [
  {
    uid: 'demo-student',
    schoolId: 'BBPS-1001',
    password: 'student123',
    role: 'student',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@bbps.edu',
    phone: '9876543210',
    section: '10-A',
    classId: 'c1',
    studentId: 's1',
  },
  {
    uid: 'demo-student2',
    schoolId: 'BBPS-1002',
    password: 'student123',
    role: 'student',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@bbps.edu',
    phone: '9876543211',
    section: '10-A',
    classId: 'c1',
    studentId: 's2',
  },
  {
    uid: 'demo-teacher',
    schoolId: 'TCH-001',
    employeeId: 'TCH-001',
    password: 'teacher123',
    role: 'teacher',
    firstName: 'Priya',
    lastName: 'Verma',
    email: 'priya.verma@bbps.edu',
    phone: '9988776655',
    department: 'Science',
    teacherId: 't1',
  },
  {
    uid: 'demo-teacher2',
    schoolId: 'TCH-002',
    employeeId: 'TCH-002',
    password: 'teacher123',
    role: 'teacher',
    firstName: 'Rajesh',
    lastName: 'Gupta',
    email: 'rajesh.gupta@bbps.edu',
    phone: '9988776644',
    department: 'Mathematics',
    teacherId: 't2',
  },
  {
    uid: 'demo-admin',
    schoolId: 'ADM-001',
    employeeId: 'ADM-001',
    password: 'admin123',
    role: 'admin',
    firstName: 'School',
    lastName: 'Administrator',
    email: 'admin@bbps.edu',
    phone: '9988776600',
    department: 'Administration',
  },
];

// ── Login / auth helpers ──
export function loginWithCredentials(schoolId: string, password: string): { user: AppUser; success: boolean; error?: string } {
  const found = demoCredentials.find(
    (c) => (c.schoolId === schoolId || c.employeeId === schoolId) && c.password === password
  );

  if (!found) {
    return { user: null as unknown as AppUser, success: false, error: 'Invalid School ID / Employee ID or password' };
  }

  const user: AppUser = {
    uid: found.uid,
    email: found.email,
    role: found.role,
    firstName: found.firstName,
    lastName: found.lastName,
    phone: found.phone,
    schoolId: found.schoolId,
    department: found.department,
    section: found.section,
    avatar: null,
  };

  return { user, success: true };
}

// ── Password management ──
export function changePassword(schoolId: string, oldPassword: string, newPassword: string): { success: boolean; error?: string } {
  const idx = demoCredentials.findIndex(
    (c) => (c.schoolId === schoolId || c.employeeId === schoolId) && c.password === oldPassword
  );

  if (idx === -1) {
    return { success: false, error: 'Current password is incorrect' };
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters' };
  }

  demoCredentials[idx].password = newPassword;
  return { success: true };
}

export function signOutUser(): void {
  // Just a stub - actual session is managed by Zustand store
}

export function isFirebaseConfigured(): boolean {
  return false;
}

export function getDemoCredentials(): DemoCredential[] {
  return demoCredentials;
}
