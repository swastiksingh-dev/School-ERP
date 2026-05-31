<div align="center">

# 🏫 School-ERP

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Latest-000000?logo=framer)](https://www.framer.com/motion/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)
[![Built by](https://img.shields.io/badge/Built%20by-Next--Token--AI-FF0000?logo=youtube)](https://www.youtube.com/@Next-Token-AI)

---

A **full-featured, zero-backend** Educational Resource Planning system with three role-based panels (Student, Teacher, Admin). Built with React 18, TypeScript, and Vite 6, it delivers **15+ features per panel** — including study management, academics tracking, messaging, attendance, exams, finance, analytics, and a hidden WebManage admin panel with AI integration & bug reporting.

Designed for schools to **self-host, customize, and scale**. No database setup required — runs entirely on demo data with smooth Framer Motion animations, Recharts dashboards, dark mode, and full offline support.

> **⚠️ Disclaimer:** This software is provided for educational and lawful administrative purposes only. The creator and contributors are not responsible for any misuse, illegal activities, or violations of applicable laws arising from its use. Users assume all risks and responsibilities.

</div>

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/swastiksingh-dev/School-ERP.git
cd School-ERP

# Install dependencies
npm install

# Start the development server
npm run dev
```

→ Open **http://localhost:5173** in your browser

## 🌐 Live Demo

The app is automatically deployed to GitHub Pages on every push:

**[https://swastiksingh-dev.github.io/School-ERP/](https://swastiksingh-dev.github.io/School-ERP/)**

### Test Demo Accounts

| Role | ID | Password | Features |
|------|----|----|----------|
| **Student** | `BBPS-1001` | `student123` | Dashboard, study materials, assignments, exams, messaging, leave portal |
| **Teacher** | `TCH-001` | `teacher123` | Class roster, assignment creation & grading, exam management, student analytics |
| **Admin** | `ADM-001` | `admin123` | System dashboard, user management, finance, communications, settings |
| **WebManage** | `WEB-001` | `webmanage123` | Bug triage, AI config, security logs, system health (hidden panel) |

---

## 📖 Feature Overview

### 🎓 **Student Panel** (15+ Features)

| Feature | Description |
|---------|-------------|
| **Dashboard** | Real-time attendance percentage, learning streaks, performance metrics |
| **Study** | Timetable, notes, video materials, reference resources |
| **Academics** | Assignment tracking, exam schedules, results with performance charts |
| **Messages** | Peer-to-peer and teacher communication |
| **Leave Portal** | Apply for leaves with multi-tier approval (Teacher → Principal) |
| **Gallery** | School event photos and memories |
| **Gate Passes** | Digital pass generation for campus entry |
| **Downloads** | Access study materials and resources |
| **Transport** | Bus routes and schedule management |
| **Bug Report** | Report app issues directly to admin |
| **AI Features** | Chat assistant, learning recommendations, smart search |
| **Birthday Section** | Birthday announcements and celebrations |
| **Profile** | Personal information and documents |

### 👨‍🏫 **Teacher Panel** (15+ Features)

| Feature | Description |
|---------|-------------|
| **Dashboard** | Today's class schedule, pending grading queue, leave approvals |
| **Classes** | Student roster, class information, attendance management |
| **Assignments** | Create, distribute, and grade assignments |
| **Exams** | Create exam papers, input scores, track completion |
| **Content** | Upload study materials, videos, and resources |
| **Reports** | Student-wise analytics, performance charts, progress tracking |
| **Messages** | Communication with students and administration |
| **Profile** | Teacher profile and credentials |
| **Grade Analytics** | Performance trends and distribution |
| **Attendance** | Track and manage student attendance |
| **Notifications** | Real-time updates on submissions and approvals |
| **Export Reports** | Download student performance data |
| **Leave Management** | Submit and track leave requests |
| **Class Schedule** | Manage and view timetables |
| **Feedback** | Provide student feedback and comments |

### ⚙️ **Admin Panel** (15+ Features)

| Feature | Description |
|---------|-------------|
| **Dashboard** | System stats, principal leave approvals, overview metrics |
| **User Management** | View profiles, reset credentials, toggle user status |
| **Class Management** | Create/edit classes, manage sections, schedule timetables |
| **Academic Management** | Oversee assignments & exams across all classes |
| **Finance Dashboard** | Invoices, transactions, payment tracking, charts |
| **Communications** | Announcements, bulk messaging, notifications |
| **Session Settings** | Configure academic sessions and parameters |
| **Branding** | Customize school name, logo, theme colors |
| **Security Settings** | Password policies, access controls, audit logs |
| **Report Generation** | System-wide analytics and exports |
| **Bulk Operations** | Mass user import, data synchronization |
| **Backup & Recovery** | Local data backup and restore |
| **Activity Logs** | Track all system activities |
| **API Configuration** | External integrations and webhooks |
| **Announcements** | School-wide communication system |

### 🔐 **WebManage Panel** (Hidden Admin Dashboard)

Access at **`/webmanage`** with admin credentials.

| Feature | Purpose |
|---------|---------|
| **System Health** | Real-time monitoring of app performance and data integrity |
| **Bug Triage** | View, assign, and resolve bug reports submitted by users |
| **AI Configuration** | Configure API keys for 6 AI providers (OpenAI, Anthropic, Gemini, etc.) |
| **Feature Toggles** | Enable/disable AI features (chat, grading, recommendations, etc.) |
| **User Accounts Viewer** | Monitor all user accounts and login activity |
| **Activity Logs** | Complete audit trail of all system actions |
| **Security Dashboard** | Overview of authentication, encryption, and access controls |

---

## 🔧 Tech Stack

**Frontend:**
- **React 18** — UI framework with hooks
- **TypeScript 5.6** — Type-safe development
- **Vite 6** — Lightning-fast build tool
- **Tailwind CSS 3** — Utility-first styling
- **Framer Motion** — Smooth page transitions and animations
- **Recharts** — Data visualization (pie, bar, line, area charts)

**State Management:**
- **Zustand** — Lightweight auth state & persistence
- **TanStack React Query** — Server state management

**Development:**
- **Lucide** — Beautiful icon library
- **React Lazy + Suspense** — Code splitting and lazy loading
- **localStorage API** — Client-side data persistence

**Deployment:**
- **GitHub Pages** — Free static hosting with auto-deploy

---

## 📋 Core Systems

### 🔑 Authentication

```
Login Flow:
1. Enter School/Employee ID (format: BBPS-1001, TCH-001, ADM-001)
2. Enter password
3. Role-based redirect (Student → Student Panel, Teacher → Teacher Panel, etc.)

Features:
- 5 pre-loaded demo accounts
- Quick-login buttons on login page
- Persistent auth via Zustand + localStorage
- Fallback to mock data if backend unavailable
```

### 📄 Leave Management System

```
Approval Workflow:
┌─────────────┐     ┌───────────────┐     ┌──────────────┐
│ Student     │────→│ Teacher       │────→│ Principal    │
│ Applies     │     │ Approves 1st  │     │ Approves 2nd │
└─────────────┘     │ (≤7 days)     │     │ (>7 days)    │
                    └───────────────┘     └──────────────┘

Status Flow:
pending_teacher → pending_principal → approved/rejected

Accessible from Student → More → Leave Portal
```

### 🤖 AI Integration (6 Features)

Integrated across the platform with mock fallback when API unconfigured:

1. **Chat Assistant** — Answer student queries
2. **Grading AI** — Assist with assignment evaluation
3. **Recommendations** — Suggest learning materials based on performance
4. **Analytics AI** — Generate insights from academic data
5. **Smart Search** — Enhanced content discovery
6. **Lesson Planning** — Generate lesson outlines and resources

**Configuration:**
- API keys stored in `localStorage` only (no server transmission)
- Support for multiple providers (OpenAI, Anthropic, Gemini, Cohere, Hugging Face, Azure)
- Enable/disable features in WebManage → AI Config

### 🐛 Bug Reporting System

```
Submission:
Student → More → Bug Report → Submit issue

Triage:
Admin → WebManage → Bug Triage → Assign → Resolve/Delete

Storage: localStorage-backed with unique IDs
```

---

## 📱 Responsive Design

- **Desktop:** Collapsible sidebar navigation (Lucide icons)
- **Tablet:** Bottom navigation bar with role-based menu
- **Mobile:** Bottom nav, optimized touch targets, full-screen modals
- **All Pages:** Mobile-first CSS with Tailwind breakpoints

---

## ✨ Key Features

✅ **Zero Backend** — No server setup required, all data in localStorage  
✅ **Offline Demo Mode** — Works without internet connection  
✅ **Dark Mode** — System-wide dark/light theme toggle  
✅ **Animations** — Smooth Framer Motion page transitions  
✅ **Charts & Analytics** — Recharts for performance visualization  
✅ **Role-Based Access Control** — 4 distinct user roles with permissions  
✅ **Lazy Loading** — React.lazy() + Suspense for fast initial load  
✅ **SPA Routing** — GitHub Pages compatible with 404.html redirect  
✅ **Responsive** — Mobile, tablet, and desktop optimized  
✅ **Accessible** — WCAG 2.1 compliant components  

---

## 📁 Project Structure

```
School-ERP/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/               # Lazy-loaded page components
│   ├── store/               # Zustand auth store
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # Helper functions
│   ├── constants/           # App constants & demo data
│   ├── App.tsx              # Main router component
│   └── main.tsx             # Vite entry point
├── public/
│   ├── index.html           # SPA entry point
│   └── 404.html             # GitHub Pages fallback
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies & scripts
```

---

## 🔐 Security Considerations

⚠️ **Important:** This is a **demo application** for educational purposes. For production use:

- [ ] Replace localStorage with secure backend
- [ ] Implement proper authentication (JWT, OAuth 2.0)
- [ ] Add encryption for sensitive data
- [ ] Use HTTPS in production
- [ ] Implement rate limiting and input validation
- [ ] Add audit logging to backend
- [ ] Use environment variables for API keys (not localStorage)
- [ ] Regular security audits and penetration testing

---

## 🛠 Build & Deploy

### Development

```bash
npm run dev          # Start dev server on http://localhost:5173
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### GitHub Pages Deployment

1. Update `base` in `vite.config.ts` to your repo name
2. Push to `main` branch
3. GitHub Actions auto-deploys to `gh-pages`
4. Enable GitHub Pages in repo settings

**Live URL:** `https://[username].github.io/School-ERP/`

---

## 📚 Full Setup Guide

See **[SETUP.md](SETUP.md)** for:
- Prerequisites & system requirements
- Step-by-step installation
- Demo credentials and test data
- Complete feature list by role
- Tech stack details and versions
- Customization guide
- Deployment options (Netlify, Vercel, etc.)
- Troubleshooting FAQs

---

## 🎬 YouTube & Resources

**Built by:** [Next-Token-AI](https://www.youtube.com/@Next-Token-AI)  
**Website:** [nexttokenai.unaux.com](https://nexttokenai.unaux.com/)

Subscribe for:
- Full development walkthroughs
- Feature explanations
- Advanced customization tutorials
- Community Q&A

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code style guidelines
- Pull request process
- Issue reporting template
- Development setup for contributors

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) file for details.

Tl;DR — You're free to use, modify, and distribute this project for educational and lawful purposes.

---

## 🔗 Quick Links

| Link | Purpose |
|------|---------|
| [GitHub](https://github.com/swastiksingh-dev/School-ERP) | Source code |
| [Live Demo](https://swastiksingh-dev.github.io/School-ERP/) | Try it online |
| [Setup Guide](SETUP.md) | Installation & configuration |
| [Contributing](CONTRIBUTING.md) | How to contribute |
| [License](LICENSE) | MIT License |
| [YouTube](https://www.youtube.com/@Next-Token-AI) | Tutorials & updates |

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/swastiksingh-dev/School-ERP/issues)
- **Discussions:** [GitHub Discussions](https://github.com/swastiksingh-dev/School-ERP/discussions)
- **YouTube:** [@Next-Token-AI](https://www.youtube.com/@Next-Token-AI)

---

<div align="center">

Made with ❤️ by [Next-Token-AI](https://nexttokenai.unaux.com/)

⭐ If you find this project useful, please consider giving it a star!

</div>
