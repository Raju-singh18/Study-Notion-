import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";
import { CircleLoader } from "react-spinners";

function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4 bg-richblack-900">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <CircleLoader color="#facc15" size={80} />
        </div>
      ) : (
        <div className="w-full max-w-md bg-richblack-800 p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-richblack-5">
            {!emailSent ? "Reset Your Password" : "Check Your Email"}
          </h1>
          <p className="text-sm sm:text-base text-richblack-300 mb-6 text-center leading-relaxed">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you do not have access to your email, we can try account recovery."
              : `We have sent the reset email to ${email}`}
          </p>
          <form onSubmit={handleOnSubmit} className="space-y-6">
            {!emailSent && (
              <label className="block space-y-2 w-full">
                <p className="text-sm text-richblack-5">Email Address:</p>
                <input
                  type="email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email Address"
                  className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 placeholder:text-richblack-400 border border-richblack-600 focus:outline-none focus:ring-1 focus:ring-yellow-50"
                />
              </label>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-yellow-50 py-3 text-richblack-900 font-semibold hover:bg-yellow-100 transition-all duration-200"
            >
              {!emailSent ? "Reset Password" : "Resend Email"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login">
              <p className="text-sm sm:text-base text-richblack-100 underline hover:text-yellow-50 transition-all duration-150">
                Back to Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
