import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Bed, Plus, Search, Filter, UserPlus, ArrowRightLeft, UserX, CheckCircle, AlertTriangle } from "lucide-react";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBlock, setFilterBlock] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);

  // Form states
  const [newRoom, setNewRoom] = useState({ roomNumber: "", block: "A", floor: 1, capacity: 2, hostelType: "BOYS_HOSTEL" });
  const [allocation, setAllocation] = useState({ studentId: "", roomNumber: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchRoomsAndStudents();
  }, []);

  const fetchRoomsAndStudents = async () => {
    try {
      setLoading(true);
      const [resRooms, resStudents] = await Promise.all([
        api.get("/api/warden/rooms"),
        api.get("/api/warden/all-students"),
      ]);
      setRooms(resRooms.data);
      setStudents(resStudents.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to load room data" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    try {
      const res = await api.post("/api/warden/rooms", {
        roomNumber: String(newRoom.roomNumber).trim(),
        block: newRoom.block,
        floor: Number(newRoom.floor),
        capacity: Number(newRoom.capacity),
        hostelType: newRoom.hostelType,
      });
      setMsg({ type: "success", text: res.data.message || `Room ${newRoom.roomNumber} created successfully!` });
      setShowAddModal(false);
      setNewRoom({ roomNumber: "", block: "A", floor: 1, capacity: 2, hostelType: "BOYS_HOSTEL" });
      fetchRoomsAndStudents();
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Error creating room" });
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    try {
      const res = await api.post("/api/warden/rooms/allocate", allocation);
      setMsg({ type: "success", text: res.data.message || "Student allocated successfully!" });
      setShowAllocateModal(false);
      setAllocation({ studentId: "", roomNumber: "" });
      fetchRoomsAndStudents();
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Allocation failed" });
    }
  };

  const openAllocateForRoom = (roomNum) => {
    setAllocation({ studentId: "", roomNumber: roomNum });
    setShowAllocateModal(true);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = filterBlock === "ALL" || room.block === filterBlock;
    const matchesStatus = filterStatus === "ALL" || room.status === filterStatus;
    return matchesSearch && matchesBlock && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bed className="w-7 h-7 text-blue-600" />
            Hostel Room Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor room capacity, occupancy, and allocate students securely.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#1B3C53] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#234C6A] transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Room
          </button>
          <button
            onClick={() => setShowAllocateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Quick Allocation
          </button>
        </div>
      </div>

      {/* Message Banner */}
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

      {/* Search & Filters */}
      <div className="bg-white dark:bg-[#1A2F42] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Room Number (e.g. 101)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-[#0F1F2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterBlock}
            onChange={(e) => setFilterBlock(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-[#3B5368] rounded-xl text-sm bg-gray-50 dark:bg-[#243B50] dark:text-white font-medium"
          >
            <option value="ALL" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">All Blocks</option>
            <option value="A" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">Block A</option>
            <option value="B" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">Block B</option>
            <option value="C" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">Block C</option>
            <option value="D" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">Block D</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-[#3B5368] rounded-xl text-sm bg-gray-50 dark:bg-[#243B50] dark:text-white font-medium"
          >
            <option value="ALL" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">All Status</option>
            <option value="AVAILABLE" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">Available</option>
            <option value="FULL">Full</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading room inventory...</div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white dark:bg-[#1A2F42] p-12 rounded-xl text-center border border-gray-100 dark:border-gray-700">
          <Bed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Rooms Found</h3>
          <p className="text-sm text-gray-500 mt-1">Try adjusting filters or add a new room.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => {
            const isFull = room.occupiedBeds >= room.capacity;
            return (
              <div
                key={room.id}
                className="bg-white dark:bg-[#1A2F42] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">Room {room.roomNumber}</span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full font-medium">
                        Block {room.block} (F{room.floor})
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        isFull
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          : room.status === "MAINTENANCE"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      }`}
                    >
                      {isFull ? "FULL" : room.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>Occupancy</span>
                      <span className="font-semibold">{room.occupiedBeds} / {room.capacity} Beds</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isFull ? "bg-red-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, (room.occupiedBeds / room.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Occupants list */}
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Occupants</h4>
                    {room.occupants && room.occupants.length > 0 ? (
                      <ul className="space-y-1.5">
                        {room.occupants.map((occ) => (
                          <li key={occ.id} className="text-xs text-gray-800 dark:text-gray-200 flex items-center justify-between bg-gray-50 dark:bg-[#0F1F2E] px-2.5 py-1.5 rounded-lg">
                            <span className="font-medium">{occ.name}</span>
                            <span className="text-gray-400">{occ.branch} (Y{occ.year})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No students assigned yet.</p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                  <button
                    disabled={isFull}
                    onClick={() => openAllocateForRoom(room.roomNumber)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      isFull
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Allocate Student
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A2F42] max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Hostel Room</h3>
            <form onSubmit={handleAddRoom} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 104"
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Block</label>
                  <select
                    value={newRoom.block}
                    onChange={(e) => setNewRoom({ ...newRoom, block: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                  >
                    <option value="A">Block A</option>
                    <option value="B">Block B</option>
                    <option value="C">Block C</option>
                    <option value="D">Block D</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Floor</label>
                  <input
                    type="number"
                    min="1"
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity (Beds)</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#0F1F2E] dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1B3C53] text-white font-semibold rounded-lg hover:bg-[#234C6A]"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate Student Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A2F42] max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Allocate Room to Student</h3>
            <form onSubmit={handleAllocate} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Select Student</label>
                <select
                  required
                  value={allocation.studentId}
                  onChange={(e) => setAllocation({ ...allocation, studentId: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 dark:border-[#3B5368] rounded-xl dark:bg-[#243B50] dark:text-white font-medium"
                >
                  <option value="" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">-- Choose Registered Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id} className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">
                      {s.name} ({s.email}) — Current: {s.room}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Select Room Number</label>
                <select
                  required
                  value={allocation.roomNumber}
                  onChange={(e) => setAllocation({ ...allocation, roomNumber: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 dark:border-[#3B5368] rounded-xl dark:bg-[#243B50] dark:text-white font-medium"
                >
                  <option value="" className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">-- Choose Available Room --</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.roomNumber} disabled={r.occupiedBeds >= r.capacity} className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">
                      Room {r.roomNumber} (Block {r.block}) — {r.occupiedBeds}/{r.capacity} occupied
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
