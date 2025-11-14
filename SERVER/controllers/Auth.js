const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");

require("dotenv").config();

// ===============================
// Send OTP=> Send otp for email verification
// ===============================
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Check if user is already present
    // Find user with provided email
    const userExists = await User.findOne({ email });

    // if user found with provided email
    if (userExists) {
      // return 401 Unauthorized status code with error message
      return res
        .status(409)
        .json({ success: false, message: "User already registered" });
    }

    // Generate 6-digit numeric OTP
    let otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Ensure unique OTP
    while (await OTP.findOne({ otp })) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    // console.log("OTP Body", otpBody);

    try {
      const emailResponse = await mailSender(
        email,
        "Verify Email with OTP",
        otpTemplate(otp)
      );
      // console.log("emailResponse", emailResponse);
    } catch (error) {
      // console.error("Error occured while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occured while sending email",
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp, // Only for development, remove in production
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

// ===============================
// Signup=> signup controller for registering Users
// ===============================
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res
        .status(403)
        .json({ success: false, message: "All fields are required" });
    }

    //check if password and confirm password match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password do not match" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue",
      });
    }
    
    //Find the most recent OTP for the email
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    // console.log("Recent Otp: ", recentOtp);

    if (!recentOtp || recentOtp[0].otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // HAsh the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Create the user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    // create the additional Profile for user
    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: "", //contactNumber || null,
    });

    const avatar = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      approved: approved,
      image: avatar,
      additionalDetails: profile._id,
    });
   // console.log("user Details: ", user);

    return res
      .status(200)
      .json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User can not registered. Please try again.",
      error: error.message,
    });
  }
};

// ===============================
// Login=> login controller for authenticating users
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    // find user with provided email
    const user = await User.findOne({ email }); //populate("additionalDetails");
    // console.log("User details without populating of additionalDetails: ", user);
    // if usr not found with provided email
    if (!user)
      // return 401 unauthorize status code woth error message
      return res.status(401).json({
        success: false,
        message: "User not registered with us. Please Signup to continue.",
      });

    // Generate JWT token and compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    } else {
      const tokenPayload = {
        id: user._id,
        email: user.email,
        accountType: user.accountType,
      };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      
      // console.log("token is: ", token);

      // save token to user document in database
      user.token = token;
      user.password = undefined;

      // Set cookie for token and return success response
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false, // true only in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      };

      //Attach cookie before sending response
      res.cookie("token", token, options);

      return res.status(200).json({
        success: true,
        message: "User Login successful",
        token,
        user,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failure Please try again.",
      error: error.message,
    });
  }
};

// ===============================
// Change Password
// ===============================
exports.changePassword = async (req, res) => {
  try {
    // const userId = req.user.id;
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);
    console.log("userDetails: ", userDetails);

    // get old password, new password, and confirm ner password from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password can not be same as old password.",
      });
    }
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "The password is incorrect.",
      });
    }

    // Match new password and confirm password
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "The password and confirm password does not match",
      });
    }

    // update password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    // userDetails.password = hashedNewPassword;
    // await userDetails.save();
    // --------OR------------
    const updateUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: hashedNewPassword },
      { new: true }
    );

    // console.log("Updated detailed: ", updateUserDetails);

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updateUserDetails.email,
        "Study Notion - Password Updated",
        passwordUpdated(
          updateUserDetails.email,
          `Password updated successfully for ${updateUserDetails.firstName} ${updateUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // if there is an error sending the email, log the error and return a 500(internal server error)
    //  console.error("Error occured while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occured while sending email",
        error: error.message,
      });
    }

    // return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
  //  console.error("Error occured while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occured while updating password",
      error: error.message,
    });
  }
};

// ===================
// ! Email verification
// ====================
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
   // console.log("Client OTP:", otp);

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    // find the latest matching otp
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .exec();
   // console.log("Stored OTP:", recentOtp?.otp);

   // console.log("latest OTP model data :", recentOtp);

    if (!recentOtp || recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTp",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Email verified successfully. Your email is now verfied.",
    });
  } catch (error) {
   // console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying OTP",
    });
  }
};
