import { httpClient } from "../config/AxiosHelper";
import axios from "axios";
import { baseURL } from "../config/AxiosHelper";
// ✅ Create Room
export async function createRoomApi(room) {
  const response = await fetch("http://localhost:8080/api/v1/rooms/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId: room.roomId,
      roomName: room.roomName,
      createdBy: room.createdBy, // ✅ separate fields
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return await response.json();
}

// ✅ Join Chat (existing logic)
export const joinChatApi = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/verify/${roomId}`);
  return response.data;
};

// ✅ Verify Room by ID (new route to check before joining)
export const verifyRoomApi = async (roomId) => {
  try {
    const response = await httpClient.get(`/api/v1/rooms/verify/${roomId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Room not found";
  }
};

// ✅ Get Messages
export const getMessagess = async (roomId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return response.data;
};

// // 🟦 Get all users who ever joined this room
// export const getUsersByRoomApi = async (roomId) => {
//   // const res = await axios.get(`${baseURL}/api/rooms/${roomId}/users`);
//   const response = await axios.get(
//     `http://localhost:8080/api/v1/rooms/${roomId}/users`
//   );
//   return response.data;
// };

// // 🟢 Get currently active users
// export const getActiveUsersByRoomApi = async (roomId) => {
//   // const res = await axios.get(`${baseURL}/api/rooms/${roomId}/active-users`);

//   const response = await axios.get(
//     `http://localhost:8080/api/v1/rooms/${roomId}/active-users`
//   );

//   return response.data; // returns an array of active usernames
// };

// 🟦 Get all users who ever joined this room
export const getUsersByRoomApi = async (roomId) => {
  const response = await axios.get(
    `http://localhost:8080/api/v1/rooms/${roomId}/users`
  );
  return response.data;
};

// 🟢 Get currently active users (with username, date, time)
export const getActiveUsersByRoomApi = async (roomId) => {
  const response = await axios.get(
    `http://localhost:8080/api/v1/rooms/${roomId}/active-users`
  );
  return response.data; // array of { username, date, time }
};

const BASE = "http://localhost:8080/api/user";

export const getAllUsersApi = async () => {
  const res = await axios.get(`${BASE}/all`);
  return res.data;
};

export const deleteUserApi = async (id) => {
  return axios.delete(`http://localhost:8080/api/user/delete/${id}`);
};
