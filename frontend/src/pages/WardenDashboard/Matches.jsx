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
  AlertCircle,
} from "lucide-react";

function StatusBadge({ status }) {
  const map = {
    INCOMPLETE: { label: "Incomplete", color: "bg-amber-50 text-amber-500" },
    COMPLETE: { label: "Complete", color: "bg-blue-50 text-blue-500" },
    CONFIRMED: { label: "Confirmed", color: "bg-emerald-50 text-emerald-600" },
  };
  const s = map[status] || map.INCOMPLETE;
  return (
    <span
      className={`text-[10px] px-2 py-1 rounded-full font-semibold ${s.color}`}
    >
      {s.label}
    </span>
  );
}

function StatSquare({ icon, iconBg, value, label, description }) {
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

      <div className="text-[9px] sm:text-[10px] font-medium text-gray-600 dark:text-gray-400 tracking-wider mt-1 uppercase">
        {label}
      </div>

      {description && (
        <p className="mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runMessage, setRunMessage] = useState("");

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
      console.error(err);
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
    setRoomId("");
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
    // fetch all students then filter out already matched ones
    try {
      const [studentsRes, matchesRes] = await Promise.all([
        api.get("/api/warden/all-students"),
        api.get("/api/matching/all"),
      ]);
      const matchedIds = new Set(
        matchesRes.data.flatMap((m) => m.students.map((s) => s._id)),
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

  const incomplete = matches.filter((m) => m.status === "INCOMPLETE");
  const complete = matches.filter((m) => m.status === "COMPLETE");
  const confirmed = matches.filter((m) => m.status === "CONFIRMED");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#083067] dark:text-white font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-[#f8f9ff] dark:bg-[#0F1F2E] min-h-screen">
      <div className="mb-6">
        <PageHeader title="Roommate Matches" />
        <button
          onClick={runMatching}
          disabled={running}
          className="lg:hidden mt-3 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          <Play className="w-4 h-4" />
          {running ? "Running..." : "Run Matching Algorithm"}
        </button>
        <button
          onClick={runMatching}
          disabled={running}
          className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 absolute top-6 right-6"
        >
          <Play className="w-4 h-4" />
          {running ? "Running..." : "Run Matching Algorithm"}
        </button>
      </div>

      {runMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {runMessage}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatSquare
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          iconBg="bg-amber-50"
          value={incomplete.length}
          label="INCOMPLETE"
          subtitle="Need more students"
        />

        <StatSquare
          icon={<Users className="w-5 h-5 text-blue-500" />}
          iconBg="bg-blue-50"
          value={complete.length}
          label="AWAITING ROOM"
          subtitle="Ready to assign"
        />

        <StatSquare
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
          iconBg="bg-emerald-50"
          value={confirmed.length}
          label="CONFIRMED"
          subtitle="Room assigned"
        />
      </div>

      {/* Matches list */}
      {matches.length === 0 ? (
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-12 shadow-sm text-center">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#083067] dark:text-white mb-1">
            No matches yet
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-400">
            Click "Run Matching Algorithm" to start matching students.
          </p>
        </div>
      ) : (
       <div className="space-y-4">
  {matches.map((match) => {
    const targetSize = roomTypeToNumber[match.roomType];
    const currentSize = match.students.length;

    return (
      <div
        key={match._id}
        className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 lg:p-5 shadow-sm"
      >
        {/* ================= Desktop ================= */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <StatusBadge status={match.status} />

              <span className="text-[10px] sm:text-xs text-gray-400">
                {match.hostelType.replace("_", " ")} ·{" "}
                {match.roomType} Room · {currentSize}/{targetSize} students
              </span>

              <span className="text-[10px] sm:text-xs font-semibold text-blue-400">
                {match.compatibilityScore}% compatible
              </span>
            </div>

            <div className="flex gap-2">
              {match.students.length < roomTypeToNumber[match.roomType] && (
                <button
                  onClick={() => openAddModal(match)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-[10px] sm:text-xs font-medium text-[#083067] dark:text-white hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Student
                </button>
              )}

              {(match.status === "COMPLETE" ||
                match.status === "INCOMPLETE") && (
                <button
                  onClick={() => openAssignModal(match)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#083067] hover:bg-[#0a3d80] text-white rounded-lg text-[10px] sm:text-xs font-medium transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  Assign Room
                </button>
              )}

              {match.status === "CONFIRMED" && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] sm:text-xs font-medium">
                  <Home className="w-3.5 h-3.5" />
                  Room {match.roomId}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {match.students.map((s) => (
              <div
                key={s._id}
                className="flex items-center gap-3 bg-gray-50 dark:bg-[#162636] px-3 py-3 rounded-xl"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white text-xs font-bold">
                  {s.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-xs font-medium text-[#083067] dark:text-white">
                    {s.name}
                  </p>
                  <p className="text-[10px] text-gray-400">{s.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= Mobile ================= */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between">
            <StatusBadge status={match.status} />

            {match.status === "CONFIRMED" ? (
              <span className="text-xs font-semibold text-emerald-600">
                Room {match.roomId}
              </span>
            ) : (
              <span className="text-xs font-semibold text-blue-500">
                {match.compatibilityScore}% Match
              </span>
            )}
          </div>

          <div className="mt-3">
            <p className="text-sm font-semibold text-[#083067] dark:text-white">
              {match.hostelType.replace("_", " ")}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {match.roomType} Room • {currentSize}/{targetSize} Students
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {match.students.map((s) => (
              <div
                key={s._id}
                className="flex items-center gap-3 bg-gray-50 dark:bg-[#162636] rounded-xl px-3 py-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white text-xs font-bold">
                  {s.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-medium text-[#083067] dark:text-white">
                    {s.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {s.email}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {match.students.length < roomTypeToNumber[match.roomType] && (
              <button
                onClick={() => openAddModal(match)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 text-sm font-medium text-[#083067] dark:text-white"
              >
                Add Student
              </button>
            )}

            {(match.status === "COMPLETE" ||
              match.status === "INCOMPLETE") && (
              <button
                onClick={() => openAssignModal(match)}
                className="w-full bg-[#083067] text-white rounded-xl py-2.5 text-sm font-medium"
              >
                Assign Room
              </button>
            )}
          </div>
        </div>
      </div>
    );
  })}
</div>
      )}

      {/* Assign Room Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <h3 className="text-sm font-bold text-[#083067] dark:text-white">
                Assign Room
              </h3>
              <button onClick={() => setShowAssignModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mb-4">
              Assigning a room to {selectedMatch?.students?.length} students.
              This will update all their profiles.
            </p>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="e.g. A-204"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/20 mb-5"
            />
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="w-full sm:flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignRoom}
                disabled={assigning || !roomId.trim()}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {assigning ? "Assigning..." : "Assign Room"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-xl  w-full max-w-md p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-[#083067] dark:text-white">
                Add Student to Group
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-5">
              Select an unmatched student to add to this group.
            </p>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/20 mb-5"
            >
              <option value="">Select student...</option>
              {unmatchedStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full sm:flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                disabled={adding || !selectedStudentId}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {adding ? "Adding..." : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
