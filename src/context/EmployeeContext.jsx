import { createContext, useContext, useState, useEffect } from 'react';

/**
 * EmployeeContext
 * Manages employee list and operations
 */
const EmployeeContext = createContext(null);

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within EmployeeProvider');
  }
  return context;
};

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);

  // Load employees from localStorage on mount
  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      try {
        setEmployees(JSON.parse(storedEmployees));
      } catch (error) {
        console.error('Error parsing stored employees:', error);
        localStorage.removeItem('employees');
      }
    }
  }, []);

  // Create new employee
  const createEmployee = async (employeeData) => {
    try {
      // Generate password (8 random alphanumeric characters)
      const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
      };

      const password = employeeData.password || generatePassword();

      const newEmployee = {
        id: `emp_${Date.now()}`,
        employeeId: employeeData.employeeId,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        fullName: `${employeeData.firstName} ${employeeData.lastName}`,
        companyName: employeeData.companyName,
        dateOfJoining: employeeData.dateOfJoining,
        jobTitle: employeeData.jobTitle,
        department: employeeData.department,
        reportingManager: employeeData.reportingManager || '',
        baseSalary: employeeData.baseSalary || 0,
        password: password,
        isFirstLogin: true,
        status: 'Active',
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage (in real app, this would be API call)
      const updatedEmployees = [...employees, newEmployee];
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      setEmployees(updatedEmployees);

      return {
        success: true,
        employee: newEmployee,
        password: password, // Return password for display
      };
    } catch (error) {
      throw new Error('Failed to create employee');
    }
  };

  // Get all employees
  const getEmployees = () => {
    return employees;
  };

  // Get employee by ID
  const getEmployeeById = (id) => {
    return employees.find((emp) => emp.id === id);
  };

  const value = {
    employees,
    createEmployee,
    getEmployees,
    getEmployeeById,
  };

  return (
    <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>
  );
};

