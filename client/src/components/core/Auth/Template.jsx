import React from "react";
import { useSelector } from "react-redux";
import frameImg from "../../../assets/Images/frame.png";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div
          className="
            flex flex-col-reverse md:flex-row 
            items-center justify-center
            w-full max-w-[1200px]
            gap-10 md:gap-16
            py-10
          "
        >
          {/* ===== Left Section (Text + Form) ===== */}
          <div
            className="
              w-full md:w-1/2 
              flex flex-col items-center md:items-start 
              text-center md:text-left
            "
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-richblack-5">
              {title}
            </h1>

            <p className="mt-3 text-sm sm:text-base md:text-lg leading-relaxed max-w-[400px]">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>

            <div className="mt-8 w-full max-w-[400px]">
              {formType === "signup" ? <SignupForm /> : <LoginForm />}
            </div>
          </div>

          {/* ===== Right Section (Keep frame+image same, just center whole block) ===== */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="relative w-full max-w-[450px] flex justify-center">
              <img
                src={frameImg}
                alt="Frame pattern"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              <img
                src={image}
                alt="Main visual"
                className="absolute -top-4 right-4 w-full h-auto z-10 object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Template;
