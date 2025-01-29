import React from "react";
import { Routes, Route } from "react-router";
import App from "../App";
import ChatPage from "../components/ChatPage";
const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route
        path="*"
        element={
          <h2 className="text-red-500 min-h-screen flex items-center justify-center text-2xl">
            404 Error.. Page not found
          </h2>
        }
      />
    </Routes>
  );
};

export default AppRoute;
