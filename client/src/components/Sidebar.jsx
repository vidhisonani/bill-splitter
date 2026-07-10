import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineSquares2X2, HiOutlineUsers, HiOutlineCurrencyRupee,
  HiOutlineCog6Tooth, HiOutlineArrowRightOnRectangle, HiOutlineUserGroup
} from 'react-icons/hi2';
import { getInitials } from '../utils/avatar';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (to) =>
    location.pathname === to ||
    (to === "/groups" && location.pathname.startsWith("/groups/"));

  const navItems = [
    { to: "/dashboard", icon: HiOutlineSquares2X2, label: "Dashboard" },
    { to: "/groups", icon: HiOutlineUsers, label: "Groups" },
    { to: "/expenses", icon: HiOutlineCurrencyRupee, label: "Expenses" },
    { to: "/friends", icon: HiOutlineUserGroup, label: "Friends" },
    { to: "/settings", icon: HiOutlineCog6Tooth, label: "Settings" },
  ];

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4">
        <div className="flex flex-col">
          <span className="text-indigo-600 font-extrabold text-lg tracking-tight">SplitEase</span>
          <span className="text-[10px] text-gray-400 -mt-1">Expense Splitter</span>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold border-2 border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition cursor-pointer select-none"
          >
            {getInitials(user?.firstName, user?.lastName)}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              
              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <HiOutlineCog6Tooth className="w-4 h-4 text-gray-400" /> Account Settings
                </Link>
              </div>
              
              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                >
                  <HiOutlineArrowRightOnRectangle className="w-4 h-4" /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* larger screen */}
      <aside className="hidden md:flex flex-col fixed h-full w-56 bg-white border-r border-gray-200 ">
        <div className="px-5 py-5 border-b border-gray-100">
          <span className="text-indigo-600 font-bold text-lg">SplitEase</span>
          <p className="text-xs text-gray-400 mt-0.5">Expense Splitter</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to ||
              (to === "/groups" && location.pathname.startsWith("/groups/"));
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative overflow-hidden group ${isActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r" />
                )}
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-105 text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`} /> {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
              {getInitials(user?.firstName, user?.lastName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 text-sm transition cursor-pointer select-none">
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* mobile screen */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 px-2 pb-safe">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 4).map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-all relative ${isActive(to)
                ? "text-indigo-600 font-semibold"
                : "text-gray-400 hover:text-gray-600"
                }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive(to)
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-400"
                }`}>
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive(to) ? "scale-110 stroke-2" : ""}`} />
              </div>
              <span className="text-[10px] tracking-wide">{label}</span>
              {isActive(to) && (
                <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}