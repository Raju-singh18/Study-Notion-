import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiConnector";
import { contactusEndpoint } from "../../services/apis";
import CountryCode from "../../data/countrycode.json";
import toast from "react-hot-toast";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    // console.log("Logging Data", data);
    try {
      setLoading(true);
      const response = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      );
      if (response.data.success) {
        toast.success("Your message has been sent successfully");
        // console.log("Logging response", response);
      } else {
        console.error(response.data.message);
      }

      setLoading(false);
    } catch (error) {
      console.log("Error:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form
      onSubmit={handleSubmit(submitContactForm)}
      className="flex flex-col gap-6 w-full max-w-[600px] text-richblack-5"
    >
      {/* Name */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label htmlFor="firstname" className="mb-1 text-sm font-medium">
            First Name <sup className="text-pink-500">*</sup>
          </label>
          <input
            type="text"
            id="firstname"
            placeholder="Enter first name"
            className="rounded-lg bg-richblack-800 p-3 text-richblack-5 border border-richblack-600 focus:outline-yellow-50"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="mt-1 text-xs text-pink-500">
              Please enter your first name
            </span>
          )}
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="lastname" className="mb-1 text-sm font-medium">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="Enter last name"
            className="rounded-lg bg-richblack-800 p-3 text-richblack-5 border border-richblack-600 focus:outline-yellow-50"
            {...register("lastname")}
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 text-sm font-medium">
          Email Address <sup className="text-pink-500">*</sup>
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          className="rounded-lg bg-richblack-800 p-3 text-richblack-5 border border-richblack-600 focus:outline-yellow-50"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="mt-1 text-xs text-pink-500">
            Please enter your email address
          </span>
        )}
      </div>

      {/* Phone Number */}
      <div className="flex flex-col">
        <label htmlFor="phonenumber" className="mb-1 text-sm font-medium">
          Phone Number <sup className="text-pink-500">*</sup>
        </label>
        <div className="flex flex-row gap-3">
          {/* Country Code Dropdown */}
          <select
            id="dropdown"
            className="rounded-lg bg-richblack-800 p-3 text-richblack-5 border border-richblack-600 focus:outline-yellow-50 w-[90px]"
            {...register("countrycode", { required: true })}
          >
            {CountryCode.map((element, index) => (
              <option key={index} value={element.code}>
                {element.code} - {element.country}
              </option>
            ))}
          </select>

          {/* Phone Number Input */}
          <input
            type="number"
            id="phonenumber"
            placeholder="12345 67890"
            className="w-full rounded-lg bg-richblack-800 p-3 text-richblack-5 border border-richblack-600 focus:outline-yellow-50"
            {...register("phoneNo", {
              required: { value: true, message: "Please enter phone number" },
              maxLength: { value: 10, message: "Invalid phone number" },
              minLength: { value: 8, message: "Invalid phone number" },
            })}
          />
        </div>
        {errors.phoneNo && (
          <span className="mt-1 text-xs text-pink-500">
            {errors.phoneNo.message}
          </span>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col">
        <label htmlFor="message" className="mb-1 text-sm font-medium">
          Message <sup className="text-pink-500">*</sup>
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="Enter your message here"
          className="rounded-lg bg-richblack-800 p-3 text-richblack-5 border border-richblack-600 focus:outline-yellow-50 resize-none"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="mt-1 text-xs text-pink-500">
            Please enter your message
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-lg bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 hover:scale-95 transition-all duration-200"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactUsForm;
