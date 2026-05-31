export type UserRole = 'admin' | 'teacher' | 'student';

export interface AppUser {
  uid: string;
  email: string | null;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  phone?: string;
  schoolId?: string;
  department?: string;
  section?: string;
}

export interface SessionInfo {
  id: string;
  name: string;
  isActive: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  teacherId: string;
  teacherName: string;
}

export interface ClassSection {
  id: string;
  name: string;
  grade: number;
  section: string;
  room: string;
  studentCount: number;
  classTeacherId: string;
  classTeacherName: string;
  subjects: Subject[];
}

export interface Teacher {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  assignedClasses: string[];
  avatar?: string;
}

export interface Student {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  classId: string;
  rollNumber: string;
  schoolId: string;
  parentName: string;
  parentPhone: string;
  address: string;
  emergencyContact: string;
  dob: string;
  bloodGroup: string;
  avatar?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  createdAt: string;
  maxScore: number;
  attachments: string[];
  status: 'active' | 'closed' | 'draft';
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  attachments: string[];
  score?: number;
  feedback?: string;
  gradedAt?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  subject: string;
  date: string;
  duration: number;
  maxMarks: number;
  type: 'midterm' | 'final' | 'quiz' | 'unit_test';
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  subject: string;
  score: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
  remarks?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'holiday';
  classId: string;
  markedBy: string;
}

export interface TimetableSlot {
  id: string;
  classId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
}

export interface Chat {
  id: string;
  participants: ChatParticipant[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  type: 'individual' | 'group';
  name?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  target: 'all' | 'class' | 'teacher';
  targetClass?: string;
  author: string;
  pinned: boolean;
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  paid: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'overdue' | 'pending';
  items: { name: string; amount: number }[];
}

export interface FeeTransaction {
  id: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  method: 'cash' | 'online' | 'cheque' | 'demand_draft';
  status: 'completed' | 'failed' | 'refunded';
  receiptNo: string;
}

export interface ContentResource {
  id: string;
  title: string;
  description: string;
  type: 'notes' | 'video' | 'reference' | 'assignment';
  classId: string;
  subjectId: string;
  subject: string;
  url: string;
  thumbnail?: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize?: string;
  tags: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  url: string;
  date: string;
  category: string;
}

export interface GatePass {
  id: string;
  studentId: string;
  studentName: string;
  reason: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'circular' | 'form' | 'report' | 'other';
  date: string;
  fileSize: string;
}

export interface TransportRoute {
  id: string;
  name: string;
  stops: { name: string; time: string }[];
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  fee: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  role: UserRole;
}

export interface DashboardStats {
  studentsTaught: number;
  assignmentsToGrade: number;
  examsThisWeek: number;
  todayClasses: number;
  assignmentsDue: number;
  avgPerformance: number;
  attendance: number;
  streak: number;
}

/* ─── Bug Report System ─── */
export interface BugReport {
  id: string;
  title: string;
  description: string;
  page: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  assignee?: string;
  browserInfo?: string;
  screenshot?: string;
}

/* ─── AI Integration ─── */
export interface AIConfig {
  provider: 'openai' | 'gemini' | 'claude' | 'custom';
  apiKey: string;
  endpoint?: string;
  model?: string;
  enabledFeatures: AIFeature[];
}

export type AIFeature =
  | 'chat_assistant'
  | 'grading_assistant'
  | 'content_recommendations'
  | 'analytics_insights'
  | 'smart_search'
  | 'lesson_planning';

export interface AIAnalysis {
  summary: string;
  confidence: number;
  suggestions: string[];
  generatedAt: string;
}

/* ─── WebManage ─── */
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  lastBackup: string;
  activeUsers: number;
  apiStatus: Record<string, 'connected' | 'disconnected' | 'error'>;
  memoryUsage: number;
  version: string;
}

/* ─── Leave Management ─── */
export type LeaveStatus = 'pending_teacher' | 'pending_principal' | 'approved' | 'rejected';
export type LeaveType = 'sick' | 'personal' | 'emergency' | 'other';

export interface LeaveApplication {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  reason: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  status: LeaveStatus;
  teacherApproval?: { approved: boolean; by: string; at: string; remark: string };
  principalApproval?: { approved: boolean; by: string; at: string; remark: string };
  submittedAt: string;
}

export interface ManagementAction {
  id: string;
  type: 'bug_fix' | 'user_action' | 'system_update' | 'content_moderation';
  description: string;
  performedBy: string;
  performedAt: string;
  status: 'completed' | 'pending' | 'failed';
}
