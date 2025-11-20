import express from "express";
import multer from "multer";
import { addResource, getResourcesByGroup } from "../controllers/resource.controllers.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

// Use memory storage — NO folder creation, NO disk writes
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add", verifyJWT, upload.single("file"), addResource);
router.get("/:groupId", verifyJWT, getResourcesByGroup);

export default router;
