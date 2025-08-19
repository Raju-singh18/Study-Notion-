 
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

  const { courseSectionData, courseEntireData, totalNoOfLectures, completedLectures } =
    useSelector((state) => state.viewCourse);

  useEffect(() => {
    if (!courseSectionData.length) return;

    const currentSectionIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const currentSubIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(
      (s) => s._id === subSectionId
    );
    const currentVideo = courseSectionData[currentSectionIndex]?.subSection?.[currentSubIndex]?._id;

    setActiveSection(courseSectionData[currentSectionIndex]?._id);
    setActiveVideo(currentVideo);
  }, [courseSectionData, courseEntireData, location.pathname, sectionId, subSectionId]);

  return (
    <div className="text-white flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-richblack-700">
        <button
          className="flex items-center gap-1 text-yellow-50 hover:text-yellow-200 transition"
          onClick={() => navigate("/dashboard/enrolled-courses")}
        >
          <MdOutlineArrowBackIos /> Back
        </button>
        <IconBtn text="Add Review" onclick={() => setReviewModal(true)} type="button" />
      </div>

      {/* Course Info */}
      <div className="p-4 border-b border-richblack-700">
        <p className="font-semibold text-lg">{courseEntireData?.courseName}</p>
        <p className="text-sm text-richblack-300">
          {completedLectures?.length} / {totalNoOfLectures} Completed
        </p>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {courseSectionData.map((section) => (
          <div key={section._id} className="border-b border-richblack-800">
            {/* Section Header */}
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-richblack-800 transition"
              onClick={() =>
                setActiveSection((prev) => (prev === section._id ? "" : section._id))
              }
            >
              <span className="font-medium">{section.sectionName}</span>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  activeSection === section._id ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Subsections */}
            {activeSection === section._id && (
              <div className="bg-richblack-800">
                {section.subSection.map((video) => (
                  <div
                    key={video._id}
                    className={`flex items-center gap-3 px-5 py-2 cursor-pointer transition-colors rounded-md mb-1 ${
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
                    {/* ✅ Checkbox is read-only now */}
                    <input
                      type="checkbox"
                      checked={completedLectures.includes(video._id)}
                      readOnly
                    />
                    <span>{video.title}</span>
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
