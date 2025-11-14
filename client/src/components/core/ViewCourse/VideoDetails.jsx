import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";

const CourseDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const { courseSectionData, completedLectures } = useSelector(
    (state) => state.viewCourse
  );

  const { user } = useSelector((state) => state.profile);
  const userId = user._id;
  const { token } = useSelector((state) => state.auth);

  const [videoData, setVideoData] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseSectionData.length) return;

    const section = courseSectionData.find((s) => s._id === sectionId);
    if (!section) return;

    const sub = section.subSection.find((s) => s._id === subSectionId);
    setVideoData(sub || null);
    setVideoEnded(false);
  }, [courseSectionData, sectionId, subSectionId]);

  const isFirstVideo = () => {
    const secIdx = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIdx = courseSectionData[secIdx].subSection.findIndex(
      (sub) => sub._id === subSectionId
    );
    return secIdx === 0 && subIdx === 0;
  };

  const isLastVideo = () => {
    const secIdx = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIdx = courseSectionData[secIdx].subSection.findIndex(
      (sub) => sub._id === subSectionId
    );
    return (
      secIdx === courseSectionData.length - 1 &&
      subIdx === courseSectionData[secIdx].subSection.length - 1
    );
  };

  const goToNextVideo = () => {
    const secIdx = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIdx = courseSectionData[secIdx].subSection.findIndex(
      (sub) => sub._id === subSectionId
    );

    if (subIdx < courseSectionData[secIdx].subSection.length - 1) {
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${
          courseSectionData[secIdx].subSection[subIdx + 1]._id
        }`
      );
    } else if (secIdx < courseSectionData.length - 1) {
      const nextSection = courseSectionData[secIdx + 1];
      navigate(
        `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`
      );
    }
  };

  const goToPrevVideo = () => {
    const secIdx = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIdx = courseSectionData[secIdx].subSection.findIndex(
      (sub) => sub._id === subSectionId
    );

    if (subIdx > 0) {
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${
          courseSectionData[secIdx].subSection[subIdx - 1]._id
        }`
      );
    } else if (secIdx > 0) {
      const prevSection = courseSectionData[secIdx - 1];
      navigate(
        `/view-course/${courseId}/section/${prevSection._id}/sub-section/${
          prevSection.subSection[prevSection.subSection.length - 1]._id
        }`
      );
    }
  };

  const handleRewatch = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch((err) => console.log(err));
    setVideoEnded(false);
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      { courseId, subSectionId, userId },
      token
    );
    if (res) dispatch(updateCompletedLectures(subSectionId));
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row bg-richblack-900 min-h-screen pt-[3.5rem]">
      {/* Video + Info */}
      <div className="flex-1 flex flex-col gap-6 p-4 md:p-6">
        <div className="relative bg-black rounded-lg overflow-hidden shadow-xl">
          {!videoData ? (
            <div className="text-white p-6 text-lg font-medium">
              No video found
            </div>
          ) : (
            <>
              <MediaController style={{ width: "100%", aspectRatio: "16/9" }}>
                <ReactPlayer
                  slot="media"
                  ref={videoRef}
                  src={videoData.videoUrl}
                  controls={false}
                  playsInline
                  onEnded={() => setVideoEnded(true)}
                  width="100%"
                  height="100%"
                  className="rounded-lg"
                />
                <MediaControlBar className="bg-richblack-900/90 text-white">
                  <MediaPlayButton className="text-white hover:text-green-500" />
                  <MediaSeekBackwardButton
                    seekOffset={5}
                    className="text-white"
                  />
                  <MediaSeekForwardButton
                    seekOffset={5}
                    className="text-white"
                  />
                  <MediaTimeRange className="text-white" />
                  <MediaTimeDisplay showDuration className="text-white" />
                  <MediaMuteButton className="text-white hover:text-yellow-400" />
                  <MediaVolumeRange className="text-white" />
                  <MediaPlaybackRateButton className="text-white" />
                  <MediaFullscreenButton className="text-white hover:text-blue-400" />
                </MediaControlBar>
              </MediaController>

              {/* Overlay Buttons */}
              {videoEnded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 p-6 rounded-lg">
                  {!completedLectures.includes(subSectionId) && (
                    <button
                      onClick={handleLectureCompletion}
                      disabled={loading}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md text-lg font-semibold"
                    >
                      {!loading ? "Mark As Completed" : "Loading..."}
                    </button>
                  )}

                  <button
                    onClick={handleRewatch}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-md text-lg font-semibold"
                  >
                    Rewatch
                  </button>

                  <div className="flex gap-3 mt-3">
                    {!isFirstVideo() && (
                      <button
                        onClick={goToPrevVideo}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
                      >
                        Prev
                      </button>
                    )}
                    {!isLastVideo() && (
                      <button
                        onClick={goToNextVideo}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Video Info */}
        <div className="bg-richblack-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-4 border border-richblack-600 hover:shadow-purple-600/50 transition-shadow duration-300">
          <h1 className="text-2xl md:text-3xl font-bold text-richblack-25 tracking-wide">
            {videoData?.title}
          </h1>

          <p className="text-richblack-50 text-sm md:text-base leading-relaxed">
            {videoData?.description}
          </p>

          <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
