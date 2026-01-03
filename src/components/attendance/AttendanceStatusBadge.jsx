import { memo } from 'react';

/**
 * AttendanceStatusBadge Component
 * Displays attendance status with color-coded badges
 * Statuses: Present (Green), Leave (Yellow), Absent (Red), Half-day (Orange)
 */
const AttendanceStatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    switch (statusLower) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'leave':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'half-day':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(status)}`}
    >
      {status || 'Unknown'}
    </span>
  );
};

export default memo(AttendanceStatusBadge);

