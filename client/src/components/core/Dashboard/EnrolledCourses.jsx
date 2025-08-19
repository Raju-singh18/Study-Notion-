 
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserCourses } from "../../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(undefined);
  const navigate = useNavigate();

  const getEnrolledCoursesData = async () => {
    const response = await getUserCourses(token);
    setEnrolledCourses(response);
  };

  useEffect(() => {
    getEnrolledCoursesData();
  }, []);
  console.log("enrolled courses ",enrolledCourses);

  return (
    <div className="text-white w-full min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400">
        My Enrolled Courses
      </h2>

      {!enrolledCourses ? (
        <div className="text-gray-400 text-lg animate-pulse">Loading...</div>
      ) : !enrolledCourses.length ? (
        <p className="text-gray-400 text-lg">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-[150px_1fr_150px_150px_200px] gap-4 py-3 border-b border-gray-700 text-sm font-semibold text-center">
            <span>Thumbnail</span>
            <span className="text-left">Course Name</span>
            <span>Duration</span>
            <span>Progress</span>
            <span>Action</span>
          </div>

          {/* Table Rows */}
          {enrolledCourses.map((course, index) => (
            <div
              key={index}
              className="grid grid-cols-[150px_1fr_150px_150px_200px] gap-4 items-center py-4 border-b border-gray-700 hover:bg-gray-800/40 transition-colors"
              onClick={() => {
                navigate(
                  `/view-course/${course?._id}/section/${course?.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                );
              }}
            >
              {/* Thumbnail */}
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="w-[120px] h-[80px] object-cover rounded-md mx-auto"
              />

              {/* Name */}
              <div className="text-left">
                <h3 className="text-base font-medium">{course.courseName}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {course.courseDescription}
                </p>
              </div>

              {/* Duration */}
              <span className="text-gray-300 text-center">
                {course?.totalDuration || "N/A"}
              </span>

              {/* Progress */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-gray-400">
                  {course.progressPercentage || 0}%
                </span>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="6px"
                  isLabelVisible={false}
                  baseBgColor="#1f2937"
                  bgColor="#facc15"
                  className="w-full"
                />
              </div>

              {/* Action */}
              <div
                className="flex justify-center"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  );
                }}
              >
                <button className="bg-yellow-500 text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all">
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
