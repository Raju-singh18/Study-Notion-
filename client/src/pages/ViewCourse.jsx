import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";

import VideoDetailSidebar from "../components/core/ViewCourse/VideoDetailSidebar";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";

const ViewCourse = () => {
  const [reviewModal, setReviewModal] = useState(false);
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourseData = async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token);

      dispatch(setCourseSectionData(courseData?.courseDetails?.courseContent));
      dispatch(setEntireCourseData(courseData.courseDetails));
      dispatch(setCompletedLectures(courseData.completedVideos));

      let lectures = 0;
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    };

    fetchCourseData();
  }, [courseId, token, dispatch]);

  return (
    <>
      <div className="flex flex-col md:flex-row w-full bg-richblack-900 min-h-screen">
        {/* Sidebar - Desktop */}
        <div
          className="hidden md:block w-[300px] bg-richblack-900 border-r border-richblack-700 overflow-y-auto fixed top-[3.5rem] bottom-0"
          style={{ height: "calc(100vh - 3.5rem)" }}
        >
          <VideoDetailSidebar setReviewModal={setReviewModal} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:ml-[300px]">
          {/* Video Player / Details */}
          <div className="mt-[3.5rem] md:mt-0">
            <Outlet />
          </div>

          {/* Sidebar - Mobile (touches video) */}
          <div className="block md:hidden mt-0">
            <VideoDetailSidebar setReviewModal={setReviewModal} />
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
};

export default ViewCourse;
