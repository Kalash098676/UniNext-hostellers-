import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  MessageSquareText,
  Star,
  TrendingUp,
  Calendar,
  Hash,
} from "lucide-react";

function StatSquare({ icon, iconBg, value, label }) {
  return (
     <div className="bg-white dark:bg-[#1A2F42] rounded-xl p-2 sm:p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div
        className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center mb-3`}
      >
        {icon}
      </div>

      <div className="text-2xl font-bold text-[#083067] dark:text-white">
        {value}
      </div>

      <div className="text-[9px] sm:text-[10px] font-medium text-gray-600 dark:text-gray-400 tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-400"
          }`}
        />
      ))}
    </div>
  );
}

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/feedback/my");
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalCount = feedbacks.length;
  const avgRating = totalCount
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalCount).toFixed(1)
    : "0.0";
  const latestRating = totalCount ? feedbacks[0].rating : 0;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      setFormError("Please provide a rating and comment.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const res = await api.post("/api/feedback", { rating, comment });
      setFeedbacks((prev) => [res.data, ...prev]);
      setRating(0);
      setComment("");
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong. Please try again.");
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
          Feedback
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{today}</p>
      </div>

      {/* Stat squares */}
      <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6">
        <StatSquare
          icon={<MessageSquareText className="w-4 h-4 text-[#083067] dark:text-white" />}
          iconBg="bg-[#d5e3ff] dark:bg-blue-900/20"
          value={String(totalCount).padStart(2, "0")}
          label="TOTAL SUBMITTED"
      
        />
        <StatSquare
          icon={<TrendingUp className="w-4 h-4 text-[#4c2f06] dark:text-white" />}
          iconBg="bg-[#ffddb8] dark:bg-amber-900/20"
          value={avgRating}
          label="AVERAGE RATING"
      
        />
        <StatSquare
          icon={<Star className="w-4 h-4 text-[#083067] dark:text-white" />}
          iconBg="bg-[#d5e3ff] dark:bg-green-900/20"
          value={latestRating || "-"}
          label="LATEST RATING"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback form */}
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 lg:p-6 shadow-sm lg:col-span-1 h-fit">
          <h2 className="text-sm font-semibold text-[#083067] dark:text-white mb-1">
            Share Your Feedback
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Help us improve your hostel experience.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-100 text-gray-200 dark:fill-gray-700  dark:text-gray-400 hover:text-amber-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Tell us what's on your mind..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-sm text-[#083067] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#083067]/30 resize-none"
              />
            </div>

            {formError && <p className="text-[10px] sm:text-xs text-red-500">{formError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>

        {/* Feedback history */}
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-sm p-4 lg:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#083067] dark:text-white">
              Your Feedback History
            </h3>
          </div>

          {feedbacks.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-center text-gray-500 dark:text-gray-400 text-sm">
              No feedback submitted yet. Share your thoughts using the form.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {feedbacks.map((f) => {
                const dateStr = new Date(f.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const shortId = f._id ? f._id.slice(-4).toUpperCase() : "----";
                return (
                  <div
                    key={f._id}
                   className="flex items-start gap-3 lg:gap-4 py-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl px-2 transition-colors"
                  >
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <StarDisplay rating={f.rating} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                        {f.comment}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dateStr}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          ID-#{shortId}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;