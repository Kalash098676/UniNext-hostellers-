import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  CalendarClock,
  CheckCircle2,
  Clock,
  Search,
  X,
  ChevronRight,
} from "lucide-react";

const WardenComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  //for complaint modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  //for search part
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/complaint");
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComplaint = async (id) => {
    setUpdateLoading(true);
    try {
      await api.put(`/api/complaint/${id}`, {
        status: selectedComplaint.status,
        priority: selectedComplaint.priority,
      });
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "PENDING").length;
  const inProgressCount = complaints.filter(
    (c) => c.status === "IN_PROGRESS",
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "RESOLVED",
  ).length;

  const filtered = complaints.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.roomId?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E]">
        <p className="text-[#083067] dark:text-white font-medium">Loading...</p>
      </div>
    );
  }
  return (
    <div className="p-4 lg:p-6 bg-[#f8f9ff] dark:bg-[#0F1F2E] min-h-screen">
      <PageHeader title={"Complaints"} />

      {/* ststs cards */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <StatSquare
          icon={
            <ClipboardList className="w-4 h-4 text-[#083067] dark:text-white" />
          }
          iconBg="bg-[#d5e3ff] dark:bg-blue-900/20"
          value={totalCount}
          label="TOTAL FILED"
          badge="All Time"
          badgeColor="bg-blue-50 text-blue-400"
        />
        <StatSquare
          icon={
            <CalendarClock className="w-4 h-4 text-[#4c2f06] dark:text-white" />
          }
          iconBg="bg-[#ffddb8] dark:bg-amber-900/20"
          value={pendingCount}
          label="PENDING REVIEW"
          badge="Action Required"
          badgeColor="bg-amber-50 text-amber-500"
        />
        <StatSquare
          icon={
            <CheckCircle2 className="w-4 h-4 text-[#083067] dark:text-white" />
          }
          iconBg="bg-[#d5e3ff] dark:bg-green-900/20"
          value={resolvedCount}
          label="RESOLVED"
          badge="Completed"
          badgeColor="bg-green-50 text-green-500"
        />
      </div>

      {/* table now */}
      <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#083067] dark:text-white mb-1">
          Active Complaints
        </h2>
        {/* Search bar */}
        <div className="mb-4">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search complaints..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/20"
              />
            </div>
          </div>

          {/* Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-left">
                  <th className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Complaint
                  </th>
                  <th className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-gray-400"
                    >
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr
                      key={c._id}
                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedComplaint(c)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold flex-shrink-0">
                            {c.userId?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#083067] dark:text-white">
                              {c.userId?.name || "Unknown"}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-400">
                              {c.userId?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                        {c.roomId || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#083067] dark:text-white">
                            {c.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-1 truncate">
                            {c.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-semibold ${
                            c.status === "PENDING"
                              ? "bg-amber-50 text-amber-600"
                              : c.status === "IN_PROGRESS"
                                ? "bg-blue-50 text-blue-500"
                                : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-semibold ${
                            c.priority === "HIGH"
                              ? "bg-red-50 text-red-600"
                              : c.priority === "MEDIUM"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden">
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-400">
                No complaints found
              </p>
            ) : (
              filtered.map((c, index) => (
                <div
                  key={c._id}
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                    index !== filtered.length - 1
                      ? "border-b border-gray-100 dark:border-gray-700"
                      : ""
                  }`}
                  onClick={() => setSelectedComplaint(c)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {c.userId?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#083067] dark:text-white">
                        {c.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c.userId?.name || "Unknown"} • Room {c.roomId || "—"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            c.status === "PENDING"
                              ? "bg-amber-50 text-amber-600"
                              : c.status === "IN_PROGRESS"
                                ? "bg-blue-50 text-blue-500"
                                : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {c.status}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            c.priority === "HIGH"
                              ? "bg-red-50 text-red-600"
                              : c.priority === "MEDIUM"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {c.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 ml-2" />
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center">
            <p className="text-[10px] sm:text-xs text-gray-400">
              Showing {filtered.length} of {complaints.length} complaints
            </p>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-[#083067] dark:text-white">
                Update Complaint
              </h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Complaint details */}
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Title
                </p>
                <p className="text-sm font-medium text-[#083067] dark:text-white">
                  {selectedComplaint.title}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Status dropdown */}
              <div>
                <label className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-1.5 block">
                  Status
                </label>
                <select
                  value={selectedComplaint.status}
                  onChange={(e) =>
                    setSelectedComplaint({
                      ...selectedComplaint,
                      status: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#3B5368] bg-gray-50 dark:bg-[#243B50] text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
                >
                  <option value="PENDING" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">Pending</option>
                  <option value="IN_PROGRESS" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">In Progress</option>
                  <option value="RESOLVED" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">Resolved</option>
                </select>
              </div>

              {/* Priority dropdown */}
              <div>
                <label className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-1.5 block">
                  Priority
                </label>
                <select
                  value={selectedComplaint.priority}
                  onChange={(e) =>
                    setSelectedComplaint({
                      ...selectedComplaint,
                      priority: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#3B5368] bg-gray-50 dark:bg-[#243B50] text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
                >
                  <option value="LOW" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">Low</option>
                  <option value="MEDIUM" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">Medium</option>
                  <option value="HIGH" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">High</option>
                </select>
              </div>

              {/* Save button */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateComplaint(selectedComplaint._id)}
                  disabled={updateLoading}
                  className="flex-1 py-2.5 rounded-xl bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {updateLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function StatSquare({ icon, iconBg, value, label }) {
  return (
    <div className="bg-white dark:bg-[#1A2F42] rounded-xl p-2 sm:p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div
        className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      <div className="text-2xl font-bold text-[#083067] dark:text-white">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] sm:text-[10px] font-medium text-gray-600 dark:text-gray-400 tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

export default WardenComplaints;
