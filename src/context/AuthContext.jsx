import React, { createContext, useContext, useEffect, useState } from "react";
import { parseEmployeeId } from "../utils/employeeIdGenerator";

/**
 * AuthContext
 * Minimal localStorage-backed auth for prototyping and easy backend integration later
 */
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const USERS_KEY = "users";
const AUTH_USER_KEY = "authUser";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Error parsing stored auth user", err);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
  }, []);

  const persistUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch (err) {
      localStorage.removeItem(USERS_KEY);
      return [];
    }
  };

  const saveAuthUser = (u) => {
    setUser(u);
    if (u) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(AUTH_USER_KEY);
  };

  const validateEmail = (email) =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const passwordStrength = (password) => {
    // At least 8 chars, contains number and letter (special characters allowed)
    return /(?=.*[A-Za-z])(?=.*\d).{8,}/.test(password);
  };

  const signUpAdmin = async ({ firstName, lastName, email, password }) => {
    setIsLoading(true);
    try {
      if (!firstName || !lastName || !email || !password) {
        throw new Error("All fields are required");
      }
      if (!validateEmail(email)) throw new Error("Invalid email");
      if (!passwordStrength(password))
        throw new Error(
          "Password must be at least 8 characters and contain letters and numbers"
        );

      const users = getUsers();
      const existingAdmin = users.find((u) => u.role === "ADMIN");
      if (existingAdmin) {
        throw new Error("An admin already exists. Sign in instead.");
      }

      const newAdmin = {
        id: `user_${Date.now()}`,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        password,
        role: "ADMIN",
        createdAt: new Date().toISOString(),
      };

      const updated = [...users, newAdmin];
      persistUsers(updated);

      // Auto sign in the admin
      saveAuthUser({ ...newAdmin });

      return { success: true, user: newAdmin };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async ({ username, password }) => {
    setIsLoading(true);
    try {
      if (!username || !password)
        throw new Error("Username and password are required");

      const users = getUsers();

      // Try admin/email login first (detect email-like username)
      if (username.includes("@")) {
        const admin = users.find((u) => u.email === username);
        if (admin && admin.password === password) {
          saveAuthUser({ ...admin });
          return { success: true, user: admin };
        }
      }

      // Try employee login by employeeId
      const employeesRaw = localStorage.getItem("employees");
      const employees = employeesRaw ? JSON.parse(employeesRaw) : [];
      const found = employees.find((e) => e.employeeId === username);
      if (found && found.password === password) {
        const employeeUser = {
          id: found.id,
          firstName: found.firstName,
          lastName: found.lastName,
          fullName: found.fullName,
          employeeId: found.employeeId,
          role: "EMPLOYEE",
          email: found.email || null,
          department: found.department,
          jobTitle: found.jobTitle,
          isFirstLogin: found.isFirstLogin,
        };
        saveAuthUser(employeeUser);
        return { success: true, user: employeeUser };
      }

      throw new Error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    saveAuthUser(null);
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error("Not authenticated");
      if (!passwordStrength(newPassword))
        throw new Error(
          "New password must be at least 8 characters and contain letters and numbers"
        );

      if (user.role === "ADMIN") {
        const users = getUsers();
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx === -1) throw new Error("User not found");
        if (users[idx].password !== currentPassword)
          throw new Error("Current password incorrect");
        users[idx].password = newPassword;
        persistUsers(users);
        saveAuthUser({ ...user, password: newPassword });
        return { success: true };
      } else if (user.role === "EMPLOYEE") {
        const employeesRaw = localStorage.getItem("employees");
        const employees = employeesRaw ? JSON.parse(employeesRaw) : [];
        const idx = employees.findIndex((e) => e.id === user.id);
        if (idx === -1) throw new Error("Employee not found");
        if (employees[idx].password !== currentPassword)
          throw new Error("Current password incorrect");
        employees[idx].password = newPassword;
        employees[idx].isFirstLogin = false;
        localStorage.setItem("employees", JSON.stringify(employees));

        saveAuthUser({ ...user });
        return { success: true };
      }

      throw new Error("Unsupported role");
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile fields (Admin or Employee)
  const updateProfile = async (changes) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error("Not authenticated");

      if (user.role === "ADMIN") {
        const users = getUsers();
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx === -1) throw new Error("User not found");
        const updated = {
          ...users[idx],
          ...changes,
          updatedAt: new Date().toISOString(),
        };
        users[idx] = updated;
        persistUsers(users);
        saveAuthUser(updated);
        return { success: true, user: updated };
      } else if (user.role === "EMPLOYEE") {
        const employeesRaw = localStorage.getItem("employees");
        const employees = employeesRaw ? JSON.parse(employeesRaw) : [];
        const idx = employees.findIndex((e) => e.id === user.id);
        if (idx === -1) throw new Error("Employee not found");
        const updated = {
          ...employees[idx],
          ...changes,
          updatedAt: new Date().toISOString(),
        };
        employees[idx] = updated;
        localStorage.setItem("employees", JSON.stringify(employees));
        // Update auth user
        const authUser = { ...user, ...changes };
        saveAuthUser(authUser);
        return { success: true, user: authUser };
      }

      throw new Error("Unsupported role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signUpAdmin,
        signIn,
        signOut,
        changePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
