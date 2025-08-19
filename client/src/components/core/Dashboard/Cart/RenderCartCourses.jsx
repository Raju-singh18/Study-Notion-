 
import React from "react";
import { GiNinjaStar } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeFromCart } from "../../../../slices/cartSlice";
import ReactStars from "../../../Common/RatingStar";

const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="w-full overflow-x-auto">
      {/* Table Header (desktop only) */}
      <div className="hidden sm:grid grid-cols-[4fr,1.2fr,1.2fr,1.2fr] gap-4 bg-richblack-800 px-6 py-4 text-richblack-200 font-semibold text-sm uppercase tracking-wide">
        <div>Course</div>
        <div className="text-center">Category</div>
        <div className="text-center">Ratings</div>
        <div className="text-right">Price</div>
      </div>

      {/* Table Body */}
      {cart.length > 0 ? (
        cart.map((course, index) => (
          <React.Fragment key={course._id}>
            <div className="flex flex-col sm:grid sm:grid-cols-[4fr,1.2fr,1.2fr,1.2fr] gap-4 px-4 sm:px-6 py-4 items-center hover:bg-richblack-800 transition-all duration-300">
              {/* Course Thumbnail + Name */}
              <div className="flex items-start gap-4 w-full">
                <img
                  src={course?.thumbnail}
                  alt={course?.courseName}
                  className="h-[75px] w-[120px] flex-shrink-0 rounded-lg object-cover border border-richblack-700"
                />
                <div className="flex-1">
                  <p className="text-richblack-5 font-semibold leading-snug break-words">
                    {course?.courseName}
                  </p>
                  <p className="text-richblack-300 text-xs mt-1">
                    {course?.category?.name}
                  </p>
                </div>
              </div>

              {/* Category (Desktop only) */}
              <div className="hidden sm:block text-center text-richblack-300 break-words">
                {course?.category?.name}
              </div>

              {/* Ratings */}
              <div className="flex justify-center items-center gap-2 w-full sm:w-auto flex-wrap">
                <span className="text-richblack-5 font-medium">4.8</span>
                <ReactStars
                  count={5}
                  size={16}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<GiNinjaStar />}
                  fullIcon={<GiNinjaStar />}
                />
                <span className="text-xs text-richblack-200">
                  ({course?.ratingAndReviews?.length || 0})
                </span>
              </div>

              {/* Price + Remove */}
              <div className="flex justify-between sm:justify-end items-center gap-5 w-full sm:w-auto flex-wrap">
                <span className="text-yellow-50 font-semibold whitespace-nowrap text-lg">
                  ₹ {course?.price}
                </span>
                <button
                  onClick={() => dispatch(removeFromCart(course._id))}
                  className="flex items-center gap-2 px-3 py-1 rounded-md bg-pink-400/10 text-pink-300 hover:bg-pink-400/20 hover:text-pink-200 transition-all duration-200"
                >
                  <RiDeleteBin6Line size={18} />
                  <span className="text-sm">Remove</span>
                </button>
              </div>
            </div>

            {/* Divider between rows */}
            {index !== cart.length - 1 && (
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-richblack-700 to-transparent"></div>
            )}
          </React.Fragment>
        ))
      ) : (
        <div className="px-6 py-4 text-center text-richblack-300">
          Your cart is empty.
        </div>
      )}
    </div>
  );
};

export default RenderCartCourses;


