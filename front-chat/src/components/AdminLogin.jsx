// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import admin from "../assets/admin.png";

// export default function AdminLogin() {
//   const [form, setForm] = useState({ adminName: "", adminPass: "" });
//   const navigate = useNavigate();

//   const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:8080/api/admin/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           adminName: form.adminName,
//           adminPass: form.adminPass,
//         }),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         toast.error(errData.error || "Invalid admin credentials");
//         return;
//       }

//       const data = await res.json();
//       toast.success(data.message || "Welcome Admin ✨");

//       // store in sessionStorage (optional)
//       sessionStorage.setItem(
//         "admin",
//         JSON.stringify({ adminName: form.adminName })
//       );

//       // redirect to Admin Dashboard
//       navigate("/admin/allchat");
//     } catch (err) {
//       console.error("Login error:", err);
//       toast.error("Something went wrong");
//     }
//   };
//   const handleBack = () => {
//     navigate("/");
//   };
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="dark:border-gray-700 border p-8 w-full flex flex-col gap-5 max-w-md rounded-xl dark:bg-gray-900">
//         <div className="z-[-10]">
//           {/* === Animated Background Layer === */}
//           <div className="absolute inset-0 overflow-hidden">
//             {/* Glowing Circles */}
//             <div className="glow-circle w-64 h-64 top-10 left-10"></div>
//             <div className="glow-circle w-72 h-72 bottom-20 right-16 delay-1000"></div>
//             <div className="glow-circle w-56 h-56 top-1/2 left-1/3 delay-2000"></div>

//             {/* Floating Transparent Bubbles (visible only in dark mode for better contrast) */}
//             <div className="bubble w-20 h-20 left-20 bottom-10 dark:block hidden"></div>
//             <div className="bubble w-28 h-28 right-24 bottom-20 delay-700 dark:block hidden"></div>
//             <div className="bubble w-16 h-16 left-1/2 bottom-16 delay-1200 dark:block hidden"></div>
//             <div className="bubble w-24 h-24 right-1/3 bottom-10 delay-2000 dark:block hidden"></div>

//             {/* Floating Stars (only in dark mode) */}
//             {[...Array(10)].map((_, i) => (
//               <div
//                 key={i}
//                 className={`star left-[${Math.random() * 100}%] top-[${
//                   Math.random() * 100
//                 }%] hidden dark:block`}
//               ></div>
//             ))}
//           </div>
//         </div>
//         <div className="flex mx-auto">
//           <img src={admin} alt="ChatSpot" className="w-[110px]" />
//         </div>
//         <h1 className="text-center font-semibold text-2xl text-orange-400">
//           Admin Login
//         </h1>

//         <input
//           onChange={onChange}
//           value={form.adminName}
//           type="text"
//           name="adminName"
//           placeholder="Admin Name"
//           className="w-full dark:bg-gray-600 px-4 py-2 dark:border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//           required
//         />

//         <input
//           onChange={onChange}
//           value={form.adminPass}
//           type="password"
//           name="adminPass"
//           placeholder="Password"
//           className="w-full dark:bg-gray-600 px-4 py-2 dark:border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//           required
//         />

//         <div className="flex justify-center gap-2 mt-4">
//           <button
//             onClick={handleLogin}
//             className="dark:bg-orange-500 hover:dark:bg-orange-800 rounded-3xl py-2 px-4 w-full text-white font-medium"
//           >
//             Login
//           </button>
//           <button
//             onClick={handleBack}
//             className="dark:bg-blue-500 hover:dark:bg-blue-900 rounded-3xl py-2 px-4 w-full text-white font-medium"
//           >
//             Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import admin from "../assets/admin.png";

export default function AdminLogin() {
  const [form, setForm] = useState({ adminName: "", adminPass: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminName: form.adminName,
          adminPass: form.adminPass,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.error || "Invalid admin credentials");
        return;
      }

      const data = await res.json();
      toast.success(data.message || "Welcome Admin ✨");

      // store in sessionStorage (optional)
      sessionStorage.setItem(
        "admin",
        JSON.stringify({ adminName: form.adminName }),
      );

      // redirect to Admin Dashboard
      navigate("/admin/allchat");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="dark:border-gray-700 border p-8 w-full flex flex-col gap-5 max-w-md rounded-xl dark:bg-gray-900">
        <div className="z-[-10]">
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
        </div>
        <div className="flex mx-auto">
          <img src={admin} alt="ChatSpot" className="w-[110px]" />
        </div>
        <h1 className="text-center font-semibold text-2xl text-orange-400">
          Admin Login
        </h1>

        <input
          onChange={onChange}
          onKeyPress={handleKeyPress}
          value={form.adminName}
          type="text"
          name="adminName"
          placeholder="Admin Name"
          className="w-full dark:bg-gray-600 px-4 py-2 dark:border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />

        <div className="relative">
          <input
            onChange={onChange}
            onKeyPress={handleKeyPress}
            value={form.adminPass}
            type={showPassword ? "text" : "password"}
            name="adminPass"
            placeholder="Password"
            className="w-full dark:bg-gray-600 px-4 py-2 pr-12 dark:border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
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

        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={handleLogin}
            className="dark:bg-orange-500 hover:dark:bg-orange-800 rounded-3xl py-2 px-4 w-full text-white font-medium"
          >
            Login
          </button>
          <button
            onClick={handleBack}
            className="dark:bg-blue-500 hover:dark:bg-blue-900 rounded-3xl py-2 px-4 w-full text-white font-medium"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
