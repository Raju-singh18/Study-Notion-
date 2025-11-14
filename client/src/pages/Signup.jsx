import React from "react";
import signupImg from "../assets/Images/signup.png";
import Template from "../Components/core/Auth/Template";
import { useSelector } from "react-redux";
import { CircleLoader } from "react-spinners";

function Signup() {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="pt-[5rem]"> 
      {/* Prevent overlap with navbar */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4">
          <CircleLoader color="#facc15" size={80} />
        </div>
      ) : (
        <Template
          title="Join the millions learning to code with StudyNotion for free"
          description1="Build skills for today, tomorrow, and beyond."
          description2="Education to future-proof your career."
          image={signupImg}
          formType="signup"
        />
      )}
    </div>
  );
}

export default Signup;
