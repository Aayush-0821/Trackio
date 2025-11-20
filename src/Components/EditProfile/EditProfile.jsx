import React, { useEffect, useState, useContext } from "react";
import { FaCamera, FaUpload, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext.jsx";

const EditProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Separate state for showing existing pic and new file
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/getUserData`, {
          withCredentials: true,
          headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (data.success) {
          setProfileData({
            name: data.userData.name || "",
            email: data.userData.email || "",
            phone: data.userData.phone || "",
            address: data.userData.address || "",
          });
          setProfilePicUrl(data.userData.profilePic?.url || null);
        }
      } catch (error) {
        console.error("Error fetching User Data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePic(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);
      formData.append("phone", profileData.phone);
      formData.append("address", profileData.address);
      if (newProfilePic) formData.append("profilePic", newProfilePic);

      const { data } = await axios.put(
  `${backendUrl}/api/user/update-profile`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);


      if (data.success) {
        toast.success("Profile Updated Successfully!");
        setIsEditing(false);
        setProfileData(data.data);
        setProfilePicUrl(data.data.profilePic?.url || profilePicUrl);
        setNewProfilePic(null);
      } else {
        toast.error("Failed to Update Profile!");
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error("Error updating Profile");
    }
  };

  const handleProfilePicSave = async () => {
    try {
      if (!newProfilePic) return;

      setIsUploading(true);

      const formData = new FormData();
      formData.append("profilePic", newProfilePic);

      const { data } = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          withCredentials: true,
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
           },
          
        }
      );

      if (data.success) {
        toast.success("Profile Picture Updated!");
        setProfilePicUrl(data.data.profilePic.url);
        setNewProfilePic(null);
        localStorage.setItem("userProfilePic",data.data.profilePic.url);
      } else {
        toast.error("Failed to Update Picture!");
      }
    } catch (error) {
      console.log("Error uploading profile picture:", error);
      toast.error("Error uploading Profile Picture");
    }
    finally{
      setIsUploading(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-10 max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-8 relative overflow-hidden">

      {/* Left: Profile Image + Upload */}
      <div className="flex flex-col items-center gap-6 w-full md:w-1/3 mt-12">
        <div className="relative">
          <img
            src={
              newProfilePic
                ? URL.createObjectURL(newProfilePic) // show preview if new file selected
                : profilePicUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover ring-4 ring-purple-300 shadow-xl transition transform hover:scale-105"
          />
          <button
            className="absolute bottom-3 right-1 bg-purple-600 p-3 rounded-full text-white hover:bg-purple-700 transition transform hover:scale-110"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <FaCamera />
          </button>
        </div>

        {/* Upload button hidden until image selected */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition hover:scale-[1.02] ${
              newProfilePic
                ? "border-purple-600 text-purple-600"
                : "border-gray-300 text-gray-500 hover:border-purple-600 cursor-pointer"
            }`}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <FaUpload className="mx-auto text-purple-600 mb-2" />
            <p className="font-semibold text-sm">
              {newProfilePic ? "Image Selected!" : "Upload Profile Pic"}
            </p>
          </div>
        </div>

        {/* ✅ Show only when new image is selected */}
        {newProfilePic && (
          <button
            onClick={handleProfilePicSave}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition cursor-pointer"
            disabled={isUploading}
          >
            {isUploading?"Uploading..." : "Save Profile Picture"}
          </button>
        )}
      </div>

      {/* Right: User Info */}
      <div className="w-full md:w-2/3 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 mb-2 font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none text-black ${
                isEditing
                  ? "border-purple-500"
                  : "border-gray-300 bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2 font-medium">Email:</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none text-black ${
                isEditing
                  ? "border-purple-500"
                  : "border-gray-300 bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2 font-medium">Phone Number:</label>
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none text-black ${
                isEditing
                  ? "border-purple-500"
                  : "border-gray-300 bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2 font-medium">Address:</label>
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none text-black ${
                isEditing
                  ? "border-purple-500"
                  : "border-gray-300 bg-gray-100"
              }`}
            />
          </div>
        </div>

        {/* Forgot Password */}
        <div className="mt-6 text-right">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium underline transition cursor-pointer"
          >
            Change Password
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 hover:scale-[1.02] transition shadow-md cursor-pointer"
              >
                SAVE
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 hover:scale-[1.02] transition shadow-sm cursor-pointer"
              >
                CANCEL
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 border border-purple-600 text-purple-600 rounded-xl font-semibold flex items-center gap-2 hover:bg-purple-50 hover:scale-[1.02] transition shadow-sm cursor-pointer"
            >
              <FaEdit /> EDIT PROFILE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
