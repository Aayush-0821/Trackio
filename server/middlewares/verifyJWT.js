import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import User from "../models/user.models.js";

export const verifyJWT =  async (req, res, next) => {
  const outerObject = {}
  try {
    const token =  req.headers.authorization?.split(" ")[1] || req.cookies?.token ;
    if (!token) {
      throw new apiError(401, "Unauthorized - No Token Provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const user=await User.findById(decoded.id).select("-password");
    console.log(user)
    if(!user){
      return res.status(404).json({success:false,message:"User Not Found"});
    }

    req.user = user
    next();
  } catch (error) {
    console.log(JSON.stringify(req.headers,null,2))
    console.error("JWT Verification Failed:", error.message);
    next(new apiError(401, JSON.stringify(outerObject,null,2)));
  }
};
