import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { getMessagesByRoomApi } from "../services/adminRoomService";
import axios from "axios";
import { Trash2, ShieldCheck, Ban } from "lucide-react";
import ConfirmPopup from "./ConfirmPopup";
export default function AdminMessages() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // for msg
  const [sendPopupOpen, setSendPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminMsg, setAdminMsg] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [bannedMap, setBannedMap] = useState({});
  const [shieldColor, setShieldColor] = useState({}); // per complaint → yellow/red/green

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getMessagesByRoomApi(roomId);
    setMessages(data);

    // Load banned users
    const bannedRes = await axios.get(
      `http://localhost:8080/api/v1/rooms/${roomId}/banned`
    );

    const map = {};
    bannedRes.data.forEach((u) => (map[u.username] = true));
    setBannedMap(map);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/complaints/${deleteId}`);
      await loadData(); // IMPORTANT
      setConfirmOpen(false);
      toast.success("Deleted successfully ");
    } catch (err) {
      toast.error("Delete failed!");
    }
  };

  // for complaint message send to the user
  const handleSendMessage = async () => {
    if (!adminMsg.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/admin-messages", {
        username: selectedUser, // complaintAgainst
        message: adminMsg,
        type: "ADMIN", // optional field
      });

      toast.success("Message sent!");
      setAdminMsg("");
      setSendPopupOpen(false);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  // -----------------------------------------------------
  // 1️⃣ DELETE Complaint
  // -----------------------------------------------------
  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;

    await axios.delete(`http://localhost:8080/api/complaints/${id}`);

    toast.error("Deleted!");
    loadData();
  };

  // -----------------------------------------------------
  // 2️⃣ BLOCK / UNBLOCK User
  // -----------------------------------------------------
  const toggleBlock = async (username) => {
    try {
      if (bannedMap[username]) {
        // UNBAN
        await axios.delete(
          `http://localhost:8080/api/v1/rooms/${roomId}/ban/${username}`
        );
        toast.success(`${username} Unbanned`);
      } else {
        // BAN
        await axios.post(
          `http://localhost:8080/api/v1/rooms/${roomId}/ban/${username}`
        );
        toast.error(`${username} Banned`);
      }

      loadData();
    } catch (e) {
      toast.info("Error updating ban status");
    }
  };

  // -----------------------------------------------------
  // 3️⃣ ShieldCheck color rotate → yellow → red → green
  // -----------------------------------------------------
  const handleShieldClick = (id) => {
    setShieldColor((prev) => {
      const current = prev[id] || "yellow"; // default

      let next = "yellow";
      if (current === "yellow") next = "red";
      else if (current === "red") next = "green";
      else next = "yellow";

      return { ...prev, [id]: next };
    });
  };

  const getShieldStyle = (color) => {
    if (color === "yellow") return "bg-yellow-500 hover:bg-yellow-600";
    if (color === "red") return "bg-red-600 hover:bg-red-700";
    if (color === "green") return "bg-green-600 hover:bg-green-700";
    return "bg-yellow-500";
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-400">
          Complaints in Room: {roomId}
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700"
          >
            <h2 className="text-lg font-semibold text-green-400">
              Complaint By: {msg.senderName}
            </h2>

            <h4 className="text-lg font-semibold text-red-400">
              Complaint Against: {msg.complaintAgainst}
            </h4>

            <p className="text-gray-400 mt-1">Reason: {msg.reason}</p>

            <p className="mt-3 bg-gray-700 p-3 rounded">{msg.message}</p>

            <div className="flex justify-between mt-4">
              {/* DELETE */}
              <button
                onClick={() => {
                  setDeleteId(msg.id || msg.complaintId);

                  setConfirmOpen(true);
                }}
                className="p-2 bg-red-600 rounded-full hover:bg-red-700"
              >
                <Trash2 size={18} />
              </button>

              {/* SHIELD COLOR TOGGLE */}
              <button
                onClick={() => handleShieldClick(msg.id)}
                className={`p-2 rounded-full ${getShieldStyle(
                  shieldColor[msg.id]
                )}`}
              >
                <ShieldCheck size={18} />
              </button>
              {/* SEND MESSAGE BUTTON */}
              <button
                onClick={() => {
                  setSelectedUser(msg.complaintAgainst);
                  setSendPopupOpen(true);
                }}
                className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                📩
              </button>

              {/* BLOCK / UNBLOCK */}
              <button
                onClick={() => toggleBlock(msg.complaintAgainst)}
                className={`p-2 rounded-full text-white ${
                  bannedMap[msg.complaintAgainst]
                    ? "bg-red-600 hover:bg-red-700" // blocked
                    : "bg-blue-600 hover:bg-blue-700" // not blocked
                }`}
              >
                <Ban size={18} />
              </button>
            </div>
          </div>
        ))}

        <ConfirmPopup
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Complaint?"
          content="Are you sure you want to delete this complaint?"
        />
      </div>
      {sendPopupOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-xl w-96 text-white">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">
              Send Message to {selectedUser}
            </h2>

            {/* USERNAME (NON-EDITABLE) */}
            <div className="mb-4">
              <label className="text-sm text-gray-400">Username</label>
              <input
                type="text"
                value={selectedUser}
                readOnly
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-400"
              />
            </div>

            {/* MESSAGE FIELD */}
            <div className="mb-4">
              <label className="text-sm text-gray-400">Message</label>
              <textarea
                value={adminMsg}
                onChange={(e) => setAdminMsg(e.target.value)}
                className="w-full px-3 py-2 h-28 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Enter message..."
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setSendPopupOpen(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSendMessage}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
