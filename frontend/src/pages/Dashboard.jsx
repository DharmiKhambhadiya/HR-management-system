import { HiUser } from "react-icons/hi";
import { HiClock, HiCalendar } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import SummaryCard from "../components/employee/SummaryCard";

/**
 * Employee Dashboard
 * Shows compact summary cards (photo, name, department, pending leaves, attendance summary)
 */
const Dashboard = () => {
  const { user } = useAuth();
  const pendingLeaves = 0;
  const presentDays = 0;
  const now = new Date();

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile summary */}
        <div className="col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden">
            {/* placeholder avatar */}
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <HiUser className="w-10 h-10" />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Employee</p>
            <p className="text-lg font-semibold text-gray-900">
              {user?.fullName}
            </p>
            <p className="text-sm text-gray-500">{user?.department || "—"}</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryCard
            icon={<HiCalendar className="w-6 h-6" />}
            title="Pending Leave Requests"
            value={pendingLeaves}
            highlight="bg-yellow-50"
          />

          <SummaryCard
            icon={<HiClock className="w-6 h-6" />}
            title={`Present Days (${now.toLocaleString(undefined, {
              month: "short",
            })})`}
            value={presentDays}
          />
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Attendance Summary
        </h2>
        <p className="text-sm text-gray-500">
          Showing present days for the current month:{" "}
          <strong>{presentDays}</strong>.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
