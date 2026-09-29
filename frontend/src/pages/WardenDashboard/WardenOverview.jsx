import { useState, useEffect } from "react";
import { useActionData, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  Users,
  AlertCircle,
  Star,
  UserCheck,
  Calendar,
  Hash,
  ChevronRight,
} from "lucide-react";
import { User } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";

function StatCard({
  icon: Icon,
  iconBg,
  value,
  label,
  badge,
  badgeColor,
  sub,
}) {
  return (
    <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 lg:p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-9 h-9 lg:w-10 lg:h-10 ${iconBg} rounded-xl flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-[#083067] dark:text-white" />
        </div>
        {badge && (
          <span
            className={`text-[10px] px-2 py-1 rounded-full font-semibold ${badgeColor}`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="text-xl lg:text-2xl font-bold text-[#083067] dark:text-white mb-0.5">
        {value}
      </div>
      {sub && (
        <p className="text-[10px] text-blue-400 font-medium mb-0.5">{sub}</p>
      )}
      <p className="text-[10px] sm:text-xs text-gray-400">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    PENDING: {
      label: "Pending",
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
    },
    IN_PROGRESS: {
      label: "In Progress",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
    },
    RESOLVED: {
      label: "Resolved",
      color:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
  };
  const s = map[status] || map.PENDING;
  return (
    <span
      className={`text-[10px] px-2 py-1 rounded-full font-medium ${s.color}`}
    >
      • {s.label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    HIGH: { label: "HIGH", color: "bg-red-50 text-red-500" },
    MEDIUM: { label: "MEDIUM", color: "bg-amber-50 text-amber-500" },
    LOW: { label: "LOW", color: "bg-gray-100 text-gray-500" },
  };
  const p = map[priority] || map.LOW;
  return (
    <span
      className={`text-[10px] px-2 py-1 rounded-full font-semibold ${p.color}`}
    >
      {p.label}
    </span>
  );
}

export default function WardenOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingComplaints: 0,
    averageRating: 0,
    newToday: 0,
    pendingVisitorPasses: 0,
  });
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [visitorPasses, setVisitorPasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsRes, complaintsRes, feedbackRes, visitorPassRes] = await Promise.all([
        api.get("/api/warden/all-students"),
        api.get("/api/complaint"),
        api.get("/api/feedback"),
        api.get("/api/visitor-pass/all").catch(() => ({ data: [] })),
      ]);

      const studentsData = studentsRes.data;
      const complaintsData = complaintsRes.data;
      const feedbackData = feedbackRes.data;
      const visitorPassData = visitorPassRes.data || [];

      setStudents(studentsData.slice(0, 4));
      setComplaints(complaintsData.slice(0, 4));
      setVisitorPasses(visitorPassData);

      const avgRating = feedbackData.length
        ? (
            feedbackData.reduce((s, f) => s + f.rating, 0) / feedbackData.length
          ).toFixed(1)
        : "0.0";

      const today = new Date().toDateString();
      const newToday = studentsData.filter(
        (s) => new Date(s.date).toDateString() === today,
      ).length;

      setStats({
        totalStudents: studentsData.length,
        pendingComplaints: complaintsData.filter((c) => c.status === "PENDING").length,
        averageRating: avgRating,
        newToday,
        pendingVisitorPasses: visitorPassData.filter((vp) => vp.status === "PENDING" || vp.status === "APPROVED").length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassStatus = async (passId, newStatus) => {
    try {
      await api.put(`/api/visitor-pass/${passId}/status`, { status: newStatus });
      loadData();
    } catch (err) {
      console.error("Failed to update visitor pass status", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#083067] dark:text-white font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 lg:p-6 bg-[#f8f9ff] dark:bg-[#0F1F2E] min-h-screen">
        {/* Header */}
       <PageHeader 
       title={"Dashboard Overview"}
       />

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Users}
            iconBg="bg-[#d5e3ff] dark:bg-blue-900/20"
            value={stats.totalStudents}
            label="Total Students"
            sub="+2.4%"
          />
          <StatCard
            icon={AlertCircle}
            iconBg="bg-[#ffddb8] dark:bg-amber-900/20"
            value={String(stats.pendingComplaints).padStart(2, "0")}
            label="Pending Complaints"
            badge="URGENT"
            badgeColor="bg-red-50 text-red-500"
          />
          <StatCard
            icon={Star}
            iconBg="bg-[#d5e3ff] dark:bg-purple-900/20"
            value={`${stats.averageRating} / 5`}
            label="Avg Feedback Rating"
          />
          <StatCard
            icon={UserCheck}
            iconBg="bg-[#d5e3ff] dark:bg-green-900/20"
            value={stats.newToday}
            label="New Registrations Today"
          />
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent complaints */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1A2F42] rounded-2xl shadow-sm p-5">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#083067] dark:text-white">
                Recent Complaint Logs
              </h2>
            </div>

            {/* Desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 uppercase text-xs border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left pb-2 font-medium">Student</th>
                    <th className="text-left pb-2 font-medium">Title</th>
                    <th className="text-left pb-2 font-medium">Priority</th>
                    <th className="text-left pb-2 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {complaints.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-gray-400"
                      >
                        No complaints yet
                      </td>
                    </tr>
                  ) : (
                    complaints.map((c) => (
                      <tr
                        key={c._id}
                        className="hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <td className="py-4 font-semibold text-[#083067] dark:text-white">
                          {c.userId?.name || "Student"}
                        </td>

                        <td className="py-4 text-gray-500 dark:text-gray-400">
                          {c.title}
                        </td>

                        <td className="py-4">
                          <PriorityBadge priority={c.priority} />
                        </td>

                        <td className="py-4">
                          <StatusBadge status={c.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <button
                onClick={() => navigate("/warden-dashboard/complaints")}
                className="w-full mt-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-[#083067] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
              >
                View All Complaints
              </button>
            </div>

            {/* Mobile */}
            <div className="lg:hidden space-y-3">
              {complaints.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  No complaints yet
                </div>
              ) : (
                complaints.map((c) => (
                  <div
                    key={c._id}
                    className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#162636] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white font-semibold">
                        {c.userId?.name?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#083067] dark:text-white">
                          {c.userId?.name || "Student"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-[#083067] dark:text-white mt-1">
                        {c.title}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-5 mt-5">
                      <div>
                        <p className="text-[11px] text-gray-400 uppercase mb-1">
                          Priority
                        </p>

                        <PriorityBadge priority={c.priority} />
                      </div>

                      <div>
                        <p className="text-[11px] text-gray-400 uppercase mb-1">
                          Status
                        </p>

                        <StatusBadge status={c.status} />
                      </div>
                    </div>
                  </div>
                ))
              )}

              <button
                onClick={() => navigate("/warden-dashboard/complaints")}
                className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-[#083067] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
              >
                View All Complaints
              </button>
            </div>
          </div>

          {/* New registrations */}
          <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-semibold text-[#083067] dark:text-white">
                New Registrations
              </h2>
            </div>

            <div className="space-y-3">
              {students.length === 0 ? (
                <p className="text-[9px] sm:text-xs text-gray-400 text-center py-4">
                  No students yet
                </p>
              ) : (
                students.map((s) => (
                  <div
                    key={s.id}
                 className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                    onClick={() => navigate("/warden-dashboard/students")}
                  >
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {s.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#083067] dark:text-white truncate">
                        {s.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {s.room !== "Not Assigned"
                          ? `Room ${s.room}`
                          : "Room not assigned"}
                      </p>
                    </div>
                    <span className="hidden sm:block text-[10px] text-gray-300 flex-shrink-0">
                      {s.date}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => navigate("/warden-dashboard/students")}
              className="w-full mt-5 py-2.5 text-sm font-medium text-[#083067] dark:text-white border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              All New Students
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
