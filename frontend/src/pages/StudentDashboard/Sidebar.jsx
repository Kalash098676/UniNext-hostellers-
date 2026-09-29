import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, AlertCircle, Star,
  Users, Settings, User, LogOut, Sun, Moon
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student-dashboard" },
  { label: "Complaints", icon: AlertCircle, path: "/student-dashboard/complaints" },
  { label: "Feedback", icon: Star, path: "/student-dashboard/feedback" },
  { label: "Roommate Match", icon: Users, path: "/student-dashboard/roommate" },
  { label: "Preferences", icon: Settings, path: "/student-dashboard/preferences" },
  { label: "Profile", icon: User, path: "/student-dashboard/profile" },
];

export default function SideBar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-56 bg-white dark:bg-[#1A2F42] flex-col z-40 border-r border-gray-100 dark:border-gray-700">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-700">
        <div
          onClick={() => navigate("/warden-dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="/logo.jpg"
            alt="UniNest"
            className="h-8 w-8"
          />

          <span className="text-lg font-bold text-[#083067] dark:text-white">
            Uni<span className="text-blue-400">Nest</span>
          </span>
        </div>
      </div>

  
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#083067] dark:text-white truncate">
              {user?.email?.split("@")[0]}
            </p>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 dark:text-gray-400 mt-0.5">Student</p>
          </div>
        </div>
      </div>

   
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#d5e4f8] text-[#083067]"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#162636] hover:text-[#083067] dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-700 space-y-0.5">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#162636] transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] sm:text-xs font-medium text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}