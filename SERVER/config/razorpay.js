//  // config/razorpay.js

const Razorpay = require("razorpay");
require("dotenv").config();

if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
  console.error("RAZORPAY_KEY or RAZORPAY_SECRET is missing in .env");
  process.exit(1);
}

exports.instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

//console.log("Razorpay instance configured successfully");
