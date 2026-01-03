import { useState, useMemo } from 'react';
import { HiMagnifyingGlass, HiPencil, HiEye, HiCheckCircle } from 'react-icons/hi2';
import EditSalaryModal from '../../components/admin/EditSalaryModal';

/**
 * Admin Payroll Management Page
 * Admin can view and update payroll details of all employees
 */
const AdminPayroll = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  // Mock payroll data - will be replaced with API call
  const [payrollData, setPayrollData] = useState([
    {
      id: 1,
      employeeName: 'Ethan Antonio',
      employeeId: 'EMP001',
      designation: 'Senior Developer',
      department: 'Engineering',
      grossSalary: 75000,
      totalDeductions: 12500,
      netSalary: 62500,
      salaryMonth: currentMonth,
      verificationStatus: 'Verified',
      salaryStructure: {
        basicSalary: 50000,
        hra: 15000,
        transportAllowance: 5000,
        medicalAllowance: 3000,
        bonus: 2000,
        pf: 6000,
        professionalTax: 200,
        incomeTax: 5000,
        insurance: 1000,
        otherDeductions: 300,
      },
    },
    {
      id: 2,
      employeeName: 'Louis B. Kimble',
      employeeId: 'EMP002',
      designation: 'Hardware Engineer',
      department: 'Hardware',
      grossSalary: 70000,
      totalDeductions: 11500,
      netSalary: 58500,
      salaryMonth: currentMonth,
      verificationStatus: 'Pending',
      salaryStructure: {
        basicSalary: 48000,
        hra: 14000,
        transportAllowance: 5000,
        medicalAllowance: 3000,
        bonus: 0,
        pf: 5760,
        professionalTax: 200,
        incomeTax: 4500,
        insurance: 1000,
        otherDeductions: 40,
      },
    },
    {
      id: 3,
      employeeName: 'Calvin C. Landry',
      employeeId: 'EMP003',
      designation: 'Software Developer',
      department: 'Engineering',
      grossSalary: 65000,
      totalDeductions: 10500,
      netSalary: 54500,
      salaryMonth: currentMonth,
      verificationStatus: 'Verified',
      salaryStructure: {
        basicSalary: 45000,
        hra: 13000,
        transportAllowance: 4000,
        medicalAllowance: 3000,
        bonus: 0,
        pf: 5400,
        professionalTax: 200,
        incomeTax: 4000,
        insurance: 800,
        otherDeductions: 100,
      },
    },
    {
      id: 4,
      employeeName: 'Mabel L. Lee',
      employeeId: 'EMP004',
      designation: 'Marketing Manager',
      department: 'Marketing',
      grossSalary: 80000,
      totalDeductions: 13500,
      netSalary: 66500,
      salaryMonth: currentMonth,
      verificationStatus: 'Pending',
      salaryStructure: {
        basicSalary: 55000,
        hra: 16000,
        transportAllowance: 5000,
        medicalAllowance: 4000,
        bonus: 0,
        pf: 6600,
        professionalTax: 200,
        incomeTax: 5500,
        insurance: 1000,
        otherDeductions: 200,
      },
    },
  ]);

  // Filter payroll data
  const filteredPayroll = useMemo(() => {
    return payrollData.filter((employee) => {
      const matchesSearch =
        employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMonth = !monthFilter || employee.salaryMonth === monthFilter;
      const matchesDepartment =
        !departmentFilter || employee.department === departmentFilter;

      return matchesSearch && matchesMonth && matchesDepartment;
    });
  }, [payrollData, searchQuery, monthFilter, departmentFilter]);

  // Get unique departments for filter
  const departments = useMemo(() => {
    const deptSet = new Set(payrollData.map((emp) => emp.department));
    return Array.from(deptSet);
  }, [payrollData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonth = (monthString) => {
    if (!monthString) return '--';
    const [year, month] = monthString.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const handleEditSalary = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleSaveSalary = (employeeId, updatedSalary) => {
    // API call: await updateSalaryStructure(employeeId, updatedSalary)
    setPayrollData((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              grossSalary: updatedSalary.grossSalary,
              totalDeductions: updatedSalary.totalDeductions,
              netSalary: updatedSalary.netPay,
              salaryStructure: {
                basicSalary: updatedSalary.basicSalary,
                hra: updatedSalary.hra,
                transportAllowance: updatedSalary.transportAllowance,
                medicalAllowance: updatedSalary.medicalAllowance,
                bonus: updatedSalary.bonus,
                pf: updatedSalary.pf,
                professionalTax: updatedSalary.professionalTax,
                incomeTax: updatedSalary.incomeTax,
                insurance: updatedSalary.insurance,
                otherDeductions: updatedSalary.otherDeductions,
              },
            }
          : emp
      )
    );
  };

  const handleViewPayslip = (employeeId) => {
    // API call: await fetchPayslipPDF(employeeId, month)
    console.log('View payslip for employee:', employeeId);
  };

  const handleVerifyPayroll = (employeeId) => {
    // API call: await verifyPayroll(employeeId)
    setPayrollData((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? { ...emp, verificationStatus: 'Verified' }
          : emp
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <nav className="text-sm text-gray-500 mb-2">
          <span>Admin</span> <span className="mx-2">/</span>{' '}
          <span className="text-gray-900 font-medium">Payroll Management</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Payroll Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage employee payroll details
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Month Filter */}
          <input
            type="month"
            value={monthFilter || currentMonth}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Employee Payroll ({filteredPayroll.length})
          </h2>
        </div>

        {filteredPayroll.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No payroll records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayroll.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(employee.grossSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      {formatCurrency(employee.totalDeductions)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                      {formatCurrency(employee.netSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatMonth(employee.salaryMonth)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          employee.verificationStatus === 'Verified'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        {employee.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSalary(employee)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Salary Structure"
                          aria-label="Edit salary structure"
                        >
                          <HiPencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleViewPayslip(employee.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View Payslip"
                          aria-label="View payslip"
                        >
                          <HiEye className="w-5 h-5" />
                        </button>
                        {employee.verificationStatus === 'Pending' && (
                          <button
                            onClick={() => handleVerifyPayroll(employee.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Mark as Verified"
                            aria-label="Verify payroll"
                          >
                            <HiCheckCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Salary Modal */}
      <EditSalaryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onSave={handleSaveSalary}
      />
    </div>
  );
};

export default AdminPayroll;
