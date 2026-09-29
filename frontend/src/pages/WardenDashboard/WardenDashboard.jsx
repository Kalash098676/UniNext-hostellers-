import { Outlet } from "react-router-dom";
import WardenSidebar from "./WardenSidebar";
import WardenMobileHeader from "../../components/WardenMobileHeader";
import WardenBottomNavMobile from "../../components/WardenBottomNavMobile";

export default function WardenDashboard() {
  return (
    <div className="flex min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E] transition-colors duration-300">
      {/* Desktop Sidebar */}
      <WardenSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-56">
        {/* Mobile Header */}
        <WardenMobileHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pt-[56px] pb-20 lg:pt-0 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <WardenBottomNavMobile />
    </div>
  );
}