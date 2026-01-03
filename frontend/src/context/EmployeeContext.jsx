import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { request } from "../api/client";

/**
 * EmployeeContext
 * Manages employee list and operations via backend API
 */
const EmployeeContext = createContext(null);

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployee must be used within EmployeeProvider");
  }
  return context;
};

const normalizeEmployees = (items = []) =>
  items.map((emp) => ({
    id: emp.id || emp.userId || emp._id,
    employeeId: emp.employeeCode || emp.employeeId,
    fullName: emp.name || emp.fullName || "",
    department: emp.department || "",
    jobTitle: emp.jobPosition || emp.jobTitle || "",
    status: emp.status || "Active",
  }));

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await request("/admin/employees");
      const list = data?.employees || [];
      setEmployees(normalizeEmployees(list));
    } catch (err) {
      setError(err.message || "Failed to load employees");
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const createEmployee = async (employeeData) => {
    setIsLoading(true);
    setError("");
    try {
      const payload = {
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone || "",
        role: "EMPLOYEE",
        company: employeeData.companyName,
        department: employeeData.department,
        managerId: employeeData.reportingManager || undefined,
        location: employeeData.location || "Remote",
        jobPosition: employeeData.jobTitle,
        dateOfJoining: employeeData.dateOfJoining,
        monthlyWage: Number(employeeData.baseSalary) || 0,
      };

      const result = await request("/auth/register", {
        method: "POST",
        body: payload,
      });

      await fetchEmployees();

      return result;
    } catch (err) {
      setError(err.message || "Failed to create employee");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployees = () => employees;

  const getEmployeeById = (id) => employees.find((emp) => emp.id === id);

  const updateEmployeeById = async (_id, _changes) => {
    throw new Error("Update employee is not implemented yet");
  };

  const value = {
    employees,
    isLoading,
    error,
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployeeById,
    refresh: fetchEmployees,
  };

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
};
