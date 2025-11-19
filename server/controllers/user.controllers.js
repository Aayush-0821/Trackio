import userModel from "../models/user.models.js";
import groupModel from "../models/group.models.js"; 
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// KEEP getUserData AS IT IS
const getUserData = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new apiError(404, "User Not Found");

  const totalGroups = await groupModel.countDocuments({ members: user._id });
  const calculatedPoints = totalGroups * 100;
  const calculatedLevel = Math.floor(calculatedPoints / 300) + 1;

  if (user.points !== calculatedPoints || user.level !== calculatedLevel) {
    user.points = calculatedPoints;
    user.level = calculatedLevel;
    await user.save();
  }

  res.json({
    success: true,
    userData: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profilePic: user.profilePic,
      streak: user.streak?.currentCount ?? 0,
      startDate: user.streak?.startDate ?? null,
      maxStreak: user.maxStreak ?? 0,
      lastActiveDays: user.lastActiveDays ?? null,
      lastLoginDate: user.streak?.lastLoginDate ?? null,
      points: user.points,
      level: user.level,
    },
  });
});

// FIXED STREAK LOGIC
const updateStreak = asyncHandler(async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) throw new apiError(404, "User Not Found!");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLogin = user.streak?.lastLoginDate
      ? new Date(user.streak.lastLoginDate)
      : null;

    if (lastLogin) lastLogin.setHours(0, 0, 0, 0);

    if (!lastLogin) {
      user.streak.currentCount = 1;
      user.streak.startDate = today;
    } else {
      const diffDays = Math.ceil((today - lastLogin) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak.currentCount += 1;
      } else if (diffDays > 1) {
        user.streak.currentCount = 1;
        user.streak.startDate = today;
      }
    }

    user.streak.lastLoginDate = new Date();

    if (user.streak.currentCount > (user.streak.maxStreak || 0)) {
      user.streak.maxStreak = user.streak.currentCount;
    }

    await user.save();

    res.json({
      success: true,
      message: "Streak updated successfully",
      streak: user.streak,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error in updateStreak",
      error: error.message,
    });
  }
});

// UPDATED PROFILE CONTROLLER (Cloudinary + Buffer)
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new apiError(401, "Unauthorized");

  const { name, email, phone, address } = req.body;
  const updatedData = {};

  if (name) updatedData.name = name;
  if (email) updatedData.email = email;
  if (phone) updatedData.phone = phone;
  if (address) updatedData.address = address;

  try {
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer, "avatars");

      if (!uploadResult?.secure_url) {
        throw new apiError(400, "Failed to Upload Image on Cloudinary!");
      }

      updatedData.profilePic = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, { $set: updatedData }, { new: true })
      .select("-password -verifyOtp -resetOtp");

    if (!updatedUser) throw new apiError(404, "User Not Found!");

    res.json({
      success: true,
      message: "Profile updated Successfully!",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error Updating User Profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Error Updating User Profile",
      error: error.message,
    });
  }
});

export { getUserData, updateStreak, updateUserProfile };
