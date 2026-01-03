import { memo } from 'react';

/**
 * StatusBadge Component
 * Displays status with color-coded badges
 * Statuses: Pending (Yellow), Approved (Green), Rejected (Red)
 */
const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    switch (statusLower) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
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

export default memo(StatusBadge);

