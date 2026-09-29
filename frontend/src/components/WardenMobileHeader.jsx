import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, Menu } from "lucide-react";

export default function WardenMobileHeader() {
  const { isDark, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
   <div className="lg:hidden fixed top-0 left-0 right-0 w-full z-50 bg-white dark:bg-[#1A2F42] border-b border-gray-100 dark:border-gray-700 shadow-sm">
      
      {/* Main header bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5 text-[#083067] dark:text-white" />
          </button>

          <div
            onClick={() => navigate("/warden-dashboard")}
            className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <img src="/logo.jpg" alt="UniNest" className="h-7 w-7" />
            <span className="text-sm font-bold whitespace-nowrap text-[#083067] dark:text-white">
              Uni<span className="text-blue-400">Nest</span>
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/warden-dashboard/profile")}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
          >
            {user?.email?.charAt(0).toUpperCase()}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-500" />
            )}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>

      {/* Hamburger dropdown */}
      <div className="relative">
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#1A2F42] border-b border-gray-100 dark:border-gray-700 shadow-lg py-2">
          <button
            onClick={() => { navigate("/warden-dashboard/feedback"); setMenuOpen(false); }}
            className="w-full text-left px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#162636] transition-colors"
          >
            Feedback
          </button>
          <button
            onClick={() => { navigate("/warden-dashboard/staff"); setMenuOpen(false); }}
            className="w-full text-left px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#162636] transition-colors"
          >
            Add Staff
          </button>
        </div>
      )}
      </div>
    </div>
  );
}