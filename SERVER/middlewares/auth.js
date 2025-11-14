 const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// ==================== AUTH ====================
exports.auth = async (req, res, next) => {
  try {
    // Extract token from cookies, body or headers
    //console.log("token through cookie:",req.cookies.token);
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");
      
      // console.log("token through cookie:",req.cookies?.token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //  console.log("Decoded user from token:", decoded);
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    next(); // proceed to next middleware or route handler
  } catch (error) {
   // console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during token validation",
    });
  }
};

// ==================== ROLE-BASED ACCESS ====================
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Students only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Role verification failed",
    });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Instructors only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Role verification failed",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Role verification failed",
    });
  }
};
