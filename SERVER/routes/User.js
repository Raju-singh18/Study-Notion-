 const express = require("express");
const router = express.Router();

const {auth} = require("../middlewares/auth");

const {
  sendOTP,
  signup,
  login,
  verifyEmail,
  changePassword,
} = require("../controllers/Auth");

const {
  sendResetPassword,   
  resetPassword,
} = require("../controllers/ResetPassword");

// console.log(signup); // Optional: can remove later

// USER AUTH ROUTES
router.post("/sendotp", sendOTP);
router.post("/verify-email", verifyEmail); 
router.post("/signup", signup);
router.post("/login", login);
router.put("/change-password", auth, changePassword);
 

// PASSWORD RESET ROUTES
router.post("/reset-password-token", sendResetPassword);   
router.post("/reset-password", resetPassword);

module.exports = router;
