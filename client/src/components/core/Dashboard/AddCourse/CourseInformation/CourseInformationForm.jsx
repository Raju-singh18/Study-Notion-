import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import RequirementField from "./RequirementField";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import { COURSE_STATUS } from "../../../../../utils/constants";
import ChipInput from "./ChipInput";
import Upload from "../Upload";
import { MdArrowForwardIos } from "react-icons/md";

const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };

    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }
    getCategories();
  }, []);

  const isFormUpdated = () => {
    const currentvalues = getValues();
    if (
      currentvalues.courseTitle !== course.courseName ||
      currentvalues.courseShortDesc !== course.courseDescription ||
      currentvalues.coursePrice !== course.price ||
      currentvalues.courseTags.toString() !== course.tag.toString() ||
      currentvalues.courseBenefits !== course.whatYouWillLearn ||
      currentvalues.courseCategory._id !== course.category._id ||
      currentvalues.courseImage !== course.thumbnail ||
      currentvalues.courseRequirements.toString() !==
        course.instructions.toString()
    )
      return true;
    else return false;
  };

  // handle next button click
  const onSubmit = async (data) => {
    // const formData = new FormData();

    if (editCourse) {
      if (isFormUpdated()) {
        const currentvalues = getValues();
        const formData = new FormData();
        formData.append("courseId", course._id);
        if (currentvalues.courseTitle !== course.courseName)
          formData.append("courseName", data.courseTitle);
        if (currentvalues.courseShortDesc !== course.courseDescription)
          formData.append("courseDescription", data.courseShortDesc);
        if (currentvalues.coursePrice !== course.price)
          formData.append("price", data.coursePrice);
        if (currentvalues.courseCategory._id !== course.category._id)
          formData.append("category", data.courseCategory);
        if (currentvalues.courseBenefits !== course.whatYouWillLearn)
          formData.append("whatYouWillLearn", data.courseBenefits);
        if (
          currentvalues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          );
        }
        if (currentvalues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage);
        }
        if (currentvalues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
          dispatch(setStep(2));
          dispatch(setCourse(result));
        }
      } else {
        toast.error("No changes made so far");
      }
      return;
    }

    //create a new course
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("tag", JSON.stringify(data.courseTags));
   
    formData.append("thumbnailImage", data.courseImage);

    setLoading(true);

    const result = await addCourseDetails(formData, token);
    if (result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border border-richblack-700 bg-richblack-800 p-8 shadow-lg space-y-8"
    >
      <div>
        <label
          htmlFor="courseTitle"
          className="text-sm font-semibold text-richblack-5 mb-1 block"
        >
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
            Course Title
          </span>{" "}
          <sup className="text-pink-500">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="w-full rounded-md bg-richblack-700 px-4 py-2 text-richblack-5 focus:ring-2 focus:ring-yellow-400 shadow-sm"
        />
        {errors.courseTitle && (
          <span className="text-xs text-pink-500">
            Course Title is Required
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="courseShortDesc"
          className="text-sm font-semibold text-richblack-5 mb-1 block"
        >
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
            Course Short Description
          </span>{" "}
          <sup className="text-pink-500">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="min-h-[140px] w-full rounded-md bg-richblack-700 px-4 py-2 text-richblack-5 focus:ring-2 focus:ring-yellow-400 shadow-sm"
        />
        {errors.courseShortDesc && (
          <span className="text-xs text-pink-500">
            Course Description is required
          </span>
        )}
      </div>

      <div className="relative">
        <label
          htmlFor="coursePrice"
          className="text-sm font-semibold text-richblack-5 mb-1 block"
        >
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
            Course Price
          </span>{" "}
          <sup className="text-pink-500">*</sup>
        </label>
        <input
          id="coursePrice"
          type="number"
          placeholder="Enter Course Price"
          {...register("coursePrice", { required: true, valueAsNumber: true })}
          className="w-full rounded-md bg-richblack-700 px-4 py-2 pl-10 text-richblack-5 focus:ring-2 focus:ring-yellow-400 shadow-sm"
        />
        <HiOutlineCurrencyRupee className="absolute left-3 top-[38px] text-richblack-300" />
        {errors.coursePrice && (
          <span className="text-xs text-pink-500">
            Course Price is Required
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="courseCategory"
          className="text-sm font-semibold text-richblack-5 mb-1 block"
        >
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
            Course Category
          </span>{" "}
          <sup className="text-pink-500">*</sup>
        </label>
        <select
          id="courseCategory"
          defaultValue=""
          {...register("courseCategory", { required: true })}
          className="w-full rounded-md bg-richblack-700 px-4 py-2 text-richblack-5 focus:ring-2 focus:ring-yellow-400 shadow-sm"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories.map((category, index) => (
              <option
                key={index}
                value={category._id}
                className="text-richblack-5"
              >
                {index + 1}. {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="text-xs text-pink-500">
            Course category is required
          </span>
        )}
      </div>

      <ChipInput
        label="Tags"
        name="courseTags"
        register={register}
        errors={errors}
        setValue={setValue}
        getValue={getValues}
      />

      <Upload
        name="courseImage"
        label="Course Image"
        register={register}
        errors={errors}
        setValue={setValue}
      />

      <div>
        <label
          htmlFor="courseBenefits"
          className="text-sm font-semibold text-richblack-5 mb-1 block"
        >
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
            Benifits Of the Course
          </span>{" "}
          <sup className="text-pink-500">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter Benefits of the Course"
          {...register("courseBenefits", { required: true })}
          className="min-h-[130px] w-full rounded-md bg-richblack-700 px-4 py-2 text-richblack-5 focus:ring-2 focus:ring-yellow-400 shadow-sm"
        />
        {errors.courseBenefits && (
          <span className="text-xs text-pink-500">Benefits are required</span>
        )}
      </div>

      <RequirementField
        name="courseRequirements"
        label="Requirements / Instructions"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      <div className="flex items-center justify-between">
        {editCourse && (
          <button
            type="button"
            onClick={() => dispatch(setStep(2))}
            className="rounded-md bg-richblack-600 px-4 py-2 text-sm font-semibold text-white hover:bg-richblack-700"
          >
            Continue Without Saving
          </button>
        )}

        <button
          type="submit"
          className="rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 hover:bg-richblack-700 flex items-center"
        >
          {!editCourse ? "Next" : "Save Changes"}
          <MdArrowForwardIos />
        </button>
      </div>
    </form>
  );
};

export default CourseInformationForm;
