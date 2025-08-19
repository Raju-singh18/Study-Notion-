 
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

  // Update rating in form state
  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating, { shouldValidate: true });
  };

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 px-4">
      <div className="bg-richblack-900 text-white rounded-lg shadow-xl w-full max-w-lg p-6 relative flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-richblack-700 pb-3">
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
        <div className="flex items-center gap-3">
          <img
            src={user?.image || "https://api.dicebear.com/5.x/initials/svg?seed=User"}
            alt="user"
            className="w-12 h-12 rounded-full object-cover border-2 border-richblack-700"
          />
          <div className="flex flex-col">
            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-richblack-300">Posting Publicly</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          
          {/* Rating Stars */}
          <div className="flex justify-center">
            <ReactStars
              count={5}
              value={watch("courseRating")}
              onChange={ratingChanged}
              size={32}
              color="#6B7280"
              activeColor="#FFD700"
              isHalf={false}
              edit={true}
            />
          </div>

          {/* Experience Textarea */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="courseExperience"
              className="font-medium"
            >
              Share Your Experience
            </label>
            <textarea
              id="courseExperience"
              placeholder="Write your experience here..."
              {...register("courseExperience", { required: true })}
              className="w-full min-h-[130px] p-3 rounded-md bg-richblack-800 border border-richblack-700 text-white resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.courseExperience && (
              <span className="text-red-400 text-sm">Please add your experience</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4 flex-wrap">
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
