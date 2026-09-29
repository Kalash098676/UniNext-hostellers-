import { useEffect, useState } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import { MessageSquare, Star, Trophy } from "lucide-react";
import { Star as StarIcon } from "lucide-react";
import StatsSquare from "../../components/StatsSquare";

const WardenFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    fiveStar: 0,
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);

    try {
      const res = await api.get("/api/feedback");
      const data = res.data;

      setFeedbacks(data);

      const total = data.length;

      const average =
        total > 0
          ? (data.reduce((sum, item) => sum + item.rating, 0) / total).toFixed(
              1,
            )
          : 0;

      const fiveStar = data.filter((item) => item.rating === 5).length;

      setStats({
        total,
        average,
        fiveStar,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600 dark:text-gray-400"
            }`}
          />
        ))}
      </div>
    );
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
      <PageHeader
        title="Student Feedback"
        showBack
        backTo="/warden-dashboard"
      />

      {/* Stats */}

      <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6">
        <StatsSquare
          icon={<Star className="w-4 h-4 text-[#083067] dark:text-white" />}
          iconBg="bg-[#d5e3ff] dark:bg-blue-900/20"
          value={`${stats.average}/5`}
          label="AVERAGE RATING"
        />

        <StatsSquare
          icon={
            <MessageSquare className="w-4 h-4 text-[#083067] dark:text-white" />
          }
          iconBg="bg-[#d5e3ff] dark:bg-blue-900/20"
          value={String(stats.total).padStart(2, "0")}
          label="TOTAL FEEDBACK"
        />

        <StatsSquare
          icon={<Trophy className="w-4 h-4 text-[#083067] dark:text-white" />}
          iconBg="bg-[#d5e3ff] dark:bg-emerald-900/20"
          value={String(stats.fiveStar).padStart(2, "0")}
          label="5 STAR REVIEWS"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-sm p-5">
        <h2 className="text-sm font-semibold text-[#083067] dark:text-white mb-4">
          Student Feedback
        </h2>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-left text-gray-500 uppercase text-[10px] sm:text-xs">
                <th className="pb-2">Student</th>
                <th className="pb-2">Rating</th>
                <th className="pb-2">Feedback</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No feedback available.
                  </td>
                </tr>
              ) : (
                feedbacks.map((feedback) => (
                  <tr
                    key={feedback._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white font-semibold">
                          {feedback.userId?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-[#083067] dark:text-white">
                            {feedback.userId?.name}
                          </p>

                          <p className="text-[10px] sm:text-xs text-gray-400">
                            {feedback.userId?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4">{renderStars(feedback.rating)}</td>

                    <td className="py-4 max-w-md">
                      <p className="truncate text-gray-600 dark:text-gray-400 dark:text-gray-300">
                        {feedback.comment}
                      </p>
                    </td>

                    <td className="py-4 text-gray-500 text-sm">
                      {new Date(feedback.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="lg:hidden space-y-3">
          {feedbacks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No feedback available.
            </div>
          ) : (
            feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#162636] p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white font-semibold">
                    {feedback.userId?.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium text-[#083067] dark:text-white">
                      {feedback.userId?.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {feedback.userId?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  {renderStars(feedback.rating)}

                  <span className="text-[11px] text-gray-400">
                    {new Date(feedback.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
                  {feedback.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WardenFeedback;
