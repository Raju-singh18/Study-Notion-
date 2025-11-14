 // config/cloudinary.js
 
const cloudinary = require("cloudinary").v2;

// Function to configure Cloudinary connection
const cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    console.log("Cloudinary connected successfully");
  } catch (error) {
    console.error("Cloudinary connection failed:", error.message);
  }
};

 module.exports = {cloudinary, cloudinaryConnect};
