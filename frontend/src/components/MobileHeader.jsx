import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";

export default function MobileHeader() {
  const { isDark, toggleTheme } = useTheme();
  const { logout,user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1A2F42] border-b border-gray-100 dark:border-gray-700">
      {/* Logo + Name on left */}
      <div className="flex items-center gap-2">
        <img src="/logo.jpg" alt="UniNest" className="h-8 w-8" />
        <span className="text-sm font-bold text-[#083067] dark:text-white">
          Uni<span className="text-blue-400">Nest</span>
        </span>
      </div>

      {/* Settings on right */}

      <div className="flex items-center gap-1">
         <button
          onClick={() => navigate("/student-dashboard/profile")}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity"
          title="Profile"
        >
          {user?.email?.charAt(0).toUpperCase()}
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          title={isDark ? "Light Mode" : "Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5 text-gray-500" /> : <Moon className="w-5 h-5 text-gray-500" />}
        </button>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Log Out"
        >
          <LogOut className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );
}