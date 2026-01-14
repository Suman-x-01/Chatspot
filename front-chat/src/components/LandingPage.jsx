import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import chat from "../assets/chat.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* === Animated Background Layer === */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing Circles */}
        <div className="glow-circle w-64 h-64 top-10 left-10"></div>
        <div className="glow-circle w-72 h-72 bottom-20 right-16 delay-1000"></div>
        <div className="glow-circle w-56 h-56 top-1/2 left-1/3 delay-2000"></div>

        {/* Floating Transparent Bubbles (visible only in dark mode for better contrast) */}
        <div className="bubble w-20 h-20 left-20 bottom-10 dark:block hidden"></div>
        <div className="bubble w-28 h-28 right-24 bottom-20 delay-700 dark:block hidden"></div>
        <div className="bubble w-16 h-16 left-1/2 bottom-16 delay-1200 dark:block hidden"></div>
        <div className="bubble w-24 h-24 right-1/3 bottom-10 delay-2000 dark:block hidden"></div>

        {/* Floating Stars (only in dark mode) */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`star left-[${Math.random() * 100}%] top-[${
              Math.random() * 100
            }%] hidden dark:block`}
          ></div>
        ))}
      </div>

      {/* === Main Login Card === */}
      <div className="relative border border-gray-300 dark:border-gray-700 p-8 w-full flex flex-col gap-5 max-w-md rounded-xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-md z-10 shadow-2xl transition-all duration-500">
        <div className="flex mx-auto">
          <img src={chat} alt="ChatSpot" className="w-16 animate-float" />
        </div>

        <h1 className="text-center font-semibold text-2xl text-gray-800 dark:text-white">
          Welcome to ChatSpot
        </h1>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Login as user or admin to continue
        </p>

        <div className="flex flex-col gap-3 mt-2">
          <button
            onClick={() => navigate("/login/user")}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 hover:dark:bg-blue-800 rounded-3xl py-2 px-4 w-full text-white transition-all duration-300 hover:scale-105"
          >
            Login as User
          </button>

          <button
            onClick={() => navigate("/login/admin")}
            className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-3xl py-2 px-4 w-full text-white transition-all duration-300 hover:scale-105"
          >
            Login as Admin
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="border border-gray-400 dark:border-gray-600 rounded-3xl py-2 px-4 w-full text-gray-800 dark:text-white bg-gray-100 hover:bg-gray-200 dark:bg-transparent hover:dark:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            Create Account
          </button>
        </div>
      </div>

      {/* === Modern Marquee === */}
      <div className="absolute bottom-5 w-full flex justify-center overflow-hidden">
        <motion.div
          className="text-gray-700 dark:text-gray-300 text-sm font-mono flex gap-8 whitespace-nowrap"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ ease: "linear", duration: 15, repeat: Infinity }}
        >
          💬 Welcome to ChatSpot — Connect • Chat • Share • Enjoy • Stay
          Connected • Be You 💬 &nbsp; 💬 Welcome to ChatSpot — Connect • Chat •
          Share • Enjoy • Stay Connected • Be You 💬
        </motion.div>
      </div>
    </div>
  );
}
