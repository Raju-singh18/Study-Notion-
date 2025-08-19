 
import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmout";

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart);

  return (
    <div className="min-h-screen w-full bg-richblack-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="mb-6 text-4xl font-bold text-white">Your Cart</h1>

        {/* Sub-heading */}
        <p className="border-b border-richblack-600 pb-3 font-medium text-richblack-300">
          {totalItems} {totalItems === 1 ? "Course" : "Courses"} in Cart
        </p>

        {total > 0 ? (
          <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-8 lg:flex-row">
            {/* Left - Course List */}
            <div className="flex-1 space-y-6">
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
