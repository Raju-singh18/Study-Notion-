const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// ==========================================
// 1. Send Password Reset Email (Token)
// ==========================================

exports.sendResetPassword = async (req, res) => {
  try {
    // Get email from request body
    const { email } = req.body;

    // Check if user with that email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Your email is not registered with us.",
      });
    }

    // Generate a unique reset token (UUID)
    const token = crypto.randomUUID();

    // Save token and expiry time (5 minutes) in user document
    const  updatedUser = await User.findOneAndUpdate(
      { email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes from now
      },
      { new: true }
    );
   // console.log("Updated User",updatedUser);

    // Construct the reset password URL
    const url = `http://localhost:3000/update-password/${token}`;

    // Send password reset email
    await mailSender(
      email,
      "Password Reset Link",
      `Click to reset your password: ${url}`
    );

    return res.status(200).json({
      success: true,
      message:
        "Reset link sent. Please check your email to change your password.",
    });
  } catch (error) {
    //console.error("Error in sendResetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password mail.",
    });
  }
};

// ==========================================
// 2. Reset Password Using Token
// ==========================================

exports.resetPassword = async (req, res) => {
  try {
    // Get data from request body
    const { password, confirmPassword, token } = req.body;

    // Validate input fields
    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Find user using the token
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Check if token is expired
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token expired. Please request a new reset link.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear token + expiry
    await User.findOneAndUpdate(
      { token },
      {
        password: hashedPassword,
        token: null,
        resetPasswordExpires: null,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
   // console.error("Error in resetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting the password.",
    });
  }
};
