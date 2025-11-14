import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmout";

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart);

  return (
    <div className="w-full flex justify-center bg-richblack-900 text-white">
      {/* Main dashboard content area */}
      <div className="w-11/12 max-w-[1000px] mx-auto py-10">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 text-center md:text-left mb-6">
          Your Cart
        </h1>

        {/* Sub-heading */}
        <p className="border-b border-richblack-600 pb-3 font-medium text-richblack-300 text-center md:text-left">
          {totalItems} {totalItems === 1 ? "Course" : "Courses"} in Cart
        </p>

        {/* Content */}
        {total > 0 ? (
          <div className="mt-8 flex flex-col-reverse gap-y-8 lg:flex-row lg:items-start lg:gap-x-10">
            {/* Left - Course List */}
            <div className="flex-1 w-full">
              <RenderCartCourses />
            </div>

            {/* Right - Summary */}
            <div className="w-full lg:w-1/3">
              <RenderTotalAmount />
            </div>
          </div>
        ) : (
          <div className="mt-14 text-center">
            <p className="text-2xl text-richblack-300 mb-6">
              Your cart is empty
            </p>
            <a
              href="/courses"
              className="inline-block px-6 py-3 bg-yellow-400 text-richblack-900 font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition-all"
            >
              Browse Courses
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
