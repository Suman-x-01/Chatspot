import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ComplaintPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, roomName } = location.state || {};

  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  const [complaint, setComplaint] = useState({
    roomName: roomName || "",
    roomId: roomId || "",
    senderName: storedUser?.username || "", // 🔥 auto-filled, not editable
    complaintAgainst: "",
    reason: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaint),
      });

      if (response.ok) {
        toast.success("Complaint submitted successfully!");
        navigate(-1);
      } else {
        toast.error("Failed to submit complaint");
      }
    } catch (error) {
      toast.error("Error submitting complaint");
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-semibold text-blue-400 mb-8">
        Submit a Complaint
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
      >
        {/* Room Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Room Name</label>
          <input
            value={complaint.roomName}
            disabled
            className="p-3 bg-gray-700 rounded-lg text-gray-400"
          />
        </div>

        {/* Room ID */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Room ID</label>
          <input
            value={complaint.roomId}
            disabled
            className="p-3 bg-gray-700 rounded-lg text-gray-400"
          />
        </div>

        {/* Your Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Your Name</label>
          <input
            value={complaint.senderName}
            disabled
            className="p-3 bg-gray-700 rounded-lg text-gray-400"
          />
        </div>

        {/* Complaint Against */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Complaint Against</label>
          <input
            value={complaint.complaintAgainst}
            onChange={(e) =>
              setComplaint({ ...complaint, complaintAgainst: e.target.value })
            }
            required
            placeholder="Enter username of the person"
            className="p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Reason */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Reason</label>
          <input
            value={complaint.reason}
            onChange={(e) =>
              setComplaint({ ...complaint, reason: e.target.value })
            }
            required
            placeholder="Enter reason (e.g., spam, abuse, harassment)"
            className="p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Message</label>
          <textarea
            value={complaint.message}
            onChange={(e) =>
              setComplaint({ ...complaint, message: e.target.value })
            }
            required
            placeholder="Describe your issue in detail..."
            className="p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 min-h-[100px]"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintPage;
