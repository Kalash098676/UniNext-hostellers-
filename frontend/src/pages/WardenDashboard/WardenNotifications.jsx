import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Bell, Send, CheckCircle, Info, ShieldAlert } from "lucide-react";

export default function WardenNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("GENERAL");
  const [msgStatus, setMsgStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/notification/all");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await api.post("/api/notification", { message, type });
      setMsgStatus({ type: "success", text: "Broadcast notification sent to all students!" });
      setMessage("");
      fetchNotifications();
    } catch (err) {
      setMsgStatus({ type: "error", text: err.response?.data?.message || "Failed to send notification" });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="w-7 h-7 text-blue-600" />
          Broadcast & Student Notifications
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Post hostel announcements, maintenance updates, or security alerts.
        </p>
      </div>

      {msgStatus.text && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between ${
            msgStatus.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{msgStatus.text}</span>
          <button onClick={() => setMsgStatus({ type: "", text: "" })} className="text-xs underline">Dismiss</button>
        </div>
      )}

      {/* Post Form */}
      <div className="bg-white dark:bg-[#1A2F42] p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Broadcast Notification</h3>
        <form onSubmit={handleSendNotification} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1">Notification Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm dark:bg-[#0F1F2E] dark:text-white"
              >
                <option value="GENERAL" className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">📢 General Announcement</option>
                <option value="COMPLAINT" className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">🛠️ Maintenance Update</option>
                <option value="MATCH" className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">🤝 Roommate Update</option>
                <option value="ALERT" className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">🚨 Security Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1">Notification Message</label>
            <textarea
              required
              rows={3}
              placeholder="Write broadcast message for students..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm dark:bg-[#0F1F2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#1B3C53] hover:bg-[#234C6A] text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition"
            >
              <Send className="w-4 h-4" /> Send Announcement
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History */}
      <div className="bg-white dark:bg-[#1A2F42] p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Sent Notifications</h3>
        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading history...</div>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No broadcast notifications sent yet.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 rounded-xl bg-gray-50 dark:bg-[#0F1F2E] border border-gray-100 dark:border-gray-700 flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md">
                    {n.type}
                  </span>
                  <p className="text-sm text-gray-800 dark:text-gray-200 pt-1">{n.message}</p>
                  <span className="text-xs text-gray-400 block pt-1">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
