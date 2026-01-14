import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  Trash2,
  Star,
  Ban,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminActiveUsers() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]); // all users who ever joined
  const [activeUsers, setActiveUsers] = useState([]); // active user info objects
  const [bannedList, setBannedList] = useState([]); // list of BannedUser objects
  const [isBannedMap, setIsBannedMap] = useState({}); // { username: true }

  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const [warnPopupOpen, setWarnPopupOpen] = useState(false);
  const [warnUser, setWarnUser] = useState("");
  const [warnMessage, setWarnMessage] = useState("");

  // Ban modal
  const [banPopupOpen, setBanPopupOpen] = useState(false);
  const [banTargetUser, setBanTargetUser] = useState("");

  // Auto-refresh / initial load
  useEffect(() => {
    loadAllUsers();
    const i = setInterval(loadAllUsers, 10000);
    return () => clearInterval(i);
  }, [roomId]);

  const loadAllUsers = async () => {
    try {
      const [usersRes, activeRes, bannedRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/v1/rooms/${roomId}/users`),
        axios.get(`http://localhost:8080/api/v1/rooms/${roomId}/active-users`),
        axios.get(`http://localhost:8080/api/v1/rooms/${roomId}/banned`),
      ]);

      setUsers(usersRes.data || []);
      setActiveUsers(activeRes.data || []);
      setBannedList(bannedRes.data || []);

      // build map: bannedByUsername
      const map = {};
      (bannedRes.data || []).forEach((b) => {
        // handle objects or plain strings defensively
        const username = b?.username ?? b;
        if (username) map[username] = true;
      });
      setIsBannedMap(map);
    } catch (err) {
      console.error("Failed to load users/active/banned", err);
    }
  };

  const getActiveInfo = (username) =>
    activeUsers.find((u) => u.username === username);

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOption === "name-asc") return a.username.localeCompare(b.username);
    if (sortOption === "name-desc") return b.username.localeCompare(a.username);
    return 0;
  });

  // Pagination
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const paginatedUsers = sortedUsers.slice(indexOfFirst, indexOfLast);

  const nextPage = () =>
    setCurrentPage((p) => (p * usersPerPage < sortedUsers.length ? p + 1 : p));
  const prevPage = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));

  // Kick / delete active (server should remove from active list)
  const removeUser = async (username) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/rooms/${roomId}/active-users/${username}`
      );
      await loadAllUsers();
    } catch (err) {
      console.error("Failed to remove user", err);
      alert("Failed to remove user");
    }
  };

  // Open pop-up to confirm ban/unban
  const openBanConfirm = (username) => {
    setBanTargetUser(username);
    setBanPopupOpen(true);
  };

  // Confirm ban/unban (called from confirmation modal)
  const handleBanConfirm = async () => {
    const username = banTargetUser;
    try {
      if (isBannedMap[username]) {
        // unban
        await axios.delete(
          `http://localhost:8080/api/v1/rooms/${roomId}/ban/${username}`
        );
      } else {
        // ban
        await axios.post(
          `http://localhost:8080/api/v1/rooms/${roomId}/ban/${username}`
        );
        // optionally also remove from active list
        await axios
          .delete(
            `http://localhost:8080/api/v1/rooms/${roomId}/active-users/${username}`
          )
          .catch(() => {});
      }
      setBanPopupOpen(false);
      setBanTargetUser("");
      await loadAllUsers();
    } catch (err) {
      console.error("Ban/unban failed", err);
      alert("Failed to update ban status");
    }
  };

  // Issue warning
  const issueWarning = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/rooms/${roomId}/warn/${warnUser}`,
        { message: warnMessage }
      );
      alert("Warning sent!");
      setWarnPopupOpen(false);
      setWarnMessage("");
    } catch (err) {
      console.error("Warning failed", err);
      alert("Failed to send warning");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-500">
          Active Users in Room: {roomId}
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
        >
          Back
        </button>
      </div>

      {/* SEARCH + SORT */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-lg w-1/2">
          <Search size={18} />
          <input
            type="text"
            className="bg-transparent outline-none w-full"
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800"
        >
          <option value="name-asc">Sort: Name ↑</option>
          <option value="name-desc">Sort: Name ↓</option>
        </select>
      </div>

      {/* USER CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedUsers.map((user, index) => {
          const activeInfo = getActiveInfo(user.username);
          const banned = !!isBannedMap[user.username];

          return (
            <motion.div
              key={user.username + index}
              className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-300 dark:border-gray-700"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {activeInfo && (
                <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs">
                  Active
                </span>
              )}

              {banned && (
                <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
                  BANNED
                </span>
              )}

              {/* <img
                src={`http://localhost:8080/api/v1/rooms/${roomId}/users`}
                className="w-20 h-20 rounded-full mx-auto mb-3"
                alt={user.username}
              /> */}
              <img
                src={
                  user.photo
                    ? `data:image/png;base64,${user.photo}`
                    : `https://avatar.iran.liara.run/public/${index + 1}`
                }
                alt={user.username}
                className="w-20 h-20 rounded-full border-2 mx-auto border-green-400 shadow-md"
              />

              <h2 className="text-lg font-semibold text-center">
                {user.username}
              </h2>

              {activeInfo ? (
                <p className="text-gray-400 text-center text-sm">
                  {new Date(activeInfo.date).toLocaleDateString()} •{" "}
                  {new Date(
                    "1970-01-01T" + activeInfo.time
                  ).toLocaleTimeString()}
                </p>
              ) : (
                <p className="text-red-400 text-center text-sm">Not Active</p>
              )}

              {/* BUTTONS */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  id="trsh"
                  onClick={() => removeUser(user.username)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white"
                  // title="Kick (remove from active list)"
                >
                  <Trash2 size={18} />
                </button>
                <Tooltip
                  anchorSelect="#trsh"
                  content={`Click to Remove from room ❌ `}
                  place="bottom"
                />
                <button
                  onClick={() => {
                    setWarnUser(user.username);
                    setWarnPopupOpen(true);
                  }}
                  className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-full text-white"
                  // title="Warn user"
                  id="titl"
                >
                  <Star size={18} />
                </button>
                <Tooltip
                  anchorSelect="#titl"
                  content={`Click to warn the user ❗ `}
                  place="bottom"
                />
                <button
                  id="bn"
                  onClick={() => openBanConfirm(user.username)}
                  className={`p-2 rounded-full text-white ${
                    banned
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  title={banned ? "Unban user" : "Ban user"}
                >
                  <Ban size={18} />
                </button>
                <Tooltip
                  anchorSelect="#bn"
                  content={`Click to Ban the user ❌ `}
                  place="bottom"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={prevPage}
          className="p-2 bg-gray-300 dark:bg-gray-700 rounded-full"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={nextPage}
          className="p-2 bg-gray-300 dark:bg-gray-700 rounded-full"
        >
          <ChevronRight />
        </button>
      </div>

      {/* WARNING MODAL */}
      {warnPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96">
            <h2 className="text-xl mb-3">
              Warn: <span className="text-yellow-500">{warnUser}</span>
            </h2>

            <textarea
              className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700"
              placeholder="Enter warning message..."
              value={warnMessage}
              onChange={(e) => setWarnMessage(e.target.value)}
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setWarnPopupOpen(false)}
                className="px-4 py-2 bg-gray-400 rounded"
              >
                Cancel
              </button>

              <button
                onClick={issueWarning}
                className="px-4 py-2 bg-yellow-500 rounded"
              >
                Send Warning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BAN CONFIRMATION MODAL */}
      {banPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96">
            <h2 className="text-xl mb-3 text-center">
              {isBannedMap[banTargetUser]
                ? `Unban ${banTargetUser}?`
                : `Ban ${banTargetUser}?`}
            </h2>

            <p className="text-center text-gray-500 mb-4">
              {isBannedMap[banTargetUser]
                ? "Do you want to unban this user?"
                : "Are you sure you want to ban this user from this room?"}
            </p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setBanPopupOpen(false)}
                className="px-4 py-2 bg-gray-400 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleBanConfirm}
                className={`px-4 py-2 text-white rounded ${
                  isBannedMap[banTargetUser] ? "bg-blue-600" : "bg-red-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
