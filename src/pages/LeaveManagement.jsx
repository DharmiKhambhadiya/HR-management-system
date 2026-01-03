import { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
import FormInput from '../components/common/FormInput';
import FormSelect from '../components/common/FormSelect';
import FormTextarea from '../components/common/FormTextarea';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';

/**
 * Leave Management Page
 * Employee can apply for leave and view leave request status
 */
const LeaveManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});

  // Mock leave requests data - will be replaced with API call
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      leaveType: 'Paid Leave',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      reason: 'Family vacation',
      status: 'Pending',
      appliedDate: '2024-01-10',
    },
    {
      id: 2,
      leaveType: 'Sick Leave',
      startDate: '2024-01-20',
      endDate: '2024-01-20',
      reason: 'Medical appointment',
      status: 'Approved',
      appliedDate: '2024-01-18',
    },
  ]);

  const leaveTypeOptions = [
    { value: 'paid', label: 'Paid Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.leaveType) {
      newErrors.leaveType = 'Please select a leave type';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Please select a start date';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Please select an end date';
    }

    if (!formData.reason || formData.reason.trim() === '') {
      newErrors.reason = 'Please provide a reason for leave';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create new leave request
    const newRequest = {
      id: leaveRequests.length + 1,
      leaveType: leaveTypeOptions.find((opt) => opt.value === formData.leaveType)
        ?.label || formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason || 'N/A',
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };

    // Add to leave requests (will be replaced with API call)
    setLeaveRequests((prev) => [newRequest, ...prev]);

    // Reset form
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
    });
    setErrors({});
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
    });
    setErrors({});
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-sm text-gray-500 mb-2">
            <span>Dashboard</span> <span className="mx-2">/</span>{' '}
            <span className="text-gray-900 font-medium">Leave Management</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Leave Management
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <HiPlus className="w-5 h-5" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            My Leave Requests
          </h2>
        </div>

        {leaveRequests.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No leave requests yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Apply for your first leave
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.leaveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(request.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(request.endDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(request.appliedDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="Apply for Leave"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <FormSelect
            label="Leave Type"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleInputChange}
            options={leaveTypeOptions}
            error={errors.leaveType}
            required
            placeholder="Select leave type"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              error={errors.startDate}
              required
            />

            <FormInput
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              error={errors.endDate}
              required
              min={formData.startDate || undefined}
            />
          </div>

          <FormTextarea
            label="Reason for Leave"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            error={errors.reason}
            required
            placeholder="Please provide a detailed reason for your leave request..."
            rows={4}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeaveManagement;

