import { httpClient } from "../config/AxiosHelper";
import axios from "axios";
const BASE_URL = "http://localhost:8080/api";
export const getAllRooms = async () => {
  const res = await httpClient.get("/api/admin");
  return res.data;
};

export const deleteRoomApi = async (roomId) => {
  return await httpClient.delete(`/api/admin/${roomId}`);
};

export const getRoomInfoApi = async (roomId) => {
  const res = await httpClient.get(`/api/admin/${roomId}`);
  return res.data;
};

export const getActiveUsersApi = async (roomId) => {
  const res = await httpClient.get(`/api/admin/${roomId}/active-users`);
  return res.data;
};

export const getComplaintsApi = async (roomId) => {
  const res = await httpClient.get(`/api/admin/${roomId}/complaints`);
  return res.data;
};

export const getMessagesByRoomApi = async (roomId) => {
  // console.log("Room id", roomId);
  const response = await axios.get(
    `http://localhost:8080/api/messages/${roomId}`
  );
  // console.log("Hello ", response.data);
  return response.data; // ✅ return only the array
};
