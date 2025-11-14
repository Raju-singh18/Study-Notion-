 
// import React, { useEffect, useState } from "react";
// import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
// import { getInstructorDashboard } from "../../../../services/operations/profileAPI";
// import { useDispatch, useSelector } from "react-redux";
// import { CircleLoader } from "react-spinners";
// import { Link } from "react-router-dom";
// import InstructorChart from "./InstructorChart";

// const Instructor = () => {
//   const [loading, setLoading] = useState(false);
//   const [instructorData, setInstructorData] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const dispatch = useDispatch();
//   const { token } = useSelector((state) => state.auth);
//   const { user } = useSelector((state) => state.profile);

//   useEffect(() => {
//     const getCourseDataWithStats = async () => {
//       setLoading(true);
//       const instructorApiData = await getInstructorDashboard(token, dispatch);
//       const result = await fetchInstructorCourses(token);

//       if (instructorApiData.length) setInstructorData(instructorApiData);
//       if (result) setCourses(result);
//       setLoading(false);
//     };

//     getCourseDataWithStats();
//   }, []);

//   const totalAmount = instructorData?.reduce(
//     (acc, curr) => acc + curr.totalAmountGenerated,
//     0
//   );
//   const totalStudents = instructorData?.reduce(
//     (acc, curr) => acc + curr.totalStudentsEnrolled,
//     0
//   );

//   return (
//     <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
//       {/* Greeting */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-1">Hi {user?.firstName}</h1>
//         <p className="text-gray-400">Let's start something new</p>
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center h-screen">
//           <CircleLoader color="#facc15" size={80} />
//         </div>
//       ) : courses.length > 0 ? (
//         <>
//           {/* Top Stats + Chart */}
//           <div className="grid md:grid-cols-4 gap-6 mb-8">
//             <div className="md:col-span-3">
//               <InstructorChart courses={instructorData} />
//             </div>

//             <div className="space-y-4">
//               <h2 className="text-xl font-semibold mb-2 text-gray-100">Statistics</h2>

//               <div className="grid gap-4">
//                 {/* Total Courses */}
//                 <div
//                   className="flex justify-between items-center bg-gray-700 p-4 rounded-md shadow-lg 
//                              hover:scale-105 hover:bg-gray-600 transition-transform duration-200 cursor-pointer"
//                   title="Total courses you have created"
//                 >
//                   <p className="font-medium">Total Courses</p>
//                   <p className="text-yellow-400 font-bold">{courses.length}</p>
//                 </div>

//                 {/* Total Students */}
//                 <div
//                   className="flex justify-between items-center bg-gray-700 p-4 rounded-md shadow-lg
//                              hover:scale-105 hover:bg-gray-600 transition-transform duration-200 cursor-pointer"
//                   title="All students enrolled in your courses"
//                 >
//                   <p className="font-medium">Total Students</p>
//                   <p className="text-yellow-400 font-bold">{totalStudents}</p>
//                 </div>

//                 {/* Total Income */}
//                 <div
//                   className="flex justify-between items-center bg-gray-700 p-4 rounded-md shadow-lg
//                              hover:scale-105 hover:bg-gray-600 transition-transform duration-200 cursor-pointer"
//                   title="Total income generated from courses"
//                 >
//                   <p className="font-medium">Total Income</p>
//                   <p className="text-yellow-400 font-bold">Rs {totalAmount}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Courses */}
//           <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold">Your Courses</h2>
//               <Link
//                 to="/dashboard/my-courses"
//                 className="text-yellow-400 hover:underline"
//               >
//                 View All
//               </Link>
//             </div>

//             <div className="grid md:grid-cols-3 gap-6">
//               {courses.slice(0, 3).map((course, index) => (
//                 <div
//                   key={index}
//                   className="bg-gray-700 rounded-lg shadow hover:scale-105 hover:bg-gray-600 transition-transform duration-200 cursor-pointer"
//                 >
//                   <img
//                     src={course.thumbnail}
//                     alt={course.courseName}
//                     className="w-full h-48 object-cover rounded-t-lg"
//                   />
//                   <div className="p-4">
//                     <p className="font-semibold text-lg">{course.courseName}</p>
//                     <div className="flex justify-between mt-2 text-gray-300 text-sm">
//                       <p>{course.studentsEnrolled.length} Students</p>
//                       <p>Rs {course.price}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
//           <p className="mb-4 text-lg">You have not created any courses yet</p>
//           <Link
//             to="/dashboard/addCourse"
//             className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
//           >
//             Create a Course
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Instructor;


import React, { useEffect, useState } from "react";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorDashboard } from "../../../../services/operations/profileAPI";
import { useDispatch, useSelector } from "react-redux";
import { CircleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import InstructorChart from "./InstructorChart";

const Instructor = () => {
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    const getCourseDataWithStats = async () => {
      setLoading(true);
      const instructorApiData = await getInstructorDashboard(token, dispatch);
      const result = await fetchInstructorCourses(token);

      if (instructorApiData.length) setInstructorData(instructorApiData);
      if (result) setCourses(result);
      setLoading(false);
    };

    getCourseDataWithStats();
  }, []);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );
  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden pb-10">

      {/* Greeting */}
      <div className="max-w-7xl mx-auto px-4 mt-6 mb-8">
        <h1 className="text-3xl font-bold">Hi {user?.firstName}</h1>
        <p className="text-gray-400 mt-1">Let's start something new</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <CircleLoader color="#facc15" size={80} />
        </div>
      ) : courses.length > 0 ? (
        <>
          {/* STATS + CHART */}
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-4 gap-6 mb-8">

            {/* Chart */}
            <div className="lg:col-span-3">
              <InstructorChart courses={instructorData} />
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-100">Statistics</h2>

              <div className="grid gap-4">

                <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition">
                  <span className="font-medium">Total Courses</span>
                  <span className="font-bold text-yellow-400">{courses.length}</span>
                </div>

                <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition">
                  <span className="font-medium">Total Students</span>
                  <span className="font-bold text-yellow-400">{totalStudents}</span>
                </div>

                <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition">
                  <span className="font-medium">Total Income</span>
                  <span className="font-bold text-yellow-400">Rs {totalAmount}</span>
                </div>

              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="max-w-7xl mx-auto px-4 bg-gray-800 p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Courses</h2>
              <Link to="/dashboard/my-courses" className="text-yellow-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course, index) => (
                <div key={index} className="bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition cursor-pointer">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <p className="font-semibold text-lg">{course.courseName}</p>
                    <div className="flex justify-between mt-2 text-gray-300 text-sm">
                      <span>{course.studentsEnrolled.length} Students</span>
                      <span>Rs {course.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
          <p className="mb-4 text-lg">You have not created any courses yet</p>
          <Link to="/dashboard/addCourse"
            className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
            Create a Course
          </Link>
        </div>
      )}
    </div>
  );
};

export default Instructor;
