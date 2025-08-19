import signupImg from "../assets/Images/signup.png";
import Template from "../Components/core/Auth/Template";
import { useSelector } from "react-redux";
import { CircleLoader } from "react-spinners";

function Signup() {
  const { loading } = useSelector((state) => state.auth);
  return loading ? (
    <div className="flex items-center justify-center h-screen">
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
  );
}

export default Signup;
