import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";
import api from "../../api/axios";
import { Search, Eye, X, Users, User, Users2 } from "lucide-react";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, SetLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    SetLoading(true);
    try {
      const res = await api.get("/api/warden/all-students");
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      SetLoading(false);
    }
  };

  const fetchStudentDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await api.get(`/api/warden/student/${id}`);
      setSelectedStudent(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.room.toLowerCase().includes(search.toLowerCase()),
  );

  const totalBoys = students.filter((s) => s.gender === "MALE").length;
  const totalGirls = students.filter((s) => s.gender === "FEMALE").length;

  const yearLabel = {
    1: "1st Year",
    2: "2nd Year",
    3: "3rd Year",
    4: "4th Year",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#083067] dark:text-white font-medium">Loading...</p>
      </div>
    );
  }
  return (
    <div className="p-4 lg:p-6 bg-[#f8f9ff] dark:bg-[#0F1F2E] min-h-screen">
      <PageHeader title={" All Students"} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <StatSquare
          icon={<Users className="w-4 h-4 text-[#083067] dark:text-white" />}
          iconBg="bg-[#d5e3ff] dark:bg-blue-900/20"
          value={students.length}
          label="TOTAL STUDENTS"
        />
        <StatSquare
          icon={<User className="w-4 h-4 text-[#083067] dark:text-white" />}
          iconBg="bg-[#d5e3ff] dark:bg-blue-900/20"
          value={totalBoys}
          label="BOYS HOSTEL"
        />
        <StatSquare
          icon={<Users2 className="w-4 h-4 text-[#083067] dark:text-white" />}
          iconBg="bg-[#ffddb8] dark:bg-pink-900/20"
          value={totalGirls}
          label="GIRLS HOSTEL"
        />
      </div>

      {/* Search + Table */}
      <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-sm">
        {/* Search bar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/20"
            />
          </div>
        </div>

        {/* Table */}
        {/* Table — desktop only and cards for the mobile view for better responsiveness */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-left">
                <th className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Room No.
                </th>
                <th className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Profile Status
                </th>
                <th className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-sm text-gray-400"
                  >
                    No students found
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold flex-shrink-0">
                          {s.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#083067] dark:text-white">
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {s.branch || "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {yearLabel[s.year] || "—"}
                    </td>
                    <td className="px-5 py-4">
                      {s.gender ? (
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                            s.gender === "MALE"
                              ? "bg-blue-50 text-blue-500"
                              : s.gender === "FEMALE"
                                ? "bg-pink-50 text-pink-500"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {s.gender}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {s.room !== "Not Assigned" ? s.room : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                          s.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-500"
                        }`}
                      >
                        • {s.status === "Active" ? "Complete" : "Incomplete"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => fetchStudentDetail(s.id)}
                        className="p-2 hover:bg-[#eff4ff] dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-[#083067] dark:text-blue-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards — mobile only */}
        <div className="lg:hidden divide-y divide-gray-50 dark:divide-gray-700">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">
              No students found
            </p>
          ) : (
            filtered.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {s.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#083067] dark:text-white">
                      {s.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {s.branch || "—"} • {yearLabel[s.year] || "—"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Room: {s.room !== "Not Assigned" ? s.room : "—"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => fetchStudentDetail(s.id)}
                  className="p-2 hover:bg-[#eff4ff] dark:hover:bg-blue-900/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <Eye className="w-4 h-4 text-[#083067] dark:text-blue-400" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-[10px] sm:text-xs text-gray-400">
            Showing {filtered.length} of {students.length} students
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {(selectedStudent || detailLoading) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            {detailLoading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-[#083067] dark:text-white font-medium">
                  Loading...
                </p>
              </div>
            ) : (
              <>
                {/* Modal header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white font-bold text-lg">
                      {selectedStudent?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#083067] dark:text-white">
                        {selectedStudent?.user?.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-400">
                        {selectedStudent?.user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {/* Basic info */}
                  <Section title="Basic Info">
                    <Row
                      label="Contact"
                      value={selectedStudent?.user?.contactNo}
                    />
                  </Section>

                  {/* Profile */}
                  {selectedStudent?.profile && (
                    <Section title="Profile">
                      <Row
                        label="Branch"
                        value={selectedStudent.profile.branch}
                      />
                      <Row
                        label="Year"
                        value={yearLabel[selectedStudent.profile.year]}
                      />
                      <Row
                        label="Gender"
                        value={selectedStudent.profile.gender}
                      />
                      <Row
                        label="Hostel"
                        value={selectedStudent.profile.hostelType?.replace(
                          "_",
                          " ",
                        )}
                      />
                      <Row
                        label="Room"
                        value={selectedStudent.profile.roomId || "Not Assigned"}
                      />
                      <Row
                        label="Parent Contact"
                        value={selectedStudent.profile.parentContactNo}
                      />
                    </Section>
                  )}

                  {/* Preferences */}
                  {selectedStudent?.preference && (
                    <Section title="Roommate Preferences">
                      <Row
                        label="Schedule"
                        value={selectedStudent.preference.scheduleType}
                      />
                      <Row
                        label="Cleanliness"
                        value={selectedStudent.preference.cleanlinessLevel}
                      />
                      <Row
                        label="Noise"
                        value={selectedStudent.preference.noisePreference}
                      />
                      <Row
                        label="Study"
                        value={selectedStudent.preference.studyPreference}
                      />
                      <Row
                        label="Room Type"
                        value={selectedStudent.preference.roomType}
                      />
                    </Section>
                  )}

                  {!selectedStudent?.profile && (
                    <p className="text-[10px] sm:text-xs text-gray-400 text-center py-2">
                      Profile not completed yet
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function Section({ title, children }) {
  return (
    <div>
      <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h4>
      <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-3">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] sm:text-xs text-gray-400">{label}</span>
      <span className="text-[10px] sm:text-xs font-medium text-[#083067] dark:text-white">
        {value || "—"}
      </span>
    </div>
  );
}

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

export default Students;
