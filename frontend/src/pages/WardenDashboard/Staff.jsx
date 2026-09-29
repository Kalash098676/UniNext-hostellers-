import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { Users, UserPlus, Search, Trash2, Mail, Shield, Clock, Building, X, CheckCircle, AlertCircle } from "lucide-react";

const DEPARTMENTS = ["MAINTENANCE", "SECURITY", "HOUSEKEEPING", "MESS", "CLEANING", "LAUNDRY"];
const SHIFTS = ["MORNING", "AFTERNOON", "NIGHT", "FULL_DAY"];
const HOSTEL_TYPES = ["BOYS_HOSTEL", "GIRLS_HOSTEL"];

export default function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Register Modal state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dept: "MAINTENANCE",
    shift: "MORNING",
    hostelType: "BOYS_HOSTEL",
    generatedPassword: "",
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/warden/all-staff");
      setStaffList(res.data);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
    let pwd = "";
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, generatedPassword: pwd }));
  };

  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.generatedPassword) {
      setError("Please fill in name, email, and password.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/warden/register-staff", formData);
      setSuccess(`Staff member ${formData.name} registered successfully!`);
      fetchStaff();
      setFormData({
        name: "",
        email: "",
        dept: "MAINTENANCE",
        shift: "MORNING",
        hostelType: "BOYS_HOSTEL",
        generatedPassword: "",
      });
      setTimeout(() => {
        setSuccess("");
        setShowModal(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register staff.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await api.delete(`/api/warden/staff/${id}`);
      setStaffList(staffList.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete staff:", err);
    }
  };

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.dept.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E]">
        <p className="text-[#083067] dark:text-white font-medium">Loading staff records...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-[#f8f9ff] dark:bg-[#0F1F2E] min-h-screen">
      <PageHeader title="Hostel Staff Management" showBack backTo="/warden-dashboard" />

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name, email, department..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A2F42] text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/20"
          />
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            handleGeneratePassword();
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Register New Staff
        </button>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-12 text-center shadow-sm">
          <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#083067] dark:text-white">No Staff Members Found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {search ? "No staff match your search query." : "No staff members registered yet. Click 'Register New Staff' to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="bg-white dark:bg-[#1A2F42] rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm relative group transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-[#083067] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {staff.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#083067] dark:text-white">{staff.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" /> {staff.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteStaff(staff.id)}
                  title="Remove Staff"
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 dark:bg-[#162636] p-2.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-medium uppercase">Department</span>
                  <span className="font-semibold text-[#083067] dark:text-blue-300 mt-0.5 block truncate">
                    {staff.dept}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-[#162636] p-2.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-medium uppercase">Shift</span>
                  <span className="font-semibold text-[#083067] dark:text-blue-300 mt-0.5 block truncate">
                    {staff.shift}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3 text-gray-400" />
                  {staff.hostelType.replace("_", " ")}
                </span>
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full font-medium">
                  ROLE_STAFF
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#083067] dark:text-white mb-1">
              Register New Staff
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Add a staff member to manage maintenance, security, mess, or housekeeping.
            </p>

            <form onSubmit={handleRegisterStaff} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anil Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#162636] text-[#083067] dark:text-white focus:ring-1 focus:ring-[#083067] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="staff@uninest.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#162636] text-[#083067] dark:text-white focus:ring-1 focus:ring-[#083067] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#162636] text-[#083067] dark:text-white focus:ring-1 focus:ring-[#083067] focus:outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d} className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Shift
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#162636] text-[#083067] dark:text-white focus:ring-1 focus:ring-[#083067] focus:outline-none"
                  >
                    {SHIFTS.map((s) => (
                      <option key={s} value={s} className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Hostel Block
                </label>
                <select
                  value={formData.hostelType}
                  onChange={(e) => setFormData({ ...formData, hostelType: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#162636] text-[#083067] dark:text-white focus:ring-1 focus:ring-[#083067] focus:outline-none"
                >
                  {HOSTEL_TYPES.map((h) => (
                    <option key={h} value={h} className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">{h.replace("_", " ")}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Generated Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10px] text-blue-500 hover:underline font-medium"
                  >
                    Regenerate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.generatedPassword}
                  onChange={(e) => setFormData({ ...formData, generatedPassword: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#162636] text-[#083067] dark:text-white font-mono focus:ring-1 focus:ring-[#083067] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#083067] hover:bg-[#0a3d80] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {submitting ? "Registering..." : "Create Staff Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}