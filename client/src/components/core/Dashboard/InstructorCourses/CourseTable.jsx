 
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { COURSE_STATUS } from "../../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit, MdCheckCircle, MdOutlineUnpublished } from "react-icons/md";
import ConfirmationModal from "../../../common/ConfirmationModal";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const CourseTable = ({ courses, setCourses }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const navigate = useNavigate();

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  return (
    <div className="mt-10 w-full mb-6">
      <Table className="w-full text-white rounded-lg overflow-hidden">
        <Thead className="hidden md:block">
          <Tr className="grid grid-cols-4 bg-richblack-800 py-4 px-4 md:px-6 text-left text-sm font-semibold border-b border-richblack-700">
            <Th className="col-span-2">Course</Th>
            <Th>Duration</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>

        <Tbody>
          {courses.length === 0 ? (
            <Tr className="grid grid-cols-1 py-8 text-center text-richblack-300">
              <Td>No Courses Found</Td>
            </Tr>
          ) : (
            courses.map((course) => (
              <Tr
                key={course._id}
                className="grid md:grid-cols-4 grid-cols-1 gap-4 border-b border-richblack-700 px-4 md:px-6 py-6 transition-all duration-300 hover:bg-richblack-800 rounded-lg"
              >
                {/* Course Details */}
                <Td className="col-span-2 flex flex-col md:flex-row gap-4">
                  <img
                    src={course?.thumbnail}
                    alt="course thumbnail"
                    className="h-[120px] w-full md:w-[150px] rounded-lg object-cover shadow-md border border-richblack-600"
                  />
                  <div className="flex flex-col justify-between text-sm">
                    <p className="text-lg font-semibold text-richblack-5">
                      {course.courseName}
                    </p>
                    <p className="text-richblack-300 line-clamp-2 text-sm">
                      {course.courseDescription}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-2 items-center">
                      <span className="text-xs text-richblack-400">
                        Created: TBD
                      </span>

                      {course.status === COURSE_STATUS.DRAFT ? (
                        <span className="flex items-center gap-1 text-xs px-2 py-1 bg-pink-700/20 text-pink-300 rounded-md font-medium">
                          <MdOutlineUnpublished className="text-base" /> Draft
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-700/20 text-green-300 rounded-md font-medium">
                          <MdCheckCircle className="text-base" /> Published
                        </span>
                      )}
                    </div>
                  </div>
                </Td>

                {/* Duration */}
                <Td className="text-sm text-richblack-200 flex items-center md:justify-start justify-between">
                  <span className="md:hidden font-semibold text-richblack-50">Duration:</span>
                  2hr 30min
                </Td>

                {/* Actions */}
                <Td className="flex gap-4 items-center md:justify-start justify-between flex-wrap">
                  <button
                    disabled={loading}
                    onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-all duration-200 underline disabled:opacity-50"
                  >
                    <MdEdit className="text-lg" /> Edit
                  </button>

                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2: "All the data related to this course will be deleted.",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => {},
                        btn2Handler: !loading ? () => setConfirmationModal(null) : () => {},
                      });
                    }}
                    className="flex items-center gap-1 text-lg text-pink-400 hover:text-pink-300 transition-all duration-200 disabled:opacity-50"
                  >
                    <RiDeleteBin6Line /> Delete
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseTable;
