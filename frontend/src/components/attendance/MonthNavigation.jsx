import { memo } from 'react';
import { HiChevronLeft, HiChevronRight, HiChevronDown } from 'react-icons/hi2';

/**
 * MonthNavigation Component
 * Month selector with arrow navigation and dropdown
 */
const MonthNavigation = ({ currentMonth, currentYear, onMonthChange, onYearChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePreviousMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    onMonthChange(newMonth);
    onYearChange(newYear);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    
    onMonthChange(newMonth);
    onYearChange(newYear);
  };

  const handleMonthSelect = (e) => {
    const selectedMonth = parseInt(e.target.value);
    onMonthChange(selectedMonth);
  };

  const handleYearSelect = (e) => {
    const selectedYear = parseInt(e.target.value);
    onYearChange(selectedYear);
  };

  // Generate year options (current year ± 2 years)
  const currentYearValue = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYearValue - 2; i <= currentYearValue + 2; i++) {
    yearOptions.push(i);
  }

  return (
    <div className="flex items-center gap-3">
      {/* Previous Month Button */}
      <button
        onClick={handlePreviousMonth}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        aria-label="Previous month"
      >
        <HiChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {/* Month Dropdown */}
      <div className="relative">
        <select
          value={currentMonth}
          onChange={handleMonthSelect}
          className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Select month"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
        <HiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>

      {/* Year Dropdown */}
      <div className="relative">
        <select
          value={currentYear}
          onChange={handleYearSelect}
          className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Select year"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <HiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>

      {/* Next Month Button */}
      <button
        onClick={handleNextMonth}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        aria-label="Next month"
      >
        <HiChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default memo(MonthNavigation);

