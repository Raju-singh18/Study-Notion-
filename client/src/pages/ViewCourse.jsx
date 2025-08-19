 

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailSidebar from '../components/core/ViewCourse/VideoDetailSidebar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';

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
      <div className="flex w-full min-h-screen bg-richblack-900">
        {/* Sidebar */}
        <div className="w-[300px] bg-richblack-900 border-r border-richblack-700 h-screen overflow-y-auto">
          <VideoDetailSidebar setReviewModal={setReviewModal} />
        </div>

        {/* Main Video / Content */}
        <div className="flex-1 h-screen overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
};

export default ViewCourse;
