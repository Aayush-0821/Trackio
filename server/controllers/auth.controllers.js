import { apiError } from "../utils/apiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import transporter from "../config/nodemailer.js";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new apiError(400, "Name, Email and Password are Required");
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        throw new apiError(409, "User Already Exists !");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await new UserModel({ name, email, password: hashedPassword }).save();

    if (!process.env.JWT_SECRET) {
        throw new apiError(500, "JWT SECRET not Configured");
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //Sending Welcome Mail
    try {
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: email,
            subject: `Welcome to Trackio`,
            text: `Welcome to Trackio. Your account has been successfully created with the email id: ${email}`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Welcome Email sent successfully !");
    } catch (error) {
        console.log("Error sending welcome Email : ", error);
    }

    return res
        .status(201)
        .json(
            new apiResponse(201, {
                id: user._id,
                name: user.name,
                email: user.email,
                token,
            }, "User Registered Successfully")
        );
});

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new apiError(400, "Email and Password are Required !");
    }

    const user = await UserModel.findOne({ email });

    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!isMatch) {
        throw new apiError(401, "Invalid Email or Password");
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.headers.set("Set-Cookie",`token=${token}; HttpOnly; Secure=true; Path=/; Max-Age=604800000`)
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res
        .status(200)
        .json(
            new apiResponse(200, {
                id: user._id,
                name: user.name,
                email: user.email,
                token,
            }, "User Logged in SuccessFully")
        );
});

const logoutUser = asyncHandler(async (req, res) => {

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    }

    return res
        .status(200)
        .clearCookie('token', cookieOptions)
        .json(
            new apiResponse(200, {}, "User Logged Out SuccessFully !")
        );

});

const sendVerifiedOtp = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    const user = await UserModel.findById(userId);

    if (!user) {
        throw new apiError(404, "User Not Found");
    }

    if (user.isAccountVerified) {
        throw new apiError(400, "User is already Verified");
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = await bcrypt.hash(otp, 10);

    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    //Send the Mail
    try {
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: user.email,
            subject: `Account Verification OTP`,
            text: `Your OTP is ${otp}. Verify your Account using this OTP.`,
            // html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        await transporter.sendMail(mailOptions);
        console.log("Veriy Otp Send Successfully !");
    } catch (error) {
        console.log("Error Sending the Verification Mail : ", error);
        throw new apiError(500, "Failed to send Verification Mail. Please try again.");
    }
    return res
        .status(200)
        .json(
            new apiResponse(200,
                {},
                "Verification OTP mail sent SuccessFully !"
            )
        );
});

const verifyEmail = asyncHandler(async (req, res) => {

    const { otp } = req.body;
    const userId = req.user?._id;

    if (!otp) {
        throw new apiError(400, "OTP is Required");
    }

    const user = await UserModel.findById(userId);

    if (!user) {
        throw new apiError(404, "User not Found !");
    }

    if (user.verifyOtpExpireAt < Date.now()) {
        throw new apiError(400, "Otp has Expired");
    }

    const isOtpValid = await bcrypt.compare(otp, user.verifyOtp);

    if (!isOtpValid) {
        throw new apiError(400, "Invalid OTP !");
    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new apiResponse(200, {
                id: user._id,
                email: user.email,
                name: user.name,
                isAccountVerified: user.isAccountVerified,
            },
                "Email Verification Successfull !"
            )
        );
});

const userIsAuthenticated = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const user = await UserModel.findById(userId).select("-password -verifyOtp");

    if (!user) {
        throw new apiError(404, "User Not Found !");
    }

    return res
        .status(200)
        .json(
            new apiResponse(200, {
                id: user._id,
                name: user.name,
                isAuthenticated: user.isAccountVerified,
            }, "User is Authenticated !"
            )
        );

});

const passwordResetOtp = asyncHandler(async (req,res)=>{

    const {email} = req.body;
    if(!email){
        throw new apiError(400,"Email is Required !");
    }

    const user=await UserModel.findOne({email});
    if (user) {
        
        const otp=String(Math.floor(100000+Math.random()*900000));
    
        user.resetOtp=await bcrypt.hash(otp,10);
    
        user.resetOtpExpireAt=Date.now()+10*60*1000;
    
        await user.save({validateBeforeSave:false});
    
        try {
            const mailOption={
                from:process.env.SMTP_SENDER_EMAIL,
                to:user.email,
                subject:'Password Reset OTP',
                text:`Your Otp for Reseting your password is ${otp}. Use this OTP to reset password.`
            }
            await transporter.sendMail(mailOption);
        } catch (error) {
            console.log("Error Sending the Reset Password Mail");
            throw new apiError(500,"Failed to send the Reset Password Mail,Please try Again ! ",error);
        }
    }

    return res
    .status(200)
    .json(
        new apiResponse(200,
            {},
            "Password reset link sent"
        )
    );
});

const UserResetPassword = asyncHandler(async (req,res)=>{

    const {email,otp,newPassword} = req.body;
    if(!email || !otp || !newPassword){
        throw new apiError(400,"Email, OTP and newPassword is Required");
    }

    const user = await UserModel.findOne({email});

    if(!user){
        throw new apiError(400,"Invalid Email or OTP");
    }

    const isOtpValid=await bcrypt.compare(otp,user.resetOtp);

    if(!isOtpValid || user.resetOtpExpireAt<Date.now()){
        throw new apiError(400,"Invalid or Expired OTP");
    }

    const updatePassword = await bcrypt.hash(newPassword,10);

    user.password=updatePassword;
    user.resetOtp=undefined;
    user.resetOtpExpireAt=undefined;
    await user.save({validateBeforeSave:false});

    return res
    .status(200)
    .json(
        new apiResponse(200,
            {
                id:user._id,
                name:user.name,
                email:user.email,
            },
            "Password has been Updated SuccessFully."
        )
    );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    sendVerifiedOtp,
    verifyEmail,
    userIsAuthenticated,
    passwordResetOtp,
    UserResetPassword,
}