/* ─── adminService ───
 * Data-access layer for admin-only features: students, teachers, classes,
 * fee management, activity logs, gallery, and downloads.
 */

import type { Student, Teacher, ClassSection, FeeInvoice, FeeTransaction, ActivityLog, GalleryItem, DownloadItem } from '../types';
import * as mock from '../data/mock';
import { delay } from './delay';

export async function getAllStudents(): Promise<Student[]> {
  await delay(); return mock.students;
}

export async function getAllTeachers(): Promise<Teacher[]> {
  await delay(); return mock.teachers;
}

export async function getAllClasses(): Promise<ClassSection[]> {
  await delay(); return mock.classes;
}

export async function getFeeInvoices(): Promise<FeeInvoice[]> {
  await delay(); return mock.feeInvoices;
}

export async function getFeeTransactions(): Promise<FeeTransaction[]> {
  await delay(); return mock.feeTransactions;
}

export async function getRecentActivity(): Promise<ActivityLog[]> {
  await delay(); return mock.activityLogs;
}

export async function getGallery(): Promise<GalleryItem[]> {
  await delay(); return mock.galleryItems;
}

export async function getDownloads(): Promise<DownloadItem[]> {
  await delay(); return mock.downloads;
}
