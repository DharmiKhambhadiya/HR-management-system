import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HiHome,
  HiUser,
  HiClock,
  HiCurrencyDollar,
  HiCalendar,
  HiDocumentText,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2';
import { sidebarData } from '../config/sidebarData';

/**
 * Sidebar Component
 * Employee-side navigation sidebar
 * Responsive with mobile hamburger menu
 */
const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64 transition-all duration-300">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">HRMS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-2 space-y-1">
          {sidebarData.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
                aria-label={item.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
        aria-label="Toggle sidebar"
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? (
          <HiXMark className="w-6 h-6" />
        ) : (
          <HiBars3 className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;

