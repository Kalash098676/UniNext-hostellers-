import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { ShieldCheck, Search, Filter, CheckCircle2, XCircle, Clock, QrCode, Plus, UserCheck } from "lucide-react";

export default function VisitorPasses() {
  const [passes, setPasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Issue Pass Modal State
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [newPass, setNewPass] = useState({
    studentId: "",
    visitorName: "",
    relation: "Parent",
    phone: "",
    visitDate: new Date().toISOString().split("T")[0],
    visitTime: "10:00 AM",
    reason: "Family Visit",
    status: "APPROVED",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resPasses, resStudents] = await Promise.all([
        api.get("/api/visitor-pass/all"),
        api.get("/api/warden/all-students").catch(() => ({ data: [] })),
      ]);
      setPasses(resPasses.data);
      setStudents(resStudents.data || []);
    } catch (err) {
      console.error("Error fetching visitor passes:", err);
      setMsg({ type: "error", text: "Failed to load visitor passes" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (passId, newStatus) => {
    try {
      await api.put(`/api/visitor-pass/${passId}/status`, { status: newStatus });
      setMsg({ type: "success", text: `Visitor pass status updated to ${newStatus}` });
      fetchData();
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Error updating pass status" });
    }
  };

  const handleIssuePass = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    try {
      const res = await api.post("/api/visitor-pass", newPass);
      setMsg({ type: "success", text: `Visitor pass ${res.data.passCode} issued successfully!` });
      setShowIssueModal(false);
      setNewPass({
        studentId: "",
        visitorName: "",
        relation: "Parent",
        phone: "",
        visitDate: new Date().toISOString().split("T")[0],
        visitTime: "10:00 AM",
        reason: "Family Visit",
        status: "APPROVED",
      });
      fetchData();
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Error issuing visitor pass" });
    }
  };

  const filteredPasses = passes.filter((p) => {
    const studentName = p.userId?.name || p.studentName || "";
    const matchesSearch =
      p.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.passCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
            Visitor Pass Governance & Issuance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review, approve, reject, or issue new digital entry passes for hostel visitors.
          </p>
        </div>
        <button
          onClick={() => setShowIssueModal(true)}
          className="flex items-center gap-2 bg-[#1B3C53] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#234C6A] transition shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" /> Issue New Visitor Pass
        </button>
      </div>

      {msg.text && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between shadow-sm ${
            msg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span className="font-semibold">{msg.text}</span>
          <button onClick={() => setMsg({ type: "", text: "" })} className="text-xs font-bold underline ml-4">Dismiss</button>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white dark:bg-[#1A2F42] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search visitor name, student, or pass code (e.g. VP-1234)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-[#0F1F2E] dark:text-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-[#0F1F2E] dark:text-white"
        >
          <option value="ALL" className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">All Statuses</option>
          <option value="PENDING" className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">Pending Approval</option>
          <option value="APPROVED" className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">Approved</option>
          <option value="REJECTED" className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">Rejected</option>
          <option value="EXPIRED" className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">Expired</option>
        </select>
      </div>

      {/* Pass List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading visitor pass records...</div>
      ) : filteredPasses.length === 0 ? (
        <div className="bg-white dark:bg-[#1A2F42] p-12 rounded-xl text-center border border-gray-100 dark:border-gray-700">
          <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Visitor Pass Requests</h3>
          <p className="text-sm text-gray-500 mt-1">No pass records match your search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPasses.map((pass) => {
            const studentName = pass.userId?.name || pass.studentName || "Student";
            const studentEmail = pass.userId?.email || pass.studentEmail || "N/A";
            const passId = pass._id || pass.id;

            return (
              <div
                key={passId}
                className="bg-white dark:bg-[#1A2F42] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md">
                      {pass.passCode}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        pass.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700"
                          : pass.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {pass.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{pass.visitorName}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Relation: <span className="font-medium text-gray-700 dark:text-gray-300">{pass.relation}</span> | Phone: {pass.phone}
                  </p>

                  <div className="bg-gray-50 dark:bg-[#0F1F2E] p-3 rounded-xl space-y-1.5 text-xs text-gray-700 dark:text-gray-300 mb-4">
                    <div>
                      <span className="font-semibold text-gray-500">Hostel Student:</span>{" "}
                      <span className="font-bold text-gray-900 dark:text-white">{studentName}</span> ({studentEmail})
                    </div>
                    <div><span className="font-semibold text-gray-500">Visit Date:</span> {pass.visitDate} at {pass.visitTime}</div>
                    <div><span className="font-semibold text-gray-500">Reason:</span> {pass.reason}</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  {pass.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(passId, "APPROVED")}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(passId, "REJECTED")}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-sm"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {pass.status === "APPROVED" && (
                    <button
                      onClick={() => handleUpdateStatus(passId, "EXPIRED")}
                      className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      Mark Expired
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Issue Visitor Pass Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A2F42] max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" /> Issue New Visitor Entry Pass
            </h3>

            <form onSubmit={handleIssuePass} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Hostel Student</label>
                <select
                  required
                  value={newPass.studentId}
                  onChange={(e) => setNewPass({ ...newPass, studentId: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                >
                  <option value="" className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">-- Select Registered Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id} className="bg-white dark:bg-[#162636] text-gray-900 dark:text-white">
                      {s.name} ({s.email}) — Room: {s.room}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Visitor Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={newPass.visitorName}
                    onChange={(e) => setNewPass({ ...newPass, visitorName: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Relation</label>
                  <select
                    value={newPass.relation}
                    onChange={(e) => setNewPass({ ...newPass, relation: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Relative">Relative</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Visitor Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={newPass.phone}
                    onChange={(e) => setNewPass({ ...newPass, phone: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Status</label>
                  <select
                    value={newPass.status}
                    onChange={(e) => setNewPass({ ...newPass, status: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                  >
                    <option value="APPROVED">APPROVED (Immediate)</option>
                    <option value="PENDING">PENDING (Requires Warden Sign-off)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Visit Date</label>
                  <input
                    type="date"
                    required
                    value={newPass.visitDate}
                    onChange={(e) => setNewPass({ ...newPass, visitDate: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Visit Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:30 AM"
                    value={newPass.visitTime}
                    onChange={(e) => setNewPass({ ...newPass, visitTime: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Visit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bringing study materials & clothes"
                  value={newPass.reason}
                  onChange={(e) => setNewPass({ ...newPass, reason: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1B3C53] text-white font-semibold rounded-lg hover:bg-[#234C6A]"
                >
                  Issue Pass & Generate Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
