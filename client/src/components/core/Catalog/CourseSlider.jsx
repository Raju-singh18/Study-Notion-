 

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Navigation, Autoplay, Pagination } from "swiper/modules";

import Course_Card from "./Course_Card";

const CourseSlider = ({ Courses }) => {
  return (
    <>
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          loop={true}
          spaceBetween={20}
          modules={[Autoplay, FreeMode, Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          className="mySwiper px-2"
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {Courses.map((course, index) => (
            <SwiperSlide key={index} className="pb-10 flex">
              <Course_Card course={course} Height={"h-[220px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-4">No Courses Found</p>
      )}
    </>
  );
};

export default CourseSlider;
