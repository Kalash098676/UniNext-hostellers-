import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import {
  Sun,
  Moon,
  Repeat,
  Sparkles,
  CheckCircle,
  History,
  VolumeX,
  Volume1,
  Volume2,
  User,
  Users,
  Thermometer,
  BedDouble,
  ClipboardList,
  Clock,
  Brush,
  BookOpen,
  ShieldAlert,
} from "lucide-react";

const SCHEDULE_OPTIONS = [
  { value: "MORNING_PERSON", label: "Morning Person", icon: Sun },
  { value: "NIGHT_PERSON", label: "Night Person", icon: Moon },
  { value: "FLEXIBLE", label: "Flexible", icon: Repeat },
];
const CLEANLINESS_OPTIONS = [
  { value: "HIGH", label: "High", icon: Brush },
  { value: "MEDIUM", label: "Medium", icon: CheckCircle },
  { value: "LOW", label: "Low", icon: History },
];

const NOISE_OPTIONS = [
  { value: "QUIET", label: "Quiet", icon: VolumeX },
  { value: "OKAY", label: "Okay", icon: Volume1 },
  { value: "NOISY", label: "Noisy", icon: Volume2 },
];

const STUDY_OPTIONS = [
  { value: "ALONE", label: "Alone", icon: User },
  { value: "GROUP", label: "Group", icon: Users },
  { value: "FLEXIBLE", label: "Flexible", icon: Repeat },
];

const ALLERGY_OPTIONS = [
  { value: "NONE", label: "None" },
  { value: "DIRT", label: "Dirt" },
  { value: "PERFUME", label: "Perfume" },
  { value: "OTHERS", label: "Others" },
];

const TEMP_OPTIONS = [
  { value: "CHILLED", label: "Chilled" },
  { value: "COOL", label: "Cool" },
  { value: "NORMAL", label: "Normal" },
  { value: "FLEXIBLE", label: "Flexible" },
];

const ROOM_TYPE_OPTIONS = [
  { value: "TWO", label: "2" },
  { value: "THREE", label: "3" },
  { value: "FOUR", label: "4" },
  { value: "FIVE", label: "5" },
];

