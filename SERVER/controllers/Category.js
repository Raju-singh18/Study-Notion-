const Category = require("../models/Category");
const Course = require("../models/Course");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    //  Validate input
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //  Create new category
    const categoryDetails = await Category.create({ name, description });
    // console.log("Category created: ", categoryDetails);

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: categoryDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({}, { name: true, description: true })
      .populate({
        path: "courses",
        select: "title description price thumbnail instructor", // pick fields to send
        populate: {
          path: "instructor",
          select: "firstName lastName email", // populate instructor details
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// category page details
exports.CategoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    //  Get selected category and populate its courses
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path:"courses",
        match:{status: "Published"},
        populate:"ratingAndReviews",
      })
      .exec();

      // console.log("SELECTED course", selectedCategory);
      
   // handle the case when the category is not found
    if (!selectedCategory) {
     // console.log("Category not found");
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const selectedCourses = selectedCategory.courses;

    if (!selectedCourses || selectedCourses.length === 0) {
      // console.log("No course found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category",
      });
    }

    const otherCategories = await Category.find({
      _id: { $ne: categoryId }
    }).populate("courses");
   
    const differentCategory = otherCategories
      .filter((cat) => cat.courses && cat.courses.length > 0);

    //  Get top 10 selling courses across all categories
     const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
    // const allCourses = await Course.find({});
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
   // console.log("Error in CategoryPageDetails", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// add course to category
exports.addCourseToCategory = async (req, res) => {
  const { courseId, categoryId } = req.body;
 // console.log("Category Id:", categoryId);
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    if (category.courses.includes(courseId)) {
      return res.status(200).json({
        success: true,
        message: "Course already exists in the category",
      });
    }
    category.courses.push(courseId);
    await category.save();
    return res.status(200).json({
      success: true,
      message: "Course added to category successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

