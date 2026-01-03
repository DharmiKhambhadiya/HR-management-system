import { memo, useState, useEffect } from 'react';
import { HiClock } from 'react-icons/hi2';

/**
 * CheckInOut Component
 * Check-in/Check-out buttons with live status
 * Only shows for current day
 */
const CheckInOut = ({ onCheckIn, onCheckOut, attendanceData = {} }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Check if today's date
    const today = new Date();
    const checkInDate = attendanceData.date ? new Date(attendanceData.date) : null;
    setIsToday(
      checkInDate &&
      checkInDate.getDate() === today.getDate() &&
      checkInDate.getMonth() === today.getMonth() &&
      checkInDate.getFullYear() === today.getFullYear()
    );

    return () => clearInterval(timer);
  }, [attendanceData.date]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!isToday) {
    return null;
  }

  const hasCheckedIn = attendanceData.checkIn;
  const hasCheckedOut = attendanceData.checkOut;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HiClock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Today's Attendance</h3>
            <p className="text-sm text-gray-500">
              {formatTime(currentTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasCheckedIn && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Checked In:</span>{' '}
              <span className="text-green-600">{attendanceData.checkIn}</span>
            </div>
          )}

          {hasCheckedOut && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Checked Out:</span>{' '}
              <span className="text-red-600">{attendanceData.checkOut}</span>
            </div>
          )}

          {!hasCheckedIn && (
            <button
              onClick={onCheckIn}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
              Check In
            </button>
          )}

          {hasCheckedIn && !hasCheckedOut && (
            <button
              onClick={onCheckOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
            >
              Check Out
            </button>
          )}

          {hasCheckedIn && hasCheckedOut && (
            <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium">
              Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CheckInOut);

