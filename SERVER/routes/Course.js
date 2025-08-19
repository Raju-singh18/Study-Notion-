const express = require("express");
const router = express.Router();

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getInstructorCourses,
  editCourse,
  getFullCourseDetails,
  deleteCourse,
  searchCourse,
  markLectureAsComplete,
} = require("../controllers/Course");

// import controllers and middleware
const {
  createCategory,
  showAllCategories,
  CategoryPageDetails,
  addCourseToCategory,
} = require("../controllers/Category");

// section controllers import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");

const {auth, isAdmin, isInstructor, isStudent } = require("../middlewares/auth");
// =================
//!  Course Route
// ==================
// Courses can only be created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);
// Add a section to a course
router.post("/addSection", auth, isInstructor, createSection);
// update a section
router.put("/updateSection", auth, isInstructor, updateSection);
// delete a section
router.delete("/deleteSection", auth, isInstructor, deleteSection);
//Add a subsection to a section
router.post("/addSubSection", auth, isInstructor, createSubSection);
//Edit Subsection
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub Section
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Courses
router.get("/getCourseDetails/:courseId", getCourseDetails);
// Edit a Course
router.post("/editCourse", auth, isInstructor, editCourse);
// Get all Courses of a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
//Get full course details
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
//Delete a Course
router.delete("/deleteCourse", auth, deleteCourse);
// Search Courses
router.post("/searchCourse", searchCourse);
//mark lecture as complete
router.post("/updateCourseProgress", auth, isStudent, markLectureAsComplete);

// =======================
// ! Category Route
// =======================
// Routes to create a category (only admin)
router.post("/createCategory", auth, isAdmin, createCategory);
// Route to get categories (public or protected)
router.get("/showAllCategories", showAllCategories);
// Routes to get category page details
router.post("/categoryPageDetails", CategoryPageDetails);
//! Route to add Course to category(This route for instructor)
router.post("/addCourseToCategory", auth, isInstructor, addCourseToCategory);

// !***************Rating and reviews route***************
// Create a rating & review (Student only)
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);
// !**********************************************
 

module.exports = router;

