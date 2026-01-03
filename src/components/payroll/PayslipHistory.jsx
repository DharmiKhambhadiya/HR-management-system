import { memo } from 'react';
import { HiDocumentArrowDown, HiEye } from 'react-icons/hi2';

/**
 * PayslipHistory Component
 * Monthly payroll history table with view/download actions
 */
const PayslipHistory = ({ payslipHistory = [] }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonthYear = (month, year) => {
    if (!month || !year) return '--';
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Mock functions - will be replaced with API calls
  const handleViewPayslip = (month, year) => {
    console.log('View payslip for:', month, year);
    // API call: fetchPayslipPDF(employeeId, month, year, 'view')
  };

  const handleDownloadPayslip = (month, year) => {
    console.log('Download payslip for:', month, year);
    // API call: fetchPayslipPDF(employeeId, month, year, 'download')
  };

  if (payslipHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payslip History</h3>
        <div className="text-center py-12">
          <p className="text-gray-500">No payslip history available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Payslip History</h3>
        <p className="text-sm text-gray-500 mt-1">
          View or download your previous payslips
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Month
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gross Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deductions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Pay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payslipHistory.map((payslip, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatMonthYear(payslip.month, payslip.year)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatCurrency(payslip.grossSalary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  {formatCurrency(payslip.deductions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  {formatCurrency(payslip.netPay)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewPayslip(payslip.month, payslip.year)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Payslip"
                      aria-label={`View payslip for ${formatMonthYear(payslip.month, payslip.year)}`}
                    >
                      <HiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadPayslip(payslip.month, payslip.year)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download Payslip"
                      aria-label={`Download payslip for ${formatMonthYear(payslip.month, payslip.year)}`}
                    >
                      <HiDocumentArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(PayslipHistory);

