import { useState, useEffect } from "react";
import { HiClipboard, HiCheckCircle } from "react-icons/hi2";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import { generateEmployeeId } from "../../utils/employeeIdGenerator";
import { useEmployee } from "../../context/EmployeeContext";

/**
 * CreateEmployeeModal Component
 * Admin creates new employee with automatic Employee ID generation
 */
const CreateEmployeeModal = ({ isOpen, onClose }) => {
  const { createEmployee } = useEmployee();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    dateOfJoining: "",
    jobTitle: "",
    department: "",
    reportingManager: "",
    baseSalary: "",
  });
  const [errors, setErrors] = useState({});
  const [generatedEmployeeId, setGeneratedEmployeeId] = useState("");
  const [isEmployeeCreated, setIsEmployeeCreated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: "",
        lastName: "",
        companyName: "",
        dateOfJoining: "",
        jobTitle: "",
        department: "",
        reportingManager: "",
        baseSalary: "",
      });
      setErrors({});
      setGeneratedEmployeeId("");
      setIsEmployeeCreated(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = "Date of joining is required";
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (formData.baseSalary && isNaN(formData.baseSalary)) {
      newErrors.baseSalary = "Base salary must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateEmployeeId = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.companyName ||
      !formData.dateOfJoining
    ) {
      setErrors({
        generate:
          "Please fill in First Name, Last Name, Company Name, and Date of Joining first",
      });
      return;
    }

    const joiningDate = new Date(formData.dateOfJoining);
    const year = joiningDate.getFullYear();

    // Get next serial number (in real app, this would come from API/database)
    // For now, use existing employees count + 1
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");
    const yearEmployees = employees.filter(
      (emp) => new Date(emp.dateOfJoining).getFullYear() === year
    );
    const serialNumber = yearEmployees.length + 1;

    const employeeId = generateEmployeeId(
      formData.companyName,
      formData.firstName,
      formData.lastName,
      year,
      serialNumber
    );

    // Password rule: Employee ID is the password
    setGeneratedEmployeeId(employeeId);
    setErrors({});
  };
  const handleCopyEmployeeId = () => {
    navigator.clipboard.writeText(generatedEmployeeId);
    // Show success message (you can add a toast notification here)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!generatedEmployeeId) {
      setErrors({ submit: "Please generate Employee ID first" });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createEmployee({
        ...formData,
        employeeId: generatedEmployeeId,
        password: generatedEmployeeId, // Employee ID will be used as password per rules
      });

      setIsEmployeeCreated(true);

      // Auto-close after 6 seconds to allow admin to copy credentials
      setTimeout(() => {
        onClose();
        setIsEmployeeCreated(false);
      }, 6000);
    } catch (error) {
      setErrors({
        submit: error.message || "Error creating employee. Please try again.",
      });
      console.error("Create employee error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const departmentOptions = [
    { value: "Engineering", label: "Engineering" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
    { value: "HR", label: "HR" },
    { value: "Finance", label: "Finance" },
    { value: "Operations", label: "Operations" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Employee"
      size="lg"
    >
      {isEmployeeCreated ? (
        <div className="text-center py-8">
          <HiCheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Employee Created Successfully!
          </h3>
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Employee ID (Username)
              </p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-lg font-mono font-bold text-blue-600 bg-white px-4 py-2 rounded border border-blue-300">
                  {generatedEmployeeId}
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(generatedEmployeeId)
                  }
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Copy Employee ID"
                >
                  <HiClipboard className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-lg font-mono font-bold text-green-600 bg-white px-4 py-2 rounded border border-green-300">
                  {generatedEmployeeId}
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(generatedEmployeeId)
                  }
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  title="Copy Password"
                >
                  <HiClipboard className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Share these credentials securely with the employee. They must
              change the password on first login.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded"></span>
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  required
                  placeholder="Enter first name"
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  required
                  placeholder="Enter last name"
                />
                <FormInput
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  error={errors.companyName}
                  required
                  placeholder="Enter company name"
                />
                <FormInput
                  label="Date of Joining"
                  name="dateOfJoining"
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={handleInputChange}
                  error={errors.dateOfJoining}
                  required
                />
              </div>
            </div>

            {/* Job Details Section */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-500 rounded"></span>
                Job Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  error={errors.jobTitle}
                  required
                  placeholder="Enter job title"
                />
                <FormSelect
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  options={departmentOptions}
                  error={errors.department}
                  required
                  placeholder="Select department"
                />
                <FormInput
                  label="Reporting Manager"
                  name="reportingManager"
                  value={formData.reportingManager}
                  onChange={handleInputChange}
                  placeholder="Enter reporting manager name"
                />
              </div>
            </div>

            {/* Salary Structure Section */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded"></span>
                Salary Structure
              </h4>
              <FormInput
                label="Base Salary"
                name="baseSalary"
                type="number"
                value={formData.baseSalary}
                onChange={handleInputChange}
                error={errors.baseSalary}
                placeholder="Enter base salary"
                min="0"
                step="1000"
              />
            </div>

            {/* Employee ID and Password Generation */}
            {generatedEmployeeId && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Generated Employee ID
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-lg font-mono font-bold text-blue-600 bg-white px-4 py-2 rounded border border-blue-300">
                      {generatedEmployeeId}
                    </code>
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(generatedEmployeeId)
                      }
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Copy Employee ID"
                    >
                      <HiClipboard className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Employee will use this as Username for login
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Password (same as Employee ID)
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-lg font-mono font-bold text-green-600 bg-white px-4 py-2 rounded border border-green-300">
                      {generatedEmployeeId}
                    </code>
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(generatedEmployeeId)
                      }
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Copy Password"
                    >
                      <HiClipboard className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Employee must change this password on first login
                  </p>
                </div>
              </div>
            )}

            {/* Errors */}
            {errors.generate && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.generate}</p>
              </div>
            )}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleGenerateEmployeeId}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Generate Employee ID
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!generatedEmployeeId || isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Employee"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CreateEmployeeModal;
