import { useState } from 'react';
import { HiPlus, HiCloudArrowUp, HiCheckCircle, HiXCircle, HiClock } from 'react-icons/hi2';
import FormInput from '../components/common/FormInput';
import FormSelect from '../components/common/FormSelect';
import FormTextarea from '../components/common/FormTextarea';
import StatusBadge from '../components/common/StatusBadge';
import SummaryCard from '../components/attendance/SummaryCard';
import Modal from '../components/common/Modal';

/**
 * Time Off Page
 * Shows leave balance summary and time off list
 * Includes "Request Time Off" button with modal form
 */
const TimeOff = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: 'Ethan Antonio', // Auto-filled, read-only
    timeOffType: '',
    startDate: '',
    endDate: '',
    reason: '', // Mandatory field
    certificate: null,
  });
  const [errors, setErrors] = useState({});

  // Mock leave balance data - will be replaced with API call
  const leaveBalance = {
    totalPaidLeaves: 15,
    usedPaidLeaves: 5,
    remainingPaidLeaves: 10,
    totalSickLeaves: 10,
    usedSickLeaves: 2,
    remainingSickLeaves: 8,
  };

  // Mock time off list data - will be replaced with API call
  const [timeOffList, setTimeOffList] = useState([
    {
      id: 1,
      employeeName: 'Ethan Antonio',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      timeOffType: 'Paid Leave',
      status: 'Pending',
    },
    {
      id: 2,
      employeeName: 'Ethan Antonio',
      startDate: '2024-01-20',
      endDate: '2024-01-20',
      timeOffType: 'Sick Leave',
      status: 'Approved',
    },
    {
      id: 3,
      employeeName: 'Ethan Antonio',
      startDate: '2024-02-10',
      endDate: '2024-02-12',
      timeOffType: 'Paid Leave',
      status: 'Approved',
    },
  ]);

  const timeOffTypeOptions = [
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        certificate: file,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.timeOffType) {
      newErrors.timeOffType = 'Please select a time off type';
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

    // Create new time off request
    const newRequest = {
      id: timeOffList.length + 1,
      employeeName: formData.employeeName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      timeOffType:
        timeOffTypeOptions.find((opt) => opt.value === formData.timeOffType)
          ?.label || formData.timeOffType,
      reason: formData.reason,
      status: 'Pending',
    };

    // Add to time off list (will be replaced with API call)
    setTimeOffList((prev) => [newRequest, ...prev]);

    // Reset form
    setFormData({
      employeeName: 'Ethan Antonio',
      timeOffType: '',
      startDate: '',
      endDate: '',
      reason: '',
      certificate: null,
    });
    setErrors({});
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      employeeName: 'Ethan Antonio',
      timeOffType: '',
      startDate: '',
      endDate: '',
      reason: '',
      certificate: null,
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
            <span className="text-gray-900 font-medium">Time Off</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Time Off Management
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <HiPlus className="w-5 h-5" />
          <span>Request Time Off</span>
        </button>
      </div>

      {/* Leave Balance Summary - Enhanced with Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          icon={HiCheckCircle}
          title="Paid Leave Balance"
          value={leaveBalance.remainingPaidLeaves}
          subtitle={`${leaveBalance.usedPaidLeaves} used of ${leaveBalance.totalPaidLeaves} total`}
          iconColor="green"
        />
        <SummaryCard
          icon={HiClock}
          title="Sick Leave Balance"
          value={leaveBalance.remainingSickLeaves}
          subtitle={`${leaveBalance.usedSickLeaves} used of ${leaveBalance.totalSickLeaves} total`}
          iconColor="yellow"
        />
        <SummaryCard
          icon={HiXCircle}
          title="Unpaid Leave"
          value="Unlimited"
          subtitle="Available on request"
          iconColor="orange"
        />
      </div>

      {/* Time Off List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Time Off List</h2>
        </div>

        {timeOffList.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No time off requests yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Request your first time off
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Off Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeOffList.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(request.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(request.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {request.timeOffType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Time Off Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="Request Time Off"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Employee Name"
            name="employeeName"
            value={formData.employeeName}
            disabled
            placeholder="Employee name"
          />

          <FormSelect
            label="Time Off Type"
            name="timeOffType"
            value={formData.timeOffType}
            onChange={handleInputChange}
            options={timeOffTypeOptions}
            error={errors.timeOffType}
            required
            placeholder="Select time off type"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Validity Period
            </label>
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Certificate (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <HiCloudArrowUp className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="certificate-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="certificate-upload"
                      name="certificate"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, JPG, PNG up to 10MB
                </p>
                {formData.certificate && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {formData.certificate.name}
                  </p>
                )}
              </div>
            </div>
          </div>

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
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TimeOff;

