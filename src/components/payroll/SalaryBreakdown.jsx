import { memo } from 'react';
import { HiArrowDownCircle, HiArrowUpCircle } from 'react-icons/hi2';

/**
 * SalaryBreakdown Component
 * Two-column layout showing earnings and deductions
 */
const SalaryBreakdown = ({ earnings = [], deductions = [] }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const totalEarnings = calculateTotal(earnings);
  const totalDeductions = calculateTotal(deductions);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Salary Breakdown</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <HiArrowUpCircle className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="text-base font-semibold text-gray-900">Earnings</h4>
          </div>
          
          <div className="space-y-3">
            {earnings.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-medium text-green-600">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
            
            <div className="pt-3 mt-3 border-t-2 border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">Total Earnings</span>
                <span className="text-base font-bold text-green-600">
                  {formatCurrency(totalEarnings)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Deductions Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <HiArrowDownCircle className="w-5 h-5 text-red-600" />
            </div>
            <h4 className="text-base font-semibold text-gray-900">Deductions</h4>
          </div>
          
          <div className="space-y-3">
            {deductions.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-medium text-red-600">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
            
            <div className="pt-3 mt-3 border-t-2 border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">Total Deductions</span>
                <span className="text-base font-bold text-red-600">
                  {formatCurrency(totalDeductions)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SalaryBreakdown);