function ToggleGroup({ options, value, onChange, columns = 3 }) {
  const colClass = columns === 2 ? "grid-cols-2" : "grid-cols-3";
  return (
    <div className={`grid ${colClass} gap-2 sm:gap-3`}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center justify-center gap-2 px-2 sm:px-4 py-3 rounded-xl text-[10px] sm:text-xs sm:text-sm font-medium transition-colors ${
              selected
                ? "border-[#083067] bg-[#eff4ff] text-[#083067] dark:bg-blue-900/20 dark:border-blue-400 dark:text-white"
                : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function PreferenceCard({ icon, value, label, description }) {
  const Icon = icon;
  return (
    <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 lg:p-5 shadow-sm">
      <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-[#083067] dark:text-white" />
      </div>
      <p className="text-[10px] font-semibold text-gray-400 tracking-wider mb-1">
        {label}
      </p>
      <h4 className="text-sm font-bold text-[#083067] dark:text-white mb-1">
        {value}
      </h4>
      {description && (
        <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed">{description}</p>
      )}
    </div>
  );
}

// lable maps
const SCHEDULE_LABELS = {
  MORNING_PERSON: {
    title: "Morning Person",
    desc: "Prefers mornings; usually active early.",
  },
  NIGHT_PERSON: {
    title: "Night Person",
    desc: "Prefers staying up late; active at night.",
  },
  FLEXIBLE: { title: "Flexible", desc: "Adapts to any schedule." },
};

const CLEANLINESS_LABELS = {
  HIGH: {
    title: "Spotless",
    desc: "Highly organized; prefers daily tidy-ups.",
  },
  MEDIUM: { title: "Moderately Tidy", desc: "Keeps things reasonably clean." },
  LOW: { title: "Relaxed", desc: "Not too particular about tidiness." },
};
const NOISE_LABELS = {
  QUIET: {
    title: "Quiet Environment",
    desc: "Prefers low volume; uses headphones for media.",
  },
  OKAY: {
    title: "Some Noise OK",
    desc: "Comfortable with moderate background noise.",
  },
  NOISY: {
    title: "Noisy Environment",
    desc: "Doesn't mind a lively, loud space.",
  },
};
const STUDY_LABELS = {
  ALONE: {
    title: "In-Room Study",
    desc: "Regularly studies alone; needs focused silence.",
  },
  GROUP: { title: "Group Study", desc: "Prefers studying with others around." },
  FLEXIBLE: {
    title: "Flexible",
    desc: "Comfortable studying alone or in groups.",
  },
};
const ALLERGY_LABELS = {
  NONE: { title: "No Allergies", desc: "No known allergy concerns." },
  DIRT: {
    title: "Dirt Allergy",
    desc: "Sensitive to dust and dirt; needs a clean space.",
  },
  PERFUME: {
    title: "Perfume Allergy",
    desc: "Sensitive to strong fragrances.",
  },
  OTHERS: {
    title: "Other Allergy",
    desc: "Has another allergy concern noted.",
  },
};
const TEMP_LABELS = {
  CHILLED: { title: "Chilled", desc: "Prefers a colder sleeping environment." },
  COOL: { title: "Cool", desc: "Prefers a cooler sleeping environment." },
  NORMAL: {
    title: "Normal",
    desc: "Comfortable at standard room temperature.",
  },
  FLEXIBLE: { title: "Flexible", desc: "Adapts to any room temperature." },
};
const ROOM_TYPE_LABELS = {
  TWO: { title: "Double Room", desc: "Shared room with one roommate." },
  THREE: { title: "Triple Room", desc: "Shared room with two roommates." },
  FOUR: { title: "Quad Room", desc: "Shared room with three roommates." },
  FIVE: { title: "Dormitory", desc: "Comfortable in larger shared rooms." },
};

const Preferences = () => {
  const [loading, setLoading] = useState(true);
  const [preference, setPreference] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  //for form
  const [scheduleType, setScheduleType] = useState("");
  const [cleanlinessLevel, setCleanlinessLevel] = useState("");
  const [noisePreference, setNoisePreference] = useState("");
  const [studyPreference, setStudyPreference] = useState("");
  const [allergy, setAllergy] = useState("");
  const [roomTempPreference, setRoomTempPreference] = useState("");
  const [roomType, setRoomType] = useState("");

  useEffect(() => {
    fetchPreference();
  }, []);

  const fetchPreference = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/preference");
      setPreference(res.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error(err);
      }
      setPreference(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !scheduleType ||
      !cleanlinessLevel ||
      !noisePreference ||
      !studyPreference ||
      !allergy ||
      !roomTempPreference ||
      !roomType
    ) {
      setFormError("Please fill in all fields before saving.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const res = await api.post("/api/preference", {
        scheduleType,
        cleanlinessLevel,
        noisePreference,
        studyPreference,
        allergy,
        roomTempPreference,
        roomType,
      });
      setPreference(res.data.preference);
      setShowForm(false);
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

  // Empty state only for now
  if (!preference && !showForm) {
    return (
      <EmptyState
        title="Room Preferences"
        icon={BedDouble}
        description="You haven't filled your room preferences yet. Complete the preference form so we can find the most compatible roommate for you."
        primaryAction={() => setShowForm(true)}
        primaryLabel="Add Preferences"
      />
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E] p-4 lg:p-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <PageHeader
            title="Preferences"
            showBack
            backTo="/student-dashboard/preferences"
          />
        </div>

        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-sm p-4 lg:p-6 w-full max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <ClipboardList className="w-5 h-5 text-[#083067] dark:text-white" />
            <h2 className="text-lg font-bold text-[#083067] dark:text-white">
              Compatibility Form
            </h2>
          </div>
          <p className="text-sm text-gray-400 mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
            Help us match you with a roommate who shares your lifestyle.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[#083067] dark:text-white mb-2">
                Schedule Type
              </h3>

              <ToggleGroup
                options={SCHEDULE_OPTIONS}
                value={scheduleType}
                onChange={setScheduleType}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#083067] dark:text-white mb-2">
                Cleanliness Level
              </h3>
              <ToggleGroup
                options={CLEANLINESS_OPTIONS}
                value={cleanlinessLevel}
                onChange={setCleanlinessLevel}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#083067] dark:text-white mb-2">
                Noise Preference
              </h3>
              <ToggleGroup
                options={NOISE_OPTIONS}
                value={noisePreference}
                onChange={setNoisePreference}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#083067] dark:text-white mb-2">
                Study Preference
              </h3>
              <ToggleGroup
                options={STUDY_OPTIONS}
                value={studyPreference}
                onChange={setStudyPreference}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-[#083067] dark:text-white mb-2">
                  Allergies
                </h3>
                <select
                  value={allergy}
                  onChange={(e) => setAllergy(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/30"
                >
                  <option value="">Select...</option>
                  {ALLERGY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#083067] dark:text-white mb-2">
                  Room Temp
                </h3>
                <ToggleGroup
                  options={TEMP_OPTIONS}
                  value={roomTempPreference}
                  onChange={setRoomTempPreference}
                  columns={2}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#083067] dark:text-white mb-2">
                Room Capacity Preference
              </h3>
              <div className="flex flex-wrap gap-3">
                {ROOM_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRoomType(opt.value)}
                    className={`w-12 h-12 rounded-full border text-sm font-semibold transition-colors flex items-center justify-center ${
                      roomType === opt.value
                        ? "border-[#083067] bg-[#eff4ff] text-[#083067] dark:bg-blue-900/20 dark:border-blue-400 dark:text-white"
                        : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {formError && <p className="text-[10px] sm:text-xs text-red-500">{formError}</p>}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                  setScheduleType("");
                  setCleanlinessLevel("");
                  setNoisePreference("");
                  setStudyPreference("");
                  setAllergy("");
                  setRoomTempPreference("");
                  setRoomType("");
                }}
                className="w-full sm:w-auto px-8 py-2.5 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 dark:bg-[#1A2F42] dark:border-gray-600 dark:text-white dark:hover:bg-[#24384B] transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className=" w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-medium transition-colors disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // after submitting
  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E] p-4 lg:p-6">
      <PageHeader title="Preferences" />
      <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
        <CheckCircle className="w-3.5 h-3.5" />
        PREFERENCES SUBMITTED
      </div>

      <h2 className="text-xl font-bold text-[#083067] dark:text-white mb-1">
        Your Room Preferences
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Review your saved roommate matching criteria. Editing is currently
        disabled.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PreferenceCard
          icon={Clock}
          label="SCHEDULE"
          value={SCHEDULE_LABELS[preference.scheduleType]?.title}
          description={SCHEDULE_LABELS[preference.scheduleType]?.desc}
        />
        <PreferenceCard
          icon={Brush}
          label="CLEANLINESS"
          value={CLEANLINESS_LABELS[preference.cleanlinessLevel]?.title}
          description={CLEANLINESS_LABELS[preference.cleanlinessLevel]?.desc}
        />
        <PreferenceCard
          icon={VolumeX}
          label="NOISE"
          value={NOISE_LABELS[preference.noisePreference]?.title}
          description={NOISE_LABELS[preference.noisePreference]?.desc}
        />
        <PreferenceCard
          icon={BookOpen}
          label="STUDY"
          value={STUDY_LABELS[preference.studyPreference]?.title}
          description={STUDY_LABELS[preference.studyPreference]?.desc}
        />
        <PreferenceCard
          icon={ShieldAlert}
          label="ALLERGY"
          value={ALLERGY_LABELS[preference.allergy]?.title}
          description={ALLERGY_LABELS[preference.allergy]?.desc}
        />
        <PreferenceCard
          icon={Thermometer}
          label="TEMPERATURE"
          value={TEMP_LABELS[preference.roomTempPreference]?.title}
          description={TEMP_LABELS[preference.roomTempPreference]?.desc}
        />
        <PreferenceCard
          icon={BedDouble}
          label="ROOM TYPE"
          value={ROOM_TYPE_LABELS[preference.roomType]?.title}
          description={ROOM_TYPE_LABELS[preference.roomType]?.desc}
        />
        <div className="bg-[#eff4ff] dark:bg-blue-900/10 rounded-2xl p-4 lg:p-5 shadow-sm flex flex-col">
          <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-[#083067] dark:text-white" />
          </div>
          <p className="text-[10px] font-semibold text-blue-500 tracking-wider mb-1">
            MATCHING STATUS
          </p>
          <h4 className="text-sm font-bold text-[#083067] dark:text-white mb-1">
            Awaiting Algorithm
          </h4>
          <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed">
            Your preferences are saved. The warden will run the matching
            algorithm to find your roommate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
