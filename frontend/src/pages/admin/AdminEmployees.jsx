import { useState, useEffect } from 'react';
import { HiPlus } from 'react-icons/hi2';
import CreateEmployeeModal from '../../components/admin/CreateEmployeeModal';
import { useEmployee } from '../../context/EmployeeContext';

/**
 * Admin Employees Page
 * Employee management with create employee functionality
 * Shows list of all employees
 */
const AdminEmployees = () => {
  const { employees, createEmployee, isLoading, error } = useEmployee();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateEmployee = async () => {
    // Modal will handle the creation via context
    // Just close the modal after creation
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-sm text-gray-500 mb-2">
            <span>Admin</span> <span className="mx-2">/</span>{' '}
            <span className="text-gray-900 font-medium">Employee Management</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Employee Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage employee accounts
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <HiPlus className="w-5 h-5" />
          <span>Create New Employee</span>
        </button>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Employees List ({employees.length})
          </h2>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        {isLoading ? (
          <div className="px-6 py-8 text-center text-gray-500">Loading employees...</div>
        ) : employees.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 mb-4">No employees created yet</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first employee
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-blue-600">
                      {employee.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.jobTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                        {employee.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Employee Modal */}
      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default AdminEmployees;
