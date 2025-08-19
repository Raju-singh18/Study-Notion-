 
import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const handleDeleleSection = async (sectionId) => {
    const result = await deleteSection({
      sectionId,
      courseId: course._id,
      token,
    })
    if (result) {
      dispatch(setCourse(result))
    }
    setConfirmationModal(null)
  }

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId }, token)
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null)
  }

  return (
    <>
      <div className="rounded-lg bg-richblack-700 p-6 px-8 shadow-md">
        {course?.courseContent?.map((section) => (
          <details
            key={section._id}
            open
            className="group border border-richblack-600 mb-4 rounded-md bg-richblack-800 transition-shadow duration-300 hover:shadow-lg"
          >
            {/* Section Header */}
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-richblack-700 transition-colors duration-300 rounded-md">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-yellow-200" />
                <p className="font-semibold bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                  {section.sectionName}
                </p>
              </div>
              <div className="flex items-center gap-x-3">
                <button
                  title="Edit Section"
                  onClick={() =>
                    handleChangeEditSectionName(section._id, section.sectionName)
                  }
                  className="hover:text-yellow-300 transition"
                >
                  <MdEdit className="text-xl text-richblack-300" />
                </button>
                <button
                  title="Delete Section"
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleleSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                  className="hover:text-pink-300 transition"
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300" />
                </button>
                <span className="text-richblack-400">|</span>
                <AiFillCaretDown className="text-xl text-richblack-300" />
              </div>
            </summary>

            {/* Subsections */}
            <div className="px-6 pb-4">
              {section.subSection.map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="group flex cursor-pointer items-center justify-between gap-x-3 border-b border-richblack-600 py-2 rounded-md hover:bg-richblack-700 transition-all"
                >
                  <div className="flex items-center gap-x-3 py-1">
                    <RxDropdownMenu className="text-xl text-richblack-100" />
                    <p className="text-richblack-100 font-medium group-hover:text-yellow-100">
                      {data.title}
                    </p>
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-3"
                  >
                    <button
                      title="Edit Lecture"
                      onClick={() =>
                        setEditSubSection({ ...data, sectionId: section._id })
                      }
                      className="hover:text-yellow-300 transition"
                    >
                      <MdEdit className="text-lg text-richblack-300" />
                    </button>
                    <button
                      title="Delete Lecture"
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Sub-Section?",
                          text2: "This lecture will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                      className="hover:text-pink-300 transition"
                    >
                      <RiDeleteBin6Line className="text-lg text-richblack-300" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Lecture Button */}
              <button
                onClick={() => setAddSubsection(section._id)}
                className="mt-3 flex items-center gap-x-2 text-yellow-100 hover:text-yellow-300 transition font-semibold"
              >
                <FaPlus className="text-base" />
                <span>Add Lecture</span>
              </button>
            </div>
          </details>
        ))}
      </div>

      {/* Modal Display */}
      {addSubSection && (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubsection}
          add={true}
        />
      )}
      {viewSubSection && (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      )}
      {editSubSection && (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      )}

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
