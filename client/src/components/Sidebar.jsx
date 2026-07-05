import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineSquares2X2, HiOutlineUsers, HiOutlineCurrencyRupee,
  HiOutlineCog6Tooth, HiOutlineArrowRightOnRectangle
} from 'react-icons/hi2';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const navItems = [
    { to: "/dashboard", icon: HiOutlineSquares2X2, label: "Dashboard" },
    { to: "/groups", icon: HiOutlineUsers, label: "Groups" },
    { to: "/expenses", icon: HiOutlineCurrencyRupee, label: "Expenses" },
    { to: "/settings", icon: HiOutlineCog6Tooth, label: "Settings" },
  ];

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed h-full">
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <Icon className="w-5 h-5" /> {label}
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
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 text-sm transition">
          <HiOutlineArrowRightOnRectangle className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
}