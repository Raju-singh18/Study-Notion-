 

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GetAvgRating from "../../../utils/avgRating";
import RatingStars from "../../Common/RatingStar";

const Course_Card = ({ course, Height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <div className="transition-all duration-300 hover:scale-[1.02]">
      <Link to={`/courses/${course._id}`}>
        <div className="flex flex-col gap-3 rounded-xl border border-richblack-700 bg-richblack-800 hover:bg-richblack-900 shadow-md hover:shadow-lg p-4 h-full transition-all duration-300">
          {/* Thumbnail */}
          <div className="overflow-hidden rounded-lg">
            <img
              src={course?.thumbnail}
              alt="Course Thumbnail"
              className={`${Height} w-full object-cover rounded-lg transition-transform duration-300 hover:scale-105`}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-richblack-5 line-clamp-2">
              {course?.courseName}
            </h3>

            <p className="text-sm text-richblack-300">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>

            {/* Ratings */}
            <div className="flex items-center gap-2 text-yellow-50">
              <span className="font-bold text-richblack-5">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-xs text-richblack-400">
                ({course?.ratingAndReviews?.length || 0} Ratings)
              </span>
            </div>

            {/* Price */}
            <p className="text-lg font-bold text-yellow-50">
              ₹{course?.price}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Course_Card;


