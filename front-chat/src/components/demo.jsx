import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const EditUser = () => {
  const location = useLocation();
  const username = location.state?.username; // ✅ get from navigation

  const [userData, setUserData] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (username) {
      axios
        .get(`http://localhost:8080/api/user/${username}`)
        .then((res) => {
          setUserData(res.data);

          // ✅ convert photo bytes (if any) to base64 for preview
          if (res.data.photo) {
            const base64String = `data:image/jpeg;base64,${res.data.photo}`;
            setPhotoPreview(base64String);
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        });
    }
  }, [username]);

  if (!userData) {
    return <div className="text-center mt-10">Loading user data...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {/* Photo preview + upload button */}
      {photoPreview && (
        <img
          src={photoPreview}
          alt="User"
          className="w-24 h-24 rounded-full mb-4 border-2 border-blue-400"
        />
      )}
      <label
        htmlFor="photoUpload"
        className="cursor-pointer bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded-full mb-6"
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
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
          }
        }}
      />

      {/* Editable fields */}
      <div className="w-80 flex flex-col gap-4">
        <input
          type="text"
          value={userData.username}
          disabled
          className="p-2 bg-gray-700 rounded-md"
        />
        <input
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          className="p-2 bg-gray-700 rounded-md"
        />
        <input
          type="text"
          value={userData.phone}
          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          className="p-2 bg-gray-700 rounded-md"
        />

        <button
          onClick={() => {
            const formData = new FormData();
            formData.append(
              "user",
              new Blob([JSON.stringify(userData)], { type: "application/json" })
            );

            axios
              .put("http://localhost:8080/api/user/update", formData)
              .then(() => alert("Profile updated successfully!"))
              .catch((err) => console.error("Update failed:", err));
          }}
          className="bg-blue-500 hover:bg-blue-700 py-2 rounded-md font-semibold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditUser;
