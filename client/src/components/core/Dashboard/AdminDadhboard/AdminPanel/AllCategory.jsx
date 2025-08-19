
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { showAllCategories } from "../../../../../services/operations/courseDetailsAPI";
import { useSelector } from "react-redux";

Chart.register(...registerables);

const AllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState(null);

  const { token } = useSelector((state) => state.auth);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await showAllCategories(token);
      setCategories(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading)
    return (
      <p className="text-center text-lg font-semibold text-white">Loading...</p>
    );

  // Stats
  const totalCourses = categories.reduce(
    (acc, cat) => acc + cat.courses.length,
    0
  );
  const totalInstructors = new Set(
    categories.flatMap((cat) => cat.courses.map((c) => c?.instructor?._id))
  ).size;

  // Chart Data
  const categoryNames = categories.map((cat) => cat.name);
  const coursesCount = categories.map((cat) => cat.courses.length);

  const chartData = {
    labels: categoryNames,
    datasets: [
      {
        label: "Courses per Category",
        data: coursesCount,
        backgroundColor: "#f59e0b",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="p-6 space-y-10 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        All Categories Overview
      </h1>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 bg-gray-900 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Category vs Courses
          </h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Stats */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Statistics</h2>
          <div className="space-y-6 flex flex-col justify-evenly">
            <div className="p-4 bg-indigo-900/40 rounded-lg text-center">
              <p className="text-lg font-semibold text-indigo-400">
                {totalInstructors}
              </p>
              <p className="text-sm text-gray-300">Total Instructors</p>
            </div>
            <div className="p-4 bg-green-900/40 rounded-lg text-center">
              <p className="text-lg font-semibold text-green-400">
                {totalCourses}
              </p>
              <p className="text-sm text-gray-300">Total Courses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Accordion */}
      <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Explore Courses by Category
        </h2>

        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat._id} className="border border-gray-700 rounded-lg">
              <button
                onClick={() =>
                  setOpenCategory(openCategory === cat._id ? null : cat._id)
                }
                className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                {cat.name}
                <span>{openCategory === cat._id ? "▲" : "▼"}</span>
              </button>

              {/* Courses - Show only if open */}
              {openCategory === cat._id && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {cat.courses.length > 0 ? (
                    cat.courses.map((course) => (
                      <div
                        key={course._id}
                        className="bg-gray-800 rounded-lg shadow hover:shadow-lg overflow-hidden transition"
                      >
                        <img
                          src={course.thumbnail}
                          alt={course.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <p className="font-semibold text-gray-200 truncate">
                            {course.courseName}
                          </p>
                          <p className="text-sm text-gray-400">
                            By {course?.instructor?.firstName}{" "}
                            {course?.instructor?.lastName}
                          </p>
                          <p className="text-sm font-semibold text-amber-400 mt-1">
                            ₹{course.price}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 col-span-full text-center">
                      No courses available
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCategory;
