/* ─── queries ───
 * React Query hooks wrapping all service-layer functions.
 * Provides useStudents, useAssignments, useChats, useExams, etc.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Student, Assignment, Submission, Exam, ExamResult, Chat, Message, Announcement, ClassSection, Teacher, Attendance, TimetableSlot, FeeInvoice, FeeTransaction, ActivityLog, GalleryItem, DownloadItem } from '../types';
import * as studentSvc from '../services/studentService';
import * as academicSvc from '../services/academicService';
import * as commSvc from '../services/communicationService';
import * as teacherSvc from '../services/teacherService';
import * as adminSvc from '../services/adminService';

// ── Student queries ──
export function useStudents() {
  return useQuery<Student[]>({ queryKey: ['students'], queryFn: studentSvc.getStudents });
}

export function useStudentById(id: string | undefined) {
  return useQuery<Student | undefined>({ queryKey: ['students', id], queryFn: () => studentSvc.getStudentById(id!), enabled: !!id });
}

export function useStudentsByClass(classId: string | undefined) {
  return useQuery<Student[]>({ queryKey: ['students', 'class', classId], queryFn: () => studentSvc.getStudentsByClass(classId!), enabled: !!classId });
}

export function useAttendance(studentId: string | undefined) {
  return useQuery<Attendance[]>({ queryKey: ['attendance', studentId], queryFn: () => studentSvc.getAttendanceByStudent(studentId!), enabled: !!studentId });
}

export function useTimetable(classId: string | undefined) {
  return useQuery<TimetableSlot[]>({ queryKey: ['timetable', classId], queryFn: () => studentSvc.getTimetableByClass(classId!), enabled: !!classId });
}

// ── Academic queries ──
export function useAssignments(classId?: string) {
  return useQuery<Assignment[]>({ queryKey: ['assignments', classId], queryFn: () => academicSvc.getAssignments(classId) });
}

export function useAssignmentsByTeacher(teacherId: string | undefined) {
  return useQuery<Assignment[]>({ queryKey: ['assignments', 'teacher', teacherId], queryFn: () => academicSvc.getAssignmentsByTeacher(teacherId!), enabled: !!teacherId });
}

export function useSubmissions(assignmentId: string | undefined) {
  return useQuery<Submission[]>({ queryKey: ['submissions', assignmentId], queryFn: () => academicSvc.getSubmissions(assignmentId!), enabled: !!assignmentId });
}

export function useExams(classId?: string) {
  return useQuery<Exam[]>({ queryKey: ['exams', classId], queryFn: () => academicSvc.getExams(classId) });
}

export function useExamResults(studentId?: string) {
  return useQuery<ExamResult[]>({ queryKey: ['examResults', studentId], queryFn: () => academicSvc.getExamResults(studentId) });
}

export function useExamResultsByExam(examId: string | undefined) {
  return useQuery<ExamResult[]>({ queryKey: ['examResults', 'exam', examId], queryFn: () => academicSvc.getExamResultsByExam(examId!), enabled: !!examId });
}

// ── Communication queries ──
export function useChats(userId: string | undefined) {
  return useQuery<Chat[]>({ queryKey: ['chats', userId], queryFn: () => commSvc.getChats(userId!), enabled: !!userId });
}

export function useMessages(chatId: string | undefined) {
  return useQuery<Message[]>({ queryKey: ['messages', chatId], queryFn: () => commSvc.getMessages(chatId!), enabled: !!chatId });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, senderId, senderName, text }: { chatId: string; senderId: string; senderName: string; text: string }) =>
      commSvc.sendMessage(chatId, senderId, senderName, text),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['messages', vars.chatId] });
      qc.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

export function useAnnouncements() {
  return useQuery<Announcement[]>({ queryKey: ['announcements'], queryFn: commSvc.getAnnouncements });
}

// ── Teacher queries ──
export function useTeachers() {
  return useQuery<Teacher[]>({ queryKey: ['teachers'], queryFn: teacherSvc.getTeachers });
}

export function useTeacherById(id: string | undefined) {
  return useQuery<Teacher | undefined>({ queryKey: ['teachers', id], queryFn: () => teacherSvc.getTeacherById(id!), enabled: !!id });
}

export function useClassesByTeacher(teacherId: string | undefined) {
  return useQuery<ClassSection[]>({ queryKey: ['classes', 'teacher', teacherId], queryFn: () => teacherSvc.getClassesByTeacher(teacherId!), enabled: !!teacherId });
}

// ── Admin queries ──
export function useAllStudents() {
  return useQuery<Student[]>({ queryKey: ['admin', 'students'], queryFn: adminSvc.getAllStudents });
}

export function useAllTeachers() {
  return useQuery<Teacher[]>({ queryKey: ['admin', 'teachers'], queryFn: adminSvc.getAllTeachers });
}

export function useAllClasses() {
  return useQuery<ClassSection[]>({ queryKey: ['admin', 'classes'], queryFn: adminSvc.getAllClasses });
}

export function useFeeInvoices() {
  return useQuery<FeeInvoice[]>({ queryKey: ['admin', 'feeInvoices'], queryFn: adminSvc.getFeeInvoices });
}

export function useFeeTransactions() {
  return useQuery<FeeTransaction[]>({ queryKey: ['admin', 'feeTransactions'], queryFn: adminSvc.getFeeTransactions });
}

export function useRecentActivity() {
  return useQuery<ActivityLog[]>({ queryKey: ['admin', 'activity'], queryFn: adminSvc.getRecentActivity });
}

export function useGallery() {
  return useQuery<GalleryItem[]>({ queryKey: ['gallery'], queryFn: adminSvc.getGallery });
}

export function useDownloads() {
  return useQuery<DownloadItem[]>({ queryKey: ['downloads'], queryFn: adminSvc.getDownloads });
}
