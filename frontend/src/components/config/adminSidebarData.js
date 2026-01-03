import {
  HiHome,
  HiUserGroup,
  HiUsers,
  HiClock,
  HiCalendar,
  HiCurrencyDollar,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

/**
 * Admin Sidebar Navigation Data
 * Admin/HR Officer side navigation items
 */
export const adminSidebarData = [
  {
    path: "/admin/dashboard",
    icon: HiHome,
    label: "Dashboard",
  },
  {
    path: "/admin/employees",
    icon: HiUserGroup,
    label: "Employees",
  },

  {
    path: "/admin/attendance",
    icon: HiClock,
    label: "Attendance",
  },
  {
    path: "/admin/timeoff",
    icon: HiCalendar,
    label: "Time Off",
  },
  {
    path: "/admin/payroll",
    icon: HiCurrencyDollar,
    label: "Payroll",
  },
  {
    path: "/admin/logout",
    icon: HiArrowRightOnRectangle,
    label: "Logout",
  },
];
