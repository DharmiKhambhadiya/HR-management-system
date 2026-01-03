import { useState, useEffect } from "react";
import {
  HiUserCircle,
  HiMail,
  HiPhone,
  HiCalendar,
  HiOfficeBuilding,
  HiIdentification,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

/**
 * Employee Profile Page
 * Full details, editable fields: Full Name, Phone
 */
const Profile = () => {
  const { user, updateProfile, signOut, isLoading } = useAuth();
  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [status, setStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    if (user) {
      setForm({
        fullName:
          user.fullName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setStatus({ message: "", type: "" });
  };

  const handleSave = async () => {
    try {
      const parts = form.fullName.trim().split(" ");
      const firstName = parts.shift() || "";
      const lastName = parts.join(" ") || "";

      const res = await updateProfile({
        firstName,
        lastName,
        fullName: form.fullName.trim(),
        phone: form.phone,
      });
      if (res && res.success) {
        setStatus({ message: "Profile updated successfully", type: "success" });
      }
    } catch (err) {
      setStatus({
        message: err.message || "Error updating profile",
        type: "error",
      });
    }
  };

  if (!user) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          My Profile
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              signOut();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <HiUserCircle className="w-12 h-12" />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500">Employee</p>
              <p className="text-lg font-semibold text-gray-900">
                {user.fullName}
              </p>
              <p className="text-sm text-gray-500">
                {user.employeeId ? `ID: ${user.employeeId}` : ""}
              </p>
              <p className="text-sm text-gray-500">{user.department || ""}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiMail className="w-5 h-5" />
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-sm text-gray-900 truncate">
                  {user.email || "N/A"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiCalendar className="w-5 h-5" />
              <div>
                <div className="text-xs text-gray-500">Date of Joining</div>
                <div className="text-sm text-gray-900">
                  {user.dateOfJoining || "N/A"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOfficeBuilding className="w-5 h-5" />
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="text-sm text-gray-900">
                  {user.status || "Active"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details & Edit form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">
                  Email (read-only)
                </label>
                <input
                  value={user.email || ""}
                  readOnly
                  className="mt-1 block w-full border border-gray-100 bg-gray-50 rounded p-2"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Employee ID</label>
                <input
                  value={user.employeeId || ""}
                  readOnly
                  className="mt-1 block w-full border border-gray-100 bg-gray-50 rounded p-2 font-mono"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setForm({ fullName: user.fullName, phone: user.phone || "" });
                  setStatus({ message: "", type: "" });
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded"
              >
                Reset
              </button>
              {status.message && (
                <div
                  className={`ml-4 text-sm ${
                    status.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {status.message}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Job Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <div className="text-xs text-gray-500">Department</div>
                <div className="text-sm text-gray-900">
                  {user.department || "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Job Title</div>
                <div className="text-sm text-gray-900">
                  {user.jobTitle || "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Reporting Manager</div>
                <div className="text-sm text-gray-900">
                  {user.reportingManager || "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Attendance & Leave Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-xs text-gray-500">Total Present Days</div>
                <div className="text-xl font-semibold text-gray-900">
                  {/* calculated from attendance */ 0}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-xs text-gray-500">
                  Total Leave Requests
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {/* count from leaveRequests */ 0}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-xs text-gray-500">
                  Remaining Leave Balance
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {/* placeholder */ 12}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
