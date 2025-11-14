 
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  useEffect(() => {
    if ((view || edit) && modalData) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    return (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    );
  };

  const handleEditSubsection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo);
    }
    setLoading(true);
    const result = await updateSubSection(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        console.error("No changes made to the form");
      } else {
        handleEditSubsection();
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("sectionId", modalData); // modalData is sectionId in add mode
      formData.append("title", data.lectureTitle);
      formData.append("description", data.lectureDesc);
      formData.append("video", data.lectureVideo);
      setLoading(true);

      const result = await createSubSection(formData, token);

      if (result) {
        //  result is updatedSection directly
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === result._id ? result : section
        );
        dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
        toast.success("Lecture added successfully");
      } else {
        toast.error("Failed to add lecture");
      }
    } catch (error) {
      console.error("Error creating subsection", error);
      toast.error("Error creating subsection");
    } finally {
      setModalData(null);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="lectureTitle"
              className="text-sm font-medium text-richblack-5"
            >
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                Lecture Title
              </span>{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              type="text"
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className={`w-full rounded-md bg-richblack-700 p-3 text-richblack-5 placeholder:text-richblack-400 outline-none border border-transparent focus:border-yellow-400 focus:shadow-md transition-all duration-300 ${
                view ? "cursor-not-allowed opacity-70" : ""
              }`}
            />
            {errors.lectureTitle && (
              <span className="ml-1 text-xs text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="lectureDesc"
              className="text-sm font-medium text-richblack-5"
            >
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                Lecture Description
              </span>{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className={`resize-none min-h-[130px] w-full rounded-md bg-richblack-700 p-3 text-richblack-5 placeholder:text-richblack-400 outline-none border border-transparent focus:border-yellow-400 focus:shadow-md transition-all duration-300 ${
                view ? "cursor-not-allowed opacity-70" : ""
              }`}
            />
            {errors.lectureDesc && (
              <span className="ml-1 text-xs text-pink-200">
                Lecture description is required
              </span>
            )}
          </div>

          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
                type="submit"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
