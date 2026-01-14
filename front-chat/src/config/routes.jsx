import React from "react";
// import AdminAllChat from "./pages/AdminAllChat";

import { Routes, Route } from "react-router";
import App from "../App";
import ChatPage from "../components/ChatPage";
import LandingPage from "../components/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import JoinReactChat from "../components/JoinREactChat";
import UserLogin from "../components/UserLogin";
import UserSignup from "../components/UserSignup";
import AdminLogin from "../components/AdminLogin";
import AllChats from "../components/AllChats";
import AdminAllChat from "../components/AdminAllChat";
import EditUser from "../components/EditUser";
import ComplaintPage from "../components/ComplaintPage";
import AllUserChatroom from "../components/AllUserChatroom";
import AdminMessages from "../components/AdminMessages";
import AdminActiveUsers from "../components/AdminActiveUsers";
import AdminAllUsers from "../components/AdminAllUsers";
import AdminDashboard from "../components/AdminDashboard";
import RoomSettings from "../components/RoomSettings";
const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/user" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/admin/allchat" element={<AdminAllChat />} />
      <Route path="/complaint" element={<ComplaintPage />} />
      <Route path="/all-user-chatroom" element={<AllUserChatroom />} />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <JoinReactChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-user"
        element={
          <ProtectedRoute>
            <EditUser />
          </ProtectedRoute>
        }
      />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route
        path="/chat-room"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-chats"
        element={
          <ProtectedRoute>
            <AllChats />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/room/:roomId/messages" element={<AdminMessages />} />
      <Route
        path="/admin/room/:roomId/active-users"
        element={<AdminActiveUsers />}
      />
      <Route path="/all-signedup-users" element={<AdminAllUsers />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/room-settings/:roomId" element={<RoomSettings />} />
    </Routes>
  );
};

export default AppRoute;
