import type { LeaveApplication } from '../types';
import { leaveApplications } from '../data/mock';

function delay(ms = 300): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

let leaves: LeaveApplication[] = [...leaveApplications];

export async function getLeaveApplications(): Promise<LeaveApplication[]> {
  await delay();
  return [...leaves].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function getLeavesByStudent(studentId: string): Promise<LeaveApplication[]> {
  await delay();
  return leaves.filter(l => l.studentId === studentId).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function getLeavesByClass(classIds: string[]): Promise<LeaveApplication[]> {
  await delay();
  return leaves.filter(l => classIds.includes(l.classId)).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function getPendingTeacherLeaves(): Promise<LeaveApplication[]> {
  await delay();
  return leaves.filter(l => l.status === 'pending_teacher').sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function getPendingPrincipalLeaves(): Promise<LeaveApplication[]> {
  await delay();
  return leaves.filter(l => l.status === 'pending_principal').sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function submitLeaveApplication(app: Omit<LeaveApplication, 'id' | 'submittedAt' | 'status' | 'daysCount'> & { startDate: string; endDate: string }): Promise<LeaveApplication> {
  await delay();
  const start = new Date(app.startDate);
  const end = new Date(app.endDate);
  const daysCount = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const newLeave: LeaveApplication = {
    ...app,
    daysCount,
    status: 'pending_teacher',
    submittedAt: new Date().toISOString(),
    id: `lv-${Date.now()}`,
  };
  leaves.unshift(newLeave);
  return newLeave;
}

export async function approveByTeacher(leaveId: string, teacherName: string, approved: boolean, remark: string): Promise<void> {
  await delay();
  const leave = leaves.find(l => l.id === leaveId);
  if (!leave) throw new Error('Leave not found');
  leave.teacherApproval = { approved, by: teacherName, at: new Date().toISOString(), remark };
  if (!approved) {
    leave.status = 'rejected';
  } else if (leave.daysCount > 7) {
    leave.status = 'pending_principal';
  } else {
    leave.status = 'approved';
  }
}

export async function approveByPrincipal(leaveId: string, principalName: string, approved: boolean, remark: string): Promise<void> {
  await delay();
  const leave = leaves.find(l => l.id === leaveId);
  if (!leave) throw new Error('Leave not found');
  leave.principalApproval = { approved, by: principalName, at: new Date().toISOString(), remark };
  leave.status = approved ? 'approved' : 'rejected';
}

export async function getLeavesStats(): Promise<{ pending: number; approved: number; rejected: number; total: number }> {
  await delay();
  return {
    pending: leaves.filter(l => l.status === 'pending_teacher' || l.status === 'pending_principal').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
    total: leaves.length,
  };
}
