import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const EditUser = () => {
  const location = useLocation();
  const username = location.state?.username;

  const [userData, setUserData] = useState({
    id: "",
    username: "",
    email: "",
    phone: "",
    photo: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      axios
        .get(`http://localhost:8080/api/user/username/${username}`)
        .then((res) => {
          setUserData(res.data);

          if (res.data.photo) {
            const base64 = `data:image/jpeg;base64,${res.data.photo}`;
            setPhotoPreview(base64);
          }
        })
        .catch(() => toast.error("Error loading profile"));
    }
  }, [username]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center  from-gray-900 via-gray-800 to-gray-950 p-6 relative overflow-hidden">
      {/* ⭐ Floating Glass Bubbles Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl bottom-10 right-10"></div>
        <div className="absolute w-64 h-64 bg-purple-500/10 rounded-full blur-3xl top-1/2 left-2/3"></div>
      </div>

      {/* ⭐ Glass Card */}
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-2xl border border-gray-700/40 shadow-2xl rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-6">
          Edit Profile
        </h1>

        <div className="flex flex-col items-center gap-4 mb-6">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-cyan-400 shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-600">
              No Photo
            </div>
          )}

          <label
            htmlFor="photoUpload"
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 px-5 py-2 rounded-full shadow-lg transition"
          >
            {photoPreview ? "Change Photo" : "Upload Photo"}
          </label>

          <input
            id="photoUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setPhotoFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setPhotoPreview(reader.result);
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-5">
          <input
            value={userData.username}
            disabled
            className="p-3 bg-gray-800 rounded-xl text-gray-400 border border-gray-700"
          />

          <input
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className="p-3 bg-gray-800 rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />

          <input
            value={userData.phone}
            onChange={(e) =>
              setUserData({ ...userData, phone: e.target.value })
            }
            className="p-3 bg-gray-800 rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500"
            placeholder="Phone"
          />
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/all-chats")}
            className="px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
          >
            Back
          </button>

          <button
            onClick={() => {
              const formData = new FormData();
              formData.append(
                "user",
                new Blob([JSON.stringify(userData)], {
                  type: "application/json",
                })
              );
              if (photoFile) formData.append("photo", photoFile);

              axios
                .put("http://localhost:8080/api/user/update", formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                })
                .then(() => toast.success("Profile updated successfully!"))
                .catch(() => toast.error("Update failed"));
            }}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
