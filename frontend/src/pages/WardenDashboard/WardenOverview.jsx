import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  Users,
  AlertCircle,
  Star,
  Bed,
  ShieldCheck,
  Plus,
  UserPlus,
  Bell,
  CheckCircle2,
  TrendingUp,
  Activity,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";

function StatCard({ icon: Icon, iconBg, value, label, sub, badge, badgeColor }) {
  return (
    <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-[#1B3C53] dark:text-white" />
        </div>
        {badge && (
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">{value}</div>
      {sub && <p className="text-xs text-blue-500 font-medium mb-0.5">{sub}</p>}
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

export default function WardenOverview() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardOverview();
  }, []);

  const fetchDashboardOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/warden/dashboard");
      setData(res.data);
    } catch (err) {
      console.error("Error loading dashboard overview:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading Admin Overview...
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-[#f8f9ff] dark:bg-[#0F1F2E] min-h-screen space-y-6">
      <PageHeader title="Admin Overview & Command Center" />

      {/* Quick Action Toolbar */}
      <div className="bg-white dark:bg-[#1A2F42] p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Quick Operations</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/warden-dashboard/students")}
            className="flex items-center gap-1.5 bg-[#1B3C53] text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#234C6A] transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Student
          </button>
          <button
            onClick={() => navigate("/warden-dashboard/matches")}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Roommate Matches
          </button>
          <button
            onClick={() => navigate("/warden-dashboard/complaints")}
            className="flex items-center gap-1.5 bg-amber-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-amber-700 transition shadow-sm"
          >
            <AlertCircle className="w-4 h-4" /> View Complaints
          </button>
          <button
            onClick={() => navigate("/warden-dashboard/notifications")}
            className="flex items-center gap-1.5 bg-purple-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-purple-700 transition shadow-sm"
          >
            <Bell className="w-4 h-4" /> Send Notification
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          value={data?.totalStudents || 0}
          label="Registered Students"
          sub={`${data?.verifiedStudents || 0} Verified | ${data?.pendingVerification || 0} Pending`}
        />
        <StatCard
          icon={Bed}
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          value={`${data?.occupancyPercentage || 0}% Occupancy`}
          label="Room Capacity & Allocation"
          sub={`${data?.occupiedBeds || 0} Beds Occupied (${data?.availableBeds || 0} Available)`}
          badge="Live"
          badgeColor="bg-emerald-100 text-emerald-800"
        />
        <StatCard
          icon={AlertCircle}
          iconBg="bg-amber-100 dark:bg-amber-900/30"
          value={data?.pendingComplaints || 0}
          label="Pending Maintenance Issues"
          sub={`${data?.urgentComplaints || 0} Urgent High Priority`}
          badge={data?.pendingComplaints > 0 ? "Needs Action" : "Clean"}
          badgeColor={data?.pendingComplaints > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}
        />
        <StatCard
          icon={ShieldCheck}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          value={data?.pendingPasses || 0}
          label="Pending Visitor Pass Approvals"
          sub={`Feedback Rating: ${data?.averageRating || 0} / 5⭐`}
        />
      </div>

      {/* Activity Feed & Detailed Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Log */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A2F42] rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" /> Recent System Activity Feed
            </h3>
            <span className="text-xs text-gray-400">Live Real-Time Log</span>
          </div>

          {!data?.activityFeed || data.activityFeed.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-6 text-center">No recent activity logged.</p>
          ) : (
            <div className="space-y-3">
              {data.activityFeed.map((act) => (
                <div key={act.id} className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#0F1F2E] border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        {act.type}
                      </span>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">{act.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-400">{new Date(act.time).toLocaleString()}</p>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                    {act.badge}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Navigation Cards */}
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
            Admin Modules Shortcut
          </h3>
          <div className="space-y-2.5 text-xs font-semibold">
            <button
              onClick={() => navigate("/warden-dashboard/students")}
              className="w-full text-left p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 hover:bg-blue-100 transition flex justify-between items-center"
            >
              <span>Manage Registered Students</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigate("/warden-dashboard/rooms")}
              className="w-full text-left p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 transition flex justify-between items-center"
            >
              <span>Room Inventory & Occupancy</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigate("/warden-dashboard/matches")}
              className="w-full text-left p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 hover:bg-purple-100 transition flex justify-between items-center"
            >
              <span>Roommate Matching Engine</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigate("/warden-dashboard/visitor-passes")}
              className="w-full text-left p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 hover:bg-amber-100 transition flex justify-between items-center"
            >
              <span>Visitor Entry Passes</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigate("/warden-dashboard/reports")}
              className="w-full text-left p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 transition flex justify-between items-center"
            >
              <span>Reports & CSV Data Exports</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
