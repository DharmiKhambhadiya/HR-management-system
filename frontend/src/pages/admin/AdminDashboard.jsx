import { useMemo } from 'react';
import { HiUsers, HiClock, HiCalendar, HiCurrencyDollar } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import SummaryCard from '../../components/attendance/SummaryCard';
import { useEmployee } from '../../context/EmployeeContext';
import { useAuth } from '../../context/AuthContext';

/**
 * Admin Dashboard Page
 * Admin/HR dashboard with overview statistics
 */
const AdminDashboard = () => {
  const { employees } = useEmployee();
  const { user } = useAuth();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((emp) => emp.status === 'Active').length;
    
    // Group by department
    const departmentCounts = employees.reduce((acc, emp) => {
      const dept = emp.department || 'Unassigned';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEmployees,
      activeEmployees,
      departmentCounts,
    };
  }, [employees]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <nav className="text-sm text-gray-500 mb-2">
          <span>Admin</span> <span className="mx-2">/</span>{' '}
          <span className="text-gray-900 font-medium">Dashboard</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user?.fullName || 'Admin'}! Here's your HRMS overview.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={HiUsers}
          title="Total Employees"
          value={stats.totalEmployees}
          subtitle="registered employees"
          iconColor="blue"
        />
        <SummaryCard
          icon={HiUsers}
          title="Active Employees"
          value={stats.activeEmployees}
          subtitle={`out of ${stats.totalEmployees}`}
          iconColor="green"
        />
        <SummaryCard
          icon={HiClock}
          title="Today's Attendance"
          value="--"
          subtitle="check-ins today"
          iconColor="purple"
        />
        <SummaryCard
          icon={HiCalendar}
          title="Pending Leave Requests"
          value="--"
          subtitle="awaiting approval"
          iconColor="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/employees"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <HiUsers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Employees</h3>
              <p className="text-sm text-gray-500">Create and view employees</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/attendance"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <HiClock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View Attendance</h3>
              <p className="text-sm text-gray-500">Monitor employee attendance</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/timeoff"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <HiCalendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Leaves</h3>
              <p className="text-sm text-gray-500">Approve leave requests</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/payroll"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <HiCurrencyDollar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Payroll Management</h3>
              <p className="text-sm text-gray-500">Manage salaries</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Employees & Department Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Employees</h2>
          </div>
          <div className="p-6">
            {employees.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No employees yet</p>
                <Link
                  to="/admin/employees"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first employee
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {employees.slice(0, 5).map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{employee.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {employee.employeeId} • {employee.department}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {employee.status || 'Active'}
                    </span>
                  </div>
                ))}
                {employees.length > 5 && (
                  <Link
                    to="/admin/employees"
                    className="block text-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-4"
                  >
                    View all employees ({employees.length})
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Department Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Department Overview</h2>
          </div>
          <div className="p-6">
            {Object.keys(stats.departmentCounts).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No departments assigned yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(stats.departmentCounts).map(([dept, count]) => (
                  <div
                    key={dept}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="font-medium text-gray-900">{dept}</span>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {count} {count === 1 ? 'employee' : 'employees'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
