import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Settings, User, Lock, Save, Shield } from "lucide-react";

export default function WardenSettings() {
  const [profile, setProfile] = useState({ name: "", email: "", contactNo: "", hostelType: "BOYS_HOSTEL" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/warden/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/api/warden/update-profile", profile);
      setMsg({ type: "success", text: "Profile details updated successfully!" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setMsg({ type: "error", text: "New passwords do not match!" });
    }

    try {
      await api.put("/api/warden/update-profile/update-password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      setMsg({ type: "success", text: "Password changed successfully!" });
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Password update failed" });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-blue-600" />
          Admin & Warden Account Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage administrative contact details, assigned hostel block, and access passwords.
        </p>
      </div>

      {msg.text && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between ${
            msg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg({ type: "", text: "" })} className="text-xs underline">Dismiss</button>
        </div>
      )}

      {/* Profile Details Form */}
      <div className="bg-white dark:bg-[#1A2F42] p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" /> Administrator Details
        </h3>

        {loading ? (
          <div className="py-4 text-gray-500 text-sm">Loading admin profile...</div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number</label>
                <input
                  type="text"
                  value={profile.contactNo || ""}
                  onChange={(e) => setProfile({ ...profile, contactNo: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Hostel Category</label>
                <select
                  value={profile.hostelType || "BOYS_HOSTEL"}
                  onChange={(e) => setProfile({ ...profile, hostelType: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                >
                  <option value="BOYS_HOSTEL">Boys Hostel</option>
                  <option value="GIRLS_HOSTEL">Girls Hostel</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#1B3C53] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#234C6A] flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" /> Save Profile Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Change Password Form */}
      <div className="bg-white dark:bg-[#1A2F42] p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-500" /> Security & Password Update
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4 text-sm max-w-md">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={passwords.oldPassword}
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
              className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-sm"
            >
              <Shield className="w-4 h-4" /> Update Admin Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
