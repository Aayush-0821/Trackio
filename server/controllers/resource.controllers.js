import { Resource } from "../models/resource.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const addResource = asyncHandler(async (req, res) => {
  const { title, description, groupId } = req.body;

  if (!req.file) throw new apiError(400, "File is Required!");

  if (!title || !groupId) throw new apiError(400, "All fields are required!");

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    throw new apiError(400, `Invalid groupId format: ${groupId}`);
  }

  try {
    const uploadResult = await uploadOnCloudinary(req.file.buffer, "resources");

    const newResource = await Resource.create({
      title,
      description,
      link: uploadResult.secure_url,
      fileUrl: uploadResult.secure_url,
      fileType: uploadResult.resource_type,
      groupId,
      addedBy: req.user._id,
    });

    return res
      .status(201)
      .json(new apiResponse(201, newResource, "Resource added Successfully!"));
  } catch (err) {
    console.error("Error while adding resource:", err);
    throw new apiError(500, err.message || "Internal Server Error");
  }
});

const getResourcesByGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    throw new apiError(400, "Group ID is required");
  }

  const resources = await Resource.find({ groupId }).populate(
    "addedBy",
    "name email"
  );

  return res
    .status(200)
    .json(new apiResponse(200, resources, "Resources fetched SuccessFully!"));
});

export { addResource, getResourcesByGroup };
