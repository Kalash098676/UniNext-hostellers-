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
import Overview from "./pages/StudentDashboard/Overview";
import Complaints from "./pages/StudentDashboard/Complaints";
import Feedback from "./pages/StudentDashboard/Feedback";
import Preferences from "./pages/StudentDashboard/Preferences";
import RoommateMatch from "./pages/StudentDashboard/RoommateMatch";
import Profile from "./pages/StudentDashboard/Profile";
import { Menu } from "lucide-react";
import WardenOverview from "./pages/WardenDashboard/WardenOverview";
import WardenComplaints from "./pages/WardenDashboard/WardenComplaints";
import WardenFeedback from "./pages/WardenDashboard/WardenFeedback";
import WardenProfile from "./pages/WardenDashboard/WardenProfile";
import Students from "./pages/WardenDashboard/Students";
import Staff from "./pages/WardenDashboard/Staff";
import Matches from "./pages/WardenDashboard/Matches";
import ManageMenu from "./pages/WardenDashboard/ManageMenu";

// #083067

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
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
            <Route
              path="/warden-dashboard"
              element={
                <ProtectedRoute allowedRoles={["ROLE_WARDEN", "ROLE_STAFF"]}>
                  <WardenDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<WardenOverview />} />
              <Route path="students" element={<Students />} />
              <Route path="complaints" element={<WardenComplaints />} />
              <Route path="feedback" element={<WardenFeedback />} />
              <Route path="matches" element={<Matches />} />
              <Route path="staff" element={<Staff />} />
              <Route path="profile" element={<WardenProfile />} />
              <Route path="menu" element={<ManageMenu />} />

            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
