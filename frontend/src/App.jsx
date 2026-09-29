import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import { AuthProvider } from "./context/AuthContext";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import WardenDashboard from "./pages/WardenDashboard/WardenDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";

// Student pages
import Overview from "./pages/StudentDashboard/Overview";
import Complaints from "./pages/StudentDashboard/Complaints";
import Feedback from "./pages/StudentDashboard/Feedback";
import Preferences from "./pages/StudentDashboard/Preferences";
import RoommateMatch from "./pages/StudentDashboard/RoommateMatch";
import Profile from "./pages/StudentDashboard/Profile";

// Warden / Admin pages
import WardenOverview from "./pages/WardenDashboard/WardenOverview";
import Students from "./pages/WardenDashboard/Students";
import Rooms from "./pages/WardenDashboard/Rooms";
import Matches from "./pages/WardenDashboard/Matches";
import WardenComplaints from "./pages/WardenDashboard/WardenComplaints";
import Staff from "./pages/WardenDashboard/Staff";
import VisitorPasses from "./pages/WardenDashboard/VisitorPasses";
import ManageMenu from "./pages/WardenDashboard/ManageMenu";
import WardenFeedback from "./pages/WardenDashboard/WardenFeedback";
import WardenNotifications from "./pages/WardenDashboard/WardenNotifications";
import WardenReports from "./pages/WardenDashboard/WardenReports";
import WardenSettings from "./pages/WardenDashboard/WardenSettings";
import WardenProfile from "./pages/WardenDashboard/WardenProfile";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Student Dashboard Routes */}
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="preferences" element={<Preferences />} />
              <Route path="roommate" element={<RoommateMatch />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Admin / Warden Dashboard Routes */}
            <Route
              path="/warden-dashboard"
              element={
                <ProtectedRoute allowedRoles={["ROLE_WARDEN", "ROLE_ADMIN", "ROLE_STAFF"]}>
                  <WardenDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<WardenOverview />} />
              <Route path="students" element={<Students />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="matches" element={<Matches />} />
              <Route path="complaints" element={<WardenComplaints />} />
              <Route path="staff" element={<Staff />} />
              <Route path="visitor-passes" element={<VisitorPasses />} />
              <Route path="menu" element={<ManageMenu />} />
              <Route path="feedback" element={<WardenFeedback />} />
              <Route path="notifications" element={<WardenNotifications />} />
              <Route path="reports" element={<WardenReports />} />
              <Route path="settings" element={<WardenSettings />} />
              <Route path="profile" element={<WardenProfile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
