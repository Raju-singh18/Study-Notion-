 

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FreeMode, Navigation, Autoplay, Pagination } from "swiper/modules";
import ReactStars from "react-stars";
import { ratingsEndpoints } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 20;

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );

        if (data?.success) {
          setReviews(data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchAllReviews();
  }, []);

  const truncateText = (text, numWords) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > numWords
      ? words.slice(0, numWords).join(" ") + "..."
      : text;
  };

  return (
    <div className="mx-auto my-20 w-11/12 max-w-maxContent text-center">
      <h2 className="text-3xl font-bold text-white mb-8 text-center w-11/12">
        Student Reviews
      </h2>

      <Swiper
        slidesPerView={4}
        spaceBetween={24}
        loop={reviews.length > 4}
        modules={[Autoplay, FreeMode, Pagination, Navigation]}
        pagination={{ clickable: true }}
        navigation={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 16 },
          640: { slidesPerView: 1, spaceBetween: 16 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
      >
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 w-full">
                <img
                  src={
                    review?.user?.image
                      ? review.user.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${
                          review?.user?.firstName || "User"
                        }${review?.user?.lastName || ""}`
                  }
                  alt="profile"
                  className="h-16 w-16 object-cover rounded-full mb-4 border-2 border-yellow-400"
                />
                <p className="text-white font-semibold text-lg">
                  {review?.user?.firstName || "Anonymous"}{" "}
                  {review?.user?.lastName || ""}
                </p>
                <p className="text-yellow-400 text-sm mb-2">
                  {review?.course?.courseName || "Course"}
                </p>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {truncateText(review?.review, truncateWords)}
                </p>
                <ReactStars
                  count={5}
                  value={review?.rating || 0}
                  size={24}
                  edit={false}
                  activeColor="#FFD700"
                />
                <p className="text-white font-medium mt-2">
                  {review?.rating ? review.rating.toFixed(1) : 0} / 5
                </p>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <p className="text-white text-center col-span-full">
            No reviews available
          </p>
        )}
      </Swiper>
    </div>
  );
};

export default ReviewSlider;
