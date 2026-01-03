import { useState, useMemo } from 'react';
import {
  HiCurrencyDollar,
  HiMinusCircle,
  HiPlusCircle,
  HiCalendar,
} from 'react-icons/hi2';
import PayrollSummaryCard from '../components/payroll/PayrollSummaryCard';
import SalaryBreakdown from '../components/payroll/SalaryBreakdown';
import PayslipDetails from '../components/payroll/PayslipDetails';
import PayslipHistory from '../components/payroll/PayslipHistory';
import MonthNavigation from '../components/attendance/MonthNavigation';

/**
 * Payroll Page
 * Employee payroll/salary details page (READ-ONLY)
 * Shows salary overview, breakdown, payslip details, and history
 */
const Payroll = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Mock employee information - will be replaced with API call
  const employeeInfo = {
    id: 'EMP001',
    name: 'Ethan Antonio',
    designation: 'Senior Developer',
    department: 'Engineering',
  };

  // Mock payroll data - will be replaced with API call: fetchPayroll(employeeId, month, year)
  const payrollData = {
    month: currentMonth + 1,
    year: currentYear,
    grossSalary: 75000,
    totalDeductions: 12500,
    netPay: 62500,
    paymentDate: new Date(currentYear, currentMonth, 5).toISOString(),
    earnings: [
      { label: 'Basic Salary', amount: 50000 },
      { label: 'HRA', amount: 15000 },
      { label: 'Transport Allowance', amount: 5000 },
      { label: 'Medical Allowance', amount: 3000 },
      { label: 'Bonus', amount: 2000 },
    ],
    deductions: [
      { label: 'Provident Fund (PF)', amount: 6000 },
      { label: 'Professional Tax', amount: 200 },
      { label: 'Income Tax (TDS)', amount: 5000 },
      { label: 'Insurance', amount: 1000 },
      { label: 'Other Deductions', amount: 300 },
    ],
  };

  // Mock payslip history - will be replaced with API call: fetchPayslipHistory(employeeId)
  const payslipHistory = [
    {
      month: 12,
      year: 2024,
      grossSalary: 75000,
      deductions: 12500,
      netPay: 62500,
    },
    {
      month: 11,
      year: 2024,
      grossSalary: 75000,
      deductions: 12500,
      netPay: 62500,
    },
    {
      month: 10,
      year: 2024,
      grossSalary: 75000,
      deductions: 12500,
      netPay: 62500,
    },
    {
      month: 9,
      year: 2024,
      grossSalary: 75000,
      deductions: 12500,
      netPay: 62500,
    },
    {
      month: 8,
      year: 2024,
      grossSalary: 75000,
      deductions: 12500,
      netPay: 62500,
    },
    {
      month: 7,
      year: 2024,
      grossSalary: 75000,
      deductions: 12500,
      netPay: 62500,
    },
  ];

  // Format month name for display
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const selectedMonthName = monthNames[currentMonth];

  // Prepare pay period data for PayslipDetails
  const payPeriod = {
    month: selectedMonthName,
    year: currentYear,
    paymentDate: payrollData.paymentDate,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-sm text-gray-500 mb-2">
            <span>Dashboard</span> <span className="mx-2">/</span>{' '}
            <span className="text-gray-900 font-medium">Payroll</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Payroll & Salary Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View your salary details and payslips
          </p>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Payroll Month
            </label>
            <MonthNavigation
              currentMonth={currentMonth}
              currentYear={currentYear}
              onMonthChange={setCurrentMonth}
              onYearChange={setCurrentYear}
            />
          </div>
        </div>
      </div>

      {/* Payroll Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PayrollSummaryCard
          icon={HiCurrencyDollar}
          title="Monthly Gross Salary"
          value={payrollData.grossSalary}
          subtitle="Before deductions"
          iconColor="blue"
        />
        <PayrollSummaryCard
          icon={HiMinusCircle}
          title="Total Deductions"
          value={payrollData.totalDeductions}
          subtitle="Taxes and other deductions"
          iconColor="red"
        />
        <PayrollSummaryCard
          icon={HiPlusCircle}
          title="Net Pay (Take Home)"
          value={payrollData.netPay}
          subtitle="Amount credited to account"
          iconColor="green"
          isNetPay={true}
        />
        <PayrollSummaryCard
          icon={HiCalendar}
          title="Salary Month"
          value={`${selectedMonthName} ${currentYear}`}
          subtitle="Payment period"
          iconColor="purple"
        />
      </div>

      {/* Salary Breakdown */}
      <SalaryBreakdown
        earnings={payrollData.earnings}
        deductions={payrollData.deductions}
      />

      {/* Payslip Details */}
      <PayslipDetails
        employeeInfo={employeeInfo}
        payPeriod={payPeriod}
        netSalary={payrollData.netPay}
      />

      {/* Payslip History */}
      <PayslipHistory payslipHistory={payslipHistory} />
    </div>
  );
};

export default Payroll;
