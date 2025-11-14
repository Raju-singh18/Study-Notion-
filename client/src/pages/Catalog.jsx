import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import Course_Card from "../components/core/Catalog/Course_Card";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import Footer from "../components/Common/Footer";

const Catalog = () => {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  // Active filter state
  const [activeFilter, setActiveFilter] = useState("popular");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Fetch all categories
  useEffect(() => {
    const getCategories = async () => {
      const res = await apiConnector("GET", categories.CATALOGPAGEDATA_API);
      const category_id = res?.data?.data?.filter(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
      )[0]?._id;
      setCategoryId(category_id);
    };
    getCategories();
  }, [catalogName]);

  // Fetch catalog data based on categoryId
  useEffect(() => {
    if (!categoryId) return;
    const getCategoriesDetails = async () => {
      try {
        setLoading(true);
        const res = await getCatalogPageData(categoryId);
        setCatalogPageData(res);
      } catch (error) {
        consoleconsole.log(error);
      } finally {
        setLoading(false);
      }
    };
    getCategoriesDetails();
  }, [categoryId]);

  // Apply sorting when data or active filter changes
  useEffect(() => {
    if (!catalogPageData?.data?.selectedCategory?.courses) return;

    let courses = [...catalogPageData.data.selectedCategory.courses];

    if (activeFilter === "popular") {
      courses.sort(
        (a, b) => (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0)
      );
    } else if (activeFilter === "new") {
      courses.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setFilteredCourses(courses);
  }, [activeFilter, catalogPageData]);

  return (
    <>
      <div className="bg-richblack-900 text-white min-h-screen pt-[80px] md:pt-[80px]">
        {/* Breadcrumb & Category Info */}
        <div className="px-4 md:px-20 py-6 bg-richblack-800 border-b border-richblack-700 sticky top-0 z-30">
          <p className="text-sm text-richblack-300">
            Home / Catalog /{" "}
            <span className="text-yellow-50">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <h1 className="text-3xl font-semibold mt-2 text-richblack-5 break-words">
            {catalogPageData?.data?.selectedCategory?.name}
          </h1>
          <p className="mt-2 text-richblack-200 max-w-3xl">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>

        {/* Courses to Get You Started */}
        <div className="px-4 md:px-20 py-10">
          <h2 className="text-2xl font-semibold text-richblack-5 mb-4">
            Courses to Get You Started
          </h2>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setActiveFilter("popular")}
              className={`pb-1 font-medium transition ${
                activeFilter === "popular"
                  ? "text-yellow-50 border-b-2 border-yellow-50"
                  : "text-richblack-300 hover:text-white"
              }`}
            >
              Most Popular
            </button>
            <button
              onClick={() => setActiveFilter("new")}
              className={`pb-1 font-medium transition ${
                activeFilter === "new"
                  ? "text-yellow-50 border-b-2 border-yellow-50"
                  : "text-richblack-300 hover:text-white"
              }`}
            >
              New
            </button>
          </div>

          {/* Course Slider */}
          <CourseSlider Courses={filteredCourses} />
        </div>

        {/* Top Courses from Other Categories */}
        <div className="px-4 md:px-20 py-10 bg-richblack-800">
          {catalogPageData?.data?.differentCategory?.length > 0 &&
            catalogPageData.data.differentCategory.map((category, idx) => (
              <div key={category._id || idx} className="mb-12">
                <h2 className="text-2xl font-semibold text-richblack-5 mb-6 break-words">
                  Top Courses in{" "}
                  <span className="text-yellow-50">{category.name}</span>
                </h2>
                <CourseSlider Courses={category.courses} />
              </div>
            ))}
        </div>

        {/* Frequently Bought Together */}
        <div className="px-4 md:px-20 py-10">
          <h2 className="text-2xl font-semibold text-richblack-5 mb-6">
            Frequently Bought
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {catalogPageData?.data?.mostSellingCourses
              ?.slice(0, 4)
              ?.map((course, index) => (
                <Course_Card course={course} key={index} Height={"h-[300px]"} />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Catalog;
