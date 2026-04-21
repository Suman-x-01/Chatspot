import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import user from "../assets/user.gif";

export default function UserLogin() {
  const [form, setForm] = useState({ userName: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch("http://localhost:8080/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         username: form.userName,
  //         password: form.password,
  //       }),
  //     });

  //     if (!res.ok) {
  //       const txt = await res.text();
  //       toast.error(txt || "Invalid username or password");
  //       return;
  //     }

  //     const data = await res.json();
  //     sessionStorage.setItem(
  //       "user",
  //       JSON.stringify({
  //         username: data.username,
  //         roles: data.roles,
  //       }),
  //     );
  //     sessionStorage.setItem("token", data.token || "");

  //     toast.success("Login successful 🎉");
  //     navigate("/all-chats");
  //   } catch (err) {
  //     toast.error("Login error");
  //     console.error(err);
  //   }
  // };

  // Handle Enter key press

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

      // ✅ UPDATED: save sessionToken alongside user data
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          email: data.email,
          phone: data.phone,
          sessionToken: data.sessionToken, // ✅ added
        }),
      );

      toast.success("Login successful 🎉");
      navigate("/all-chats");
    } catch (err) {
      toast.error("Login error");
      console.error(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
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
            onKeyPress={handleKeyPress}
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
          <div className="relative">
            <input
              onChange={onChange}
              onKeyPress={handleKeyPress}
              value={form.password}
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter Password"
              className="w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
            >
              {showPassword ? (
                // Eye slash icon (hide password)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                // Eye icon (show password)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
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
