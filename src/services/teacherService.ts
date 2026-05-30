/* ─── teacherService ───
 * Data-access layer for teacher entities and their assigned classes.
 * Wraps mock data access with simulated async delay.
 */

import type { Teacher, ClassSection } from '../types';
import * as mock from '../data/mock';
import { delay } from './delay';

export async function getTeachers(): Promise<Teacher[]> {
  await delay(); return mock.teachers;
}

export async function getTeacherById(id: string): Promise<Teacher | undefined> {
  await delay(); return mock.getTeacherById(id);
}

export async function getClassesByTeacher(teacherId: string): Promise<ClassSection[]> {
  await delay(); return mock.getClassesByTeacher(teacherId);
}
