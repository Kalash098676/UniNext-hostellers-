import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Users,
  Save,
  Pencil,
  CheckCircle,
  Lock,
} from "lucide-react";

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {options.map((opt) => {
        const Icon = opt.icon;
        const selected = value === opt.value;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center justify-center gap-2 rounded-xl border
            px-2 sm:px-4
            py-3
            text-[10px] sm:text-xs sm:text-sm
            font-medium
            transition-colors
            ${
              selected
                ? "border-[#083067] bg-[#eff4ff] text-[#083067] dark:bg-blue-900/20 dark:border-blue-400 dark:text-white"
                : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">
        {label}
      </p>
      <p className="text-base sm:text-sm font-medium text-[#083067] dark:text-white break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-[#eff4ff] dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#083067] dark:text-blue-400" />
      </div>

      <h3 className="text-base font-semibold text-[#083067] dark:text-white">
        {title}
      </h3>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}) {
  return (
    <div>
      <label className="block text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {disabled && (
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${disabled ? "pl-9" : "pl-4"} pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#083067]/20 ${
            disabled
              ? "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "border-gray-200 dark:border-gray-600 bg-white dark:bg-white/5 text-[#083067] dark:text-white"
          }`}
        />
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // form state
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [hostelType, setHostelType] = useState("");
  const [parentContactNo, setParentContactNo] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/student/profile");
      setProfile(res.data);
      // pre-fill form with existing data
      if (res.data) {
        setName(res.data.name || "");
        setContactNo(res.data.contactNo || "");
        setBranch(res.data.branch || "");
        setYear(res.data.year || "");
        setGender(res.data.gender || "");
        setHostelType(res.data.hostelType || "");
        setParentContactNo(res.data.parentContactNo || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branch || !year || !gender || !hostelType || !parentContactNo.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const res = await api.put("/api/student/profile", {
        branch,
        year: Number(year),
        gender,
        hostelType,
        parentContactNo,
      });
      setProfile({ ...profile, ...res.data.profile, profileComplete: true });
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong.");
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

  if (!profile?.profileComplete && !showForm) {
    return (
      <EmptyState
        title="Complete Your Profile"
        icon={User}
        description="Your student profile is incomplete. Please complete your profile so hostel information and roommate matching can work correctly."
        primaryAction={() => setShowForm(true)}
        primaryLabel="Complete Profile"
      />
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E] p-6">
        <PageHeader title="Profile" showBack backTo="/student-dashboard" />
        <div className="max-w-2xl mx-auto w-full">
          <p className="text-sm text-gray-400 mb-6">
            Update your residential records
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-6 shadow-sm">
              <SectionHeader icon={User} title="Personal Info" />
              <div className="space-y-4">
                <InputField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
                <InputField
                  label="Email (Read-only)"
                  value={user?.email || ""}
                  disabled
                />
                <InputField
                  label="Contact Number"
                  type="tel"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-6 shadow-sm">
              <SectionHeader icon={GraduationCap} title="Academic Details" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-500 mb-1.5">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/20"
                  >
                    <option value="">Select Branch</option>
                    {[
                      "Computer Science",
                      "Information Technology",
                      "Electronics",
                      "Mechanical",
                      "Civil",
                      "Chemical",
                      "Other",
                    ].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-500 mb-1.5">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/20"
                  >
                    <option value="">Select Year</option>
                    {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(
                      (y, i) => (
                        <option key={y} value={i + 1}>
                          {y}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-6 shadow-sm">
              <SectionHeader icon={Building2} title="Personal Details" />
              <div className="space-y-4 lg:space-y-5">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-500 mb-2">
                    Gender
                  </label>
                  <ToggleGroup
                    options={[
                      { value: "MALE", label: "Male", icon: User },
                      { value: "FEMALE", label: "Female", icon: User },
                      { value: "OTHER", label: "Other", icon: Users },
                    ]}
                    value={gender}
                    onChange={setGender}
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-500 mb-2">
                    Hostel Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: "BOYS_HOSTEL",
                        label: "Boys Hostel",
                        sub: "STANDARD",
                      },
                      {
                        value: "GIRLS_HOSTEL",
                        label: "Girls Hostel",
                        sub: "STANDARD",
                      },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setHostelType(opt.value)}
                        className={`flex flex-col items-center justify-center py-4 rounded-xl border text-sm font-medium transition-colors ${
                          hostelType === opt.value
                            ? "border-[#083067] bg-[#eff4ff] text-[#083067] dark:bg-blue-900/20 dark:border-blue-400 dark:text-white"
                            : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Building2 className="w-5 h-5 mb-1" />
                        {opt.label}
                        <span className="text-[10px] tracking-wider text-gray-400 mt-0.5">
                          {opt.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <InputField
                  label="Emergency Contact (Parent)"
                  type="tel"
                  value={parentContactNo}
                  onChange={(e) => setParentContactNo(e.target.value)}
                  placeholder="Parent's mobile number"
                />
              </div>
            </div>

            {formError && <p className="text-[10px] sm:text-xs text-red-500">{formError}</p>}

            <div className="flex gap-3">
              {showForm && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormError("");
                  }}
                  className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {submitting ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const yearLabels = {
    1: "1st Year",
    2: "2nd Year",
    3: "3rd Year",
    4: "4th Year",
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E] px-4 py-4 sm:p-6">
      <PageHeader title="Profile" showBack backTo="/student-dashboard" />

      <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 sm:p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {profile?.name?.charAt(0)?.toUpperCase() ||
                user?.email?.charAt(0)?.toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-lg font-bold text-[#083067] dark:text-white break-words">
                {profile?.name || user?.email?.split("@")[0]}
              </h2>

              <p className="mt-1 text-[10px] sm:text-xs text-gray-400 flex items-center gap-1 break-all">
                <Mail className="w-3 h-3 flex-shrink-0" />
                {user?.email}
              </p>

              <div className="mt-2 sm:hidden">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Profile Complete
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch sm:items-end gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Profile Complete
            </span>

            <button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto sm:self-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-[#083067] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Update Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Personal Info */}
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 sm:p-5 shadow-sm">
          <SectionHeader icon={User} title="Personal Info" />
          <div className="space-y-4 lg:space-y-5">
            <InfoField label="Full Name" value={profile?.name} />
            <InfoField label="Email Address" value={user?.email} />
            <InfoField label="Contact Number" value={profile?.contactNo} />
          </div>
        </div>

        {/* Academic Details */}
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 sm:p-5 shadow-sm">
          <SectionHeader icon={GraduationCap} title="Academic Details" />
          <div className="space-y-4 lg:space-y-5">
            <InfoField label="Branch / Major" value={profile?.branch} />
            <InfoField
              label="Academic Year"
              value={yearLabels[profile?.year] || profile?.year}
            />
          </div>
        </div>

        {/* Hostel Details */}
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 sm:p-5 shadow-sm">
          <SectionHeader icon={Building2} title="Hostel Details" />
          <div className="space-y-4 lg:space-y-5">
            <InfoField label="Gender" value={profile?.gender} />
            <InfoField
              label="Hostel Type"
              value={profile?.hostelType?.replace("_", " ")}
            />
            <InfoField
              label="Parent Contact"
              value={profile?.parentContactNo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
