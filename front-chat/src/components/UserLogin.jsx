import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import user from "../assets/user.gif";

export default function UserLogin() {
  const [form, setForm] = useState({ userName: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.userName,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        toast.error(txt || "Invalid username or password");
        return;
      }

      const data = await res.json();
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          roles: data.roles,
        })
      );
      sessionStorage.setItem("token", data.token || "");

      toast.success("Login successful 🎉");
      navigate("/all-chats");
    } catch (err) {
      toast.error("Login error");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <div className="border border-gray-300 dark:border-gray-700 p-8 w-full flex flex-col gap-5 max-w-md rounded-xl bg-white dark:bg-gray-900 shadow-lg">
        {/* Header image */}
        <div className="flex mx-auto">
          <img src={user} alt="ChatSpot" className="w-[130px]" />
        </div>

        <h1 className="text-center font-semibold text-2xl text-gray-800 dark:text-white">
          User Login
        </h1>

        {/* Username field */}
        <div>
          <label
            htmlFor="userName"
            className="block font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <input
            onChange={onChange}
            value={form.userName}
            type="text"
            name="userName"
            id="userName"
            placeholder="Enter Name"
            className="w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password field */}
        <div>
          <label
            htmlFor="password"
            className="block font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            onChange={onChange}
            value={form.password}
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password"
            className="w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={handleLogin}
            className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 hover:dark:bg-orange-800 rounded-3xl py-2 px-4 w-1/2 text-white transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="border border-gray-400 dark:border-gray-600 rounded-3xl py-2 px-4 w-1/2 text-gray-800 dark:text-white bg-gray-100 dark:bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            Sign up
          </button>
        </div>

        {/* Back Button */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 hover:dark:bg-blue-800 rounded-3xl py-2 px-4 w-1/2 text-white transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
