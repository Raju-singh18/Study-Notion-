 
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../common/IconBtn";
import { buyCourse } from "../../../../services/operations/studentFeaturesApi";
import { useNavigate } from "react-router-dom";

const RenderTotalAmout = () => {
  const { total, cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBuyCourse = () => {
    const courses = cart.map((course) => course._id);
    buyCourse(token, courses, user, navigate, dispatch);
  };

  return (
    <div className="min-w-[280px] rounded-xl border border-richblack-700 bg-richblack-800 p-6 shadow-lg sticky top-20">
      {/* Heading */}
      <p className="mb-1 text-sm font-medium text-richblack-300 uppercase tracking-wide">
        Total Amount
      </p>

      {/* Price */}
      <p className="mb-6 text-3xl font-bold text-yellow-100">
        ₹{total.toLocaleString("en-IN")}
      </p>

      {/* Divider */}
      <hr className="border-richblack-600 mb-6" />

      {/* Buy Now Button */}
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center py-3 bg-yellow-400 hover:bg-yellow-300 text-richblack-900 font-semibold text-lg rounded-lg transition-all"
      />
    </div>
  );
};

export default RenderTotalAmout;
