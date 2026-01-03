import { memo } from 'react';

/**
 * PayrollSummaryCard Component
 * Displays payroll summary with currency formatting
 */
const PayrollSummaryCard = ({ icon: Icon, title, value, subtitle, iconColor = 'blue', isNetPay = false }) => {
  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${isNetPay ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${isNetPay ? 'text-blue-600' : 'text-gray-900'}`}>
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColorClasses[iconColor]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default memo(PayrollSummaryCard);

