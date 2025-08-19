import React, { useEffect } from "react";
import OTPInput from "react-otp-input";
import { useSelector, useDispatch } from "react-redux";
import { sendOtp, verifyOtp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CircleLoader } from "react-spinners";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, signupData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!signupData?.email) {
      navigate("/signup");
    }
  }, [signupData, navigate]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    // const {email,accountType,confirmPassword,password,lastName,firstName}=signupData;

    // dispatch(signUp(
    //   accountType,
    //     firstName,
    //     lastName,
    //     email,
    //     password,
    //     confirmPassword,
    //     otp,
    //     navigate));
    dispatch(verifyOtp(otp, navigate));
  };

  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <CircleLoader color="#facc15" size={80} />
    </div>
  ) : (
    <div>
      <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
            Verify Email
          </h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleOnSubmit}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>-</span>}
              inputStyle="w-[20px] rounded-[8px] border-[1px] border-richblack-500 text-[3rem] text-center text-richblack-700"
              focusStyle="border-[5px] border-red-500"
              isInputNum={true}
              shouldAutoFocus={true}
              containerStyle="flex justify-between gap-4"
              renderInput={(props) => <input {...props} />}
            />
            <button
              type="submit"
              className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
            >
              Verify Email
            </button>
          </form>
          <div className="flex justify-between items-center">
            <div>
              <Link to="/login">
                <p>Back to Login</p>
              </Link>
            </div>

            <button
              onClick={() => dispatch(sendOtp(signupData.email, navigate))}
            >
              Resend otp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
