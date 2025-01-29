import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import { Toaster } from "react-hot-toast";
import AppRoute from "./config/routes";
import { ChatProvider } from "./context/ChatContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster />
    <ChatProvider>
      <AppRoute />
    </ChatProvider>
  </BrowserRouter>
);
