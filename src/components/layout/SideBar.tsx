import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  FileText,
  Calendar,
  Users,
  Building2,
  ClipboardList,
  Settings,
  BarChart3
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';

export const Sidebar: React.FC = () => {
  const { role } = useAuthStore();

  const getNavigationItems = () => {
    switch (role) {
      case UserRole.ADMIN:
        return [
          { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
          { to: '/admin/users', icon: Users, label: 'Student Management' },
          { to: '/admin/departments', icon: Building2, label: 'Departments' },
          { to: '/admin/fields', icon: ClipboardList, label: 'Fields' },
          { to: '/admin/thesis-forms', icon: FileText, label: 'Thesis Forms' },
          { to: '/admin/meetings', icon: Calendar, label: 'Defense Meetings' },
          { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
        ];

      case UserRole.PROFESSOR:
      case UserRole.MANAGER:
        return [
          { to: '/professor/dashboard', icon: Home, label: 'Dashboard' },
          { to: '/professor/thesis-forms', icon: FileText, label: 'Thesis Forms' },
          { to: '/professor/meetings', icon: Calendar, label: 'My Meetings' },
          { to: '/professor/students', icon: Users, label: 'My Students' },
          { to: '/professor/profile', icon: Settings, label: 'Profile' },
        ];

      case UserRole.STUDENT:
        return [
          { to: '/student/dashboard', icon: Home, label: 'Dashboard' },
          { to: '/student/thesis-form', icon: FileText, label: 'My Thesis Form' },
          { to: '/student/meetings', icon: Calendar, label: 'Defense Meetings' },
          { to: '/student/profile', icon: Settings, label: 'Profile' },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavigationItems();

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
