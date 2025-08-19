
const express = require("express");
const router = express.Router();

const {
  updateProfile,
  deleteAccount,
  getAllUserDetails,
  updateProfilePicture,
  getUserEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");

const { auth } = require("../middlewares/auth");

router.put("/updateProfile", auth, updateProfile);
router.put("/updatePicture",auth, updateProfilePicture );
router.delete("/deleteProfile", auth, deleteAccount);
router.get("/getUserDetails", auth, getAllUserDetails);
router.get("/getUserEnrolledCourses",auth,getUserEnrolledCourses);
router.get("/getInstructorDashboardDetails",auth,instructorDashboard);
module.exports = router;



