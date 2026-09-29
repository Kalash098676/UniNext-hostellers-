import MobileHeader from "../../components/MobileHeader";
import StudentsBottomNavMobile from "../../components/StudentsBottomNavMobile";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen bg-[#F5F9FF] dark:bg-[#0F1F2E] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-56">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>
      <StudentsBottomNavMobile/>
    </div>
  );
}