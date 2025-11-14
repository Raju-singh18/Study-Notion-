const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");


// ===============
// CREATE SECTION
// ===============
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    //  Validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section name and course ID are required.",
      });
    }

    //  Create section
    const newSection = await Section.create({ sectionName });

    //  Update course with new section
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection", // nested populate
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    //console.log("Error creating section:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create section. Please try again.",
      error: error.message,
    });
  }
};

// ==================
// UPDATE SECTION
// ===================
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;

    //  Validate input
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section ID and name are required",
      });
    }

    //  Update section name
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: course,
    });
  } catch (error) {
   // console.log("Error updating section:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update section. Please try again.",
      error: error.message,
    });
  }
};

//===========================
// DELETE SECTION
//==========================
exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		//console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		//console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   
