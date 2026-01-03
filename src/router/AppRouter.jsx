import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Attendance from "../pages/Attendance";
import LeaveManagement from "../pages/LeaveManagement";
import TimeOff from "../pages/TimeOff";
import Payroll from "../pages/Payroll";
import Documents from "../pages/Documents";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminEmployees from "../pages/admin/AdminEmployees";
import AdminAttendance from "../pages/admin/AdminAttendance";
import AdminTimeOff from "../pages/admin/AdminTimeOff";
import AdminPayroll from "../pages/admin/AdminPayroll";

/**
 * AppRouter Component
 * Main routing configuration using React Router v6
 * Separate routes for Employee and Admin sides
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Employee Routes */}
      <Route path="/" element={<DashboardLayout />}>
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Employee Pages */}
        <Route path="profile" element={<Profile />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave-timeoff" element={<TimeOff />} />
        <Route path="leave-management" element={<LeaveManagement />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="documents" element={<Documents />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Redirect admin root to admin dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />

        {/* Admin Dashboard */}
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Admin Pages */}
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="timeoff" element={<AdminTimeOff />} />
        <Route path="payroll" element={<AdminPayroll />} />
        <Route
          path="logout"
          element={<Navigate to="/admin/dashboard" replace />}
        />
      </Route>

      {/* 404 - Redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
