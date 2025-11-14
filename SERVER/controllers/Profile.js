const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const { cloudinary } = require("../config/cloudinary");
const fs = require("fs");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");

// =================================
// ! Update profile Picture
// ==================================

exports.updateProfilePicture = async (req, res) => {
  try {
    // 1. Fetch user ID from token
    const userId = req.user.id;

    // 2. Fetch user and their profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //3. find the profile
    const profileId = user.additionalDetails;
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // 4. Check if file is provided
    if (!req.files || !req.files.profilePicture) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const file = req.files.profilePicture;

    // 5. Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "StudyNotion", // optional: organize uploads
      use_filename: true,
      resource_type: "image",
    });

    // 6. Update user's profile image URL
    user.image = uploadResult.secure_url;
    await user.save();

    // 7. Delete temp file (optional cleanup)
    fs.unlink(file.tempFilePath, (err) => {
      if (err) {
       console.error("Error deleting temp file:", err);
      }
    });
    // send response
    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
   // console.error("Error updating profile picture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile picture",
      error: error.message,
    });
  }
};

// ======================================
// 🔄 Update additional Profile
// ======================================
exports.updateProfile = async (req, res) => {
  try {
    // Get data from request body
   // console.log("req body", req.body);
    const { dateOfBirth, about = "", contactNumber, gender } = req.body;

    //console.log("dob: ", dateOfBirth);
   // console.log("about: ", about);
   // console.log("Contact : ", contactNumber);
   // console.log("gender :", gender);
    // Get current user ID from req.user (decoded from JWT)
    const id = req.user.id;
    //console.log("user id :", id);

    // Basic validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Get user and their profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Update profile fields
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    // Save the updated profile
    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: error.message,
    });
  }
};

// ======================================
// Delete Account
// ======================================
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    // Get user
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // 1. Delete profile
    await Profile.findByIdAndDelete(userDetails.additionalDetails);

    // 2. Unenroll user from all courses
    await Course.updateMany(
      { studentsEnrolled: id },
      { $pull: { studentsEnrolled: id } }
    );

    // 3. Delete user account
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user account",
      error: error.message,
    });
  }
};

// ======================================
//  Get Full User Details
// ======================================
exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .populate("courses") // Enrolled courses
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user data",
      error: error.message,
    });
  }
};

//  ============
// getUser enrolled courses
// ===============
exports.getUserEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
   // console.log("User ID from token:", userId);

    // Fetch user with populated courses, sections, lectures, category, instructor
    let user = await User.findById(userId)
      .populate({
        path: "courses",
        populate: [
          {
            path: "courseContent", // Sections
            populate: { path: "subSection" }, // Lectures
          },
          { path: "category" }, // Course category
          {
            path: "instructor",
            select: "firstName lastName email image",
          },
        ],
      })
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id: ${userId}`,
      });
    }

   // console.log("userDetails in getUserEnrolledCourses", user);

    user = user.toObject(); // convert Mongoose doc to plain object

    // Iterate over each course
    for (let i = 0; i < user.courses.length; i++) {
      const course = user.courses[i];
      let totalDurationInSeconds = 0;
      let SubSectionLength = 0;

      if (course.courseContent?.length) {
        for (let j = 0; j < course.courseContent.length; j++) {
          const section = course.courseContent[j];
          if (!section?.subSection?.length) continue;

          // Sum lecture durations
          totalDurationInSeconds += section.subSection.reduce(
            (acc, curr) => acc + parseInt(curr.timeDuration || 0),
            0
          );

          SubSectionLength += section.subSection.length;
        }
      }

      course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

      // Calculate course progress
      let courseProgress = await CourseProgress.findOne({
        courseId: course._id,
        userId: userId,
      });

      const completedCount = courseProgress?.completedVideos?.length || 0;

      course.progressPercentage =
        SubSectionLength === 0
          ? 100
          : Math.round((completedCount / SubSectionLength) * 10000) / 100; // 2 decimals
    }

    return res.status(200).json({
      success: true,
      message: "Enrolled courses fetched successfully",
      data: user.courses,
    });
  } catch (error) {
  //console.error("ERROR IN getUserEnrolledCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


exports.instructorDashboard = async(req , res)=>{
  try {

        // Ensure req.user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }
    
    const courseDetails = await Course.find({instructor:req.user.id});

    const courseData = courseDetails.map((course)=>{
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      const courseDataWithStats = {
        _id:course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats;
    })

    // console.log("GET_INSTRUCTOR_API_RESPONSE", courseData);
    
    return res.status(200).json({
      success:true,
      message:"Instructor courses found successfully",
      courses:courseData
    });
    
  } catch (error) {
    //console.error(error);
    res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }

}
