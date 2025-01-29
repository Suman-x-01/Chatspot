import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxiosHelper";

import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";

import { getMessagess } from "../services/RoomService";
import { formatTime } from "../config/Helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  // Generate a random color based on the sender's name
  const generateRandomColor = (userName) => {
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 50%)`; // Generate a hue based on hash
  };

  // Function to generate a random avatar URL based on the user
  const getAvatarUrl = (username) => {
    // Use a consistent seed for each user to generate a consistent avatar
    const seed = Array.from(username).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    const randomAvatarId = (seed % 100) + 1; // Ensures a number between 1-100
    return `https://avatar.iran.liara.run/public/${randomAvatarId}`;
  };

  // -----------------handle  the image-------------------------------
  // const handleFileUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await fetch("http://localhost:8080/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const result = await response.json();
  //     if (response.ok) {
  //       const message = {
  //         sender: currentUser,
  //         content: result.fileUrl,
  //         roomId: roomId,
  //         timestamp: new Date().toISOString(),
  //       };
  //       stompClient.send(
  //         `/app/sendMessage/${roomId}`,
  //         {},
  //         JSON.stringify(message)
  //       );
  //     } else {
  //       toast.error(result.error || "File upload failed");
  //     }
  //   } catch (error) {
  //     toast.error("File upload error");
  //   }
  // };

  // load the messages

  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        // console.log(messages);
        setMessages(messages);
      } catch (error) {}
    }
    if (connected) {
      loadMessages();
    }
  }, []);

  // scroll down messages
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // init stomp client
  // subscribe
  useEffect(() => {
    const connectWebSocket = () => {
      ///SockJS
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);

        toast.success("connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          // console.log(message);

          const newMessage = JSON.parse(message.body);
          console.log("Time : ", newMessage.timestamp);
          setMessages((prev) => [...prev, newMessage]);

          //rest of the work after success receiving the message
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }

    //stomp client
  }, [roomId]);

  // send message handle

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      // console.log(input);
      const timestamp = new Date().toISOString();
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
        timestamp: timestamp,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };
  // logout
  function handleLogout() {
    stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    toast.error("Logging Out");
    navigate("/");
  }

  return (
    <div>
      {/* Header Starts */}
      <header className=" dark:border-gray-700  fixed w-full dark:bg-gray-900 py-5 shadow flex justify-around items-center">
        {/*  Room Name*/}
        <div>
          <h1 className="text-xl font-semibold">
            Room: <span className="dark:text-green-600">{roomId}</span>
          </h1>
        </div>
        {/* Name */}
        <div>
          <h1 className="text-xl font-semibold">
            User: <span>{currentUser}</span>
          </h1>
        </div>
        {/* Leave Button */}
        <div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 dark:bg-red-500 dark:hover:bg-red-700 rounded-full "
          >
            Leave
          </button>
        </div>
      </header>
      {/* Header Ends Here */}

      {/* Main Message Area Starts*/}
      <main
        ref={chatBoxRef}
        className="py-20 w-2/3 dark:bg-slate-700
      mx-auto h-screen overflow-auto px-7"
      >
        {messages.map((messages, index) => (
          <div
            key={index}
            className={`flex ${
              messages.sender === currentUser ? "justify-end " : "justify-start"
            }`}
          >
            <div
              className={`${
                messages.sender === currentUser ? "order-last" : "order-first"
              }`}
            >
              <img
                className="h-9 w-9 m-1"
                src={getAvatarUrl(messages.sender)}
                alt=""
              />
            </div>
            <div
              className={`my-2 ${
                messages.sender === currentUser
                  ? "dark:bg-green-900 text-right"
                  : "dark:bg-gray-800 text-left"
              }  max-w-xs rounded-md pr-2 pl-2`}
              // className={` my-2 max-w-xs px-4 py-2 rounded-lg ${
              //   messages.sender === currentUser
              //     ? "dark:bg-green-900 text-right rounded-br-none"
              //     : "dark:bg-gray-800 text-left rounded-bl-none"
              // }`}
            >
              <div className="flex flex-row gap-2">
                {/* <div
                  className={`${
                    messages.sender === currentUser
                      ? "order-last"
                      : "order-first"
                  }`}
                >
                  <img
                    className="h-9 w-9 m-1"
                    src={getAvatarUrl(messages.sender)}
                    alt=""
                  />
                </div> */}

                <div className=" flex flex-col gap-1">
                  {/* <p className="text-sm font-bold">{messages.sender}</p> */}

                  <p
                    className="text-sm font-bold"
                    style={{
                      color: generateRandomColor(messages.sender), // Use random color here
                    }}
                  >
                    {messages.sender}
                  </p>
                  {/* ------------------------------------- */}

                  <p>{messages.content}</p>

                  {/* Add formatted timestamp here */}
                  <span className="text-xs text-gray-400 self-end">
                    {formatTime(messages.timeStamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
      {/* Main Message Area Ends*/}

      {/* Input msg starts */}
      <div className="fixed bottom-4 w-full h-12">
        <div className=" h-full  pr-10 gap-4 flex items-center justify-between rounded-full w-1/2 mx-auto ">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            type="text"
            placeholder="Type your Message..."
            className="w-full   dark:bg-gray-800  px-5 py-2 rounded-full h-full focus:outline-none "
          />
          {/* buttons */}
          <div className="flex gap-1">
            <input type="file" id="fileInput" style={{ display: "none" }} />
            <button className="dark:bg-purple-600 h-10 w-10 flex justify-center items-center rounded-full">
              <MdAttachFile size={20} />
            </button>
            <button
              onClick={sendMessage}
              className="dark:bg-green-600 h-10 w-10  flex   justify-center items-center rounded-full"
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
