import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  CalendarClock,
  Plus,
  BadgeCheck,
  ScrollText,
  Siren,
  Users
} from "lucide-react";
import VisitorPassModal from "../../components/Resources/VisitorPassModal";
import HostelRulesModal from "../../components/Resources/HostelRulesModal";
import EmergencyModal from "../../components/Resources/EmergencyModal";

function ComplaintCard({ total, pending, resolved, onViewHistory }) {
  return (
    <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 lg:p-5 shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h2 className="text-sm font-semibold text-[#083067] dark:text-white">
          Complaints Overview
        </h2>
        <button
          onClick={onViewHistory}
          className="text-[10px] sm:text-[10px] sm:text-xs text-gray-500 hover:text-[#083067] dark:text-gray-400"
        >
          View History →
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">

        <StatSquare
          icon={
            <ClipboardList className="w-4 h-4 text-[#083067] dark:text-[white]" />
          }
          iconBg="bg-[#d5e3ff] dark:bg-blue-900/30"
          value={total}
          label="TOTAL FILED"
        />
        <StatSquare
          icon={
            <CalendarClock className="w-4 h-4 text-[#4c2f06] dark:text-[white]" />
          }
          iconBg="bg-[#ffddb8] dark:bg-amber-900/30"
          value={pending}
          label="PENDING"
        />
        <StatSquare
          icon={
            <CheckCircle2 className="w-4 h-4 text-[#083067] dark:text-[white]" />
          }
          iconBg="bg-[#d5e3ff] dark:bg-green-900/30"
          value={resolved}
          label="RESOLVED"
        />
      </div>
    </div>
  );
}

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

