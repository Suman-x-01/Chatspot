import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import signup from "../assets/signup.gif";

export default function SignupPage() {
  const navigate = useNavigate();

  const [detail, setDetail] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setDetail({ ...detail, [name]: value });
    validateField(name, value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  // --- Validation Logic ---
  const validateField = (name, value) => {
    let message = "";

    if (name === "userName" && !value.trim()) {
      message = "Name is required";
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) message = "Email is required";
      else if (!emailRegex.test(value)) message = "Invalid email format";
    }

    if (name === "phone") {
      const phoneRegex = /^[0-9]{10}$/;
      if (!value) message = "Phone number is required";
      else if (!phoneRegex.test(value))
        message = "Phone number must be 10 digits";
    }

    if (name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,20}$/;
      if (!value) message = "Password is required";
      else if (!passwordRegex.test(value))
        message =
          "Password must have 1 lowercase, 1 uppercase, 1 number, 1 special char, and length 6–20";
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const isFormValid =
    detail.userName &&
    detail.email &&
    detail.phone &&
    detail.password &&
    Object.values(errors).every((msg) => msg === "");

  //   const handleSignup = () => {
  //     if (!isFormValid) return;
  //     // Backend call to your Spring Boot API
  //     toast.success("Login successful");
  //     navigate("/login/user"); // redirect to login page
  //   };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const formData = new FormData();
    formData.append("username", detail.userName);
    formData.append("email", detail.email);
    formData.append("phone", detail.phone);
    formData.append("password", detail.password);
    if (photoPreview)
      formData.append("photo", document.getElementById("photoUpload").files[0]);

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text();
        alert(txt || "Signup failed");
        return;
      }

      toast.success("Signup successful — login now");
      navigate("/login/user");
    } catch (err) {
      console.error(err);
      alert("Signup error");
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
          <img src={signup} alt="ChatSpot" className="w-20" />
        </div>
        <h1 className="text-center font-semibold text-2xl">Create Account</h1>

        {/* Name */}
        <div>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text"
            name="userName"
            placeholder="Enter Name"
            className="w-full dark:bg-gray-600 px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.userName && (
            <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            onChange={handleFormInputChange}
            value={detail.email}
            type="email"
            name="email"
            placeholder="Email"
            className="w-full dark:bg-gray-600 px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <input
            onChange={handleFormInputChange}
            value={detail.phone}
            type="text"
            name="phone"
            placeholder="Phone"
            className="w-full dark:bg-gray-600 px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          id="photoUpload"
          name="photo"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />

        {/* Custom Upload Button */}
        <label
          htmlFor="photoUpload"
          className="cursor-pointer w-full text-center dark:bg-purple-600 text-white py-2 px-4 rounded-full shadow-md hover:dark:bg-purple-800 transition"
        >
          {photoPreview ? "Change Photo" : "Upload Photo"}
        </label>

        {/* Photo preview */}
        {photoPreview && (
          <img
            src={photoPreview}
            alt="preview"
            className="w-20 h-20 rounded-full mx-auto object-cover border border-gray-400"
          />
        )}

        {/* Password */}
        <div>
          <input
            onChange={handleFormInputChange}
            value={detail.password}
            type="password"
            name="password"
            placeholder="Password"
            className="w-full dark:bg-gray-600 px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Sign Up Button */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={handleSignup}
            disabled={!isFormValid}
            className={`rounded-3xl py-2 px-4 w-full text-white ${
              isFormValid
                ? "dark:bg-orange-600 hover:dark:bg-orange-800"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* back button */}
        <div className="flex justify-center gap-1 mt-1">
          <button
            onClick={handleBack}
            className={`rounded-3xl py-2 px-4 w-full text-white dark:bg-blue-600 hover:dark:bg-blue-800        
            `}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
