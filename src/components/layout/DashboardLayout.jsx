import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * DashboardLayout Component
 * Main layout wrapper with sidebar and header
 */
const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 transition-all duration-300 pt-16 md:pt-0">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

