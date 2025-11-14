import React from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import ReactStars from "react-stars";
import IconBtn from "../../common/IconBtn";
import { createRating } from "../../../services/operations/courseDetailsAPI";

const CourseReviewModal = ({ setReviewModal }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseExperience: "",
      courseRating: 0,
    },
  });

  const ratingChanged = (newRating) =>
    setValue("courseRating", newRating, { shouldValidate: true });

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    );
    setReviewModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 px-4">
      <div className="bg-richblack-900 text-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-richblack-700 pb-3 mb-4">
          <h2 className="text-xl font-semibold">Add Review</h2>
          <button
            type="button"
            onClick={() => setReviewModal(false)}
            className="text-2xl hover:text-red-400 transition"
          >
            <RxCross2 />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user?.image || "https://api.dicebear.com/5.x/initials/svg?seed=User"}
            alt="user"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-richblack-700"
          />
          <div>
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-richblack-300">Posting publicly</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex justify-center">
            <ReactStars
              count={5}
              value={watch("courseRating")}
              onChange={ratingChanged}
              size={28}
              color="#6B7280"
              activeColor="#FFD700"
            />
          </div>

          <div>
            <label htmlFor="courseExperience" className="block font-medium mb-1">
              Share your experience
            </label>
            <textarea
              id="courseExperience"
              placeholder="Write your experience here..."
              {...register("courseExperience", { required: true })}
              className="w-full min-h-[120px] p-3 rounded-md bg-richblack-800 border border-richblack-700 focus:ring-2 focus:ring-yellow-400"
            />
            {errors.courseExperience && (
              <span className="text-red-400 text-sm">
                Please add your experience
              </span>
            )}
          </div>

          <div className="flex flex-wrap justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setReviewModal(false)}
              className="px-4 py-2 rounded-md border border-richblack-700 hover:bg-richblack-800 transition text-white"
            >
              Cancel
            </button>
            <IconBtn
              type="submit"
              text="Save"
              customClasses="bg-yellow-50 text-black px-4 py-2 rounded-md hover:bg-yellow-100 transition"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseReviewModal;
