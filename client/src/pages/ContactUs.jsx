import React from "react";
import ContactUsForm from "../components/ContactPage/ContactUsForm";
import Footer from "../components/Common/Footer";
import ReviewSlider from "../components/Common/ReviewSlider";

const ContactUs = () => {
  const contactOptions = [
    {
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          viewBox="0 0 24 24"
          height="25"
          width="25"
        >
          <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z"></path>
          <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z"></path>
        </svg>
      ),
      title: "Chat with us",
      desc: "Our friendly team is here to help.",
      sub: "info@studynotion.com",
    },
    {
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          viewBox="0 0 24 24"
          height="25"
          width="25"
        >
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM4 12c0-.899.156-1.762.431-2.569L6 11l2 2v2l2 2 1 1v1.931C7.061 19.436 4 16.072 4 12zm14.33 4.873C17.677 16.347 16.687 16 16 16v-1a2 2 0 0 0-2-2h-4v-3a2 2 0 0 0 2-2V7h1a2 2 0 0 0 2-2v-.411C17.928 5.778 20 8.65 20 12a7.947 7.947 0 0 1-1.67 4.873z"></path>
        </svg>
      ),
      title: "Visit us",
      desc: "Come and say hello at our HQ.",
      sub: "Kushinagar Salemgarh 274409",
    },
    {
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          viewBox="0 0 512 512"
          height="25"
          width="25"
        >
          <path d="..."></path>
        </svg>
      ),
      title: "Call us",
      desc: "Mon - Fri From 8am to 5pm",
      sub: "+91 7317 781 678",
    },
  ];

  return (
    <div className="bg-richblack-900 text-white">
      {/* Contact Section */}
      <div className="mx-auto mt-20 w-11/12 max-w-maxContent flex flex-col lg:flex-row gap-10">
        {/* Left Info Section */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-br from-richblack-800 to-richblack-700 p-6 shadow-xl">
            {contactOptions.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-4 rounded-lg transition-all duration-300 hover:bg-richblack-700"
              >
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400">{item.icon}</span>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                </div>
                <p className="text-richblack-200">{item.desc}</p>
                <p className="font-semibold text-richblack-5 break-words">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full lg:w-3/5">
          <div className="rounded-2xl border border-richblack-600 bg-richblack-800/60 backdrop-blur-md p-6 sm:p-10 lg:p-14 shadow-xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug text-white">
              Got an Idea?{" "}
              <span className="text-yellow-400">We’ve got the skills.</span>{" "}
              Let’s team up.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-richblack-200">
              Tell us more about yourself and what you’ve got in mind.
            </p>
            <div className="mt-8 sm:mt-10">
              <ContactUsForm />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mx-auto my-24 w-11/12 max-w-maxContent text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold mb-6">
          What our <span className="text-yellow-400">learners</span> say
        </h1>
        <ReviewSlider />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactUs;
