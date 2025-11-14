import React from "react";
import loginImg from "../assets/Images/login.png";
import Template from "../Components/core/Auth/Template";

function Login() {
  return (
    <div className="pt-[5rem]"> 
      {/* Top padding prevents navbar overlap */}
      <Template
        title="Welcome Back"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image={loginImg}
        formType="login"
      />
    </div>
  );
}

export default Login;
