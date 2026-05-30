/* ─── academicService ───
 * Data-access layer for academic entities: assignments, submissions, exams, results.
 * Wraps mock data access with simulated async delay.
 */

import type { Assignment, Submission, Exam, ExamResult } from '../types';
import * as mock from '../data/mock';
import { delay } from './delay';

export async function getAssignments(classId?: string): Promise<Assignment[]> {
  await delay(); return classId ? mock.getAssignmentsByClass(classId) : mock.assignments;
}

export async function getAssignmentsByTeacher(teacherId: string): Promise<Assignment[]> {
  await delay(); return mock.getAssignmentsByTeacher(teacherId);
}

export async function getSubmissions(assignmentId: string): Promise<Submission[]> {
  await delay(); return mock.submissions.filter(s => s.assignmentId === assignmentId);
}

export async function getExams(classId?: string): Promise<Exam[]> {
  await delay(); return classId ? mock.getExamsByClass(classId) : mock.exams;
}

export async function getExamResults(studentId?: string): Promise<ExamResult[]> {
  await delay(); return studentId ? mock.getResultsByStudent(studentId) : mock.examResults;
}

export async function getExamResultsByExam(examId: string): Promise<ExamResult[]> {
  await delay(); return mock.examResults.filter(r => r.examId === examId);
}
