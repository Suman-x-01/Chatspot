import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useChatContext from "../context/ChatContext";

const RoomSettings = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { setRoomId } = useChatContext();

  const [room, setRoom] = useState(null);
  const [newRoomId, setNewRoomId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [isCreator, setIsCreator] = useState(false);

  const currentUser = JSON.parse(sessionStorage.getItem("user"))?.username;

  useEffect(() => {
    loadRoom();
  }, []);

  const loadRoom = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/rooms/verify/${roomId}`
      );
      setRoom(res.data);
      setNewRoomId(res.data.roomId);
      setNewRoomName(res.data.roomName);
      setIsCreator(res.data.createdBy === currentUser);
    } catch {
      toast.error("Failed to load room");
    }
  };

  const handleSave = async () => {
    if (!isCreator) {
      toast.error("Only the creator can update this room!");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/v1/rooms/${roomId}/update`, {
        roomId: newRoomId,
        roomName: newRoomName,
        username: currentUser,
      });

      toast.success("Room updated successfully!");

      if (roomId !== newRoomId) {
        setRoomId(newRoomId);
        toast.success("Room updated, reloading chat...");
      }

      navigate("/chat-room");
    } catch (e) {
      toast.error(e.response?.data || "Update failed");
    }
  };

  if (!room) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white">
      {/* CARD */}
      <div
        className="w-full max-w-lg bg-gray-900/60 backdrop-blur-xl 
        border border-gray-700/50 shadow-2xl rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-center mb-2">
          Room Settings
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Created by: <b className="text-blue-300">{room.createdBy}</b>
        </p>

        {/* FORM */}
        <div className="flex flex-col gap-6">
          {/* Room ID */}
          <div>
            <label className="text-gray-300 font-medium">Room ID</label>
            <input
              value={newRoomId}
              onChange={(e) => setNewRoomId(e.target.value)}
              disabled={!isCreator}
              className={`mt-2 px-4 py-3 w-full rounded-xl bg-gray-800 border border-gray-600 
                focus:ring-2 focus:ring-blue-500 transition 
                ${!isCreator ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>

          {/* Room Name */}
          <div>
            <label className="text-gray-300 font-medium">Room Name</label>
            <input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              disabled={!isCreator}
              className={`mt-2 px-4 py-3 w-full rounded-xl bg-gray-800 border border-gray-600 
                focus:ring-2 focus:ring-blue-500 transition 
                ${!isCreator ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!isCreator}
            className={`mt-4 w-full py-3 rounded-xl text-lg font-semibold transition 
              ${
                isCreator
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-xl hover:scale-[1.02]"
                  : "bg-gray-700 cursor-not-allowed opacity-50"
              }`}
          >
            Save Changes
          </button>

          {/* Not creator message */}
          {!isCreator && (
            <p className="text-red-400 text-sm text-center">
              You are not the creator. You cannot modify this room.
            </p>
          )}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-8 w-full py-2 rounded-xl bg-gray-700 hover:bg-gray-600 
            transition text-gray-200"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default RoomSettings;
