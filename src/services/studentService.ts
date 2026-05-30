/* ─── studentService ───
 * Data-access layer for student-related entities: students, attendance, timetable.
 * All functions return promises wrapping mock data.
 */

import type { Student, Attendance, TimetableSlot } from '../types';
import * as mock from '../data/mock';
import { delay } from './delay';

export async function getStudents(): Promise<Student[]> {
  await delay(); return mock.students;
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  await delay(); return mock.getStudentById(id);
}

export async function getStudentsByClass(classId: string): Promise<Student[]> {
  await delay(); return mock.getStudentsByClass(classId);
}

export async function getAttendanceByStudent(studentId: string): Promise<Attendance[]> {
  await delay(); return mock.getAttendanceByStudent(studentId);
}

export async function getTimetableByClass(classId: string): Promise<TimetableSlot[]> {
  await delay(); return mock.getTimetableByClass(classId);
}

export async function getMyClassId(studentId: string): Promise<string | undefined> {
  await delay(); const s = mock.getStudentById(studentId); return s?.classId;
}
