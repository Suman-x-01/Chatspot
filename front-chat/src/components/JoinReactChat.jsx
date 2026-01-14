// !================
import React, { useState } from "react";
import chat from "../assets/chat.png";
import { toast } from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import { useNavigate } from "react-router";
import useChatContext from "../context/ChatContext";
import useTheme from "../hooks/useTheme";
import createRoomImg from "../assets/createRoom.gif";
const JoinReactChat = () => {
  const { theme, toggleTheme } = useTheme();
  const [detail, setDetail] = useState({
    roomId: "",
    roomName: "",
    userName: "",
  });

  // Get logged in user from sessionStorage
  const savedUser = JSON.parse(sessionStorage.getItem("user"));

  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (
      detail.roomId === "" ||
      detail.userName === "" ||
      detail.roomName === ""
    ) {
      toast.error("All fields are required!");
      return false;
    }
    return true;
  }

  React.useEffect(() => {
    if (savedUser?.username) {
      setDetail((prev) => ({
        ...prev,
        userName: savedUser.username,
      }));
    }
  }, []);

  async function joinChat() {
    if (validateForm()) {
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined successfully!");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        console.log("Joining room name:", detail.userName);
        console.log("Joining room id:", detail.roomId);
        navigate("/chat-room");
      } catch (error) {
        console.error("Join error:", error);
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      try {
        const response = await createRoomApi({
          roomId: detail.roomId,
          roomName: detail.roomName,
          createdBy: detail.userName,
        });

        toast.success("Room created successfully!");
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        navigate("/chat");
      } catch (error) {
        toast.error(error.message || "Error in creating room");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-500 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
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

      <div className="border border-gray-300 dark:border-gray-700 p-8 w-full flex flex-col gap-5 max-w-md rounded-xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-md shadow-2xl transition-all duration-500">
        {/* Chat Logo */}
        <div className="flex mx-auto">
          <img src={createRoomImg} alt="Not Loading.." className="w-[90px]" />
        </div>

        <h1 className="text-center font-semibold text-2xl text-gray-800 dark:text-white">
          Create Room
        </h1>

        {/* Username */}
        <div>
          <label
            htmlFor="name"
            className="block font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          {/* <input
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text"
            name="userName"
            placeholder="Enter Your Name"
            className="w-full bg-gray-100 border border-gray-300 text-gray-800 dark:bg-gray-600 dark:border-gray-300 dark:text-white px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          /> */}
          <input
            value={detail.userName}
            type="text"
            name="userName"
            readOnly
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white 
             px-4 py-2 rounded-full shadow-md border border-gray-300 
             dark:border-gray-500 opacity-70 cursor-not-allowed"
          />
        </div>

        {/* Room Name */}
        <div>
          <label
            htmlFor="roomName"
            className="block font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            Room Name
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.roomName}
            type="text"
            name="roomName"
            placeholder="Enter Room Name"
            className="w-full bg-gray-100 border border-gray-300 text-gray-800 dark:bg-gray-600 dark:border-gray-300 dark:text-white px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Room ID */}
        <div>
          <label
            htmlFor="roomId"
            className="block font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            Room ID
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.roomId}
            name="roomId"
            type="text"
            placeholder="Enter Room ID"
            className="w-full bg-gray-100 border border-gray-300 text-gray-800 dark:bg-gray-600 dark:border-gray-300 dark:text-white px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={createRoom}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 hover:dark:bg-blue-800 text-white rounded-3xl py-2 px-5 transition-all duration-300 hover:scale-105"
          >
            Create Room
          </button>
          <button
            onClick={joinChat}
            className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 hover:dark:bg-orange-800 text-white rounded-3xl py-2 px-5 transition-all duration-300 hover:scale-105"
          >
            Join Room
          </button>
        </div>

        {/* Back Button */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => navigate("/all-chats")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-3xl transition-all duration-300 hover:scale-105"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinReactChat;
