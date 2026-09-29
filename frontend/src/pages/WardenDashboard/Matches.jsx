import { useState, useEffect } from "react";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import {
  Users,
  Play,
  Home,
  Plus,
  X,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  Building2,
  Percent,
} from "lucide-react";

function StatusBadge({ status }) {
  const map = {
    INCOMPLETE: { label: "Incomplete", color: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" },
    COMPLETE: { label: "Awaiting Room", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
    CONFIRMED: { label: "Confirmed & Assigned", color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" },
  };
  const s = map[status] || map.INCOMPLETE;
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${s.color}`}>
      {s.label}
    </span>
  );
}

function StatSquare({ icon: Icon, iconBg, value, label, subtitle }) {
  return (
    <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-[#083067] dark:text-white">
          {value}
        </div>
        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">
          {label}
        </div>
        {subtitle && (
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runMessage, setRunMessage] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [hostelFilter, setHostelFilter] = useState("ALL");

  // assign room modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [assigning, setAssigning] = useState(false);

  // add student modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [unmatchedStudents, setUnmatchedStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/matching/all");
      setMatches(res.data);
    } catch (err) {
      console.error("Error fetching matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const runMatching = async () => {
    setRunning(true);
    setRunMessage("");
    try {
      const res = await api.post("/api/matching/run");
      setRunMessage(res.data.message);
      fetchMatches();
    } catch (err) {
      setRunMessage("Error running matching algorithm.");
    } finally {
      setRunning(false);
    }
  };

  const openAssignModal = (match) => {
    setSelectedMatch(match);
    setRoomId(match.roomId || "");
    setShowAssignModal(true);
  };

  const handleAssignRoom = async () => {
    if (!roomId.trim()) return;
    setAssigning(true);
    try {
      await api.put(`/api/matching/${selectedMatch._id}/assign-room`, {
        roomId,
      });
      setShowAssignModal(false);
      fetchMatches();
    } catch (err) {
      console.error(err);
    } finally {
      setAssigning(false);
    }
  };

  const openAddModal = async (match) => {
    setSelectedMatch(match);
    setSelectedStudentId("");
    setShowAddModal(true);
    try {
      const [studentsRes, matchesRes] = await Promise.all([
        api.get("/api/warden/all-students"),
        api.get("/api/matching/all"),
      ]);
      const matchedIds = new Set(
        matchesRes.data.flatMap((m) => m.students.map((s) => s._id))
      );
      const unmatched = studentsRes.data.filter((s) => !matchedIds.has(s.id));
      setUnmatchedStudents(unmatched);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedStudentId) return;
    setAdding(true);
    try {
      await api.put(`/api/matching/${selectedMatch._id}/add-student`, {
        studentId: selectedStudentId,
      });
      setShowAddModal(false);
      fetchMatches();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const roomTypeToNumber = { TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

  // Metrics
  const totalMatches = matches.length;
  const confirmed = matches.filter((m) => m.status === "CONFIRMED");
  const complete = matches.filter((m) => m.status === "COMPLETE");
  const incomplete = matches.filter((m) => m.status === "INCOMPLETE");
  const avgScore = totalMatches > 0
    ? Math.round(matches.reduce((acc, m) => acc + (m.compatibilityScore || 0), 0) / totalMatches)
    : 0;

  // Filtered Matches
  const filteredMatches = matches.filter((m) => {
    // Status filter
    if (statusFilter !== "ALL" && m.status !== statusFilter) return false;
    // Hostel filter
    if (hostelFilter !== "ALL" && m.hostelType !== hostelFilter) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRoom = m.roomId?.toLowerCase() || "";
      const matchStudents = m.students.some(
        (s) => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
      );
      return matchRoom.includes(q) || matchStudents;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E]">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-[#083067] dark:text-white">
            Loading Roommate Matches...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-[#f8f9ff] dark:bg-[#0F1F2E] min-h-screen space-y-6">
      {/* Header & Main Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <PageHeader title="Roommate Matching Command Center" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Displaying {totalMatches} Matched Roommate Groups & AI Compatibility Ratings
          </p>
        </div>
        <button
          onClick={runMatching}
          disabled={running}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#1B3C53] hover:bg-[#244f6d] text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-60 shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          {running ? "Running Match Engine..." : "Run AI Matching Algorithm"}
        </button>
      </div>

      {runMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {runMessage}
        </div>
      )}

      {/* Stats Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatSquare
          icon={Users}
          iconBg="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
          value={totalMatches}
          label="Total Matched Pairs"
          subtitle="Generated roommate groups"
        />

        <StatSquare
          icon={Percent}
          iconBg="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
          value={`${avgScore}%`}
          label="Avg Compatibility"
          subtitle="Preference alignment"
        />

        <StatSquare
          icon={CheckCircle}
          iconBg="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
          value={confirmed.length}
          label="Confirmed & Roomed"
          subtitle="Room allocated"
        />

        <StatSquare
          icon={Clock}
          iconBg="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
          value={complete.length + incomplete.length}
          label="Pending Action"
          subtitle="Awaiting room assignment"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#1A2F42] p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or room..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0F1F2E] border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 dark:bg-[#0F1F2E] border border-gray-200 dark:border-gray-600 text-xs font-semibold text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All Statuses ({totalMatches})</option>
            <option value="CONFIRMED">Confirmed ({confirmed.length})</option>
            <option value="COMPLETE">Awaiting Room ({complete.length})</option>
            <option value="INCOMPLETE">Incomplete ({incomplete.length})</option>
          </select>

          <select
            value={hostelFilter}
            onChange={(e) => setHostelFilter(e.target.value)}
            className="bg-gray-50 dark:bg-[#0F1F2E] border border-gray-200 dark:border-gray-600 text-xs font-semibold text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All Hostels</option>
            <option value="BOYS_HOSTEL">Boys Hostel</option>
            <option value="GIRLS_HOSTEL">Girls Hostel</option>
          </select>
        </div>
      </div>

      {/* Matches Grid List */}
      {filteredMatches.length === 0 ? (
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-12 shadow-sm text-center border border-gray-100 dark:border-gray-700">
          <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#083067] dark:text-white mb-1">
            No matching roommate records found
          </h3>
          <p className="text-xs text-gray-400">
            Try adjusting your search query or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((match, idx) => {
            const targetSize = roomTypeToNumber[match.roomType] || 2;
            const currentSize = match.students.length;

            return (
              <div
                key={match._id || idx}
                className="bg-white dark:bg-[#1A2F42] rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Status, Hostel & Compatibility */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={match.status} />
                      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                        {match.hostelType === "BOYS_HOSTEL" ? "Boys Hostel" : "Girls Hostel"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full text-xs font-extrabold">
                      <Sparkles className="w-3 h-3" />
                      {match.compatibilityScore}% Match
                    </div>
                  </div>

                  {/* Room & Capacity Details */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                        Assigned Room
                      </h4>
                      <p className="text-base font-extrabold text-[#083067] dark:text-white flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-4 h-4 text-blue-500" />
                        {match.roomId ? `Room ${match.roomId}` : "Unassigned"}
                      </p>
                    </div>

                    <div className="text-right">
                      <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                        Occupancy
                      </h4>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                        {match.roomType} Seater ({currentSize}/{targetSize})
                      </p>
                    </div>
                  </div>

                  {/* Students List */}
                  <div className="space-y-2 mb-4">
                    {match.students.map((s) => (
                      <div
                        key={s._id}
                        className="flex items-center justify-between bg-gray-50 dark:bg-[#0F1F2E] px-3.5 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-[#1B3C53] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {s.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              {s.name}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                              {s.email}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-semibold shrink-0">
                          Student
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                  {match.students.length < targetSize && (
                    <button
                      onClick={() => openAddModal(match)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#0F1F2E] transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Roommate
                    </button>
                  )}

                  <button
                    onClick={() => openAssignModal(match)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1B3C53] hover:bg-[#244f6d] text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <Home className="w-3.5 h-3.5" />
                    {match.roomId ? "Change Room" : "Assign Room"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign Room Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#083067] dark:text-white">
                Assign Room Number
              </h3>
              <button onClick={() => setShowAssignModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Assigning room for {selectedMatch?.students?.length} matched students.
            </p>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="e.g. 101, 102, 201..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#0F1F2E] text-xs text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-5 font-bold"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignRoom}
                disabled={assigning || !roomId.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#1B3C53] hover:bg-[#244f6d] text-white text-xs font-bold transition shadow-sm disabled:opacity-60"
              >
                {assigning ? "Saving..." : "Save Room"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#083067] dark:text-white">
                Add Unmatched Student to Group
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              Select an unmatched student to pair with this roommate group.
            </p>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#0F1F2E] text-xs text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-5"
            >
              <option value="">Select student...</option>
              {unmatchedStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                disabled={adding || !selectedStudentId}
                className="flex-1 py-2.5 rounded-xl bg-[#1B3C53] hover:bg-[#244f6d] text-white text-xs font-bold transition shadow-sm disabled:opacity-60"
              >
                {adding ? "Adding..." : "Add Roommate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
