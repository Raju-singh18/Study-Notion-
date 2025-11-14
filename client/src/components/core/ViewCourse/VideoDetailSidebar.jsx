import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import IconBtn from "../../common/IconBtn";

const VideoDetailSidebar = ({ setReviewModal }) => {
  const [activeSection, setActiveSection] = useState("");
  const [activeVideo, setActiveVideo] = useState("");
  const navigate = useNavigate();
  const { sectionId, subSectionId } = useParams();
  const location = useLocation();

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    if (!courseSectionData.length) return;

    const currentSectionIndex = courseSectionData.findIndex(
      (s) => s._id === sectionId
    );
    const currentSubIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(
      (s) => s._id === subSectionId
    );
    const currentVideo =
      courseSectionData[currentSectionIndex]?.subSection?.[currentSubIndex]?._id;

    setActiveSection(courseSectionData[currentSectionIndex]?._id);
    setActiveVideo(currentVideo);
  }, [courseSectionData, courseEntireData, location.pathname, sectionId, subSectionId]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-richblack-900 border-r border-richblack-700 text-white overflow-y-auto md:w-[300px] w-full md:fixed top-[3.5rem] left-0 z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-richblack-700 bg-richblack-800 sticky top-0 z-50">
        <button
          className="flex items-center gap-1 text-yellow-50 hover:text-yellow-200 transition"
          onClick={() => navigate("/dashboard/enrolled-courses")}
        >
          <MdOutlineArrowBackIos /> <span className="hidden sm:block">Back</span>
        </button>
        <IconBtn text="Add Review" onclick={() => setReviewModal(true)} type="button" />
      </div>

      {/* Course Info */}
      <div className="p-4 border-b border-richblack-700">
        <p className="font-semibold text-lg truncate">{courseEntireData?.courseName}</p>
        <p className="text-sm text-richblack-300">
          {completedLectures?.length} / {totalNoOfLectures} Completed
        </p>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto px-2">
        {courseSectionData.map((section) => (
          <div key={section._id} className="border-b border-richblack-800">
            <div
              className="flex items-center justify-between px-2 py-3 cursor-pointer hover:bg-richblack-800 transition"
              onClick={() =>
                setActiveSection((prev) => (prev === section._id ? "" : section._id))
              }
            >
              <span className="font-medium truncate">{section.sectionName}</span>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  activeSection === section._id ? "rotate-180" : ""
                }`}
              />
            </div>

            {activeSection === section._id && (
              <div className="bg-richblack-800 rounded-md">
                {section.subSection.map((video) => (
                  <div
                    key={video._id}
                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition rounded-md mb-1 ${
                      activeVideo === video._id
                        ? "bg-yellow-100 text-black"
                        : "text-white hover:bg-richblack-700"
                    }`}
                    onClick={() => {
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${video?._id}`
                      );
                      setActiveVideo(video?._id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={completedLectures.includes(video._id)}
                      readOnly
                      className="accent-yellow-400"
                    />
                    <span className="truncate">{video.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDetailSidebar;
