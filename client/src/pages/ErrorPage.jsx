import React from "react";
import { useNavigate, Link } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-richblack-900 flex flex-col items-center justify-center px-4 text-center text-white">
      <img
        src="https://cdn.dribbble.com/users/722246/screenshots/3066818/404-page.gif"
        alt="404 Not Found"
        className="w-[400px] max-w-full"
      />
      <h1 className="text-4xl font-bold mt-6 text-richblack-5">
        Oops! Page Not Found
      </h1>
      <p className="text-richblack-200 mt-2 text-lg max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <Link
          to="/"
          className="bg-yellow-400 text-black px-6 py-2 rounded-md font-semibold hover:bg-yellow-500 transition"
        >
          ⬅ Go to Home
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="bg-richblack-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-richblack-600 transition"
        >
          ⬅ Back
        </button>
      </div>
    </section>
  );
};

export default ErrorPage;
