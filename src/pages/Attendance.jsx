import { useState, useEffect, useMemo } from 'react';
import {
  HiCheckCircle,
  HiCalendar,
  HiClock,
  HiXCircle,
} from 'react-icons/hi2';
import SummaryCard from '../components/attendance/SummaryCard';
import MonthNavigation from '../components/attendance/MonthNavigation';
import AttendanceStatusBadge from '../components/attendance/AttendanceStatusBadge';
import CheckInOut from '../components/attendance/CheckInOut';

/**
 * Attendance Page
 * Employee attendance management with monthly view
 * Shows summary cards, attendance table, and check-in/out functionality
 */
const Attendance = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Mock attendance data - will be replaced with API call
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      date: '2024-01-15',
      checkIn: '10:00 AM',
      checkOut: '07:00 PM',
      workingHours: '09:00',
      extraHours: '01:00',
      status: 'Present',
    },
    {
      id: 2,
      date: '2024-01-16',
      checkIn: '10:00 AM',
      checkOut: '07:00 PM',
      workingHours: '09:00',
      extraHours: '01:00',
      status: 'Present',
    },
    {
      id: 3,
      date: '2024-01-17',
      checkIn: null,
      checkOut: null,
      workingHours: '00:00',
      extraHours: '00:00',
      status: 'Absent',
    },
    {
      id: 4,
      date: '2024-01-18',
      checkIn: '10:00 AM',
      checkOut: '02:00 PM',
      workingHours: '04:00',
      extraHours: '00:00',
      status: 'Half-day',
    },
    {
      id: 5,
      date: '2024-01-19',
      checkIn: null,
      checkOut: null,
      workingHours: '00:00',
      extraHours: '00:00',
      status: 'Leave',
    },
    {
      id: 6,
      date: today.toISOString().split('T')[0], // Today's date
      checkIn: null,
      checkOut: null,
      workingHours: '00:00',
      extraHours: '00:00',
      status: null,
    },
  ]);

  // Get current date attendance record
  const todayAttendance = useMemo(() => {
    const todayStr = today.toISOString().split('T')[0];
    return attendanceData.find((record) => record.date === todayStr) || {
      date: todayStr,
      checkIn: null,
      checkOut: null,
    };
  }, [attendanceData]);

  // Calculate summary statistics for selected month
  const summaryStats = useMemo(() => {
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    const monthRecords = attendanceData.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= monthStart && recordDate <= monthEnd;
    });

    const daysPresent = monthRecords.filter(
      (r) => r.status?.toLowerCase() === 'present'
    ).length;
    const leavesCount = monthRecords.filter(
      (r) => r.status?.toLowerCase() === 'leave'
    ).length;
    const totalWorkingDays = monthEnd.getDate();
    
    // Calculate total work hours
    const totalHours = monthRecords.reduce((total, record) => {
      if (record.workingHours) {
        const [hours, minutes] = record.workingHours.split(':').map(Number);
        return total + hours + minutes / 60;
      }
      return total;
    }, 0);

    const formattedTotalHours = `${Math.floor(totalHours)}:${String(Math.round((totalHours % 1) * 60)).padStart(2, '0')}`;

    return {
      daysPresent,
      leavesCount,
      totalWorkingDays,
      totalWorkHours: formattedTotalHours,
    };
  }, [attendanceData, currentMonth, currentYear]);

  // Get filtered attendance records for selected month
  const filteredAttendance = useMemo(() => {
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    return attendanceData
      .filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= monthStart && recordDate <= monthEnd;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [attendanceData, currentMonth, currentYear]);

  // Handle check-in
  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const todayStr = today.toISOString().split('T')[0];
    const existingRecord = attendanceData.find((r) => r.date === todayStr);

    if (existingRecord) {
      setAttendanceData((prev) =>
        prev.map((record) =>
          record.date === todayStr
            ? { ...record, checkIn: timeString, status: 'Present' }
            : record
        )
      );
    } else {
      setAttendanceData((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          date: todayStr,
          checkIn: timeString,
          checkOut: null,
          workingHours: '00:00',
          extraHours: '00:00',
          status: 'Present',
        },
      ]);
    }
  };

  // Handle check-out
  const handleCheckOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const todayStr = today.toISOString().split('T')[0];
    
    setAttendanceData((prev) =>
      prev.map((record) => {
        if (record.date === todayStr && record.checkIn) {
          // Calculate working hours
          const checkInTime = new Date(`2000-01-01 ${record.checkIn}`);
          const checkOutTime = new Date(`2000-01-01 ${timeString}`);
          const diffMs = checkOutTime - checkInTime;
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          
          const workingHours = `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}`;
          
          // Calculate extra hours (assuming 8 hours is standard)
          const standardHours = 8;
          const extraHours = diffHours > standardHours 
            ? `${String(diffHours - standardHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}`
            : '00:00';

          return {
            ...record,
            checkOut: timeString,
            workingHours,
            extraHours,
          };
        }
        return record;
      })
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-sm text-gray-500 mb-2">
            <span>Dashboard</span> <span className="mx-2">/</span>{' '}
            <span className="text-gray-900 font-medium">Attendance</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Attendance
          </h1>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <MonthNavigation
          currentMonth={currentMonth}
          currentYear={currentYear}
          onMonthChange={setCurrentMonth}
          onYearChange={setCurrentYear}
        />
      </div>

      {/* Check-In/Check-Out Section */}
      <CheckInOut
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        attendanceData={todayAttendance}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={HiCheckCircle}
          title="Days Present"
          value={summaryStats.daysPresent}
          subtitle={`out of ${summaryStats.totalWorkingDays} days`}
          iconColor="green"
        />
        <SummaryCard
          icon={HiXCircle}
          title="Leaves Count"
          value={summaryStats.leavesCount}
          subtitle="days"
          iconColor="yellow"
        />
        <SummaryCard
          icon={HiCalendar}
          title="Total Working Days"
          value={summaryStats.totalWorkingDays}
          subtitle="days this month"
          iconColor="blue"
        />
        <SummaryCard
          icon={HiClock}
          title="Total Work Hours"
          value={summaryStats.totalWorkHours}
          subtitle="hours this month"
          iconColor="purple"
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Attendance Records
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {formatDateHeader(
              new Date(currentYear, currentMonth, 1).toISOString()
            )}
          </p>
        </div>

        {filteredAttendance.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No attendance records for this month</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.checkIn || (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.checkOut || (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.workingHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.extraHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.status ? (
                        <AttendanceStatusBadge status={record.status} />
                      ) : (
                        <span className="text-gray-400 text-sm">--</span>
                      )}
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

export default Attendance;
