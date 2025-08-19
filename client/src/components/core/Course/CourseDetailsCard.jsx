 
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdArrowRight } from "react-icons/md";
import { FaRegShareFromSquare } from "react-icons/fa6";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";

const CourseDetailsCard = ({ course, setConfirmationModal, handleBuyCourse }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { thumbnail, price, studentsEnrolled, instructions } = course;

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an instructor, you cannot buy a course");
      return;
    }

    if (token) {
      dispatch(addToCart(course));
      toast.success("Course added to cart");
      return;
    }

    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please login to add to cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-2xl p-6 flex flex-col gap-6 w-full">
      {/* Thumbnail */}
      <img
        src={thumbnail}
        alt="courseCardImage"
        className="w-full h-48 object-cover rounded-xl shadow-md"
      />

      {/* Price */}
      <div className="text-yellow-400 font-bold text-2xl">Rs. {price}</div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={
            user && studentsEnrolled?.includes(user?._id)
              ? () => navigate("/dashboard/enrolled-courses")
              : handleBuyCourse
          }
          className="bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 transition"
        >
          {user && studentsEnrolled?.includes(user?._id)
            ? "Go to Course"
            : "Buy Now"}
        </button>

        {!studentsEnrolled?.includes(user?._id) && (
          <button
            onClick={handleAddToCart}
            className="bg-gray-700 text-yellow-400 font-semibold py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Add to Cart
          </button>
        )}
      </div>

      {/* Guarantee & Instructions */}
      <div className="bg-gray-800 p-4 rounded-lg flex flex-col gap-3 text-gray-300 text-sm">
        <p className="font-medium text-yellow-400">30-Day Money-Back Guarantee</p>
        <p className="font-medium">This course includes:</p>
        <div className="flex flex-col gap-2">
          {instructions?.map((item, index) => (
            <p key={index} className="flex items-center gap-2">
              <MdArrowRight className="text-yellow-400" />
              <span>{item}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Share Button */}
      <div className="flex justify-center mt-2">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-gray-200"
        >
          <FaRegShareFromSquare />
          Share
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsCard;
