import React, { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen, variant = "default" }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // Close on Esc key
  useEffect(() => {
    const keyHandler = (e) => {
      if (!sidebarOpen || e.key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // Shared Link Styles
  const linkClasses = (isActive) =>
    `flex items-center p-2 rounded-lg transition duration-150 truncate ${isActive
      ? "bg-gray-100 dark:bg-gray-700/50 text-violet-500"
      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/30"
    }`;

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static h-dvh no-scrollbar w-64 shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64 lg:translate-x-0"} 
          ${variant === "v2" ? "border-r border-gray-200 dark:border-gray-700/60" : "rounded-r-2xl shadow-xs"}`}
      >
        {/* Header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" /></svg>
          </button>

          <NavLink end to="/" className="block">
            <svg className="fill-violet-500" width={32} height={32} viewBox="0 0 32 32">
              <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
            </svg>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xs uppercase text-gray-400 font-semibold pl-3 mb-3">Pages</h3>
            <ul className="space-y-1">
              
              {/* Dashboard Link */}
              <li>
                <NavLink
                  end
                  to="/dashboard"
                  className={({ isActive }) => linkClasses(isActive)}
                >
                  <svg className="shrink-0 fill-current w-4 h-4 mr-3" viewBox="0 0 16 16">
                    <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
                    <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
                  </svg>
                  <span className="text-sm font-medium">Dashboard</span>
                </NavLink>
              </li>

              {/* Analytics Link */}
              <li>
                <NavLink
                  to="/analytics"
                  className={({ isActive }) => linkClasses(isActive)}
                >
                  <svg className="shrink-0 fill-current w-4 h-4 mr-3" viewBox="0 0 16 16">
                    <path d="M0 13h16v2H0zM2 10h2v2H2zM5 7h2v5H5zM8 4h2v8H8zM11 1h2v11h-2z" />
                  </svg>
                  <span className="text-sm font-medium">Analytics</span>
                </NavLink>
              </li>

              {/* Menu List Member */}
              <li>
                <NavLink
                  to="/member-list"
                  className={({ isActive }) => linkClasses(isActive)}
                >
                  <svg className="shrink-0 fill-current w-4 h-4 mr-3" viewBox="0 0 16 16">
                    <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5v7A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 3h-13Zm0 2h13a.5.5 0 0 1 .5.5v1H0v-1a.5.5 0 0 1 .5-.5ZM0 8.5h16v3a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-3Z" />
                  </svg>
                  <span className="text-sm font-medium">Data Member</span>
                </NavLink>
              </li>

              {/* Menu Registrasi Member */}
              <li>
                <NavLink
                  to="/register-member"
                  className={({ isActive }) => linkClasses(isActive)}
                >
                  <svg className="shrink-0 fill-current w-4 h-4 mr-3" viewBox="0 0 16 16">
                    <path d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-4 4a4 4 0 0 1 8 0H4Z" />
                  </svg>
                  <span className="text-sm font-medium">Daftar Member</span>
                </NavLink>
              </li>



             

              {/* Menu Promo Membership */}
              <li>
                <NavLink
                  to="/promo-membership"
                  className={({ isActive }) => linkClasses(isActive)}
                >
                  {/* Icon Tiket/Diskon */}
                  <svg className="shrink-0 fill-current w-4 h-4 mr-3" viewBox="0 0 16 16">
                    <path d="M14.5 2H1.5A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2Zm-1 9h-11v-7h11v7Z" />
                    <circle cx="5" cy="7" r="1" />
                    <path d="M7 6h4v1H7zM7 8h2v1H7z" />
                  </svg>
                  <span className="text-sm font-medium">Promo Membership</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/notification-management"
                  className={({ isActive }) => linkClasses(isActive)}
                >
                  {/* Icon Tiket/Diskon */}
                  <svg className="shrink-0 fill-current w-4 h-4 mr-3" viewBox="0 0 16 16">
                    <path d="M14.5 2H1.5A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2Zm-1 9h-11v-7h11v7Z" />
                    <circle cx="5" cy="7" r="1" />
                    <path d="M7 6h4v1H7zM7 8h2v1H7z" />
                  </svg>
                  <span className="text-sm font-medium">Manajemen Notifikasi</span>
                </NavLink>
              </li>

            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;