 const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, // 5 minutes
  },
});

// Pre-save middleware to send email
otpSchema.pre("save", async function (next) {
  try {
    await mailSender(this.email, "Verification Email from StudyNotion", otpTemplate(this.otp));
    next();
  } catch (error) {
   // console.error("Failed to send OTP email", error);
    next(error);
  }
});

module.exports = mongoose.model("OTP", otpSchema);
