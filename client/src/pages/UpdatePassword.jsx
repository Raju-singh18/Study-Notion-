import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../services/operations/authAPI";
import { Link, useLocation } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { CircleLoader } from "react-spinners";

function UpdatePassword() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const { password, confirmPassword } = formData;

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmPassword, token));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-richblack-900 px-4 py-10">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <CircleLoader color="#facc15" size={80} />
        </div>
      ) : (
        <div className="w-full max-w-md rounded-xl bg-richblack-800 p-8 shadow-[0_0_15px_#00000088]">
          <h1 className="text-2xl font-semibold text-richblack-5 mb-2">
            Choose New Password
          </h1>
          <p className="text-sm text-richblack-300 mb-6">
            Almost done. Enter your new password and you are all set.
          </p>

          <form onSubmit={handleOnSubmit} className="space-y-6">
            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm text-richblack-5 mb-1">
                New Password <sup className="text-pink-200">*</sup>
              </label>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter new password"
                className="w-full rounded-md bg-richblack-700 p-3 pr-10 text-richblack-5 placeholder:text-richblack-400 focus:outline-none focus:ring focus:ring-yellow-100"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-10 cursor-pointer text-richblack-300"
              >
                {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
              </span>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label className="block text-sm text-richblack-5 mb-1">
                Confirm Password <sup className="text-pink-200">*</sup>
              </label>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm password"
                className="w-full rounded-md bg-richblack-700 p-3 pr-10 text-richblack-5 placeholder:text-richblack-400 focus:outline-none focus:ring focus:ring-yellow-100"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-10 cursor-pointer text-richblack-300"
              >
                {showConfirmPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-md bg-yellow-50 py-2 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95 hover:shadow-md"
            >
              Reset Password
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link to="/login">
              <p className="text-sm text-yellow-50 hover:underline hover:text-yellow-100 transition-all">
                Back to Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePassword;
