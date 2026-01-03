import { memo } from 'react';

/**
 * FormSelect Component
 * Reusable select dropdown with label and error message
 */
const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default memo(FormSelect);

