import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiChevronDown, HiUserCircle } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";

/**
 * Header Component
 * Top header with profile dropdown
 * Shows logged-in user data dynamically
 */
const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    navigate("/auth/signin");
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Logo - hidden on mobile when sidebar is visible */}
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">HRMS</h1>
        </div>

        {/* Profile Section */}
        <div className="ml-auto relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="User profile menu"
            aria-expanded={isProfileOpen}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName || user.firstName || "User"}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <HiUserCircle className="w-8 h-8 text-gray-600" />
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {user?.fullName || user?.firstName || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role === "ADMIN"
                  ? "Admin"
                  : user?.department || "Employee"}
              </p>
            </div>
            <HiChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsProfileOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email || user?.employeeId || "N/A"}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (user?.role === "ADMIN") navigate("/admin/dashboard");
                      else navigate("/profile");
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
