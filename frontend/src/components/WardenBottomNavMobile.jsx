import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  AlertCircle,
  User,
  UtensilsCrossed,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    icon: LayoutDashboard,
    path: "/warden-dashboard",
  },
  {
    label: "Students",
    icon: Users,
    path: "/warden-dashboard/students",
  },
  {
    label: "Complaints",
    icon: AlertCircle,
    path: "/warden-dashboard/complaints",
  },
  {
    label: "Match",
    icon: Users,
    path: "/warden-dashboard/matches",
  },
  {
    label: "Mess Menu",
    icon: UtensilsCrossed,
    path: "/warden-dashboard/menu",
  },
];

export default function WardenBottomNavMobile() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1A2F42] border-t border-gray-100 dark:border-gray-700 shadow-[0_-8px_20px_rgba(255,255,255,0.95)] dark:shadow-[0_-8px_20px_rgba(26,47,66,0.95)] lg:hidden z-50">
      <div className="flex items-center justify-around">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] sm:text-xs font-medium transition-colors ${
                isActive
                  ? "text-[#083067] dark:text-white bg-[#eff4ff] dark:bg-blue-900/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#083067] dark:hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}