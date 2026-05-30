# BBPS ERP - AI Agent Guide

## Project Overview

**BBPS ERP** is a comprehensive Educational Resource Planning application for Blooming Bud Public School. It provides three distinct user panels (Admin, Teacher, Student) with role-based access control, Firebase backend integration, and smooth animations.

See [prompt.txt](prompt.txt) for full feature specifications and requirements.

## Tech Stack & Key Dependencies

| Tool | Purpose |
|------|---------|
| **React 18** + **TypeScript** | UI framework with type safety |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Styling with custom `brand` color palette |
| **Firebase** | Auth, Firestore (database), Storage |
| **Zustand** | State management with persistence |
| **React Query** | Server state & API caching |
| **Framer Motion** | Animation library |
| **React Router v6** | Client-side routing |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |

## Architecture & Conventions

### Role-Based Structure
The app is organized around three user roles: `admin`, `teacher`, `student`. Each role has:
- Dedicated page folder: `src/pages/{role}/`
- Role-specific routes in `App.tsx` protected by `ProtectedRoute`
- User metadata stored in Firestore with role field

**Type Definition** ([src/types/index.ts](src/types/index.ts)):
```typescript
type UserRole = 'admin' | 'teacher' | 'student';

interface AppUser {
  uid: string;
  email: string | null;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  // role-specific fields: department, section, schoolId, phone
}
```

### State Management Pattern

**Authentication** ([src/store/authStore.ts](src/store/authStore.ts)):
- Zustand store with localStorage persistence (`bbps-auth` key)
- Tracks current user and hydration state
- Updated via `subscribeAuth()` from Firebase listener

**Server State**:
- React Query for API calls and caching
- QueryClient configured in `App.tsx`

### Component Patterns

**Protected Routes** ([src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx)):
```typescript
<ProtectedRoute requiredRole="student">
  <StudentPanel />
</ProtectedRoute>
```

**Lazy Loading** (in [App.tsx](src/App.tsx)):
- Pages use React.lazy() + Suspense for code splitting
- Spinner component shown during load
- Improves initial bundle size

**Shared UI Components** ([src/components/ui/](src/components/ui/)):
- `Button.tsx`, `Card.tsx` - reusable base components
- Follow Tailwind conventions with `className`

### Styling Conventions

- **Color Palette**: Custom `brand` colors (emerald-based)
- **Shadows**: Use `shadow-card` for consistent elevation
- **Fonts**: `font-sans` (DM Sans) for body, `font-display` (Outfit) for headings
- **Dark Mode**: Supported via `darkMode: 'class'` in tailwind.config.js

### Page Organization

```
src/pages/
├── auth/           # LoginPage, RegisterPage, ForgotPasswordPage
├── student/        # StudentHome, StudentStudy, StudentAcademics, etc.
├── teacher/        # TeacherHome, TeacherProfile
└── admin/          # AdminHome
```

Each page is a React component exported as named export and lazily loaded in `App.tsx`.

## Firebase Configuration

**Environment Variables** (in `.env`):
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FORCE_DEMO_AUTH=true|false  # Demo mode for testing without Firebase
```

**Lazy Initialization** ([src/firebase/config.ts](src/firebase/config.ts)):
- `isFirebaseConfigured()` checks if credentials are set
- `getFirebaseApp()`, `getFirebaseAuth()`, `getFirebaseDb()` - lazy getters
- Returns `null` if not configured (demo mode)

**Authentication** ([src/firebase/authService.ts](src/firebase/authService.ts)):
- `subscribeAuth()` - listener for Firebase auth state changes
- Updates Zustand store on user changes
- Handles token refresh automatically

## Development Workflow

### Commands
```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # TypeScript check + Vite build → dist/
npm run preview    # Preview built app locally
npm run lint       # Run ESLint on all files
```

### Adding a New Feature

1. **For Student Features**: Add page to `src/pages/student/`, add route in `App.tsx` with lazy loading
2. **For State**: Add store to Zustand (prefer `authStore` pattern with persistence)
3. **For Styling**: Use Tailwind with custom brand colors; check `tailwind.config.js`
4. **For Animations**: Import `motion` from `framer-motion` and use in components
5. **For API Calls**: Use React Query `useQuery()` / `useMutation()`

### Common Hooks
- `useAuth()` - Get current user from Zustand + check hydration
- `useRole()` - Get user's role with fallback
- `useAuthContext()` - Internal auth subscription hook

## Key Files Reference

| File | Purpose |
|------|---------|
| [package.json](package.json) | Dependencies & npm scripts |
| [vite.config.ts](vite.config.ts) | Vite configuration |
| [tailwind.config.js](tailwind.config.js) | Tailwind theme with custom colors |
| [tsconfig.json](tsconfig.json) | TypeScript strict mode enabled |
| [src/App.tsx](src/App.tsx) | Main router, lazy-loaded routes, QueryClient setup |
| [src/main.tsx](src/main.tsx) | React mount point |
| [src/context/AuthProvider.tsx](src/context/AuthProvider.tsx) | Firebase auth listener setup |
| [src/store/authStore.ts](src/store/authStore.ts) | Zustand auth state |
| [src/firebase/config.ts](src/firebase/config.ts) | Firebase lazy initialization |
| [src/types/index.ts](src/types/index.ts) | Global TypeScript types |

## ESLint Configuration

- Uses `@eslint/js` with TypeScript support
- Rules in [eslint.config.js](eslint.config.js)
- React Hooks rules enabled to catch common mistakes

## Tips for AI Agents

✅ **DO:**
- Use lazy loading pattern for all new pages
- Use Zustand for state persistence needs
- Use React Query for API calls
- Apply custom `brand` colors for consistent theming
- Wrap role-specific pages in `ProtectedRoute`
- Check `isFirebaseConfigured()` before Firebase operations

❌ **DON'T:**
- Hardcode demo users (use authStore patterns)
- Create global CSS (use Tailwind only)
- Use inline styles (prefer className)
- Add routes without lazy loading + Suspense
- Forget TypeScript types for new features

## Next Suggested Customizations

- **Skills**: Create `/skill-add-student-page/` for automating student feature scaffolding
- **Instructions**: Add specific docs for Firebase Firestore schema design if expanding database
- **Hooks**: Document custom React hooks patterns for code reuse
