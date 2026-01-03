import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
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
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
/**
 * AppRouter Component
 * Main routing configuration using React Router v6
 * Separate routes for Employee and Admin sides
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth">
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Route>

      {/* Employee Routes (require employee role) */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="EMPLOYEE">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
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

      {/* Admin Routes (require admin role) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
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

      {/* 404 - Redirect to signin */}
      <Route path="*" element={<Navigate to="/auth/signin" replace />} />
    </Routes>
  );
};

export default AppRouter;
