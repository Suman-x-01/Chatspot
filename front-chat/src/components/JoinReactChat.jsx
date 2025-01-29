import React, { useState } from "react";
import chat from "../assets/chat.png";
import { toast } from "react-hot-toast";
import { createRoomApi } from "../services/RoomService";
import { useNavigate } from "react-router";
import useChatContext from "../context/ChatContext";
import { joinChatApi } from "../services/RoomService";

const JoinReactChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });
  const { roomId, userName, setRoomId, setCurrentUser, setConnected } =
    useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }
  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      console.log("Error");
      toast.error("Invalid Input");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      //join chat

      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("joined..");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
        console.log(error);
      }
    }
  }
  async function createRoom() {
    if (validateForm()) {
      console.log("create room");
      try {
        const response = await createRoomApi(detail.roomId);
        console.log(response);
        toast.success("Room created Successfully");
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        navigate("/chat");
        // forword to chat page
      } catch (error) {
        if (error.status === 400) {
          toast.error("Room Already exist");
        } else {
          toast.error("Error in Creating Room");
        }
      }
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="dark:border-gray-700 border p-8 w-full flex flex-col gap-5 max-w-md rounded-xl dark:bg-gray-900">
        <div className="flex mx-auto">
          <img src={chat} alt="Not Loading.." className="w-16  " />
          {/* <label className="text-3xl">ChatSpot</label> */}
        </div>
        <h1 className="text-center font-semibold text-2xl">
          Join Room / Create Room
        </h1>
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2">
            Name
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text"
            name="userName"
            placeholder="Enter Name"
            id="name"
            className="w-full dark:bg-gray-600 px-4 py-2 dark:border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></input>
        </div>
        {/* room id div */}
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2">
            Room ID
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.roomId}
            name="roomId"
            id="name1"
            type="text"
            placeholder="Enter room Id"
            className="w-full dark:bg-gray-600 px-4 py-2 dark:border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></input>
        </div>

        {/* Buttons */}

        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={createRoom}
            className="dark:bg-blue-600 hover:dark:bg-blue-800 rounded-3xl py-2 px-4 "
          >
            Create Room
          </button>
          <button
            onClick={joinChat}
            className="dark:bg-orange-500 hover:dark:bg-orange-800 rounded-3xl py-2 px-4 "
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinReactChat;
