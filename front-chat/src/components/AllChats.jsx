// !=================================
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { baseURL } from "../config/AxiosHelper";
import axios from "axios";

import { useSessionGuard } from "../hooks/useSessionGuard";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyRoomApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { motion } from "framer-motion"; // ✅ for floating animation
import { FaMixcloud, FaPlus } from "react-icons/fa"; // ✅ better centered plus icon
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import {
  HiOutlineDotsVertical,
  HiMenuAlt3,
  HiX,
  HiSun,
  HiMoon,
} from "react-icons/hi";
import { FiMessageCircle } from "react-icons/fi";
export default function AllChats() {
  // for search btn
  // Add after const [unreadCount, setUnreadCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const [chatRooms, setChatRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const navigate = useNavigate();

  // const [createdBy, setCreatedBy] = useState("");
  const { setCreatedBy } = useChatContext();

  // for msg to the user
  const [msgPopupOpen, setMsgPopupOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  //   const [msgPopupOpen, setMsgPopupOpen] = useState(false);
  // const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  // const [sound] = useState(new Audio("../../notification.mp3"));
  const sound = useRef(null);

  useEffect(() => {
    sound.current = new Audio("/notification.mp3");
  }, []);

  // 🌙 Theme per-user (not global)
  const [darkMode, setDarkMode] = useState(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    return storedUser?.theme === "dark"; // Each user remembers their own theme
  });
  const { setConnected, setRoomId, setCurrentUser } = useChatContext();

  // ✅ Toggle theme per user (stores inside user's own sessionStorage data)
  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      if (storedUser) {
        storedUser.theme = newMode ? "dark" : "light";
        sessionStorage.setItem("user", JSON.stringify(storedUser));
      }
      return newMode;
    });
  };

  // Fetch user info
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (!storedUser) {
      toast.error("Please login first");
      navigate("/login/user");
      return;
    }
    setUser(storedUser);

    fetch(`http://localhost:8080/api/auth/photo/${storedUser.username}`)
      .then((res) => {
        if (!res.ok) throw new Error("No photo found");
        return res.blob();
      })
      .then((blob) => setPhotoUrl(URL.createObjectURL(blob)))
      .catch(() => setPhotoUrl(null));
  }, [navigate]);

  // delete that personal msg after read
  const deleteMessage = async (id) => {
    try {
      // await axios.delete(`http://localhost:8080/api/messages/${id}`);
      axios.delete(`http://localhost:8080/api/admin-messages/${id}`);

      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // show no of msg notification

  const lastUnreadRef = useRef(0);

  const fetchUserMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin-messages/user/${user.username}`,
      );

      setMessages(res.data);

      const unread = res.data.filter((m) => !m.read).length;
      setUnreadCount(unread);

      // 🔔 Play sound ONLY when new unread > old unread
      if (unread > lastUnreadRef.current) {
        sound.currentTime = 0; // restart from beginning
        sound.play();
      }

      // Update ref
      lastUnreadRef.current = unread;
    } catch (e) {
      console.log(e);
    }
  };

  // call it
  useEffect(() => {
    if (user?.username) {
      fetchUserMessages();
      const interval = setInterval(fetchUserMessages, 5000); // poll every 5 sec
      return () => clearInterval(interval);
    }
  }, [user]);

  // mark as read
  const markAsRead = async (id) => {
    try {
      // await axios.put(`http://localhost:8080/api/messages/read/${id}`);
      axios.put(`http://localhost:8080/api/admin-messages/read/${id}`);

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch {}
  };

  // Fetch chat rooms
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/rooms/all")
      .then((res) => res.json())
      .then((data) => setChatRooms(data))
      .catch(() => toast.error("Failed to load chat rooms"));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // 2. Add inside the component, after your existing useEffects:
  useSessionGuard(user, () => {
    sessionStorage.removeItem("user");
    navigate("/login/user");
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [enteredRoomId, setEnteredRoomId] = useState("");
  const handleJoinRoom = (room) => {
    setSelectedRoom(room);
    setIsPopupOpen(true); // open popup
  };

  const confirmJoinRoom = async () => {
    if (!enteredRoomId) {
      toast.error("Please enter a Room ID!");
      return;
    }

    try {
      const verifiedRoom = await verifyRoomApi(enteredRoomId);

      if (!verifiedRoom) {
        toast.error("Room not found!");
        return;
      }

      // 1) Try to join the room (this can return 200 or 403)
      const joinUrl = `http://localhost:8080/api/v1/rooms/${verifiedRoom.roomId}/join/${user.username}`;
      const joinResp = await axios.get(joinUrl);

      // 2) After join success, fetch room details (creator)
      const roomDetailsUrl = `http://localhost:8080/api/admin/${verifiedRoom.roomId}`;
      const roomDetailsResp = await axios.get(roomDetailsUrl);

      // 3) All good -> update context & navigate
      setConnected(true);
      setRoomId(verifiedRoom.roomId);
      setCurrentUser(user.username);
      setCreatedBy(roomDetailsResp.data.createdBy);

      setIsPopupOpen(false);
      toast.success("Room joined successfully!");
      navigate("/chat-room");
    } catch (error) {
      console.error("confirmJoinRoom error:", error);

      // If backend returned 403 on join
      if (error.response?.status === 403) {
        toast.error("❌ You are banned from this room!");
        return;
      }

      // If join succeeded but fetching roomDetails failed,
      // we might still want to allow navigation — but safer to inform user.
      toast.error("Room not found or network error!");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login/user");
  };

  const handleCreateRoom = () => {
    navigate("/chat");
  };

  // Add just before the return() statement
  const filteredRooms = chatRooms.filter((room) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      room.roomName?.toLowerCase().includes(q) ||
      room.roomId?.toLowerCase().includes(q)
    );
  });
  return (
    <div className="min-h-screen bg-white dark:border-gray-700 dark:bg-gray-950 text-black dark:text-white flex flex-col relative overflow-hidden">
      {/* Floating Transparent Bubbles (visible only in dark mode) */}
      <div className="bubble w-20 h-20 left-20 bottom-10 dark:block hidden"></div>
      <div className="bubble w-28 h-28 right-24 bottom-20 delay-700 dark:block hidden"></div>
      <div className="bubble w-16 h-16 left-1/2 bottom-16 delay-1200 dark:block hidden"></div>
      <div className="bubble w-24 h-24 right-1/3 bottom-10 delay-2000 dark:block hidden"></div>

      {/* === EXTRA NORMAL BUBBLES === */}
      <div className="bubble w-14 h-14 left-10 top-1/3 delay-500 dark:block hidden"></div>
      <div className="bubble w-20 h-20 right-10 top-1/4 delay-900 dark:block hidden"></div>
      <div className="bubble w-24 h-24 left-[60%] bottom-20 delay-1400 dark:block hidden"></div>
      <div className="bubble w-16 h-16 right-[40%] top-[70%] delay-1800 dark:block hidden"></div>
      <div className="bubble w-12 h-12 left-[30%] top-[80%] delay-2200 dark:block hidden"></div>

      {/* === BLUE-TINTED TRANSPARENT BUBBLES === */}
      <div className="bubble-blue w-24 h-24 left-[15%] top-[40%] delay-300 dark:block hidden"></div>
      <div className="bubble-blue w-20 h-20 right-[20%] bottom-[30%] delay-1100 dark:block hidden"></div>
      <div className="bubble-blue w-28 h-28 left-[70%] top-[20%] delay-1700 dark:block hidden"></div>
      <div className="bubble-blue w-16 h-16 right-[50%] top-[60%] delay-2300 dark:block hidden"></div>

      {/* Navbar */}
      <div className="flex justify-between items-center p-4 shadow-lg dark:bg-gray-900 relative">
        <h1
          id="allChats"
          data-tooltip-content="Here is All Available Room ✨"
          data-tooltip-place="bottom"
          className="text-2xl font-semibold text-blue-400"
        >
          All Chats
          {/* 🌙 Light/Dark Mode Toggle */}
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform duration-200"
          >
            {darkMode ? (
              <HiSun className="text-yellow-400" size={18} />
            ) : (
              <HiMoon className="text-gray-800" size={18} />
            )}
          </button>
          */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform duration-200"
          >
            {darkMode ? (
              <HiSun className="text-yellow-400" size={18} />
            ) : (
              <HiMoon className="text-gray-800" size={18} />
            )}
          </button>
        </h1>

        <Tooltip
          anchorSelect="#allChats"
          content="Here are all available rooms ✨"
          place="bottom"
        />

        {user && (
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
            {photoUrl ? (
              <img
                id="user-img"
                onClick={() =>
                  navigate("/edit-user", { state: { username: user.username } })
                }
                src={photoUrl}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-gray-400 dark:border-blue-400 shadow-lg animate-pulse cursor-pointer"
                style={{
                  boxShadow:
                    "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff",
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold shadow-md">
                {user.username[0]?.toUpperCase()}
              </div>
            )}
            <span className="font-medium text-lg">{user.username}</span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 dark:text-white text-white rounded-full transition"
        >
          Logout
        </button>
      </div>
      {/* msg button */}

      <motion.button
        onClick={() => setMsgPopupOpen(true)}
        className="fixed top-20 left-5 z-[5000] w-14 h-14 rounded-full 
             bg-gradient-to-r from-blue-500 to-cyan-400 
             shadow-[0_0_20px_#00eaff] flex items-center justify-center
             hover:scale-110 transition "
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <FiMessageCircle size={28} className="text-white drop-shadow-lg" />

        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white 
                     text-xs px-2 py-0.5 rounded-full shadow-lg"
          >
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Floating Search Button */}
      <motion.div
        className="fixed top-36 left-5 z-[5000] flex items-center"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <motion.div
          className="flex items-center overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-purple-400 shadow-[0_0_20px_#a855f7]"
          animate={{ width: showSearch ? 220 : 56, height: 56 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          {/* Search Icon Button */}
          <button
            onClick={() => {
              setShowSearch((prev) => {
                const next = !prev;
                if (next)
                  setTimeout(() => searchInputRef.current?.focus(), 350);
                else setSearchQuery("");
                return next;
              });
            }}
            className="min-w-[56px] h-14 flex items-center justify-center text-white"
          >
            {showSearch ? (
              <HiX size={22} className="text-white drop-shadow" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white drop-shadow-lg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            )}
          </button>

          {/* Expandable Input */}
          {showSearch && (
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room..."
              className="bg-transparent text-white placeholder-purple-200 text-sm 
                   outline-none w-full pr-4"
            />
          )}
        </motion.div>
      </motion.div>
      {/* Chat Room Grid */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 justify-items-center">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div
              id="card-info"
              key={room.roomId}
              onClick={() => {
                handleJoinRoom(room);
              }}
              className="cursor-pointer w-64 bg-gray-200 dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 p-4 flex flex-col justify-between transform hover:scale-105 hover:shadow-fuchsia-400 dark:hover:shadow-[0_0_25px_#3b82f6] hover:bg-fuchsia-400 dark:hover:bg-blue-700 "
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r  from-purple-500 to-blue-500 dark:from-purple-500 dark:to-pink-500 flex items-center justify-center text-xl font-bold mb-3 shadow-lg">
                  💬
                </div>
                <h2 className="text-md font-semibold text-center">
                  {room.roomName}
                </h2>
              </div>
              <p className="mt-3 text-center text-blue-500 dark:text-gray-300 text-sm">
                {room.createdBy
                  ? `${room.createdBy}'s Room`
                  : "Unknown Creator"}
              </p>
            </div>
          ))
        ) : (
          // <p className="text-center col-span-full text-gray-400 text-lg">
          //   No chat rooms available.
          // </p>
          <p className="text-center col-span-full text-gray-400 text-lg">
            {searchQuery
              ? `No rooms found for "${searchQuery}"`
              : "No chat rooms available."}
          </p>
        )}
      </div>

      <Tooltip
        anchorSelect="#card-info"
        content={`Click to open chat room ✨`}
        place="bottom"
      />
      {/* For custom popup */}

      <Popup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        modal
        nested
        contentStyle={{
          background: "transparent",
          border: "none",
          boxShadow: "none",
          padding: "0",
        }}
        overlayStyle={{
          background: "rgba(0, 0, 0, 0.6)", // dark transparent overlay
          backdropFilter: "blur(8px)", // glass blur effect
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-gray-300 dark:bg-gray-900/70 backdrop-blur-xl text-black dark:text-white p-6 rounded-2xl shadow-2xl w-80 text-center border border-gray-400 dark:border-gray-700 mx-auto"
        >
          <h2 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
            Join {selectedRoom?.roomName}'s Room 😉
          </h2>

          <input
            type="text"
            placeholder="Enter Room ID"
            value={enteredRoomId}
            onChange={(e) => setEnteredRoomId(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800/70 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-black dark:text-white placeholder-gray-400"
          />

          <div className="flex justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={confirmJoinRoom}
              className="bg-sky-400 dark:bg-blue-600 hover:bg-sky-600 dark:hover:bg-blue-700 px-4 py-2 rounded-md shadow-md text-white"
            >
              Join
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPopupOpen(false)}
              className="bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 px-4 py-2 rounded-md shadow-md text-white"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </Popup>

      {/* floating msg button */}

      <Popup
        open={msgPopupOpen}
        onClose={() => setMsgPopupOpen(false)}
        modal
        nested
        contentStyle={{ background: "transparent", border: "none", padding: 0 }}
        overlayStyle={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.25 }}
          className="bg-gray-900/70 backdrop-blur-xl text-white p-5 rounded-2xl 
               shadow-2xl w-[320px] max-h-[450px] overflow-y-auto 
               border border-gray-700 mx-auto"
        >
          <h2 className="text-xl font-semibold mb-4 text-cyan-300">Messages</h2>

          {messages.length === 0 && (
            <p className="text-gray-400 text-center">No messages.</p>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 mb-3 rounded-xl border 
          ${
            msg.read
              ? "bg-gray-800/60 border-gray-700"
              : "bg-gray-700/60 border-cyan-400"
          }`}
            >
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs text-gray-400 mt-1">{msg.date}</p>

              <div className="flex justify-between mt-3">
                {!msg.read && (
                  <button
                    onClick={() => markAsRead(msg.id)}
                    className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Mark as Read
                  </button>
                )}

                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </Popup>

      {/* Floating Create Button */}
      <motion.button
        id="createRoomBtn"
        data-tooltip-content="Create New Room ✨"
        data-tooltip-place="top"
        onClick={handleCreateRoom}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 dark:from-orange-500 to-blue-400 dark:to-yellow-400 text-white dark:text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center"
        animate={{
          y: [0, -10, 0],
          boxShadow: [
            "0 0 15px rgba(255,165,0,0.7)",
            "0 0 25px rgba(255,200,0,0.9)",
            "0 0 15px rgba(255,165,0,0.7)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <FaPlus size={24} className="drop-shadow-lg" />
      </motion.button>

      {/* Tooltip component (place once at the bottom) */}
      <Tooltip
        anchorSelect="#createRoomBtn"
        content="Create New Room ✨"
        place="top"
      />
      <Tooltip
        anchorSelect="#user-img"
        content={`Click to Edit your details ✨`}
        place="bottom"
      />
    </div>
  );
}
