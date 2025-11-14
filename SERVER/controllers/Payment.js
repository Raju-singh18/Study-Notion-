// // ===================== PAYMENT CONTROLLER =====================
require("dotenv").config();
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
  paymentSuccessEmail
} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
 

// initiate the razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (courses.length === 0) {
    return res.json({
      success: false,
      message: "Please provide Course Id",
    });
  }

  let totalAmount = 0;
  for (const course_id of courses) {
    let course;
    try {
 
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(200).json({
          success: false,
          message: "Could not find the course",
        });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course?.studentsEnrolled?.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is already Enrolled",
        });
      }

      totalAmount += course.price;
    } catch (error) {
     // console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    res.json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
   // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Could not Initiate Order",
    });
  }
};

// verify the Payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;
  
 /* console.log({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  userId,
  courses
});*/


  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment Failed",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256",process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    //enroll karwa do student ko
    await enrolledStudents(courses, userId, res);
    //  return res
    return res.status(200).json({
      success: true,
      message: "Payment Verified",
    });
  }
  return res.status(400).json({
    success: false,
    message: "Payment Failed",
  });
};

const enrolledStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide data for Courses or UserId",
    });
  }

  for (const courseId of courses) {
    try {
      //find the courses and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Could not Fouond",
        });
      }

      // courseProgress
      const courseProgress = await CourseProgress.create({
           userId:userId,
        courseId:courseId,
        completedVideos: [],
      });

      // find the student and add the course to their list of enrolledCourse
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );
      //bacche ko mail send kardo

      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName}`
        )
      );
      // console.log("Email Sent Successfully", emailResponse.response);
    } catch (error) {
       //  console.log(error);
         return res.status(500).json({
            success:false,
            message:error.message,
         }); 
    }
  }
};

exports.sendPaymentSuccessfulEmail = async(req, res) => {
  const {orderId, paymentId, amount} = req.body;

  const userId = req.user.id;

  if(!orderId || !paymentId || !amount || !userId){
    return res.status(400).json({
      success:false,
      message:"Please provide all the fields"
    })
  }

  try {
    //student ko dhundho
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(`${enrolledStudent.firstName}`,amount/100, orderId, paymentId)
    )
  } catch (error) {
   // console.log("error in sending mail", error);
    return res.status(500).json({
      success:false,
      message:"Could not send email"
    })
  }
}

// // Capture Razorpay payment
// exports.capturePayment = async (req, res) => {
//   const { course_id } = req.body;
//   const userId = req.user.id;

//   if (!course_id) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Please provide valid course ID" });
//   }

//   try {
//     const course = await Course.findById(course_id);
//     if (!course) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Course not found" });
//     }

//     const uid = new mongoose.Types.ObjectId(userId);
//     if (course.studentsEnrolled.includes(uid)) {
//       return res
//         .status(409)
//         .json({ success: false, message: "User already enrolled" });
//     }

//     const amount = course.price * 100;
//     const currency = "INR";

//     const options = {
//       amount,
//       currency,
//       receipt: Math.floor(Math.random() * 1000000000).toString(),
//       notes: { courseId: course_id, userId },
//     };

//     const paymentResponse = await instance.orders.create(options);
//     res.status(200).json({
//       success: true,
//       message: "Payment order created",
//       courseName: course.courseName,
//       courseDescription: course.courseDescription,
//       thumbnail: course.thumbnail,
//       orderId: paymentResponse.id,
//       currency: paymentResponse.currency,
//       amount: paymentResponse.amount,
//     });
//   } catch (error) {
//     console.error("Payment error:", error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "Could not initiate payment",
//         error: error.message,
//       });
//   }
// };

// // Verify Razorpay signature and enroll student
// exports.verifySignature = async (req, res) => {
//   try {
//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "12345";
//     const signature = req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if (signature !== digest) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid signature" });
//     }

//     const { courseId, userId } = req.body.payload.payment.entity.notes;

//     const enrolledCourse = await Course.findByIdAndUpdate(
//       courseId,
//       { $push: { studentsEnrolled: userId } },
//       { new: true }
//     );
//     if (!enrolledCourse) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Course not found" });
//     }

//     const enrolledStudent = await User.findByIdAndUpdate(
//       userId,
//       { $push: { courses: courseId } },
//       { new: true }
//     );

//     await mailSender(
//       enrolledStudent.email,
//       "Enrollment Successful",
//       courseEnrollmentEmail(
//         enrolledCourse.courseName,
//         enrolledStudent.firstName
//       )
//     );

//     res
//       .status(200)
//       .json({
//         success: true,
//         message: "Payment verified and student enrolled",
//       });
//   } catch (error) {
//     console.error("Verify Signature Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
