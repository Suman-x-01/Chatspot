// !==========
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Menu } from "@headlessui/react";
import {
  MoreVertical,
  Info,
  Trash2,
  Users,
  Menu as MenuIcon,
} from "lucide-react";
import CustomPopup from "../components/CustomPopup";
import { useNavigate } from "react-router";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";

import { getMessagesByRoomApi } from "../services/adminRoomService";
import { MessageSquare } from "lucide-react";
import { Transition } from "@headlessui/react";

import "react-tooltip/dist/react-tooltip.css";
import {
  getAllRooms,
  deleteRoomApi,
  getRoomInfoApi,
  getActiveUsersApi,
} from "../services/adminRoomService";
import ConfirmPopup from "./ConfirmPopup";

const AdminAllChat = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const [unreadCounts, setUnreadCounts] = useState({});
  const [openUpward, setOpenUpward] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState("");

  // Stylish navbar menu
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const leftMenuRef = useRef(null);

  // CLICK OUTSIDE MENU TO CLOSE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (leftMenuRef.current && !leftMenuRef.current.contains(e.target)) {
        setLeftMenuOpen(false);
      }
    };

    if (leftMenuOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [leftMenuOpen]);

  const showPopup = (title, content) => {
    setPopupTitle(title);
    setPopupContent(content);
    setPopupOpen(true);
  };

  useEffect(() => {
    const storedAdmin = JSON.parse(sessionStorage.getItem("admin"));
    if (!storedAdmin) {
      toast.error("Please login as admin first");
      navigate("/login/admin");
      return;
    }
    setAdmin(storedAdmin);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin");
    toast.success("Admin logged out successfully");
    navigate("/login/admin");
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await getAllRooms();
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  // const handleDeleteRoom = async (roomId) => {
  //   if (!window.confirm("Are you sure you want to delete this room?")) return;
  //   try {
  //     await deleteRoomApi(roomId);
  //     setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
  //   } catch (err) {
  //     console.error("Failed to delete room:", err);
  //   }
  // };
  const handleDeleteRoomConfirm = async () => {
    try {
      await deleteRoomApi(roomToDelete);
      setRooms((prev) => prev.filter((r) => r.roomId !== roomToDelete));
      toast.success("Room deleted successfully");
    } catch (err) {
      // console.error("Failed to delete room:", err);
      toast.error("Failed to delete room");
    } finally {
      setConfirmOpen(false);
      setRoomToDelete(null);
    }
  };

  const handleViewInfo = async (roomId) => {
    const info = await getRoomInfoApi(roomId);
    showPopup(
      "Room Info",
      `Room Name: ${info.roomName}
Created By: ${info.createdBy}
Created At: ${info.createdAt}
Room ID: ${info.roomId}`
    );
  };

  // const handleActiveUsers = async (roomId) => {
  //   const { count } = await getActiveUsersApi(roomId);
  //   showPopup("Active Users", `Currently Active Users: ${count}`);
  // };
  const handleActiveUsers = (roomId) => {
    navigate(`/admin/room/${roomId}/active-users`);
  };

  //   const handleViewMessages = async (roomId) => {
  //     try {
  //       const messages = await getMessagesByRoomApi(roomId);
  //       if (!messages || messages.length === 0) {
  //         return showPopup("Messages", "No messages found in this room.");
  //       }

  //       setUnreadCounts((prev) => ({ ...prev, [roomId]: 0 }));

  //       const formatted = messages
  //         .map(
  //           (m) =>
  //             `Complaint Against: ${m.complaintAgainst}
  // Reason: ${m.reason}
  // Message: ${m.message}`
  //         )
  //         .join("\n\n");

  //       showPopup("Room Messages", formatted);
  //     } catch (err) {
  //       console.error("Error fetching messages:", err);
  //       toast.error("Failed to fetch messages");
  //     }
  //   };
  const handleViewMessages = (roomId) => {
    navigate(`/admin/room/${roomId}/messages`);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await Promise.all(
          rooms.map(async (room) => {
            const msgs = await getMessagesByRoomApi(room.roomId);
            return { roomId: room.roomId, count: msgs.length };
          })
        );

        const newCounts = {};
        data.forEach(({ roomId, count }) => {
          newCounts[roomId] = count;
        });

        setUnreadCounts(newCounts);
      } catch (err) {
        console.error("Error auto-refreshing messages:", err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [rooms]);

  if (loading)
    return <p className="text-center mt-20 text-gray-400">Loading rooms...</p>;

  return (
    <div className="relative">
      {/* BACKGROUND BLUR + DISABLE POINTER EVENTS */}
      {leftMenuOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 z-[5000] pointer-events-auto"></div>
      )}

      {/* MAIN CONTENT WRAPPER (DISABLED WHEN MENU OPEN) */}
      <div
        className={`p-8 bg-gray-900 min-h-screen text-white relative overflow-visible 
        ${leftMenuOpen ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        {/* NAVBAR (REMAINS CLICKABLE ALWAYS) */}
        <div
          className="flex items-center gap-4 p-4 shadow-lg 
          bg-white/10 backdrop-blur-xl border border-white/20
          rounded-xl mb-10 relative z-[6000] pointer-events-auto"
        >
          {/* GLOW MENU BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent outside click interfering
              setLeftMenuOpen((prev) => !prev);
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center
            bg-gray-800/40 border border-cyan-400 shadow-lg transition hover:scale-110
            hover:shadow-[0_0_20px_3px_#00ffff90]"
          >
            <MenuIcon className="text-cyan-300" size={22} />
          </button>

          {/* TITLE */}
          <h1 className="text-xl font-semibold text-blue-400">
            Admin Dashboard
          </h1>

          <div className="flex-1"></div>

          {/* ADMIN CENTERED INFO */}
          {admin && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border-2 border-blue-400 shadow-lg 
                animate-pulse flex items-center justify-center text-sm font-bold"
              >
                {admin.adminName[0]?.toUpperCase()}
              </div>
              <span className="font-medium">{admin.adminName}</span>
            </div>
          )}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition"
          >
            Logout
          </button>

          {/* SLIDE NAVBAR MENU */}
          <Transition
            show={leftMenuOpen}
            enter="transition duration-200 transform"
            enterFrom="-translate-x-5 opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition duration-200 transform"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="-translate-x-5 opacity-0"
          >
            <div
              ref={leftMenuRef}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              className="absolute top-16 left-0 w-48 p-4 rounded-xl
              backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl
              flex flex-col gap-3 z-[7000] pointer-events-auto"
            >
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 rounded-md hover:bg-white/20"
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("/all-signedup-users")}
                className="p-2 rounded-md hover:bg-white/20"
              >
                All Users
              </button>
              <button className="p-2 rounded-md hover:bg-white/20">
                Settings
              </button>
              <button className="p-2 rounded-md hover:bg-white/20">Help</button>
            </div>
          </Transition>
        </div>
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

        {/* CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            // <div key={room.roomId} className="relative group">
            //   <motion.div
            //     className="bg-gray-800 cursor-pointer rounded-2xl p-6 shadow-lg
            //     hover:shadow-blue-600/30 transition transform hover:scale-105
            //     border border-gray-700 relative z-10"
            //     whileHover={{ scale: 1.03 }}
            //   >
            //     <h2 className="text-xl font-semibold text-blue-500">
            //       {room.roomName}
            //     </h2>
            //     <p className="text-sm text-gray-400 mt-2">
            //       Created by: {room.createdBy}
            //     </p>
            //   </motion.div>

            //   {/* 3 DOT MENU */}
            // <Menu
            //   as="div"
            //   className="absolute top-3 right-3 text-left z-[9999] opacity-0 group-hover:opacity-100 transition"
            // >
            //   <Menu.Button
            //     onClick={(e) => {
            //       const rect = e.currentTarget.getBoundingClientRect();
            //       const spaceBelow = window.innerHeight - rect.bottom;
            //       setOpenUpward(spaceBelow < 180);
            //     }}
            //     className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-full shadow-md transition"
            //   >
            //     <MoreVertical size={18} className="text-gray-200" />
            //   </Menu.Button>

            //   <Transition
            //     enter="transition ease-out duration-150 transform"
            //     enterFrom="opacity-0 scale-95 -translate-y-1"
            //     enterTo="opacity-100 scale-100 translate-y-0"
            //     leave="transition ease-in duration-100 transform"
            //     leaveFrom="opacity-100 scale-100 translate-y-0"
            //     leaveTo="opacity-0 scale-95 -translate-y-1"
            //   >
            //     <Menu.Items
            //       className={`absolute right-0 ${
            //         openUpward ? "bottom-10" : "top-10"
            //       } bg-gray-800 border border-gray-700 rounded-xl shadow-2xl
            //       flex flex-col items-center gap-2 p-3 z-[9999]`}
            //     >
            //       <Menu.Item>
            //         <button
            //           onClick={() => handleDeleteRoom(room.roomId)}
            //           className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition"
            //         >
            //           <Trash2 size={18} color="white" />
            //         </button>
            //       </Menu.Item>

            //       <Menu.Item>
            //         <button
            //           onClick={() => handleActiveUsers(room.roomId)}
            //           className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition"
            //         >
            //           <Users size={18} color="white" />
            //         </button>
            //       </Menu.Item>

            //       <Menu.Item>
            //         <button
            //           onClick={() => handleViewMessages(room.roomId)}
            //           className="relative p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition"
            //         >
            //           <MessageSquare size={18} color="white" />
            //           {unreadCounts[room.roomId] > 0 && (
            //             <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1.5">
            //               {unreadCounts[room.roomId]}
            //             </span>
            //           )}
            //         </button>
            //       </Menu.Item>

            //       <Menu.Item>
            //         <button
            //           onClick={() => handleViewInfo(room.roomId)}
            //           className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition"
            //         >
            //           <Info size={18} color="white" />
            //         </button>
            //       </Menu.Item>
            //     </Menu.Items>
            //   </Transition>
            // </Menu>
            // </div>
            <div key={room.roomId} className="relative group">
              <motion.div
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-xl 
               border border-gray-700 hover:border-cyan-400 transition-all
               duration-300 transform hover:scale-105 hover:shadow-cyan-500/25
               cursor-pointer relative z-10"
                whileHover={{ scale: 1.05 }}
              >
                {/* Title */}
                <h2 className="text-2xl font-bold text-cyan-300 drop-shadow-sm">
                  {room.roomName}
                </h2>

                {/* Created By */}
                <p className="text-sm text-gray-300 mt-3">
                  <span className="text-gray-400 font-medium">Created By:</span>{" "}
                  {room.createdBy}
                </p>

                {/* Created At */}
                <p className="text-sm text-gray-300 mt-1">
                  <span className="text-gray-400 font-medium">Created At:</span>{" "}
                  {room.createdAt}
                </p>

                {/* Room ID */}
                <p className="text-xs text-gray-500 mt-3">
                  <span className="text-gray-400 font-medium">Room ID:</span>{" "}
                  {room.roomId}
                </p>

                {/* Subtle glow ring behind card */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 
                 transition duration-500 blur-2xl bg-cyan-500"
                ></div>
              </motion.div>

              {/* 3 DOT MENU */}
              {/* <Menu
                as="div"
                className="absolute top-3 right-3 text-left z-[9999] opacity-0 
               group-hover:opacity-100 transition"
              >
                <Menu.Button
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - rect.bottom;
                    setOpenUpward(spaceBelow < 180);
                  }}
                  className="p-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-full shadow-md 
                 border border-gray-600 hover:border-cyan-400 transition"
                >
                  <MoreVertical size={18} className="text-gray-200" />
                </Menu.Button>
              </Menu> */}
              {/* -------------------------- */}
              <Menu
                as="div"
                className="absolute top-3 right-3 text-left z-[9999] opacity-0 group-hover:opacity-100 transition"
              >
                <Menu.Button
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - rect.bottom;
                    setOpenUpward(spaceBelow < 180);
                  }}
                  className="p-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-full shadow-md 
                 border border-gray-600 hover:border-cyan-400 transition"
                >
                  <MoreVertical size={18} className="text-gray-200" />
                </Menu.Button>

                <Transition
                  enter="transition ease-out duration-150 transform"
                  enterFrom="opacity-0 scale-95 -translate-y-1"
                  enterTo="opacity-100 scale-100 translate-y-0"
                  leave="transition ease-in duration-100 transform"
                  leaveFrom="opacity-100 scale-100 translate-y-0"
                  leaveTo="opacity-0 scale-95 -translate-y-1"
                >
                  <Menu.Items
                    className={`absolute right-0 ${
                      openUpward ? "bottom-10" : "top-10"
                    } bg-gray-800 border border-gray-700 rounded-xl shadow-2xl
                    flex flex-col items-center gap-2 p-3 z-[9999]`}
                  >
                    <Menu.Item>
                      <button
                        // onClick={() => handleDeleteRoom(room.roomId)}
                        onClick={() => {
                          setRoomToDelete(room.roomId);
                          setConfirmOpen(true);
                        }}
                        className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition"
                      >
                        <Trash2 size={18} color="white" />
                      </button>
                    </Menu.Item>

                    <Menu.Item>
                      <button
                        onClick={() => handleActiveUsers(room.roomId)}
                        className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition"
                      >
                        <Users size={18} color="white" />
                      </button>
                    </Menu.Item>

                    <Menu.Item>
                      <button
                        onClick={() => handleViewMessages(room.roomId)}
                        className="relative p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition"
                      >
                        <MessageSquare size={18} color="white" />
                        {unreadCounts[room.roomId] > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1.5">
                            {unreadCounts[room.roomId]}
                          </span>
                        )}
                      </button>
                    </Menu.Item>

                    <Menu.Item>
                      <button
                        onClick={() => handleViewInfo(room.roomId)}
                        className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition"
                      >
                        <Info size={18} color="white" />
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          ))}
        </div>

        <CustomPopup
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          title={popupTitle}
          content={popupContent}
        />
        <ConfirmPopup
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDeleteRoomConfirm}
          title="Delete Room?"
          content="Are you sure you want to permanently delete this room?"
        />
      </div>
    </div>
  );
};

export default AdminAllChat;
