import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaArrowRight,
  FaCode,
  FaLaptopCode,
  FaProjectDiagram,
  FaUsers,
} from "react-icons/fa";
import { useDispatch } from "react-redux";

import { HighlightText } from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import Footer from "../components/Common/Footer";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ReviewSlider from "../components/Common/ReviewSlider";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import { getCatalogPageData } from "../services/operations/pageAndComponentData";

const Home = () => {
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const categoryID = "6868be4b209b24f4e642d20d";

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCatalogPageData = async () => {
      setLoading(true);
      try {
        const result = await getCatalogPageData(categoryID);
        setCatalogPageData(result);
      } catch (error) {
        console.error("Failed to fetch catalog data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryID) fetchCatalogPageData();
  }, [categoryID]);

  return (
    <div className="bg-richblack-900 text-white pt-16">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-12 px-4 sm:px-6 lg:px-10">
        <NavLink to="/signup">
          <div className="group mb-4 p-1 rounded-full bg-richblack-700 hover:scale-95 transition-all duration-200 w-fit shadow-md">
            <div className="flex items-center gap-2 rounded-full px-6 py-2 bg-richblack-800 group-hover:bg-richblack-900 font-medium text-sm sm:text-base transition">
              Become an Instructor
              <FaArrowRight size={14} />
            </div>
          </div>
        </NavLink>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-snug max-w-3xl">
          Empower Your Future with{" "}
          <HighlightText text="Practical Coding Skills" />
        </h1>

        <p className="mt-2 sm:mt-3 text-richblack-300 text-sm sm:text-base max-w-xl">
          Build real-world projects that prepare you for jobs, freelancing, and
          launching products.
        </p>

        <div className="flex gap-3 sm:gap-4 mt-4 flex-wrap justify-center">
          <CTAButton active linkto="/signup">
            Get Started
          </CTAButton>
          <CTAButton active={false} linkto="/login">
            Book a Demo
          </CTAButton>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 w-full max-w-4xl">
          {[
            {
              icon: <FaCode size={22} />,
              text: "Full-Stack Projects",
              color: "text-yellow-100",
            },
            {
              icon: <FaLaptopCode size={22} />,
              text: "Hands-On Learning",
              color: "text-pink-200",
            },
            {
              icon: <FaProjectDiagram size={22} />,
              text: "System Design",
              color: "text-blue-200",
            },
            {
              icon: <FaUsers size={22} />,
              text: "Peer Reviews",
              color: "text-green-200",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1 bg-richblack-800 px-4 py-3 rounded-lg shadow hover:scale-105 transition"
            >
              <div className={item.color}>{item.icon}</div>
              <p className="font-semibold text-xs sm:text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* First CodeBlocks Section */}
      <section className="w-full max-w-5xl mx-auto my-12 px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        <CodeBlocks
          position="flex flex-col lg:flex-row items-center justify-center text-center lg:text-left"
          heading={
            <div className="text-3xl sm:text-4xl font-semibold text-center lg:text-left">
              Unlock Your <HighlightText text="coding potential" /> with our
              online courses
            </div>
          }
          subheading="Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
          ctabtn1={{ btnText: "Try it yourself", linkto: "/signup", active: true }}
          ctabtn2={{ btnText: "Learn more", linkto: "/login", active: false }}
          codeblock={`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
</body>
</html>`}
          codeColor="text-yellow-50"
        />
      </section>

      {/* Most Popular Courses */}
      <section className="w-full max-w-6xl mx-auto my-12 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Most Popular Courses
        </h2>
        {loading ? (
          <p className="text-white text-center text-lg">Loading courses...</p>
        ) : catalogPageData?.data?.mostSellingCourses?.length > 0 ? (
          <CourseSlider Courses={catalogPageData.data.mostSellingCourses} />
        ) : (
          <p className="text-center text-gray-500 text-lg">No Courses Found</p>
        )}
      </section>

      {/* Second CodeBlocks Section */}
      <section className="w-full max-w-5xl mx-auto my-12 px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        <CodeBlocks
          position="flex flex-col lg:flex-row-reverse items-center justify-center text-center lg:text-left"
          heading={
            <div className="text-3xl sm:text-4xl font-semibold text-center lg:text-left">
              Start <HighlightText text="coding in Seconds" />
            </div>
          }
          subheading="Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lessons."
          ctabtn1={{ btnText: "Continue Lesson", linkto: "/signup", active: true }}
          ctabtn2={{ btnText: "Learn more", linkto: "/login", active: false }}
          codeblock={`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
</body>
</html>`}
          codeColor="text-yellow-50"
        />
      </section>

      {/* Instructor Section */}
      <InstructorSection />

      {/* Reviews Section */}
      <section className="mt-20 mb-12">
        <h1 className="text-center text-4xl font-semibold mb-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
