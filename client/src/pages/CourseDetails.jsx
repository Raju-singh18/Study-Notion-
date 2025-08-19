 

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../services/operations/studentFeaturesApi";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import { CircleLoader } from "react-spinners";
import ErrorPage from "./ErrorPage";
import ConfirmationModal from "../components/common/ConfirmationModal";
import RatingStars from "../components/Common/RatingStar";
import { formatDate } from "../utils/formatDate";
import { RiGlobalLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { BiPlayCircle } from "react-icons/bi";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import Footer from "../components/Common/Footer";

const CourseDetails = () => {
  const { user, loading } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [avgReviewCount, setAverageReviewCount] = useState(0);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [totalDurationSec, setTotalDurationSec] = useState(0);
  const [activeSections, setActiveSections] = useState([]);

  const toSeconds = (val) => {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    const parts = String(val).split(":").map((x) => parseInt(x || "0", 10));
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    const n = parseInt(val, 10);
    return Number.isNaN(n) ? 0 : n;
  };

  const formatTotal = (secs) => {
    if (secs <= 0) return "0m total length";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m total length`;
    return `${m}m total length`;
  };

  useEffect(() => {
    const getCourseFullDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId);
        setCourseData(result);
        const firstId = result?.data?.courseContent?.[0]?._id;
        setActiveSections(firstId ? [firstId] : []);
      } catch {
        console.log("Could not fetch course details");
      }
    };
    getCourseFullDetails();
  }, [courseId]);

  useEffect(() => {
    const count = GetAvgRating(courseData?.data?.ratingAndReviews);
    setAverageReviewCount(count);
  }, [courseData]);

  useEffect(() => {
    let lectures = 0;
    let secs = 0;
    courseData?.data?.courseContent?.forEach((sec) => {
      const items = sec?.subSection || [];
      lectures += items.length;
      items.forEach((lec) => (secs += toSeconds(lec?.timeDuration)));
    });
    setTotalNoOfLectures(lectures);
    setTotalDurationSec(secs);
  }, [courseData]);

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      text1: "You are not Logged in",
      text2: "Please login to purchase the course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  if (loading || !courseData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircleLoader color="#facc15" size={80} />
      </div>
    );
  }

  if (!courseData.success || !courseData.data) {
    return <ErrorPage />;
  }

  const {
    courseName,
    courseDescription,
    whatYouWillLearn,
    courseContent = [],
    ratingAndReviews = [],
    instructor,
    studentsEnrolled = [],
    language,
    createdAt,
  } = courseData?.data;

  const allOpen = activeSections.length === courseContent.length;

  return (
    <>
    <div className="flex flex-col lg:flex-row gap-8 text-white px-6 lg:px-12 py-8">
      {/* Left column */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{courseName}</h1>
        <p className="mt-2 text-gray-300">{courseDescription}</p>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            {avgReviewCount}
            <RatingStars Review_Count={avgReviewCount} Star_Size={20} />
          </span>
          <span>({ratingAndReviews.length} reviews)</span>
          <span>({studentsEnrolled.length} students enrolled)</span>
        </div>

        <p className="mt-3 text-gray-300">
          Created by{" "}
          <span className="text-yellow-400 font-medium">
            {instructor?.firstName} {instructor?.lastName}
          </span>
        </p>

        <div className="flex items-center gap-6 mt-3 text-gray-400">
          <p>Created at {formatDate(createdAt)}</p>
          <p className="flex items-center gap-1">
            <RiGlobalLine /> {language}
          </p>
        </div>

        {/* What you'll learn */}
        <div className="mt-8 bg-gray-800/80 p-5 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-3">What you'll learn</h2>
          <p className="text-gray-300 leading-relaxed">{whatYouWillLearn}</p>
        </div>

        {/* Course Content */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Course Content</h2>

          <div className="mt-2 flex items-center justify-between text-sm">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-gray-400">
              <span>{courseContent.length} section(s)</span>
              <span>{totalNoOfLectures} lecture(s)</span>
              <span>{formatTotal(totalDurationSec)}</span>
            </div>

            <button
              onClick={() =>
                setActiveSections(
                  allOpen ? [] : courseContent.map((s) => s._id)
                )
              }
              className="text-yellow-400 hover:underline"
            >
              {allOpen ? "Collapse all sections" : "Expand all sections"}
            </button>
          </div>

          {/* Accordion */}
          <div className="mt-4 rounded-xl overflow-hidden border border-gray-700">
            {courseContent.map((section, idx) => {
              const isOpen = activeSections.includes(section._id);
              return (
                <div
                  key={section._id}
                  className={`${
                    idx !== courseContent.length - 1 ? "border-b" : ""
                  } border-gray-700 bg-gray-800/70`}
                >
                  {/* Section header */}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSections((prev) =>
                        prev.includes(section._id)
                          ? prev.filter((id) => id !== section._id)
                          : [...prev, section._id]
                      )
                    }
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-700/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <IoIosArrowDown
                        className={`text-xl transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                      <span className="text-lg font-medium">
                        Section {idx + 1}: {section?.title}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {section?.subSection?.length || 0} lecture(s)
                    </span>
                  </button>

                  {/* Lectures */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0">
                      {(section?.subSection || []).map((lec) => (
                        <div
                          key={lec._id}
                          className="pl-12 pr-5 py-3 flex items-center justify-between bg-gray-900/60 hover:bg-gray-900 transition-colors border-t border-gray-700"
                        >
                          <div className="flex items-center gap-3">
                            <BiPlayCircle className="text-lg text-gray-400" />
                            <span className="text-sm">{lec?.title}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {lec?.timeDuration ?? "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="lg:w-1/3 w-full lg:sticky lg:top-24 self-start">
        <CourseDetailsCard
          course={courseData?.data}
          setConfirmationModal={setConfirmationModal}
          handleBuyCourse={handleBuyCourse}
        />
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
    <Footer/>
    </>
  );
};

export default CourseDetails;







// ============

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { buyCourse } from "../services/operations/studentFeaturesApi";
// import { addToCart } from "../slices/cartSlice";
// import toast from "react-hot-toast";
// import { apiConnector } from "../services/apiConnector";
// import { courseEndpoints } from "../services/apis";
// import Footer from "../components/Common/Footer";

// const CourseDetails = () => {
//   const { user } = useSelector((state) => state.profile);
//   const { token } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const { courseId } = useParams();
//   const navigate = useNavigate();

//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch course details
//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       try {
//         setLoading(true);
//         const res = await apiConnector("GET", `${courseEndpoints.COURSE_DETAILS_API}/${courseId}`);
//         setCourse(res.data?.data);
//       } catch (error) {
//         toast.error("Failed to load course details");
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourseDetails();
//   }, [courseId]);

//   const handleBuyCourse = () => {
//     if (token) {
//       buyCourse(token, [courseId], user, navigate, dispatch);
//     } else {
//       navigate("/login");
//     }
//   };

//   const handleAddToCart = () => {
//     if (!course) return;
//     dispatch(addToCart(course));
//     toast.success("Course added to cart");
//   };

//   if (loading) {
//     return <div className="text-center py-20 text-lg font-semibold">Loading course...</div>;
//   }

//   if (!course) {
//     return <div className="text-center py-20 text-lg font-semibold">Course not found</div>;
//   }

//   return (
//     <>
//     <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
//       {/* Left - Course Details */}
//       <div>
//         <h1 className="text-4xl font-bold mb-4">{course.courseName}</h1>
//         <p className="text-gray-600 mb-6">{course.courseDescription}</p>

//         <div className="flex items-center gap-6 mb-6">
//           <span className="text-2xl font-semibold text-green-600">
//             ₹{course.price}
//           </span>
//           <span className="text-gray-500">
//             {course.courseContent?.length || 0} Sections
//           </span>
//           <span className="text-gray-500">{course.category?.name}</span>
//         </div>

//         <div className="flex gap-4">
//           <button
//             className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-lg text-black font-semibold shadow-md transition"
//             onClick={handleBuyCourse}
//           >
//             Buy Now
//           </button>
//           <button
//             className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-white font-semibold shadow-md transition"
//             onClick={handleAddToCart}
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>

//       {/* Right - Image */}
//       <div className="flex justify-center">
//         <img
//           src={course.thumbnail}
//           alt={course.courseName}
//           className="w-full max-w-md rounded-xl shadow-lg"
//         />
//       </div>
//     </div>
//     <Footer/>
//     </>
//   );
// };

// export default CourseDetails;

 

