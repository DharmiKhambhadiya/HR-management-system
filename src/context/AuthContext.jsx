import React from "react";

/**
 * Simplified/no-op AuthContext
 * Authentication has been removed; provide safe no-op functions
 */
export const useAuth = () => ({
  user: null,
  isAuthenticated: true,
  isLoading: false,
  signUpAdmin: async () => ({ success: true }),
  signIn: async () => ({ success: true }),
  signOut: () => {},
  changePassword: async () => ({ success: true }),
});

export const AuthProvider = ({ children }) => children;
