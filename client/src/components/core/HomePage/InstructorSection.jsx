 
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import Instructor from "../../../assets/Images/Instructor.png";
import { HighlightText } from "./HighlightText";

const InstructorSection = () => {
  return (
    <section className="bg-gradient-to-r from-richblack-800 to-richblack-900 py-16 px-4 sm:px-6 lg:px-20 rounded-lg my-16">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Instructor Image */}
        <div className="lg:w-1/2 flex justify-center lg:justify-start">
          <img
            src={Instructor}
            alt="Instructor"
            className="shadow-white shadow-[-20px_-20px_0_0] rounded-xl transform transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Text Content */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-snug">
            Become an <HighlightText text="Instructor" />
          </h1>

          <p className="text-richblack-300 text-[16px] sm:text-[18px] leading-relaxed text-justify">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide you with the tools and skills to teach what
            you love, share your knowledge, and build your own online presence.
          </p>

          {/* Enhanced Button */}
          <a
            href="/signup"
            className="w-fit inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-richblack-900 font-semibold rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Start Teaching Today
            <FaArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;


