# Thesis Management System - Frontend

A comprehensive web application for managing thesis submissions, defense meetings, and academic workflows. Built with React, ```typescript, and modern web technologies.

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![```typescript](https://img.shields.io/badge/```typescript-5.x-3178C6?logo=```typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [User Roles](#user-roles)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The Thesis Management System is a full-featured web application designed to streamline the thesis submission and defense process in academic institutions. It provides role-based dashboards for students, professors, managers, and administrators to manage the entire thesis lifecycle from submission to defense.

---

## ✨ Features

### For Students
- 📝 Create and submit thesis forms
- 📊 Track thesis form status through approval workflow
- 📅 View and select time slots for defense meetings
- 👤 Manage personal profile and change password

### For Professors/Instructors
- ✅ Review and approve/reject thesis submissions
- 📋 View assigned thesis forms
- ⏰ Specify available time periods for defense meetings

### For Managers
- 👥 Select jury members for defense meetings
- 📅 Schedule and manage defense meetings
- 📍 Assign meeting locations

### For Administrators
- 👨‍🎓 Register new students
- 🏛️ Manage departments and fields of study
- 📑 Oversee all thesis forms
- 👥 User management
- 📊 View system-wide reports

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **```typescript** | Type Safety |
| **React Router v6** | Client-side Routing |
| **TanStack Query (React Query)** | Server State Management |
| **Zustand** | Client State Management |
| **Axios** | HTTP Client |
| **Tailwind CSS** | Styling |
| **Lucide React** | Icons |
| **date-fns** | Date Formatting |

---

## 📁 Project Structure

```
src/
├── api/                          # API layer
│   ├── admin.api.ts              # Admin API endpoints
│   ├── auth.api.ts               # Authentication API
│   ├── professor.api.ts          # Professor API endpoints
│   └── student.api.ts            # Student API endpoints
│
├── components/                   # Reusable components
│   ├── auth/
│   │   └── ProtectedRoute.tsx    # Route protection HOC
│   ├── common/
│   │   ├── Button.tsx            # Button component
│   │   ├── Card.tsx              # Card container component
│   │   ├── Input.tsx             # Input field component
│   │   ├── Modal.tsx             # Modal dialog component
│   │   └── JurySelectionModal.tsx# Jury selection modal
│   ├── layout/
│   │   ├── Layout.tsx            # Main layout wrapper
│   │   ├── Navbar.tsx            # Navigation bar
│   │   └── SideBar.tsx           # Sidebar navigation
│   ├── professor/
│   │   ├── ScheduleMeeting.tsx   # Meeting scheduling component
│   └── student/
│       └── ThesisFormCreate.tsx  # Thesis form creation
│
├── pages/                        # Page components
│   ├── admin/
│   │   ├── AdminDashboard.tsx    # Admin main dashboard
│   │   ├── AdminHome.tsx         # Admin home page
│   │   ├── AdminFieldsPage.tsx   # Fields management
│   │   ├── AdminThesisFormsPage.tsx
│   │   ├── DefenseMeetings.tsx   # Defense meetings management
│   │   ├── Departments.tsx       # Department management
│   │   ├── StudentManagement.tsx # User management
│   │   └── StudentRegistration.tsx
│   ├── professor/
│   │   └── ProfessorDashboard.tsx
│   ├── student/
│   │   ├── StudentDashboard.tsx  # Student main dashboard
│   │   ├── StudentHome.tsx       # Student home page
│   │   ├── ThesisFormPage.tsx    # Thesis form page
│   │   ├── ProfessorThesisForms.tsx     # View submitted forms
│   │   ├── MeetingsPage.tsx      # View meetings
│   │   └── ProfilePage.tsx       # Profile settings
│   └── LoginPage.tsx             # Authentication page
│
├── store/                        # State management
│   └── authStore.ts              # Authentication store (Zustand)
│
├── types/                        # ```typescript definitions
│   └── index.ts                  # Type definitions & enums
│
├── App.tsx                       # Main application component
├── index.tsx                     # Application entry point
└── index.css                     # Global styles & Tailwind imports

---
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher) or **yarn** (v1.22.x or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/thesis-management-frontend.git
   cd thesis-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration (see [Environment Variables](#environment-variables))

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080/api

# Optional: Enable React Query Devtools in production
REACT_APP_ENABLE_DEVTOOLS=false

---

## 👥 User Roles

The system supports four distinct user roles with different permissions:

| Role | Description | Access Level |
|------|-------------|--------------|
| `ADMIN` | System Administrator | Full system access, user management |
| `MANAGER` | Department Manager | Jury selection, meeting scheduling |
| `PROFESSOR` | Faculty Member | Thesis review, time slot specification |
| `STUDENT` | Graduate Student | Thesis submission, meeting attendance |

---

## 🔗 API Integration

### API Structure

The application uses Axios for HTTP requests with automatic token injection:

```typescript
// Example: Student API
export const studentAPI = {
    createThesisForm: async (data: ThesisFormInput) => {
        const response = await getStudentAPI().post('/create-form', data);
        return response.data;
    },
    getMyThesisForms: async () => {
        const response = await getStudentAPI().get('/forms');
        return response.data;
    },
    // ... more endpoints
};
```

### Available API Modules

- **`auth.api.ts`** - Login, logout, token refresh
- **`student.api.ts`** - Thesis forms, meetings, profile management
- **`professor.api.ts`** - Form reviews, meeting scheduling, jury management
- **`admin.api.ts`** - User registration, departments, fields, system management

---

## 🗃️ State Management

### Authentication State (Zustand)


```typescript
interface AuthState {
    token: string | null;
    role: UserRole | null;
    userId: number | null;
    firstName: string | null;
    lastName: string | null;
    setAuth: (token: string, role: UserRole, userId: number) => void;
    clearAuth: () => void;
    isAuthenticated: () => boolean;
}
```

The auth store automatically:
- Decodes JWT tokens to extract user information
- Persists authentication state to localStorage
- Provides easy access to user data across components

### Server State (TanStack Query)

```typescript
// Example usage
const { data: forms, isLoading } = useQuery({
    queryKey: ['myThesisForms'],
    queryFn: studentAPI.getMyThesisForms,
});
```

---

## 📊 Data Types & Enums

### Form States
```typescript
enum FormState {
    SUBMITTED = 'SUBMITTED',
    INSTRUCTOR_APPROVED = 'INSTRUCTOR_APPROVED',
    INSTRUCTOR_REJECTED = 'INSTRUCTOR_REJECTED',
    ADMIN_APPROVED = 'ADMIN_APPROVED',
    ADMIN_REJECTED = 'ADMIN_REJECTED',
    MANAGER_APPROVED = 'MANAGER_APPROVED',
    MANAGER_REJECTED = 'MANAGER_REJECTED',
}
```
### Meeting States
```typescript
enum MeetingState {
    JURIES_SELECTED = 'JURIES_SELECTED',
    JURIES_SPECIFIED_TIME = 'JURIES_SPECIFIED_TIME',
    STUDENT_SPECIFIED_TIME = 'STUDENT_SPECIFIED_TIME',
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}
```
### Time Periods
```typescript
enum TimePeriod {
    PERIOD_7_30_9_00 = 'PERIOD_7_30_9_00',
    PERIOD_9_00_10_30 = 'PERIOD_9_00_10_30',
    PERIOD_10_30_12_00 = 'PERIOD_10_30_12_00',
    PERIOD_13_30_15_00 = 'PERIOD_13_30_15_00',
    PERIOD_15_30_17_00 = 'PERIOD_15_30_17_00',
}
```
---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm test` | Launches the test runner |
| `npm run build` | Builds the app for production |
| `npm run lint` | Runs ESLint for code quality |
| `npm run format` | Formats code with Prettier |

---

## 🎨 Styling

The project uses **Tailwind CSS** for styling. Configuration can be found in:

- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - Global styles and Tailwind imports

### Custom Utilities

```css
/* Line clamping for text truncation */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
```
---

## 🔒 Authentication Flow

1. User submits credentials on `/login`
2. Backend returns JWT token with user info
3. Token is stored in Zustand store (persisted to localStorage)
4. Protected routes check authentication status
5. API requests include token in Authorization header
6. On logout, auth state is cleared and user redirected to login

---

## 📱 Route Structure


/login                    # Public - Login page

/student/*                # Protected - Student routes
/dashboard              # Student home
/thesis-form            # Thesis form creation
/meetings               # Defense meetings
/profile                # Profile settings

/professor/*              # Protected - Professor/Manager routes
/dashboard              # Professor home
/reviews                # Thesis form reviews
/meetings               # Meeting management

/admin/*                  # Protected - Admin routes
/dashboard              # Admin home
/register-student       # Student registration
/users                  # User management
/departments            # Department management
/fields                 # Field management
/thesis-forms           # All thesis forms
/meetings               # Defense meetings

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines

- Use ```typescript for all new files
- Follow the existing component structure
- Use TanStack Query for server state
- Use Zustand for client state
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, please open an issue on the GitHub repository or contact the development team.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Made with ❤️ for Academic Excellence**

