import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { request, setTokens, clearTokens, getTokens } from "../api/client";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const refreshUser = useCallback(async () => {
    const tokens = getTokens();
    if (!tokens.accessToken) {
      setUser(null);
      setIsReady(true);
      return;
    }

    setIsLoading(true);
    try {
      const data = await request("/auth/me");
      setUser(data);
    } catch (err) {
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signUpAdmin = async ({ firstName, lastName, email, password }) => {
    setIsLoading(true);
    try {
      const data = await request("/auth/bootstrap-admin", {
        method: "POST",
        body: { firstName, lastName, email, password },
        auth: false,
      });

      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setUser(data.user);

      return { success: true, user: data.user };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async ({ username, password }) => {
    setIsLoading(true);
    try {
      const data = await request("/auth/login", {
        method: "POST",
        body: { identifier: username, password },
        auth: false,
      });

      if (data.requiresOTP) {
        throw new Error(
          "OTP flow is disabled in this build. Please contact admin to enable direct login."
        );
      }

      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setUser(data.user);

      return { success: true, user: data.user };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    clearTokens();
    setUser(null);
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    if (!user) throw new Error("Not authenticated");

    await request("/auth/change-password", {
      method: "PUT",
      body: {
        oldPassword: currentPassword,
        newPassword,
        confirmPassword: newPassword,
      },
    });

    return { success: true };
  };

  const updateProfile = async (changes) => {
    if (!user) throw new Error("Not authenticated");

    const data = await request(`/profile/${user.id}`, {
      method: "PUT",
      body: changes,
    });

    const nextUser = {
      ...user,
      name: data?.personal?.name || user.name,
      email: data?.personal?.email || user.email,
      employeeCode: data?.professional?.employeeCode || user.employeeCode,
    };

    setUser(nextUser);
    return { success: true, user: nextUser };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: isLoading && !isReady ? true : isLoading,
        signUpAdmin,
        signIn,
        signOut,
        changePassword,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
