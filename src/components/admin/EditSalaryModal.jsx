import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import FormInput from '../common/FormInput';

/**
 * EditSalaryModal Component
 * Modal for editing employee salary structure
 * Auto-calculates Gross Salary and Net Pay
 */
const EditSalaryModal = ({ isOpen, onClose, employee, onSave }) => {
  const [salaryData, setSalaryData] = useState({
    basicSalary: 0,
    hra: 0,
    transportAllowance: 0,
    medicalAllowance: 0,
    bonus: 0,
    pf: 0,
    professionalTax: 0,
    incomeTax: 0,
    insurance: 0,
    otherDeductions: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee && employee.salaryStructure) {
      setSalaryData(employee.salaryStructure);
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setSalaryData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const calculateGrossSalary = () => {
    return (
      salaryData.basicSalary +
      salaryData.hra +
      salaryData.transportAllowance +
      salaryData.medicalAllowance +
      salaryData.bonus
    );
  };

  const calculateTotalDeductions = () => {
    return (
      salaryData.pf +
      salaryData.professionalTax +
      salaryData.incomeTax +
      salaryData.insurance +
      salaryData.otherDeductions
    );
  };

  const calculateNetPay = () => {
    return calculateGrossSalary() - calculateTotalDeductions();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = () => {
    // Validation
    const newErrors = {};
    if (salaryData.basicSalary <= 0) {
      newErrors.basicSalary = 'Basic salary must be greater than 0';
    }
    if (calculateNetPay() < 0) {
      newErrors.netPay = 'Net pay cannot be negative';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedSalary = {
      ...salaryData,
      grossSalary: calculateGrossSalary(),
      totalDeductions: calculateTotalDeductions(),
      netPay: calculateNetPay(),
    };

    onSave(employee.id, updatedSalary);
    onClose();
  };

  const handleCancel = () => {
    if (employee && employee.salaryStructure) {
      setSalaryData(employee.salaryStructure);
    }
    setErrors({});
    onClose();
  };

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={`Edit Salary Structure - ${employee.name}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Earnings Section */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-green-500 rounded"></span>
            Earnings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Basic Salary"
              name="basicSalary"
              type="number"
              value={salaryData.basicSalary}
              onChange={handleInputChange}
              error={errors.basicSalary}
              required
              min="0"
              step="100"
            />
            <FormInput
              label="HRA"
              name="hra"
              type="number"
              value={salaryData.hra}
              onChange={handleInputChange}
              min="0"
              step="100"
            />
            <FormInput
              label="Transport Allowance"
              name="transportAllowance"
              type="number"
              value={salaryData.transportAllowance}
              onChange={handleInputChange}
              min="0"
              step="100"
            />
            <FormInput
              label="Medical Allowance"
              name="medicalAllowance"
              type="number"
              value={salaryData.medicalAllowance}
              onChange={handleInputChange}
              min="0"
              step="100"
            />
            <FormInput
              label="Bonus / Incentives"
              name="bonus"
              type="number"
              value={salaryData.bonus}
              onChange={handleInputChange}
              min="0"
              step="100"
            />
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900">Total Earnings</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(calculateGrossSalary())}
              </span>
            </div>
          </div>
        </div>

        {/* Deductions Section */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-red-500 rounded"></span>
            Deductions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Provident Fund (PF)"
              name="pf"
              type="number"
              value={salaryData.pf}
              onChange={handleInputChange}
              min="0"
              step="100"
            />
            <FormInput
              label="Professional Tax"
              name="professionalTax"
              type="number"
              value={salaryData.professionalTax}
              onChange={handleInputChange}
              min="0"
              step="10"
            />
            <FormInput
              label="Income Tax (TDS)"
              name="incomeTax"
              type="number"
              value={salaryData.incomeTax}
              onChange={handleInputChange}
              min="0"
              step="100"
            />
            <FormInput
              label="Insurance"
              name="insurance"
              type="number"
              value={salaryData.insurance}
              onChange={handleInputChange}
              min="0"
              step="100"
            />
            <FormInput
              label="Other Deductions"
              name="otherDeductions"
              type="number"
              value={salaryData.otherDeductions}
              onChange={handleInputChange}
              min="0"
              step="100"
            />
          </div>
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900">Total Deductions</span>
              <span className="text-lg font-bold text-red-600">
                {formatCurrency(calculateTotalDeductions())}
              </span>
            </div>
          </div>
        </div>

        {/* Net Pay Summary */}
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-500">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">Net Pay (Take Home)</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(calculateNetPay())}
            </span>
          </div>
          {errors.netPay && (
            <p className="mt-2 text-sm text-red-600">{errors.netPay}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditSalaryModal;

