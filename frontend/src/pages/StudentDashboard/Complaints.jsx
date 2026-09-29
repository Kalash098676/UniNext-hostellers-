import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  ClipboardList,
  CalendarClock,
  CheckCircle2,
  Plus,
  X,
  Droplet,
  Wifi,
  Snowflake,
  AlertCircle,
  Calendar,
  Hash,
  ChevronRight,
} from "lucide-react";

function StatSquare({ icon, iconBg, value, label }) {
  return (
    <div className="bg-white dark:bg-[#1A2F42] rounded-xl p-2 sm:p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
      {/* Icon in a colored circle */}
      <div
        className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      {/* Big number */}
      <div className="text-2xl font-bold text-[#083067] dark:text-white">
        {String(value).padStart(2, "0")}
      </div>
      {/* Label */}
      <div className="text-[9px] sm:text-[10px] font-medium text-gray-600 dark:text-gray-400 tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

function getComplaintIcon(title = "") {
  const t = title.toLowerCase();
  if (t.includes("water") || t.includes("leak")) {
    return {
      icon: <Droplet className="w-5 h-5 text-red-500" />,
      bg: "bg-red-50 dark:bg-red-900/20",
    };
  }
  if (t.includes("wifi") || t.includes("internet") || t.includes("network")) {
    return {
      icon: <Wifi className="w-5 h-5 text-[#083067]" />,
      bg: "bg-blue-50 dark:bg-blue-900/20",
    };
  }
  if (t.includes("ac") || t.includes("cool") || t.includes("temperature")) {
    return {
      icon: <Snowflake className="w-5 h-5 text-sky-500" />,
      bg: "bg-sky-50 dark:bg-sky-900/20",
    };
  }
  return {
    icon: <AlertCircle className="w-5 h-5 text-[#4c2f06] dark:text-white" />,
    bg: "bg-[#ffddb8] dark:bg-amber-900/20",
  };
}
function StatusBadge({ status }) {
  const map = {
    PENDING: {
      label: "Pending",
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
    },
    IN_PROGRESS: { label: "In Progress", color: "bg-blue-50 text-blue-500 dark:bg-blue-900/40 dark:text-blue-300" },
    RESOLVED: { label: "Resolved", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300" },
  };
  const s = map[status] || map.PENDING;
  return (
    <span
      className={`text-[10px] sm:text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${s.color}`}
    >
      {s.label}
    </span>
  );
}

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  //for forms
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomId, setRoomId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/complaint/my");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "PENDING").length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "RESOLVED",
  ).length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRoomId("");
    setFormError("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !roomId.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const res = await api.post("/api/complaint", {
        title,
        description,
        roomId,
      });
      setComplaints((prev) => [res.data, ...prev]);
      handleCloseModal();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E]">
        <p className="text-[#083067] dark:text-white font-medium">Loading...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E] p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#083067] dark:text-white">
          Complaints
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">{today}</p>
      </div>

      {/* Stat squares */}
      <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6">
        <StatSquare
          icon={
            <ClipboardList className="w-4 h-4 text-[#083067] dark:text-white" />
          }
          iconBg="bg-[#d5e3ff] dark:bg-blue-900/20"
          value={totalCount}
          label="TOTAL FILED"
        />
        <StatSquare
          icon={
            <CalendarClock className="w-4 h-4 text-[#4c2f06] dark:text-white" />
          }
          iconBg="bg-[#ffddb8] dark:bg-amber-900/20"
          value={pendingCount}
          label="PENDING REVIEW"
        
        />
        <StatSquare
          icon={
            <CheckCircle2 className="w-4 h-4 text-[#083067] dark:text-white" />
          }
          iconBg="bg-[#d5e3ff] dark:bg-green-900/20"
          value={resolvedCount}
          label="RESOLVED"
        
        />
      </div>

      {/* Activity Tracking header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-semibold text-[#083067] dark:text-white">
            Activity Tracking
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and monitor your reported housing issues.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors w-full lg:w-auto"
        >
          <Plus className="w-4 h-4" />
          File New Complaint
        </button>
      </div>

      {/* Recent Complaints card */}
      <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-sm p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#083067] dark:text-white">
            Recent Complaints
          </h3>
        </div>

        {complaints.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
            No complaints filed yet. Click "File New Complaint" to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {complaints.map((c) => {
              const { icon, bg } = getComplaintIcon(c.title);
              const dateStr = new Date(c.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              );
              return (
                <div
                  key={c._id}
                  className="flex items-start lg:items-center gap-3 lg:gap-4 py-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl px-2 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 lg:w-10 lg:h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#083067] dark:text-white truncate">
                      {c.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-300 mt-0.5 truncate">
                      {c.description}
                    </p>
<div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        Room {c.roomId}
                      </span>
                      <span className="lg:hidden">
                        <StatusBadge status={c.status} />
                      </span>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={c.status} />
                   <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-4">
          <button
            className="mt-4
text-sm
font-medium
text-[#60A5FA]
hover:text-blue-300
transition-colors
"
          >
            View All Complaint History
          </button>
        </div>
      </div>

      {/* File New Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-xl w-full max-w-md p-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-[#083067] dark:text-white mb-1">
              File New Complaint
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Describe your issue and we'll get it resolved as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Complaint Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Water Leakage in Room 402B"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/30"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Room Number
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="e.g. A-204"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/30"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/30 resize-none"
                />
              </div>

              {formError && (
                <p className="text-[10px] sm:text-xs text-red-500">
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
