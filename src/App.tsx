import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardShell } from './layouts/DashboardShell';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/auth/LoginPage';

const StudentHome = lazy(() => import('./pages/student/StudentHome').then((m) => ({ default: m.StudentHome })));
const StudentStudy = lazy(() => import('./pages/student/StudentStudy').then((m) => ({ default: m.StudentStudy })));
const StudentAcademics = lazy(() => import('./pages/student/StudentAcademics').then((m) => ({ default: m.StudentAcademics })));
const StudentMessages = lazy(() => import('./pages/student/StudentMessages').then((m) => ({ default: m.StudentMessages })));
const StudentMore = lazy(() => import('./pages/student/StudentMore').then((m) => ({ default: m.StudentMore })));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile').then((m) => ({ default: m.StudentProfile })));

const TeacherHome = lazy(() => import('./pages/teacher/TeacherHome').then((m) => ({ default: m.TeacherHome })));
const TeacherClasses = lazy(() => import('./pages/teacher/TeacherClasses').then((m) => ({ default: m.TeacherClasses })));
const TeacherAssignments = lazy(() => import('./pages/teacher/TeacherAssignments').then((m) => ({ default: m.TeacherAssignments })));
const TeacherExams = lazy(() => import('./pages/teacher/TeacherExams').then((m) => ({ default: m.TeacherExams })));
const TeacherContent = lazy(() => import('./pages/teacher/TeacherContent').then((m) => ({ default: m.TeacherContent })));
const TeacherReports = lazy(() => import('./pages/teacher/TeacherReports').then((m) => ({ default: m.TeacherReports })));
const TeacherMessages = lazy(() => import('./pages/teacher/TeacherMessages').then((m) => ({ default: m.TeacherMessages })));
const TeacherProfile = lazy(() => import('./pages/teacher/TeacherProfile').then((m) => ({ default: m.TeacherProfile })));

const AdminHome = lazy(() => import('./pages/admin/AdminHome').then((m) => ({ default: m.AdminHome })));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then((m) => ({ default: m.AdminUsers })));
const AdminClasses = lazy(() => import('./pages/admin/AdminClasses').then((m) => ({ default: m.AdminClasses })));
const AdminAcademic = lazy(() => import('./pages/admin/AdminAcademic').then((m) => ({ default: m.AdminAcademic })));
const AdminFinance = lazy(() => import('./pages/admin/AdminFinance').then((m) => ({ default: m.AdminFinance })));
const AdminComms = lazy(() => import('./pages/admin/AdminComms').then((m) => ({ default: m.AdminComms })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings })));

/* ─── Hidden Web Management Panel (no nav link, direct URL access only) ─── */
const WebManage = lazy(() => import('./pages/WebManage').then((m) => ({ default: m.WebManage })));

const queryClient = new QueryClient();

function Spinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  );
}

function RootRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  const target = user.role === 'admin' ? '/admin' : user.role === 'teacher' ? '/teacher' : '/student';
  return <Navigate to={target} replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute allowed="student" />}>
              <Route path="/student" element={<DashboardShell role="student" />}>
                <Route index element={<StudentHome />} />
                <Route path="study" element={<StudentStudy />} />
                <Route path="academics" element={<StudentAcademics />} />
                <Route path="messages" element={<StudentMessages />} />
                <Route path="more" element={<StudentMore />} />
                <Route path="profile" element={<StudentProfile />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowed="teacher" />}>
              <Route path="/teacher" element={<DashboardShell role="teacher" />}>
                <Route index element={<TeacherHome />} />
                <Route path="classes" element={<TeacherClasses />} />
                <Route path="assignments" element={<TeacherAssignments />} />
                <Route path="exams" element={<TeacherExams />} />
                <Route path="content" element={<TeacherContent />} />
                <Route path="reports" element={<TeacherReports />} />
                <Route path="messages" element={<TeacherMessages />} />
                <Route path="profile" element={<TeacherProfile />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowed="admin" />}>
              <Route path="/admin" element={<DashboardShell role="admin" />}>
                <Route index element={<AdminHome />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="classes" element={<AdminClasses />} />
                <Route path="academic" element={<AdminAcademic />} />
                <Route path="finance" element={<AdminFinance />} />
                <Route path="comms" element={<AdminComms />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* ─── Hidden Web Management Panel (admin only, direct URL access) ─── */}
            <Route element={<ProtectedRoute allowed="admin" />}>
              <Route path="/webmanage" element={<WebManage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster position="top-center" toastOptions={{ duration: 3200 }} />
      </Router>
    </QueryClientProvider>
  );
}
