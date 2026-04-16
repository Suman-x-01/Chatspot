import React, { useContext, useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxiosHelper";
import axios from "axios";
import { createPortal } from "react-dom";

// for theme
// Add these two imports at the top with your other imports
import { useChatBackground } from "../hooks/useChatBackground";
import ThemePicker from "../components/ThemePicker";

import {
  HiOutlineDotsVertical,
  HiMenuAlt3,
  HiX,
  HiSun,
  HiMoon,
} from "react-icons/hi";

import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import { getMessagess } from "../services/RoomService";
import { formatTime } from "../config/Helper";
import { deleteRoomApi } from "../services/adminRoomService";

const ChatPage = () => {
  // for 3 dots menu design
  const menuBtnStyle = {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "7px 12px",
    borderRadius: "8px",
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.85)",
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background 0.15s",
  };

  const [openDropdownId, setOpenDropdownId] = useState(null);

  // for preview media
  const [previewMedia, setPreviewMedia] = useState(null); // { url, type }s
  // for delete the chat room only for current user
  const [isCreator, setIsCreator] = useState(false);
  // for search func
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchText, setSearchText] = useState("");

  // for stop pause btn
  const [recordPaused, setRecordPaused] = useState(false);

  // for 3 dot dropup menu beside send btn
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);

  // for those who give vote
  const [activePollDetails, setActivePollDetails] = useState(null);

  // for voice
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  // const mediaRecorderRef = useRef(null);
  // const audioChunksRef = useRef([]);

  // add wave animation at the time of recording
  const [recordTime, setRecordTime] = useState(0);
  const timerRef = useRef(null);

  // for   poll
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([""]);

  // 🟦 Message Selection
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // 🟦 Reply To Message
  const [replyTo, setReplyTo] = useState(null);

  // typing
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);

  // for emoji
  const [activeReactionMessageId, setActiveReactionMessageId] = useState(null);
  const [reactionPickerId, setReactionPickerId] = useState(null);

  // for ste user photo
  const [userPhotos, setUserPhotos] = useState({});
  // const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  // for delete and edit button to message
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingOriginalText, setEditingOriginalText] = useState("");

  // for dark and light mode
  // 🌙 Theme and Sidebar state
  const [darkMode, setDarkMode] = useState(() => {
    return sessionStorage.getItem("theme") === "dark";
  });

  // Reusing your existing state name to avoid changing other logic
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // for GIF in chat page
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifs, setGifs] = useState([]);

  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
    createdBy,
    setCreatedBy,
  } = useChatContext();

  const navigate = useNavigate();
  useEffect(() => {
    if (!connected && !isLoggingOut) {
      navigate("/");
    }
  }, [connected, roomId, currentUser, isLoggingOut]);

  // ============== theme change in chat page =========================
  // Add after your existing state declarations, around line 80
  const [showThemePicker, setShowThemePicker] = useState(false);

  const { background, updateBackground, resetBackground } = useChatBackground(
    currentUser, // already in your context
    roomId, // already in your context
  );

  // Compute the bg style
  const chatBgStyle = background.value
    ? background.type === "image"
      ? {
          backgroundImage: `url(${background.value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : { backgroundColor: background.value }
    : {}; // no style = use your existing Tailwind classes
  // ============== theme change in chat page end =========================

  // ========================= GIF section =========================
  const fetchGifs = async (query = "funny") => {
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=kQHjRnd3mJ8XX98hhKcNkF7ma0RaSVIX&q=${query}&limit=12`,
      );
      const data = await res.json();
      setGifs(data.data);
    } catch (err) {
      console.error("GIF fetch error", err);
    }
  };
  const sendGif = (gifUrl) => {
    if (stompClient && connected) {
      const message = {
        sender: currentUser,
        content: gifUrl,
        roomId,
        timestamp: new Date().toISOString(),
        fileType: "gif", // ⭐ important
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message),
      );

      setShowGifPicker(false);
    }
  };
  // ==============================gif section ends here ===================
  // for 3 dots menu
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    }
    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  const generateRandomColor = (userName) => {
    if (!userName || typeof userName !== "string" || userName.trim() === "") {
      return "hsl(0, 0%, 60%)";
    }
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 50%)`;
  };
  // !handle user photo
  async function loadUserPhoto(username) {
    if (!username) return;

    // Already loaded? don’t fetch again
    if (userPhotos[username]) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/photo/${username}`,
      );
      console.log(`http://localhost:8080/api/auth/photo/${username}`);
      if (!res.ok) throw new Error("No photo");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setUserPhotos((prev) => ({
        ...prev,
        [username]: url,
      }));
    } catch (err) {
      // If no photo – fallback to avatar
      setUserPhotos((prev) => ({
        ...prev,
        [username]: null,
      }));
    }
  }

  const getAvatarUrl = (username) => {
    if (!username || typeof username !== "string") {
      return "https://avatar.iran.liara.run/public/1";
    }
    const seed = Array.from(username).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );
    const randomAvatarId = (seed % 100) + 1;
    return `https://avatar.iran.liara.run/public/${randomAvatarId}`;
  };
  // for 3 dot dropup menu beside send btn
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    }

    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMoreMenu]);

  // for select msg
  const toggleSelectMessage = (id) => {
    if (selectedMessages.includes(id)) {
      const updated = selectedMessages.filter((mid) => mid !== id);

      setSelectedMessages(updated);
      if (updated.length === 0) setIsSelecting(false);
    } else {
      setSelectedMessages([...selectedMessages, id]);
      setIsSelecting(true);
    }
  };
  const isSelected = (id) => selectedMessages.includes(id);

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

  // for dark and light mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      sessionStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      sessionStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // load the messages
  useEffect(() => {
    // async function loadMessages() {
    //   try {
    //     const messages = await getMessagess(roomId);
    //     setMessages(messages);
    //   } catch (error) {}
    // }
    // if (connected) {
    //   loadMessages().then((msgs) => {
    //     msgs.forEach((m) => loadUserPhoto(m.sender)); // <-- important
    //   });
    // }
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        setMessages(messages);
        messages.forEach((m) => loadUserPhoto(m.sender));
      } catch (error) {}
    }
    if (connected) {
      loadMessages();
    }
  }, [connected, roomId]);

  // scroll down messages
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    let client = null;
    let isMounted = true;

    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      client = Stomp.over(sock);

      client.connect({}, () => {
        if (!isMounted) return;
        setStompClient(client);
        toast.success("connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const msg = JSON.parse(message.body);

          // ⭐ HANDLE JOIN EVENT
          if (
            msg.type === "system" &&
            msg.content.endsWith("joined the room")
          ) {
            toast.success(msg.content);
            return; // ❌ Do NOT add to chat messages
          }

          // ⭐ HANDLE LEAVE EVENT
          if (msg.type === "system" && msg.content.endsWith("left the room")) {
            toast(msg.content, { icon: "👋" });
            return; // ❌ Do NOT add to chat messages
          }

          // ⭐ Normal chat message
          setMessages((prev) => [...prev, msg]);
          loadUserPhoto(msg.sender);
        });

        // for delete room who create the room only he can abel to delete
        // 🚨 FORCE LOGOUT WHEN ROOM GETS DELETED
        client.subscribe(`/topic/room-deleted/${roomId}`, () => {
          toast.error("⚠️ Room was deleted!");
          navigate("/all-chats"); // redirect all users
        });

        // for typing
        // 🔵 TYPING SUBSCRIPTION
        client.subscribe(`/topic/typing/${roomId}`, (msg) => {
          const data = JSON.parse(msg.body);

          // ignore yourself
          if (data.username === currentUser) return;

          setTypingUser(data.username);

          // remove after 2.5 seconds
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setTypingUser(null);
          }, 2500);
        });

        client.subscribe(`/topic/reactions/${roomId}`, (msg) => {
          const data = JSON.parse(msg.body);

          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== data.messageId) return m;

              const reactions = { ...(m.reactions || {}) };

              // Find if user already reacted and with which emoji
              let previousEmoji = null;
              Object.entries(reactions).forEach(([emoji, users]) => {
                if (users.includes(data.username)) previousEmoji = emoji;
              });

              // If user already reacted with same emoji -> remove (toggle off)
              if (previousEmoji === data.emoji) {
                reactions[data.emoji] = reactions[data.emoji].filter(
                  (u) => u !== data.username,
                );
                if (reactions[data.emoji].length === 0)
                  delete reactions[data.emoji];

                // done — toggled off
                return { ...m, reactions };
              }

              // Otherwise: remove user from any previous emoji (one reaction per user)
              if (previousEmoji) {
                reactions[previousEmoji] = reactions[previousEmoji].filter(
                  (u) => u !== data.username,
                );
                if (reactions[previousEmoji].length === 0)
                  delete reactions[previousEmoji];
              }

              // Add user to the new emoji
              reactions[data.emoji] = [
                ...(reactions[data.emoji] || []),
                data.username,
              ];
              m.pop = true; // optional animation flag

              return { ...m, reactions };
            }),
          );
        });

        // for poll
        // client.subscribe(`/topic/votes/${roomId}`, (msg) => {
        //   const data = JSON.parse(msg.body);

        //   setMessages((prev) =>
        //     prev.map((m) => {
        //       if (m.id === data.messageId) {
        //         return { ...m }; // backend already updated values
        //       }
        //       return m;
        //     })
        //   );
        // });
        client.subscribe(`/topic/votes/${roomId}`, (msg) => {
          const data = JSON.parse(msg.body);

          setMessages((prev) =>
            prev.map((m) =>
              m.id === data.messageId
                ? {
                    ...m,
                    pollVotes: data.pollVotes,
                    votedUsers: data.votedUsers,
                  }
                : m,
            ),
          );
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }

    return () => {
      isMounted = false;
      if (client)
        client.disconnect(() => console.log("🧹 WebSocket disconnected"));
    };
  }, [connected, roomId]);

  // send message handle
  const deleteMessage = async (messageId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/rooms/${roomId}/message/${messageId}`,
        {
          method: "DELETE",
        },
      );
      // if (res.ok) {
      //   toast.success("Message deleted");
      //   setMessages((prev) =>
      //     prev.map((m) =>
      //       m.id === messageId ? { ...m, deleted: true, content: "" } : m
      //     )
      //   );
      // }
      if (res.ok) {
        toast.success("Message deleted");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  deleted: true,
                  content: "",
                  reactions: {}, // 🧹 remove all emoji reactions
                  pollVotes: {}, // optional (remove poll votes)
                  votedUsers: {}, // optional
                }
              : m,
          ),
        );
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting message");
    }
  };

  const handleReaction = (messageId, emoji) => {
    stompClient.send(
      `/app/react/${roomId}`,
      {},
      JSON.stringify({
        messageId,
        emoji,
        username: currentUser,
      }),
    );
    setReactionPickerId(null);
  };

  // for voice

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        const formData = new FormData();
        formData.append("file", blob, "voice-message.webm");

        const upload = await fetch("http://localhost:8080/api/files/upload", {
          method: "POST",
          body: formData,
        });

        const result = await upload.json();

        stompClient.send(
          `/app/sendMessage/${roomId}`,
          {},
          JSON.stringify({
            sender: currentUser,
            roomId,
            content: result.fileUrl,
            fileType: "audio",
          }),
        );
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordPaused(false);

      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Recording failed:", error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    setRecording(false);
    setRecordTime(0);
  };
  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      clearInterval(timerRef.current);
      setRecordPaused(true);
    }
  };
  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setRecordPaused(false);

      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const toggleRecording = () => {
    if (!recording) startRecording();
    else stopRecording();
  };
  const sendPoll = () => {
    const message = {
      sender: currentUser,
      roomId,
      content: "POLL",
      poll: true, // FIXED ✔
      pollQuestion,
      pollOptions,
    };

    stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));

    setShowPollCreator(false);
    setPollQuestion("");
    setPollOptions([""]);
  };

  const votePoll = (messageId, option) => {
    stompClient.send(
      `/app/vote/${roomId}`,
      {},
      JSON.stringify({
        messageId,
        username: currentUser,
        option,
      }),
    );
  };

  const saveEditedMessage = async () => {
    if (!editingMessageId) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/rooms/${roomId}/message/${editingMessageId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: input }),
        },
      );

      if (res.ok) {
        toast.success("Message edited");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === editingMessageId
              ? { ...m, content: input, edited: true }
              : m,
          ),
        );
        setInput("");
        setEditingMessageId(null);
      } else {
        toast.error("Failed to edit");
      }
    } catch (err) {
      toast.error("Error editing message");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (editingMessageId) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/rooms/${roomId}/message/${editingMessageId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: input }),
          },
        );

        if (response.ok) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === editingMessageId
                ? {
                    ...msg,
                    content: input,
                    edited: true,
                  }
                : msg,
            ),
          );
          setEditingMessageId(null);
          setInput("");
        } else toast.error("Edit failed");
      } catch (err) {
        toast.error("Error editing message");
      }
      return;
    }

    if (stompClient && connected) {
      const timestamp = new Date().toISOString();

      const message = {
        sender: currentUser,
        content: input,
        roomId,
        timestamp,

        // 🟦 reply support
        replyTo: replyTo
          ? {
              id: replyTo.id,
              sender: replyTo.sender,
              content: replyTo.content,
            }
          : null,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message),
      );

      setInput(""); // clear input after sending
      setReplyTo(null); // clear reply box
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await deleteRoomApi(roomId);
      toast.success("Room deleted");
      navigate("/all-chats"); // or "/all-chats"
    } catch (err) {
      toast.error("Failed to delete room");
    }
  };

  const handleDeleteRoomConfirm = async () => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await deleteRoomApi(roomId);

      // ⭐ Force YOURSELF to leave instantly
      toast.error("Room deleted!");
      navigate("/all-chats");
    } catch (err) {
      toast.error("Failed to delete room");
    }
  };

  async function handleLogout() {
    // console.log("hey handle logouttttttttttt");
    setIsLoggingOut(true);

    try {
      if (roomId && currentUser) {
        await axios.get(
          `http://localhost:8080/api/v1/rooms/${roomId}/leave/${currentUser}`,
        );
      }
    } catch (err) {
      console.error("Error leaving room:", err);
    }

    if (stompClient) stompClient.disconnect();

    setConnected(false);
    setRoomId("");
    setCurrentUser("");

    toast.error("Logging Out");
    navigate("/all-chats");
  }

  // ===================== FILE UPLOAD HANDLER =====================
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/files/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        const timestamp = new Date().toISOString();
        const message = {
          sender: currentUser,
          content: result.fileUrl,
          roomId: roomId,
          timestamp,
          fileName: result.fileName,
          fileType: file.type,
        };

        stompClient.send(
          `/app/sendMessage/${roomId}`,
          {},
          JSON.stringify(message),
        );
      } else {
        toast.error(result.error || "File upload failed");
      }
    } catch (error) {
      toast.error("File upload error");
    }
  };

  const handleFileSend = async () => {
    if (!previewFile) return;

    const formData = new FormData();
    formData.append("file", previewFile);

    try {
      const response = await fetch("http://localhost:8080/api/files/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const message = {
          sender: currentUser,
          content: result.fileUrl,
          roomId,
          timestamp: new Date().toISOString(),
          fileType: previewFile.type,
        };

        stompClient.send(
          `/app/sendMessage/${roomId}`,
          {},
          JSON.stringify(message),
        );
        setPreviewFile(null);
      } else {
        toast.error(result.error || "File upload failed");
      }
    } catch (error) {
      toast.error("Upload error");
    }
  };

  // ========================= for Today, Yesterday or Date show of middle chat=====
  const getDateLabel = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ---------- New: click-outside handler for the glass overlay ----------
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      // If sidebar is open and click is outside the menuRef, close it
      if (
        isSidebarOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsSidebarOpen(false);
      }
    }
    if (isSidebarOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div>
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 shadow-md bg-white dark:bg-gray-900 dark:border-gray-700 transition-colors duration-300">
        {/* Left: Room name + theme */}
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {roomId ? `Room: ${roomId}` : "Chat Room"}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform duration-200"
          >
            {darkMode ? (
              <HiSun className="text-yellow-400" size={18} />
            ) : (
              <HiMoon className="text-gray-800" size={18} />
            )}
          </button>
        </div>

        {/* Center: user info */}
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
                className="w-10 h-10 rounded-full border-2 border-blue-400 shadow-lg cursor-pointer hover:scale-105 transition-transform"
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
            <span className="font-medium text-lg text-gray-800 dark:text-white">
              {user.username}
            </span>
          </div>
        )}

        {/* Right: leave */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          Leave
        </button>
      </header>

      {/* selection action bar */}
      {isSelecting && (
        <div className="fixed top-16 left-0 w-full z-40 bg-gray-800 text-white py-2 px-4 flex justify-between items-center shadow">
          <span>{selectedMessages.length} selected</span>

          <div className="flex gap-4">
            {/* Reply button */}
            {selectedMessages.length === 1 && (
              <button
                onClick={() => {
                  setReplyTo(
                    messages.find((m) => m.id === selectedMessages[0]),
                  );
                  setIsSelecting(false);
                }}
                className="text-blue-300 hover:text-white"
              >
                ↩ Reply
              </button>
            )}

            {/* Delete Multi */}
            <button
              onClick={async () => {
                for (let id of selectedMessages) {
                  await deleteMessage(id);
                }
                setSelectedMessages([]);
                setIsSelecting(false);
              }}
              className="text-red-400 hover:text-white"
            >
              🗑 Delete
            </button>

            {/* Cancel Selection */}
            <button
              onClick={() => {
                setSelectedMessages([]);
                setIsSelecting(false);
              }}
              className="text-gray-300 hover:text-white"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* ===== Floating burger button (top-left) - redesigned with animation ===== */}
      <div>
        {/* inline styles for floating + glassy button and menu behavior */}
        <style>{`
          /* floating bob animation */
          @keyframes floatUpDown {
            0% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0); }
          }

          .floating-btn {
            animation: floatUpDown 3s ease-in-out infinite;
          }

          /* small subtle glass item hover */
          .glass-item:hover {
            background: rgba(255,255,255,0.08);
            backdrop-filter: blur(6px);
          }
        `}</style>

        <button
          onClick={() => setIsSidebarOpen((s) => !s)}
          className="fixed top-20 left-4 z-50 p-3 rounded-full 
    bg-white/80 dark:bg-gray-800/80 backdrop-blur-md 
    border border-white/20 dark:border-gray-700 
    shadow-[0_0_8px_#00eaff,0_0_16px_#00eaff,0_0_24px_#00eaff]
    hover:shadow-[0_0_12px_#00eaff,0_0_22px_#00eaff,0_0_32px_#00eaff]
    transition-all duration-300 hover:scale-110 floating-btn"
          aria-label="Open menu"
        >
          {/* Animated burger -> X */}

          <HiMenuAlt3 className="text-gray-900 dark:text-white" size={26} />
        </button>
      </div>

      {/* ===== Glass overlay menu (drops from the button) ===== */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop: clicking will close and menu will animate out */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* The menu itself */}
            <motion.div
              ref={menuRef}
              initial={{ y: -18, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -18, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="fixed left-4 top-20 z-50 w-64 rounded-2xl backdrop-blur-lg bg-white/30 dark:bg-gray-900/40 border border-white/20 dark:border-gray-700 shadow-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  Menu
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-full bg-white/30 dark:bg-gray-800/40 hover:scale-105 transition-transform"
                  aria-label="Close menu"
                >
                  <HiX className="text-gray-800 dark:text-white" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate("/all-chats");
                  }}
                  className="glass-item w-full text-left px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 transition-all"
                >
                  💬 All Chats
                </button>
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate("/complaint", {
                      state: { roomId, roomName: roomId },
                    });
                  }}
                  className="glass-item w-full text-left px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 transition-all"
                >
                  📝 Complaint
                </button>
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate("/all-user-chatroom", {
                      state: { roomId, roomName: roomId },
                    });
                  }}
                  className="glass-item w-full text-left px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 transition-all"
                >
                  ⚙️ All Users
                </button>
                {/* Delete Room — only creator can see */}
                {currentUser === createdBy && (
                  <button
                    onClick={() => handleDeleteRoom(roomId)}
                    className="glass-item w-full text-left px-3 py-2 rounded-lg text-red-500 transition-all"
                  >
                    🗑 Delete Room
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate(`/room-settings/${roomId}`);
                  }}
                  className="glass-item w-full text-left px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 transition-all"
                >
                  ⚙️ Settings
                </button>
                <hr className="border-t border-white/10 my-2" />

                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setShowThemePicker(true);
                  }}
                  className="glass-item w-full text-left px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 transition-all"
                >
                  🎨 Theme
                </button>
                <hr className="border-t border-white/10 my-2" />
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    handleLogout();
                  }}
                  className="glass-item w-full text-left px-3 py-2 rounded-lg text-red-500 transition-all"
                >
                  🚪 Leave
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== Main Message Area  ===== */}
      {/* <main
        ref={chatBoxRef}
        className="bg-gray-300 py-20 w-2/3 dark:bg-slate-700 mx-auto h-screen 
             overflow-y-auto overflow-x-hidden px-7
             [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      > */}
      <main
        ref={chatBoxRef}
        className="py-20 w-2/3 mx-auto h-screen 
       overflow-y-auto overflow-x-hidden px-7
       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          // fallback Tailwind-like colors when no custom bg is set
          backgroundColor: background.value ? undefined : undefined,
          ...chatBgStyle,
        }}
      >
        {/* search func */}
        {/* SEARCH BAR (GLOBAL, NOT INSIDE MESSAGE LOOP) */}
        {showSearchBar && (
          <div
            className="fixed top-16 left-1/2 -translate-x-1/2 w-1/2 
                  bg-white dark:bg-gray-800 shadow-xl 
                  p-3 rounded-full z-50 flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Search messages..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white px-2"
              autoFocus // 🔥 Fixes cursor disappearing
            />

            <button
              onClick={() => {
                setShowSearchBar(false);
                setSearchText("");
              }}
              className="text-red-500 text-lg"
            >
              ✖
            </button>
          </div>
        )}

        {/* {messages.map((message, index) => { */}
        {messages
          .filter((msg) => {
            if (!searchText.trim()) return true;

            const text = searchText.toLowerCase();

            return (
              msg.content?.toLowerCase().includes(text) ||
              msg.sender?.toLowerCase().includes(text) ||
              (msg.timestamp &&
                new Date(msg.timestamp)
                  .toLocaleDateString("en-IN")
                  .toLowerCase()
                  .includes(text))
            );
          })
          .map((message, index) => {
            // ===========
            // console.log("Sender from message → ", message.sender);

            const currentDateLabel = getDateLabel(message.timestamp);
            const prevDateLabel =
              index > 0 ? getDateLabel(messages[index - 1].timestamp) : null;
            const showDateDivider = currentDateLabel !== prevDateLabel;

            const renderMessageContent = (message) => {
              const url = message.content?.toLowerCase() || "";
              const type = message.fileType?.toLowerCase() || "";

              if (
                type.startsWith("image/") ||
                url.endsWith(".jpg") ||
                url.endsWith(".jpeg") ||
                url.endsWith(".png") ||
                url.endsWith(".gif")
              ) {
                return (
                  <div className="relative group inline-block">
                    <img
                      src={message.content}
                      alt={message.fileName || "sent"}
                      onClick={() =>
                        setPreviewMedia({ url: message.content, type: "image" })
                      }
                      className="max-w-[200px] rounded-md cursor-pointer hover:brightness-90 transition"
                    />
                  </div>
                );
              }

              if (type.includes("pdf") || url.endsWith(".pdf")) {
                return (
                  <div
                    onClick={() =>
                      setPreviewMedia({ url: message.content, type: "pdf" })
                    }
                    className="cursor-pointer relative group inline-block"
                  >
                    <iframe
                      src={message.content}
                      title="pdf"
                      className="w-40 h-40 rounded-md pointer-events-none"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 rounded-md">
                      <span className="text-white text-sm font-medium">
                        🔍 Preview
                      </span>
                    </div>
                  </div>
                );
              }
              if (
                type.includes("spreadsheet") ||
                url.endsWith(".xls") ||
                url.endsWith(".xlsx")
              ) {
                return (
                  <div className="relative group inline-block">
                    <div className="flex flex-col items-center bg-green-700 text-white px-3 py-2 rounded-md shadow-md w-48">
                      <span className="text-sm font-semibold">
                        📗 Excel File
                      </span>
                      <span className="text-xs truncate w-full text-center">
                        {message.fileName || message.content.split("/").pop()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = message.content;
                        link.download =
                          message.fileName || message.content.split("/").pop();
                        link.click();
                      }}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <div className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-md text-sm">
                        ⬇ Download
                      </div>
                    </button>
                  </div>
                );
              }

              if (
                type.includes("word") ||
                url.endsWith(".doc") ||
                url.endsWith(".docx")
              ) {
                return (
                  <div className="relative group inline-block">
                    <div className="flex flex-col items-center bg-blue-700 text-white px-3 py-2 rounded-md shadow-md w-48">
                      <span className="text-sm font-semibold">
                        📘 Word File
                      </span>
                      <span className="text-xs truncate w-full text-center">
                        {message.fileName || message.content.split("/").pop()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = message.content;
                        link.download =
                          message.fileName || message.content.split("/").pop();
                        link.click();
                      }}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <div className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-md text-sm">
                        ⬇ Download
                      </div>
                    </button>
                  </div>
                );
              }
              // 🎤 AUDIO MESSAGE SUPPORT

              // 🎤 AUDIO MESSAGE SUPPORT — FIXED
              if (
                type.startsWith("audio/") ||
                message.fileType === "audio" ||
                url.endsWith(".webm") ||
                url.endsWith(".mp3") ||
                url.endsWith(".wav") ||
                url.endsWith(".ogg")
              ) {
                // Detect mime type from URL if backend didn't send fileType
                const mime =
                  message.fileType ||
                  (url.endsWith(".webm")
                    ? "audio/webm"
                    : url.endsWith(".mp3")
                      ? "audio/mpeg"
                      : url.endsWith(".wav")
                        ? "audio/wav"
                        : "audio/webm");

                return (
                  <div
                    className={`flex items-center gap-3 
                
                ${
                  isSelected(message.id)
                    ? "bg-blue-300 dark:bg-blue-700 border-2 border-blue-500"
                    : message.sender === currentUser
                      ? "bg-green-300 dark:bg-green-900"
                      : "bg-gray-200 dark:bg-gray-800"
                }
                rounded-lg w-56`}
                  >
                    {/* <div 
                    className="flex items-center gap-3 bg-green-800 
                dark:bg-green-900 p-3 rounded-lg w-56"
                  >*/}
                    <audio controls className="w-full  rounded-md">
                      <source src={message.content} type={mime} />
                    </audio>
                    {/* </div> */}
                  </div>
                );
              }

              return (
                <p className="break-words whitespace-pre-wrap max-w-[250px] text-sm leading-relaxed">
                  {message.content}
                </p>
              );
            };

            return (
              <React.Fragment key={index}>
                {showDateDivider && (
                  <div className="flex justify-center my-4">
                    <div className="bg-gray-600 text-white text-xs px-4 py-1 rounded-full shadow-md">
                      {currentDateLabel}
                    </div>
                  </div>
                )}

                <div
                  className={`flex ${
                    message.sender === currentUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`${
                      message.sender === currentUser
                        ? "order-last"
                        : "order-first"
                    }`}
                  >
                    <img
                      className="h-9 w-9 m-1 rounded-full border border-gray-400"
                      // src={
                      //   message.sender === currentUser
                      //     ? photoUrl
                      //     : message.senderPhotoUrl || getAvatarUrl(message.sender)
                      // }
                      src={
                        message.sender === currentUser
                          ? photoUrl
                          : userPhotos[message.sender] ||
                            getAvatarUrl(message.sender)
                      }
                      alt={message.sender}
                    />
                  </div>

                  {/*<div
                  className={`my-2 ${
                    message.sender === currentUser
                      ? "bg-green-300 dark:bg-green-900 text-right"
                      : "bg-gray-200 dark:bg-gray-800 text-left"
                  }  text-gray-800 dark:text-gray-100 max-w-xs rounded-md pr-2 pl-2 py-1 shadow-sm`}
                > */}
                  <div
                    onClick={() => {
                      if (isSelecting) toggleSelectMessage(message.id);
                    }}
                    onLongPress={() => toggleSelectMessage(message.id)} // if mobile support needed
                    className={`my-2 cursor-pointer ${
                      isSelected(message.id)
                        ? "bg-blue-300 dark:bg-blue-700 border-2 border-blue-500"
                        : message.sender === currentUser
                          ? "bg-green-300 dark:bg-green-900"
                          : "bg-gray-200 dark:bg-gray-800"
                    } text-gray-800 dark:text-gray-100 max-w-xs rounded-md pr-2 pl-2 py-1 shadow-sm`}
                  >
                    <div className="flex flex-col gap-1 group relative">
                      {/* EMOJI REACTION BAR */}
                      {/* REACTION PICKER */}
                      {reactionPickerId === message.id && (
                        <div
                          className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                  bg-gray-800 text-white px-3 py-1 rounded-full shadow-lg flex gap-2 z-20"
                        >
                          {["❤️", "😂", "👍", "🥲", "🔥", "😭"].map((emoji) => (
                            <span
                              key={emoji}
                              className="cursor-pointer text-lg hover:scale-125 transition-transform"
                              onClick={() => handleReaction(message.id, emoji)}
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-start relative">
                        <p
                          className="text-sm font-bold"
                          style={{ color: generateRandomColor(message.sender) }}
                        >
                          {message.sender}
                        </p>

                        {!message.deleted && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId((prev) =>
                                  prev === message.id ? null : message.id,
                                );
                              }}
                              className={`text-black-100 dark:text-gray-400 dark:hover:text-white 
                p-1 rounded-full transition-opacity duration-150
                ${
                  openDropdownId === message.id
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
                            >
                              <HiOutlineDotsVertical size={18} />
                            </button>

                            {openDropdownId === message.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: "28px",
                                  zIndex: 50,
                                  minWidth: "130px",
                                  borderRadius: "12px",
                                  padding: "6px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                  background: "rgba(15, 25, 50, 0.72)",
                                  backdropFilter: "blur(16px)",
                                  WebkitBackdropFilter: "blur(16px)",
                                  border: "1px solid rgba(120,170,255,0.18)",
                                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                                }}
                              >
                                {/* Reply */}
                                <button
                                  onClick={() => {
                                    setReplyTo(message);
                                    setOpenDropdownId(null);
                                  }}
                                  style={menuBtnStyle}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                      "rgba(255,255,255,0.08)")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                      "transparent")
                                  }
                                >
                                  ↩️ Reply
                                </button>

                                {/* Download */}
                                {(message.fileType ||
                                  message.fileName ||
                                  (message.content &&
                                    (message.content.includes(".jpg") ||
                                      message.content.includes(".jpeg") ||
                                      message.content.includes(".png") ||
                                      message.content.includes(".pdf") ||
                                      message.content.includes(".webm") ||
                                      message.content.includes(".mp3") ||
                                      message.content.includes(".gif") ||
                                      message.content.includes(".doc") ||
                                      message.content.includes(".xls")))) &&
                                  !message.deleted && (
                                    <button
                                      onClick={() => {
                                        fetch(message.content)
                                          .then((r) => r.blob())
                                          .then((blob) => {
                                            const link =
                                              document.createElement("a");
                                            link.href =
                                              URL.createObjectURL(blob);
                                            link.download =
                                              message.fileName ||
                                              message.content.split("/").pop();
                                            link.click();
                                            URL.revokeObjectURL(link.href);
                                          })
                                          .catch(() =>
                                            toast.error("Download failed"),
                                          );
                                        setOpenDropdownId(null);
                                      }}
                                      style={menuBtnStyle}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                          "rgba(255,255,255,0.08)")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.background =
                                          "transparent")
                                      }
                                    >
                                      ⬇️ Download
                                    </button>
                                  )}

                                {/* Delete + Edit — own messages only */}
                                {message.sender === currentUser && (
                                  <>
                                    <button
                                      onClick={() => {
                                        deleteMessage(message.id);
                                        setOpenDropdownId(null);
                                      }}
                                      style={{
                                        ...menuBtnStyle,
                                        color: "#ff6b6b",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                          "rgba(255,80,80,0.1)")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.background =
                                          "transparent")
                                      }
                                    >
                                      🗑 Delete
                                    </button>

                                    {!message.fileType &&
                                      !message.deleted &&
                                      (() => {
                                        const hoursDiff =
                                          (new Date() -
                                            new Date(message.timestamp)) /
                                          (1000 * 60 * 60);
                                        return hoursDiff < 24 ? (
                                          <button
                                            onClick={() => {
                                              setEditingMessageId(message.id);
                                              setInput(message.content);
                                              setEditingOriginalText(
                                                message.content,
                                              );
                                              setOpenDropdownId(null);
                                            }}
                                            style={menuBtnStyle}
                                            onMouseEnter={(e) =>
                                              (e.currentTarget.style.background =
                                                "rgba(255,255,255,0.08)")
                                            }
                                            onMouseLeave={(e) =>
                                              (e.currentTarget.style.background =
                                                "transparent")
                                            }
                                          >
                                            ✏️ Edit
                                          </button>
                                        ) : null;
                                      })()}
                                  </>
                                )}

                                {/* React */}
                                <button
                                  onClick={() => {
                                    setReactionPickerId(message.id);
                                    setOpenDropdownId(null);
                                  }}
                                  style={menuBtnStyle}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                      "rgba(255,255,255,0.08)")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                      "transparent")
                                  }
                                >
                                  😊 React
                                </button>

                                {/* Pin — admin only */}
                                {user?.role === "ADMIN" && (
                                  <button
                                    onClick={() => {
                                      setPinnedMessage({
                                        id: message.id,
                                        text: message.content,
                                        senderName: message.sender,
                                        time: message.timestamp,
                                      });
                                      setOpenDropdownId(null);
                                    }}
                                    style={menuBtnStyle}
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.background =
                                        "rgba(255,255,255,0.08)")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.background =
                                        "transparent")
                                    }
                                  >
                                    📌 Pin
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {message.replyTo && (
                        <div
                          className="
        bg-gray-300 dark:bg-gray-700 
        border-l-4 border-blue-500 
        rounded-md px-2 py-1 mb-2 max-w-[240px]
    "
                        >
                          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                            {message.replyTo.sender}
                          </p>
                          <p className="text-xs text-gray-700 dark:text-gray-300 truncate">
                            {message.replyTo.content || "Media"}
                          </p>
                        </div>
                      )}

                      {/* MAIN MESSAGE CONTENT */}

                      {/* for poll */}

                      {message.poll && !message.deleted ? (
                        <div className="relative bg-white dark:bg-gray-700 dark:text-white p-3 rounded-lg shadow-md max-w-[250px]">
                          {/* 👁 Floating voters icon */}
                          <button
                            onClick={() => setActivePollDetails(message)}
                            className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-800 p-1 rounded-full shadow 
                 hover:scale-110 transition-transform"
                            title="View voters"
                          >
                            👁
                          </button>

                          {/* Question */}
                          <p className="font-semibold text-gray-900 dark:text-white pr-6">
                            {message.pollQuestion}
                          </p>

                          {/* OPTIONS */}
                          {message.pollOptions.map((opt, i) => (
                            <div
                              key={i}
                              className="w-full mt-2 flex justify-between items-center gap-2"
                            >
                              {/* Option text */}
                              <span className="text-gray-900 dark:text-white font-medium">
                                {opt}
                              </span>

                              {/* Animated Vote Button */}
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                onClick={() => votePoll(message.id, opt)}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-sm"
                              >
                                {message.pollVotes?.[opt] || 0} votes
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        renderMessageContent(message)
                      )}
                      {message.deleted && (
                        <span className="text-[10px] text-gray-500 italic self-end">
                          Message deleted
                        </span>
                      )}

                      {/* {renderMessageContent(message)} */}
                      {/* for emoji */}
                      {/* SHOW REACTION BELOW MESSAGE */}
                      {/* {message.reaction && (
                      <div className="text-xl mt-1 flex justify-end">
                        <span className="px-2">{message.reaction}</span>
                      </div>
                    )} */}
                      {message.edited && !message.deleted && (
                        <span className="text-[10px] text-gray-400 self-end">
                          (edited)
                        </span>
                      )}
                      {/* {message.deleted && (
                      <span className="text-[10px] text-gray-500 italic self-end">
                        Message deleted
                      </span>
                    )} */}
                      {/* <span className="text-xs text-gray-400 self-end">
                      {formatTime(message.timestamp)}
                    </span> */}
                      {/* for emoji */}
                      <div className="flex items-center gap-1 self-end">
                        <span className="text-xs text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>

                        {/* ---------- REACTION STRIP (unique emojis + total count) ---------- */}
                      </div>
                      {message.reactions &&
                        Object.keys(message.reactions).length > 0 &&
                        (() => {
                          const reactionEntries = Object.entries(
                            message.reactions,
                          );
                          const uniqueEmojis = [];
                          const seen = new Set();

                          // retain order of FIRST appearance
                          reactionEntries.forEach(([emoji, users]) => {
                            if (!seen.has(emoji)) {
                              uniqueEmojis.push(emoji);
                              seen.add(emoji);
                            }
                          });

                          const totalCount = reactionEntries.reduce(
                            (sum, [emoji, users]) => sum + users.length,
                            0,
                          );

                          return (
                            <div
                              onClick={() =>
                                setActiveReactionMessageId(message.id)
                              }
                              className="flex items-center gap-1 mt-1 self-end bg-gray-300 dark:bg-gray-700 
                 px-2 py-1 rounded-full text-xs cursor-pointer shadow max-w-[200px]"
                            >
                              {uniqueEmojis.map((emoji, idx) => (
                                <span key={idx} className="text-sm">
                                  {emoji}
                                </span>
                              ))}
                              <span className="ml-1 text-[11px] text-gray-800 dark:text-gray-300">
                                {totalCount}
                              </span>
                            </div>
                          );
                        })()}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
      </main>

      {/* for typing */}
      {typingUser && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 text-gray-600 dark:text-gray-300 text-sm animate-pulse">
          {typingUser} is typing...
        </div>
      )}

      {/* reply */}
      {replyTo && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 w-1/2 
                  bg-gray-300 dark:bg-gray-700 p-3 rounded-lg shadow-lg"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-sm">{replyTo.sender}</p>
              <p className="text-xs opacity-80 max-w-[300px] truncate">
                {replyTo.content}
              </p>
            </div>
            <button onClick={() => setReplyTo(null)} className="text-red-500">
              ✖
            </button>
          </div>
        </div>
      )}

      {/* show who vote on the pole */}
      {activePollDetails && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setActivePollDetails(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-5 rounded-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">Votes</h3>

            {Object.entries(activePollDetails.votedUsers).map(
              ([user, option]) => (
                <div
                  key={user}
                  className="flex justify-between bg-gray-200 dark:bg-gray-800 px-3 py-2 rounded mb-2"
                >
                  <span>{user}</span>
                  <span>{option}</span>
                </div>
              ),
            )}

            <button
              className="bg-blue-600 text-white w-full mt-3 py-1 rounded"
              onClick={() => setActivePollDetails(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Input msg starts */}
      <div className="fixed bottom-4 w-full h-12">
        <div className=" h-full  pr-10 gap-4 flex items-center justify-between rounded-full w-1/2 mx-auto ">
          {previewFile && (
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 p-3 rounded-lg flex flex-col items-center shadow-lg">
              {previewFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(previewFile)}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              ) : (
                <p className="text-white">📄 {previewFile.name}</p>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-green-600 px-3 py-1 rounded-md text-sm"
                  onClick={() => handleFileSend()}
                >
                  Send
                </button>
                <button
                  className="bg-red-600 px-3 py-1 rounded-md text-sm"
                  onClick={() => setPreviewFile(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);

              if (stompClient) {
                stompClient.send(
                  `/app/typing/${roomId}`,
                  {},
                  JSON.stringify({
                    username: currentUser,
                    typing: true,
                  }),
                );
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            type="text"
            placeholder="Type your Message..."
            className="w-full dark:bg-gray-800 px-5 py-2 rounded-full h-full focus:outline-none"
          />

          <div className="flex gap-1">
            <input type="file" id="fileInput" style={{ display: "none" }} />

            <input
              type="file"
              id="fileInput"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPreviewFile(file);
                }
              }}
            />

            <button
              className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800 text-white h-10 w-10 flex justify-center items-center rounded-full transition-colors duration-200"
              onClick={() => fileInputRef.current.click()}
            >
              <MdAttachFile size={20} />
            </button>
            {recording && (
              <div
                className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-red-500 text-white
    px-4 py-2 rounded-full flex items-center gap-4 shadow-xl"
              >
                {/* Animated waveform bars */}
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-white animate-pulse"></div>
                  <div className="w-1 h-6 bg-white animate-pulse delay-100"></div>
                  <div className="w-1 h-3 bg-white animate-pulse delay-200"></div>
                  <div className="w-1 h-5 bg-white animate-pulse delay-300"></div>
                </div>

                {/* Timer */}
                <span className="font-mono text-lg">
                  {String(Math.floor(recordTime / 60)).padStart(2, "0")}:
                  {String(recordTime % 60).padStart(2, "0")}
                </span>

                {/* Pause / Resume */}
                {!recordPaused ? (
                  <button onClick={pauseRecording} className="text-xl">
                    ⏸
                  </button>
                ) : (
                  <button onClick={resumeRecording} className="text-xl">
                    ▶️
                  </button>
                )}

                {/* Stop Recording */}
                <button onClick={stopRecording} className="text-xl">
                  ⏹
                </button>

                {/* Cancel */}
                <button
                  onClick={() => {
                    clearInterval(timerRef.current);
                    setRecording(false);
                    setRecordTime(0);
                  }}
                  className="text-xl"
                >
                  ❌
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setShowGifPicker(true);
                fetchGifs(); // load default gifs
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white h-10 w-10 flex justify-center items-center rounded-full"
            >
              GIF
            </button>
            <button
              onClick={sendMessage}
              className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white h-10 w-10 flex justify-center items-center rounded-full transition-colors duration-200"
            >
              <MdSend size={20} />
            </button>

            {/* 3-dot Menu */}

            <div className="relative group">
              <button
                onClick={() => setShowMoreMenu((prev) => !prev)}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 h-10 w-10 flex justify-center items-center rounded-full dark:hover:bg-gray-600 "
              >
                <b>⋮</b>
              </button>

              {/* 🟦 DROPDOWN / DROP-UP MENU */}
              {showMoreMenu && (
                <div
                  ref={moreMenuRef}
                  className="absolute bottom-12 right-0
               bg-white/20 dark:bg-gray-800/40 
               backdrop-blur-lg border border-white/20 dark:border-gray-700
               shadow-xl rounded-xl p-2 w-40 z-50 animate-fadeIn "
                >
                  <button
                    onClick={toggleRecording}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    🎤 Voice
                  </button>
                  <button
                    onClick={() => setShowPollCreator(true)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    📊 Poll
                  </button>
                  <button
                    onClick={() => setShowSearchBar(true)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    🔍 Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* REACTION DETAILS POPUP */}
        {activeReactionMessageId && (
          <div
            onClick={() => setActiveReactionMessageId(null)}
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 p-4 rounded-xl w-80 shadow-xl"
            >
              <h3 className="text-lg font-semibold mb-2 dark:text-white text-gray-900">
                Reactions
              </h3>

              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto p-1">
                {(() => {
                  const msg = messages.find(
                    (m) => m.id === activeReactionMessageId,
                  );
                  if (!msg) return null;

                  return Object.entries(msg.reactions).flatMap(
                    ([emoji, users]) =>
                      users.map((u) => (
                        <div
                          key={u + emoji}
                          className="flex justify-between items-center bg-gray-200 dark:bg-gray-800
                           px-3 py-2 rounded-lg"
                        >
                          <span className="dark:text-white">{u}</span>
                          <span className="text-lg">{emoji}</span>
                        </div>
                      )),
                  );
                })()}
              </div>

              <button
                onClick={() => setActiveReactionMessageId(null)}
                className="mt-3 bg-blue-600 text-white px-4 py-1 rounded-lg w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {/* for poll */}
        {showPollCreator && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            {/* <div className="bg-white p-4 rounded-xl w-96"> */}
            <div className="bg-white text-black dark:bg-gray-800 dark:text-white p-4 rounded-xl w-96">
              <h2 className="text-lg font-bold">Create Poll</h2>

              <input
                type="text"
                placeholder="Poll question"
                className="w-full p-2 border rounded my-2 dark:bg-slate-700 dark:text-white text-black"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
              />

              {pollOptions.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  className="w-full p-2 border rounded my-1 dark:bg-slate-700 dark:text-white text-black"
                  value={pollOptions[i]}
                  onChange={(e) => {
                    const updated = [...pollOptions];
                    updated[i] = e.target.value;
                    setPollOptions(updated);
                  }}
                />
              ))}

              <button
                onClick={() => setPollOptions([...pollOptions, ""])}
                className="text-blue-600"
              >
                + Add option
              </button>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setShowPollCreator(false)}
                  className="bg-gray-400 px-4 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={sendPoll}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  Send Poll
                </button>
              </div>
            </div>
          </div>
        )}

        {/* for popup of images/ pdfs */}
        {/* ===== LIGHTBOX POPUP ===== */}
        {previewMedia &&
          createPortal(
            <div
              onClick={() => setPreviewMedia(null)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                animation: "fadeInBg 0.25s ease",
              }}
            >
              <style>{`
      @keyframes fadeInBg {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes popIn {
        from { opacity: 0; transform: scale(0.92) translateY(16px); }
        to   { opacity: 1; transform: scale(1)    translateY(0);    }
      }
      .preview-box {
        animation: popIn 0.28s cubic-bezier(0.34,1.56,0.64,1);
      }
      .preview-scroll::-webkit-scrollbar { width: 6px; }
      .preview-scroll::-webkit-scrollbar-track { background: transparent; }
      .preview-scroll::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.25);
        border-radius: 999px;
      }
    `}</style>

              {/* Modal box */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="preview-box relative flex flex-col"
                style={{
                  width: "90vw",
                  maxWidth: "900px",
                  maxHeight: "90vh",
                  borderRadius: "16px",
                  overflow: "hidden",
                  // background: "rgba(20,20,20,0.85)",
                  background: "rgba(10, 25, 60, 0.75)", // dark blue glass
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  // border: "1px solid rgba(255,255,255,0.12)",
                  border: "1px solid rgba(120, 170, 255, 0.25)",
                  // boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                  boxShadow: "0 32px 80px rgba(0, 80, 200, 0.35)",
                }}
              >
                {/* Top bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    // borderBottom: "1px solid rgba(255,255,255,0.08)",
                    borderBottom: "1px solid rgba(120,170,255,0.15)",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}
                  >
                    {previewMedia.type === "image"
                      ? "🖼 Image Preview"
                      : previewMedia.type === "pdf"
                        ? "📄 PDF Preview"
                        : previewMedia.type === "audio"
                          ? "🎵 Audio"
                          : "📁 File Preview"}
                  </span>

                  <div style={{ display: "flex", gap: "8px" }}>
                    {/* Download btn */}
                    <button
                      onClick={() => {
                        fetch(previewMedia.url)
                          .then((r) => r.blob())
                          .then((blob) => {
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = previewMedia.url.split("/").pop();
                            link.click();
                            URL.revokeObjectURL(link.href);
                          })
                          .catch(() => toast.error("Download failed"));
                      }}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "white",
                        borderRadius: "8px",
                        padding: "5px 14px",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      ⬇ Download
                    </button>

                    {/* Close btn */}
                    <button
                      onClick={() => setPreviewMedia(null)}
                      style={{
                        background: "rgba(255,80,80,0.15)",
                        border: "1px solid rgba(255,80,80,0.3)",
                        color: "#ff6b6b",
                        borderRadius: "8px",
                        padding: "5px 14px",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      ✕ Close
                    </button>
                  </div>
                </div>

                {/* Content area — scrollable */}
                <div
                  className="preview-scroll"
                  style={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    flex: 1,
                    display: "flex",
                    alignItems:
                      previewMedia.type === "image" ? "center" : "flex-start",
                    justifyContent: "center",
                    padding: previewMedia.type === "image" ? "16px" : "0",
                  }}
                >
                  {previewMedia.type === "image" && (
                    <img
                      src={previewMedia.url}
                      alt="preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "75vh",
                        objectFit: "contain",
                        borderRadius: "10px",
                      }}
                    />
                  )}

                  {previewMedia.type === "pdf" && (
                    <iframe
                      src={previewMedia.url}
                      title="PDF Preview"
                      style={{
                        width: "100%",
                        height: "80vh",
                        border: "none",
                        display: "block",
                      }}
                    />
                  )}

                  {previewMedia.type === "audio" && (
                    <div style={{ padding: "32px", textAlign: "center" }}>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          marginBottom: "16px",
                        }}
                      >
                        🎵 Voice Message
                      </p>
                      <audio
                        controls
                        style={{ width: "100%", maxWidth: "400px" }}
                      >
                        <source src={previewMedia.url} />
                      </audio>
                    </div>
                  )}

                  {previewMedia.type === "excel" && (
                    <div
                      style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                        📗
                      </div>
                      <p>Excel file — click Download to open</p>
                    </div>
                  )}

                  {previewMedia.type === "word" && (
                    <div
                      style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                        📘
                      </div>
                      <p>Word file — click Download to open</p>
                    </div>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )}

        {/* ========= for gif ================== */}
        {showGifPicker && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-[400px] max-h-[500px] overflow-y-auto">
              <input
                type="text"
                placeholder="Search GIF..."
                onChange={(e) => fetchGifs(e.target.value)}
                className="w-full p-2 mb-3 rounded bg-gray-200 dark:bg-gray-700"
              />

              <div className="grid grid-cols-3 gap-2">
                {gifs.map((gif) => (
                  <img
                    key={gif.id}
                    src={gif.images.fixed_height.url}
                    className="cursor-pointer rounded hover:scale-105 transition"
                    onClick={() => sendGif(gif.images.fixed_height.url)}
                  />
                ))}
              </div>

              <button
                onClick={() => setShowGifPicker(false)}
                className="mt-3 w-full bg-red-500 text-white py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* =========== for theme picker =========== */}
        {/* Theme Picker Modal */}
        {showThemePicker && (
          <ThemePicker
            onSelect={(type, value) => {
              updateBackground(type, value);
              setShowThemePicker(false);
            }}
            onReset={resetBackground}
            onClose={() => setShowThemePicker(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
