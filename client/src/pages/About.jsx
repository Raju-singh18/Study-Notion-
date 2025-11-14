import React from "react";
import { HighlightText } from "../components/core/HomePage/HighlightText";
import Aboutus1 from "../assets/Images/aboutus1.png";
import Aboutus2 from "../assets/Images/aboutus2.png";
import Aboutus3 from "../assets/Images/aboutus3.png";
import Quate from "../components/core/AboutPage/Quate";
import FoundingStory from "../assets/Images/FoundingStory.png";
import StatsComponent from "../components/core/AboutPage/Stats";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
import Footer from "../components/Common/Footer";
import ReviewSlider from "../components/Common/ReviewSlider";

const About = () => {
  return (
    <>
      <div className="w-11/12 max-w-[1200px] mx-auto text-white">
        {/* Hero Section */}
        <section className="mt-28 text-center">
          <header className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Driving Innovation in Online Learning for a{" "}
            <HighlightText text={"Smarter Tomorrow"} />
          </header>
          <p className="mt-6 text-base sm:text-lg text-richblack-300 max-w-[720px] mx-auto">
            At <span className="text-yellow-400 font-semibold">StudyNotion</span>, 
            we’re not just building an e-learning platform. We’re creating a 
            global hub where learners, mentors, and innovators come together 
            to explore, grow, and shape the future of education.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
            {[Aboutus1, Aboutus2, Aboutus3].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`about-${i}`}
                className="w-full sm:w-[28%] rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
              />
            ))}
          </div>
        </section>

        {/* Quote */}
        <section className="my-16">
          <Quate />
        </section>

        {/* Founding Story */}
        <section className="my-20 w-full">
          <div className="flex flex-col gap-20">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-5 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                  Our Founding Story
                </h1>
                <p className="text-richblack-300">
                  StudyNotion was born from a simple question: 
                  <span className="text-richblack-5 font-medium">
                    {" "}What if quality education was accessible to everyone, everywhere?
                  </span>
                </p>
                <p className="text-richblack-300">
                  With a small team of educators, engineers, and dreamers, 
                  we set out to create a platform that empowers learners and 
                  educators alike. From the start, our mission has been clear — 
                  to break barriers, ignite curiosity, and make learning 
                  deeply personal, interactive, and rewarding.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <img
                  src={FoundingStory}
                  alt="founding story"
                  className="rounded-2xl shadow-xl w-full md:w-auto max-w-md"
                />
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="rounded-2xl bg-richblack-800/60 backdrop-blur-md p-6 sm:p-8 shadow-lg hover:shadow-yellow-500/20 transition-all">
                <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                <p className="text-richblack-300">
                  To redefine how the world learns — by blending 
                  technology, creativity, and human connection. 
                  We envision a future where every learner has the 
                  tools to explore, innovate, and thrive without 
                  boundaries.
                </p>
              </div>
              <div className="rounded-2xl bg-richblack-800/60 backdrop-blur-md p-6 sm:p-8 shadow-lg hover:shadow-yellow-500/20 transition-all">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-richblack-300">
                  To democratize learning by building a platform 
                  that is accessible, affordable, and engaging. 
                  Beyond courses, we’re nurturing a community 
                  where knowledge grows through collaboration, 
                  mentorship, and shared experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <StatsComponent />

        {/* Learning Grid + Contact */}
        <section className="w-full my-20 flex flex-col gap-16">
          <LearningGrid />
          <ContactFormSection />
        </section>

        {/* Reviews */}
        <section className="my-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-10">
            Hear from our <span className="text-yellow-400">learners</span>
          </h1>
          <ReviewSlider />
        </section>
      </div>

      <Footer />
    </>
  );
};

export default About;
