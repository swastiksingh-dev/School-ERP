# BBPS ERP — Blooming Bud Public School

**A comprehensive Educational Resource Planning system** with three panels (Student, Teacher, Admin), built with React + TypeScript, featuring demo mode with pre-loaded data.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ (recommended: v20 LTS)
- **npm** v9+ or **yarn** v1.22+
- **Git** for cloning

### Clone & Setup
```bash
# Clone the repository
git clone https://github.com//bbps-erp.git
cd bbps-erp

# Install dependencies
npm install

# Start development server
npm run dev
```

The app opens at **http://localhost:5173**

### Build for Production
```bash
npm run build
```
Output goes to `dist/` — ready to deploy on any static host (GitHub Pages, Vercel, Netlify, Firebase Hosting, etc.)

---

## 📋 Demo Credentials

The app runs in **demo mode** out of the box — no database setup needed.

### Students
| School ID | Password | Name | Class |
|-----------|----------|------|-------|
| `BBPS-1001` | `student123` | Aarav Sharma | 10-A |
| `BBPS-1002` | `student123` | Priya Patel | 10-A |

### Teachers
| Employee ID | Password | Name | Department |
|-------------|----------|------|------------|
| `TCH-001` | `teacher123` | Priya Verma | Science |
| `TCH-002` | `teacher123` | Rajesh Gupta | Mathematics |

### Admin
| Employee ID | Password | Name |
|-------------|----------|------|
| `ADM-001` | `admin123` | School Administrator |

> **Password can be changed** from the Profile page (for demo, passwords reset on page refresh).

---

## ✨ Features Overview

### 🎓 Student Panel (12+ Features)
| Feature | Description |
|---------|-------------|
| **Dashboard** | Stats, performance chart, schedule, announcements |
| **Study Zone** | E-Content library, syllabus tracker, live class, online exams, view links |
| **Academics** | Exam results with charts, homework tracker, timetable grid, attendance calendar, admit card |
| **Messages** | Real-time chat with teachers and classmates |
| **Gallery** | School event photos with lightbox |
| **Classmates** | Roster with contact info and birthdays |
| **Fee Status** | Invoice history, payment tracking, due alerts |
| **Transport** | Route details, stops, timings, driver info |
| **Gate Pass** | Request form with approval tracking |
| **Downloads** | Circulars, forms, reports |
| **Notice Board** | School announcements and notices |
| **Library** | Book catalog search |
| **Leave Application** | Apply and track leave status |
| **Profile** | Personal info, password change |

### 👨‍🏫 Teacher Panel (12+ Features)
| Feature | Description |
|---------|-------------|
| **Dashboard** | Class stats, attendance pulse, today's schedule |
| **Classes** | Student roster, attendance marking with charts |
| **Assignments** | Create, publish, review submissions, grade with feedback |
| **Exams** | Create exams, enter marks, auto-calc percentages & grades |
| **Content** | Upload notes/videos/references organized by class |
| **Reports** | Performance charts, attendance trends, submission analytics |
| **Messages** | Individual chat + class broadcast |
| **Profile** | Personal info, password change |
| **Lesson Planning** | Plan and track lessons per subject |
| **Student Behavior** | Track behavior records and notes |
| **Activities** | Extra-curricular activity management |
| **Meetings** | Schedule and manage parent-teacher meetings |
| **Parent Comms** | Communication log with parents |
| **Report Cards** | Generate and view student report cards |

### 🛠️ Admin Panel (12+ Features)
| Feature | Description |
|---------|-------------|
| **Dashboard** | School KPIs, attendance pie chart, recent activity |
| **Users** | Manage students/teachers, search, add, view details |
| **Classes** | Manage classes, assign teachers, view rosters |
| **Academic** | Subjects, exams, calendar with holidays |
| **Finance** | Fee invoices, transactions, collection charts |
| **Communications** | Create announcements with templates |
| **Settings** | School profile, sessions, feature toggles, dark mode |
| **Bulk Import** | CSV import for users (ready for backend) |
| **Audit Logs** | System activity tracking |
| **Backup** | Database backup management (ready for backend) |
| **Holiday Calendar** | Manage school holidays |
| **Grading Scale** | Configure grade boundaries |

---

## 🧱 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 3 (emerald brand palette) |
| **Animations** | Framer Motion 11 |
| **State** | Zustand 5 (persisted to localStorage) |
| **Server State** | TanStack React Query 5 |
| **Charts** | Recharts 2 |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **Validation** | Zod |
| **Routing** | React Router v6 |

---

## 📁 Project Structure

```
src/
├── components/        # Shared UI (Card, Button, Logo, etc.)
├── constants/         # Animation constants
├── data/              # Mock/demo data
├── hooks/             # Custom hooks (useAuth, useRole, queries)
├── layouts/           # DashboardShell with sidebar + bottom nav
├── pages/
│   ├── auth/          # LoginPage
│   ├── student/       # 6 student pages
│   ├── teacher/       # 8 teacher pages
│   └── admin/         # 7 admin pages
├── services/          # API-ready service layer
├── store/             # Zustand stores
├── types/             # TypeScript interfaces
├── App.tsx            # Router + lazy loading
└── main.tsx           # Entry point
```

---

## 🔌 Connecting a Backend (MongoDB)

All service files in `src/services/` follow an async API pattern. To connect a real backend:

1. Choose your backend stack (Node.js/Express + MongoDB is recommended)
2. Create REST API endpoints matching the service function signatures
3. Replace the mock implementation in each service with `fetch()` or `axios` calls
4. Remove the mock data imports

Example pattern:
```typescript
// Before (mock):
export async function getStudents(): Promise<Student[]> {
  await delay(); return mock.students;
}

// After (API):
export async function getStudents(): Promise<Student[]> {
  const res = await fetch('/api/students');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
```

---

## 🌐 Deployment Options

### GitHub Pages (Free)
```bash
npm run build
# Upload dist/ folder to GitHub Pages
# Or use: npm install -g gh-pages && gh-pages -d dist
```

### Vercel / Netlify (Free)
1. Push repo to GitHub
2. Import project on Vercel/Netlify
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy — done!

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
npm run build
firebase deploy
```

---

## 📺 YouTube Channel

Built and maintained by **Next-Token-AI**

[![Next-Token-AI YouTube Channel](https://img.shields.io/badge/YouTube-Subscribe-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/@Next-Token-AI)

Subscribe for tutorials, updates, and more educational tech projects!

---

## 🙏 Credits

- **Developer**: Next-Token-AI (@Next-Token-AI)
- **School**: Blooming Bud Public School (conceptual)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Built with**: React, TypeScript, Vite, Tailwind CSS

---

## 📄 License

MIT — Free to use, modify, and distribute.

---

*Last updated: May 2026*