function MenuCard({ todayShort, menuData, mealTimes, mealIcons, navigate }) {
  return (
    <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 lg:p-5 shadow-sm min-h-[240px] flex flex-col">
      <div className="flex items-center mb-3 lg:mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#083067] dark:text-white">
            Today's Menu
          </h2>
          <span className="text-[10px] sm:text-[10px] sm:text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-400 px-2 py-0.5 rounded-full">
            {todayShort}
          </span>
        </div>
      </div>

      {menuData?.meals ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1">
          {Object.entries(menuData.meals).map(
            ([mealType, items]) =>
              items &&
              items.length > 0 && (
                <div
                  key={mealType}
                 className="bg-[#eff4ff] dark:bg-[#162636] rounded-xl p-3 lg:p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1A2F42] flex items-center justify-center text-lg shadow-sm flex-shrink-0">
                    {mealIcons[mealType]}
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs font-semibold text-[#083067] dark:text-white mb-0.5">
                      {mealType.charAt(0) + mealType.slice(1).toLowerCase()}
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-300 line-clamp-1">
                      {items.slice(0, 3).join(", ")}
                    </p>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
                    {mealTimes[mealType]}
                  </span>
                </div>
              ),
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-6">
          No menu available for today
        </p>
      )}
    </div>
  );
}

function FeedbackCard({ handleFeedbackSubmit, menuData, feedbackSubmitting , rating , comment ,setComment,setRating }) {
  return (
    <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 lg:p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#083067] dark:text-white mb-1">
        Rate Lunch
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
         "How was today's lunch?"
      </p>

      {/* Star rating */}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-xl transition-colors ${
              star <= rating
                ? "text-amber-400"
                : "text-gray-200 dark:text-gray-600 dark:text-gray-400 hover:text-amber-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Any specific feedback?"
        rows={3}
        className="w-full text-[10px] sm:text-xs border border-gray-100 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-[#162636] text-gray-700 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-[#083067]"
      />

      <button
        onClick={handleFeedbackSubmit}
        disabled={feedbackSubmitting}
        className="w-full mt-3 py-2.5 bg-[#083067] text-white rounded-xl text-[10px] sm:text-xs font-semibold hover:bg-[#0a3d7a] transition-colors disabled:opacity-50"
      >
        {feedbackSubmitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
}

function ResourcesCard({ onOpenVisitorPass, onOpenHostelRules, onOpenEmergency }){
  return(
   <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 lg:p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#083067] dark:text-white mb-4">
              Quick Resources
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <ResourceCard
                icon={<BadgeCheck className="w-6 h-6 text-[#083067] dark:text-blue-300" />}
                label="Visitor Pass"
                onClick={onOpenVisitorPass}
              />
              <ResourceCard
                icon={<ScrollText className="w-6 h-6 text-[#083067] dark:text-blue-300" />}
                label="Hostel Rules"
                onClick={onOpenHostelRules}
              />
              <ResourceCard
                icon={<Siren className="w-6 h-6 text-red-500" />}
                label="Emergency"
                onClick={onOpenEmergency}
              />
            </div>
          </div>
  );
}

function ResourceCard({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-50 dark:bg-[#162636] rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-[#eff4ff] dark:hover:bg-[#1A2F42] transition-colors border border-gray-100 dark:border-gray-700 cursor-pointer active:scale-95 transform"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium">
        {label}
      </span>
    </button>
  );
}

function RommmateMatchCard({navigate}){
  return(
      <div className="bg-[#083067] rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">
              Roommate Match
            </h2>
            <p className="text-[10px] sm:text-[10px] sm:text-xs text-blue-200 mb-4 leading-relaxed">
              Find your perfect roommate based on shared interests and habits.
            </p>
            <button
              onClick={() => navigate("/student-dashboard/roommate")}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] sm:text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Get Started →
            </button>
          </div>
  )
}

const Overview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Resource modals state
  const [showVisitorPassModal, setShowVisitorPassModal] = useState(false);
  const [showHostelRulesModal, setShowHostelRulesModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  //for feedback
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProfile(), fetchComplaints(), fetchMenu()]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchProfile = async () => {
    const res = await api.get("/api/student/profile");
    setProfile(res.data);
  };

  const fetchComplaints = async () => {
    const res = await api.get("/api/complaint/my");
    setComplaints(res.data);
  };

  const fetchMenu = async () => {
    const res = await api.get("/api/menu");
    if (res.data.length > 0) {
      const today = new Date()
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();
      setMenuData({ day: today, meals: res.data[0].meals[today] });
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!rating || !comment) {
      alert("Please provide rating and comment");
      return;
    }
    setFeedbackSubmitting(true);
    try {
      const res = await api.post("/api/feedback", { rating, comment });
      alert("Feedback submitted!");
      setRating(0);
      setComment("");
    } catch (err) {
      alert("Failed to submit feedback");
    } finally {
      setFeedbackSubmitting(false);
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

  const mealTimes = {
    BREAKFAST: "08:00 AM",
    LUNCH: "01:00 PM",
    SNACKS: "04:30 PM",
    DINNER: "08:30 PM",
  };

  const mealIcons = {
    BREAKFAST: "🍳",
    LUNCH: "🍛",
    SNACKS: "🍪",
    DINNER: "🍽️",
  };
  const todayShort = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0F1F2E]">
        <p className="text-[#083067] dark:text-white font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <>
   
   <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E] p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[#083067] dark:text-white">
            Hello, {profile?.name || user?.email?.split("@")[0]}!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{today}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ComplaintCard
            total={totalCount}
            pending={pendingCount}
            resolved={resolvedCount}
            onViewHistory={() => navigate("/student-dashboard/complaints")}
          />
          <MenuCard
            todayShort={todayShort}
            menuData={menuData}
            mealTimes={mealTimes}
            mealIcons={mealIcons}
            navigate={navigate}
          />

          <ResourcesCard
            onOpenVisitorPass={() => setShowVisitorPassModal(true)}
            onOpenHostelRules={() => setShowHostelRulesModal(true)}
            onOpenEmergency={() => setShowEmergencyModal(true)}
          />

        </div>
        


        {/* Right column */}
       <div className="hidden lg:flex flex-col gap-4">
          {/* File New Complaint button */}
          <button
            onClick={() => navigate("/student-dashboard/complaints")}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#083067] text-white rounded-xl font-semibold text-sm hover:bg-[#0a3d7a] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            File New Complaint
          </button>

          <FeedbackCard
            handleFeedbackSubmit={handleFeedbackSubmit}
            menuData={menuData}
            feedbackSubmitting={feedbackSubmitting}
            rating={rating}
            comment={comment}
            setRating={setRating}
            setComment={setComment}
          />

          <RommmateMatchCard
          navigate={navigate}/>
        </div>
      </div>
    </div>

    {/* Quick Resources Modals */}
    <VisitorPassModal
      isOpen={showVisitorPassModal}
      onClose={() => setShowVisitorPassModal(false)}
    />
    <HostelRulesModal
      isOpen={showHostelRulesModal}
      onClose={() => setShowHostelRulesModal(false)}
    />
    <EmergencyModal
      isOpen={showEmergencyModal}
      onClose={() => setShowEmergencyModal(false)}
    />
    </>
  );
};

export default Overview;
