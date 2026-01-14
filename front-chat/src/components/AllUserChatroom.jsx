import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  getUsersByRoomApi,
  getActiveUsersByRoomApi,
} from "../services/RoomService";

const AllUserChatroom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, roomName } = location.state || {};

  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Map of profile photos per username
  const [photos, setPhotos] = useState({});

  useEffect(() => {
    if (!roomId) {
      toast.error("Invalid room");
      navigate("/all-chats");
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);

        // 🟢 Fetch both user lists
        const [userList, activeList] = await Promise.all([
          getUsersByRoomApi(roomId),
          getActiveUsersByRoomApi(roomId),
        ]);

        setUsers(userList || []);
        setActiveUsers(activeList || []);

        // 🟢 Fetch photos for each username from /api/auth/photo/{username}
        const photoPromises = userList.map(async (user) => {
          try {
            const res = await axios.get(
              `http://localhost:8080/api/auth/photo/${user.username}`,
              { responseType: "blob" }
            );
            const blobUrl = URL.createObjectURL(res.data);
            return { username: user.username, photoUrl: blobUrl };
          } catch {
            return { username: user.username, photoUrl: null };
          }
        });

        const photoResults = await Promise.all(photoPromises);
        const photoMap = photoResults.reduce((acc, p) => {
          acc[p.username] = p.photoUrl;
          return acc;
        }, {});
        setPhotos(photoMap);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Optional auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [roomId, navigate]);

  // ✅ Helper: find active user details
  const getActiveUserInfo = (username) => {
    return activeUsers.find((u) => u.username === username);
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
          All Users in Room: {roomName}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-lg transition-all duration-300"
        >
          ← Back
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading users...
        </p>
      ) : users.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => {
            const activeInfo = getActiveUserInfo(user.username);
            const isActive = !!activeInfo;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-300 dark:border-gray-700 flex flex-col items-center gap-3"
              >
                <img
                  src={
                    photos[user.username] ||
                    `https://avatar.iran.liara.run/public/${index + 1}`
                  }
                  alt={user.username}
                  className={`w-20 h-20 rounded-full border-2 ${
                    isActive ? "border-green-400" : "border-gray-400"
                  } shadow-md`}
                />

                <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  {user.username}
                  {isActive && (
                    <span className="text-green-400 text-sm font-medium">
                      ● Active
                    </span>
                  )}
                </h2>

                {isActive ? (
                  <>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Joined :{" "}
                      <span className="text-gray-300">
                        {new Date(activeInfo.date).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Time:{" "}
                      <span className="text-gray-300">
                        {new Date(
                          "1970-01-01T" + activeInfo.time
                        ).toLocaleTimeString()}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="text-gray-400 text-sm italic">
                    Not currently active
                  </p>
                )}

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Email: {user.email || "Not available"}
                </p>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center col-span-full">
          No users found in this room.
        </p>
      )}
    </div>
  );
};

export default AllUserChatroom;
