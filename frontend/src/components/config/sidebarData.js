import {
  HiHome,
  HiUser,
  HiClock,
  HiCurrencyDollar,
  HiCalendar,
  HiDocumentText,
} from 'react-icons/hi2';

/**
 * Sidebar Navigation Data
 * Employee-side navigation items
 */
export const sidebarData = [
  {
    path: '/dashboard',
    icon: HiHome,
    label: 'Dashboard',
  },
  {
    path: '/profile',
    icon: HiUser,
    label: 'Profile',
  },
  {
    path: '/attendance',
    icon: HiClock,
    label: 'Attendance',
  },
  {
    path: '/leave-timeoff',
    icon: HiCalendar,
    label: 'Leave & Time Off',
  },
  {
    path: '/payroll',
    icon: HiCurrencyDollar,
    label: 'Payroll',
  },
  {
    path: '/documents',
    icon: HiDocumentText,
    label: 'Documents',
  },
];

