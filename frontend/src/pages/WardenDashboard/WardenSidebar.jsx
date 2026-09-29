import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Bed,
  UserCheck,
  AlertCircle,
  UserPlus,
  ShieldCheck,
  UtensilsCrossed,
  Star,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/warden-dashboard" },
  { label: "Students", icon: Users, path: "/warden-dashboard/students" },
  { label: "Roommate Match", icon: UserCheck, path: "/warden-dashboard/matches" },
  { label: "Complaints", icon: AlertCircle, path: "/warden-dashboard/complaints" },
  { label: "Staff Management", icon: UserPlus, path: "/warden-dashboard/staff" },
  { label: "Visitor Passes", icon: ShieldCheck, path: "/warden-dashboard/visitor-passes" },
  { label: "Mess Menu", icon: UtensilsCrossed, path: "/warden-dashboard/menu" },
  { label: "Feedback", icon: Star, path: "/warden-dashboard/feedback" },
  { label: "Notifications", icon: Bell, path: "/warden-dashboard/notifications" },
  { label: "Reports & CSV", icon: BarChart3, path: "/warden-dashboard/reports" },
  { label: "Settings", icon: Settings, path: "/warden-dashboard/settings" },
];

export default function WardenSidebar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-60 bg-white dark:bg-[#1A2F42] flex-col z-40 border-r border-gray-100 dark:border-gray-700 shadow-sm">
      {/* Logo Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div
          onClick={() => navigate("/warden-dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="/logo.jpg"
            alt="UniNest"
            className="h-8 w-8 rounded-lg"
          />
          <span className="text-lg font-bold text-[#083067] dark:text-white">
            Uni<span className="text-blue-500">Nest</span> <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">ADMIN</span>
          </span>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#0F1F2E] p-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-[#1B3C53] flex items-center justify-center text-white font-bold text-xs shrink-0">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#083067] dark:text-white truncate">
              {user?.name || user?.email?.split("@")[0]}
            </p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase">
              {user?.role === "ROLE_WARDEN" ? "Warden / Admin" : user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#1B3C53] text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0F1F2E] hover:text-[#1B3C53]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-700 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0F1F2E] transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}