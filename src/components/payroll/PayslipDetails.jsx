import { memo } from 'react';
import { HiDocumentArrowDown, HiEye } from 'react-icons/hi2';

/**
 * PayslipDetails Component
 * Displays employee payslip information with download/view actions
 */
const PayslipDetails = ({ employeeInfo = {}, payPeriod = {}, netSalary = 0 }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Mock function - will be replaced with API call
  const handleViewPayslip = () => {
    console.log('View payslip for:', payPeriod.month, payPeriod.year);
    // API call: fetchPayslipPDF(employeeInfo.id, payPeriod.month, payPeriod.year, 'view')
  };

  // Mock function - will be replaced with API call
  const handleDownloadPayslip = () => {
    console.log('Download payslip for:', payPeriod.month, payPeriod.year);
    // API call: fetchPayslipPDF(employeeInfo.id, payPeriod.month, payPeriod.year, 'download')
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Payslip Details</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleViewPayslip}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            <HiEye className="w-4 h-4" />
            View Payslip
          </button>
          <button
            onClick={handleDownloadPayslip}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <HiDocumentArrowDown className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Employee Information
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Employee Name</span>
              <span className="text-sm font-medium text-gray-900">
                {employeeInfo.name || '--'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Employee ID</span>
              <span className="text-sm font-medium text-gray-900">
                {employeeInfo.id || '--'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Designation</span>
              <span className="text-sm font-medium text-gray-900">
                {employeeInfo.designation || '--'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Department</span>
              <span className="text-sm font-medium text-gray-900">
                {employeeInfo.department || '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Payment Information
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Pay Period</span>
              <span className="text-sm font-medium text-gray-900">
                {payPeriod.month && payPeriod.year
                  ? `${payPeriod.month} ${payPeriod.year}`
                  : '--'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Payment Date</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(payPeriod.paymentDate)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Pay Cycle</span>
              <span className="text-sm font-medium text-gray-900">Monthly</span>
            </div>
            <div className="flex justify-between py-2 pt-4 mt-2 border-t-2 border-gray-200">
              <span className="text-base font-semibold text-gray-900">Net Salary</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(netSalary)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PayslipDetails);

