import { useState, useMemo } from 'react';
import { HiMagnifyingGlass, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import SummaryCard from '../../components/attendance/SummaryCard';
import AttendanceStatusBadge from '../../components/attendance/AttendanceStatusBadge';
import {
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiUsers,
} from 'react-icons/hi2';

/**
 * Admin Attendance Management Page
 * Admin/HR can view attendance of all employees
 */
const AdminAttendance = () => {
  const today = new Date();
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'month'
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [searchQuery, setSearchQuery] = useState('');

  // Mock attendance data - will be replaced with API call
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      employeeName: 'Ethan Antonio',
      checkIn: '10:00 AM',
      checkOut: '07:00 PM',
      workingHours: '09:00',
      extraHours: '01:00',
      status: 'Present',
    },
    {
      id: 2,
      employeeName: 'Louis B. Kimble',
      checkIn: '10:15 AM',
      checkOut: '07:30 PM',
      workingHours: '09:15',
      extraHours: '01:15',
      status: 'Present',
    },
    {
      id: 3,
      employeeName: 'Calvin C. Landry',
      checkIn: null,
      checkOut: null,
      workingHours: '00:00',
      extraHours: '00:00',
      status: 'Absent',
    },
    {
      id: 4,
      employeeName: 'Mabel L. Lee',
      checkIn: '10:00 AM',
      checkOut: '02:00 PM',
      workingHours: '04:00',
      extraHours: '00:00',
      status: 'Half-day',
    },
    {
      id: 5,
      employeeName: 'John Doe',
      checkIn: null,
      checkOut: null,
      workingHours: '00:00',
      extraHours: '00:00',
      status: 'Leave',
    },
  ]);

  // Filter by search query
  const filteredAttendance = useMemo(() => {
    return attendanceData.filter((record) =>
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [attendanceData, searchQuery]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalEmployees = filteredAttendance.length;
    const present = filteredAttendance.filter(
      (r) => r.status?.toLowerCase() === 'present'
    ).length;
    const absent = filteredAttendance.filter(
      (r) => r.status?.toLowerCase() === 'absent'
    ).length;
    const leave = filteredAttendance.filter(
      (r) => r.status?.toLowerCase() === 'leave'
    ).length;

    // Calculate average working hours
    const totalHours = filteredAttendance.reduce((total, record) => {
      if (record.workingHours) {
        const [hours, minutes] = record.workingHours.split(':').map(Number);
        return total + hours + minutes / 60;
      }
      return total;
    }, 0);

    const avgHours = totalHours / (present || 1);
    const formattedAvgHours = `${Math.floor(avgHours)}:${String(Math.round((avgHours % 1) * 60)).padStart(2, '0')}`;

    return {
      totalEmployees,
      present,
      absent,
      leave,
      avgWorkingHours: formattedAvgHours,
    };
  }, [filteredAttendance]);

  // Date navigation handlers
  const handlePreviousDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    // API call: fetchAttendanceByDate(newDate)
  };

  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    // API call: fetchAttendanceByDate(newDate)
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    // API call: fetchAttendanceByDate(newDate)
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <nav className="text-sm text-gray-500 mb-2">
          <span>Admin</span> <span className="mx-2">/</span>{' '}
          <span className="text-gray-900 font-medium">Attendance Management</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Attendance Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View and monitor employee attendance
        </p>
      </div>

      {/* View Mode Toggle and Date Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'day'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreviousDate}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Previous date"
            >
              <HiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={handleDateChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <button
              onClick={handleNextDate}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Next date"
            >
              <HiChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            <span className="text-sm text-gray-600 hidden md:block">
              {formatDate(selectedDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by employee name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={HiUsers}
          title="Total Employees"
          value={summaryStats.totalEmployees}
          subtitle="registered employees"
          iconColor="blue"
        />
        <SummaryCard
          icon={HiCheckCircle}
          title="Present"
          value={summaryStats.present}
          subtitle={`out of ${summaryStats.totalEmployees}`}
          iconColor="green"
        />
        <SummaryCard
          icon={HiXCircle}
          title="Absent"
          value={summaryStats.absent}
          subtitle={`out of ${summaryStats.totalEmployees}`}
          iconColor="red"
        />
        <SummaryCard
          icon={HiClock}
          title="Avg Working Hours"
          value={summaryStats.avgWorkingHours}
          subtitle="hours per day"
          iconColor="purple"
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Employee Attendance ({filteredAttendance.length})
          </h2>
          <p className="text-sm text-gray-500 mt-1">{formatDate(selectedDate)}</p>
        </div>

        {filteredAttendance.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No attendance records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Working Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Extra Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.checkIn || <span className="text-gray-400">--</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.checkOut || <span className="text-gray-400">--</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.workingHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.extraHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AttendanceStatusBadge status={record.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;

