import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import User from "../models/user.models.js";

export const verifyJWT =  async (req, res, next) => {
  const outerObject = {}
  try {
    const token = req.body.token || req.cookies?.token || req.headers.authorization?.split(" ")[1];
    console.log(req.cookies.token)
    console.log(req.headers.authorization)

    if (!token) {
      throw new apiError(401, "Unauthorized - No Token Provided");
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user=await User.findById(decoded.id).select("-password");
    
    if(!user){
      return res.status(404).json({success:false,message:"User Not Found"});
    }
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);

    outerObject.cookie = req.cookies;
    outerObject.authorization = req.headers.authorization
    outerObject.error="error in jwt process somewhere"
    next(new apiError(401, JSON.stringify(outerObject)));
  }
};
