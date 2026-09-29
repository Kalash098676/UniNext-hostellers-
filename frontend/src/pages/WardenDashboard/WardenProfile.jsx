import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import {
  User, Mail, Phone, Building2, Pencil,
  Save, Lock, Eye, EyeOff, X
} from "lucide-react";

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-[#083067] dark:text-white">
        {value || "—"}
      </p>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, disabled }) {
  return (
    <div>
      <label className="block text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#083067]/20 ${
          disabled
            ? "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-gray-400 cursor-not-allowed"
            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-white/5 text-[#083067] dark:text-white"
        }`}
      />
    </div>
  );
}

export default function WardenProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [hostelType, setHostelType] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/warden/profile");
      setProfile(res.data);
      setName(res.data.name || "");
      setEmail(res.data.email || "");
      setContactNo(res.data.contactNo || "");
      setHostelType(res.data.hostelType || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !contactNo.trim() || !hostelType) {
      setFormError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      await api.put("/api/warden/update-profile", { name, email, contactNo, hostelType });
      setProfile({ ...profile, name, email, contactNo, hostelType });
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordSubmitting(true);
    try {
      await api.put("/api/warden/update-profile/update-password", {
        oldPassword, newPassword,
      });
      setPasswordSuccess("Password updated successfully!");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => setShowPasswordModal(false), 1200);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPasswordSubmitting(false);
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
    <div className="p-4 lg:p-6 bg-[#f8f9ff] dark:bg-[#0F1F2E] min-h-screen">
      <PageHeader title="Profile" 
      showBack
      backTo="/warden-dashboard" />

      {!showForm ? (
        <>
          {/* View card */}
         <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-5 shadow-sm mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-4 text-center lg:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {profile?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#083067] dark:text-white">
                  {profile?.name}
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3" />
                  {profile?.email}
                </p>
              </div>
            </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 w-full sm:w-auto px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-[#083067] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-[#083067] hover:bg-[#0a3d80] text-white rounded-xl text-sm font-medium transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Info card */}
          <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-6 shadow-sm max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#eff4ff] dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-[#083067] dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-[#083067] dark:text-white">
                Personal Info
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoField label="Full Name" value={profile?.name} />
              <InfoField label="Email" value={profile?.email} />
              <InfoField label="Contact Number" value={profile?.contactNo} />
              <InfoField label="Hostel Type" value={profile?.hostelType?.replace("_", " ")} />
            </div>
          </div>
        </>
      ) : (
        /* Edit form */
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-6 shadow-sm max-w-xl mx-auto">
          <h3 className="text-sm font-semibold text-[#083067] dark:text-white mb-4">
            Edit Profile
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField label="Contact Number" type="tel" value={contactNo} onChange={(e) => setContactNo(e.target.value)} />

            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-500 mb-2">Hostel Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "BOYS_HOSTEL", label: "Boys Hostel" },
                  { value: "GIRLS_HOSTEL", label: "Girls Hostel" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setHostelType(opt.value)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-colors ${
                      hostelType === opt.value
                        ? "border-[#083067] bg-[#eff4ff] text-[#083067] dark:bg-blue-900/20 dark:border-blue-400 dark:text-white"
                        : "border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {formError && <p className="text-[10px] sm:text-xs text-red-500">{formError}</p>}

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change password modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-xl w-full max-w-sm p-5 sm:p-6 relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-[#083067] dark:text-white mb-1">
              Change Password
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Enter your current and new password.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-500 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-500 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <InputField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {passwordError && <p className="text-[10px] sm:text-xs text-red-500">{passwordError}</p>}
              {passwordSuccess && <p className="text-[10px] sm:text-xs text-emerald-500">{passwordSuccess}</p>}

              <button
                type="submit"
                disabled={passwordSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {passwordSubmitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}