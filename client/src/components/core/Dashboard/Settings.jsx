import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateAdditionalDetails,
  updatePassword,
  updatePfp,
  deleteAccount,
} from "../../../services/operations/profileAPI";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  // Profile Picture
  const [profilePicture, setProfilePicture] = useState(user?.image || "");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(URL.createObjectURL(file));
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    updatePfp(token, file);
  };

  // Additional Info
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
    gender: user?.additionalDetails?.gender || "",
    contactNumber: user?.additionalDetails?.contactNumber || "",
    about: user?.additionalDetails?.about || "",
  });

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
      gender: user?.additionalDetails?.gender || "",
      contactNumber: user?.additionalDetails?.contactNumber || "",
      about: user?.additionalDetails?.about || "",
    });
  }, [user]);

  const handleOnChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSaveDetails = (e) => {
    e.preventDefault();
    updateAdditionalDetails(token, formData);
  };

  // Password Update
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) =>
    setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.newPassword === password.confirmPassword) {
      updatePassword(token, password);
    } else {
      alert("Passwords do not match");
    }
  };

  // Delete Account
  const onDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      deleteAccount(token, dispatch, navigate);
    }
  };

  return (
    <div className="w-full flex justify-center bg-richblack-900 text-richblack-5">
      <div className="w-11/12 max-w-[1000px] mx-auto py-10">
        <h1 className="mb-10 text-3xl font-semibold text-yellow-400 text-center md:text-left">
          Edit Profile
        </h1>

       
        {/* update profile picture */}
        <div className="flex flex-col md:flex-row items-center justify-between rounded-md border border-richblack-700 bg-richblack-800 p-4 md:p-8 text-richblack-5 gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <img
              className="aspect-square w-[78px] rounded-full object-cover"
              src={profilePicture}
              alt="Profile"
            />

            <div className="space-y-2 w-full md:w-auto">
              <p className="font-medium text-richblack-5">
                Change Profile Picture
              </p>
              <form
                onSubmit={handleUpload}
                className="flex flex-wrap items-center gap-3 w-full"
              >
                <label
                  htmlFor="upload"
                  className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 hover:bg-richblack-600 transition-all duration-300"
                >
                  Select
                  <input
                    id="upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/gif, image/jpeg"
                  />
                </label>

                <button
                  type="submit"
                  className="bg-yellow-50 text-richblack-900 rounded-md py-2 px-5 font-semibold shadow-md hover:bg-yellow-100 hover:scale-[1.02] transition-all duration-300"
                >
                  Upload
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <form
          onSubmit={handleSaveDetails}
          className="my-10 rounded-2xl border border-richblack-700 bg-richblack-800 p-6 md:p-10"
        >
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-richblack-50">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleOnChange}
                placeholder="Enter first name"
                className="w-full rounded-md border border-richblack-600 bg-richblack-700 p-3 mt-1 focus:border-yellow-200 focus:ring-1 focus:ring-yellow-200"
              />
            </div>
            <div>
              <label className="text-richblack-50">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleOnChange}
                placeholder="Enter last name"
                className="w-full rounded-md border border-richblack-600 bg-richblack-700 p-3 mt-1 focus:border-yellow-200 focus:ring-1 focus:ring-yellow-200"
              />
            </div>
            <div>
              <label className="text-richblack-50">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleOnChange}
                className="w-full rounded-md border border-richblack-600 bg-richblack-700 p-3 mt-1 focus:border-yellow-200 focus:ring-1 focus:ring-yellow-200"
              />
            </div>
            <div>
              <label className="text-richblack-50">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleOnChange}
                className="w-full rounded-md border border-richblack-600 bg-richblack-700 p-3 mt-1 focus:border-yellow-200 focus:ring-1 focus:ring-yellow-200"
              >
                <option value="">Select Gender</option>
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
              </select>
            </div>
            <div>
              <label className="text-richblack-50">Contact Number</label>
              <input
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleOnChange}
                placeholder="Enter contact number"
                className="w-full rounded-md border border-richblack-600 bg-richblack-700 p-3 mt-1 focus:border-yellow-200 focus:ring-1 focus:ring-yellow-200"
              />
            </div>
            <div>
              <label className="text-richblack-50">About</label>
              <input
                name="about"
                value={formData.about}
                onChange={handleOnChange}
                placeholder="Write about yourself"
                className="w-full rounded-md border border-richblack-600 bg-richblack-700 p-3 mt-1 focus:border-yellow-200 focus:ring-1 focus:ring-yellow-200"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-yellow-50 text-richblack-900 rounded-md py-2 px-6 font-semibold shadow hover:bg-yellow-100 transition-all"
            >
              Save
            </button>
          </div>
        </form>

        {/* Password Update */}
        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 md:p-10"
        >
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>

          {["oldPassword", "newPassword", "confirmPassword"].map((field, i) => (
            <div key={field} className="relative mt-4">
              <label className="text-richblack-50 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                required
                type={
                  i === 0
                    ? showPassword
                      ? "text"
                      : "password"
                    : showConfirmPassword
                    ? "text"
                    : "password"
                }
                name={field}
                value={password[field]}
                onChange={handlePasswordChange}
                placeholder={`Enter ${field}`}
                className="w-full rounded-md bg-richblack-700 p-3 pr-12 mt-1 focus:border-yellow-200 focus:ring-1 focus:ring-yellow-200"
              />
              <span
                onClick={() =>
                  i === 0
                    ? setShowPassword((prev) => !prev)
                    : setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-3 top-10 cursor-pointer"
              >
                {i === 0 ? (
                  showPassword ? (
                    <AiOutlineEyeInvisible size={22} />
                  ) : (
                    <AiOutlineEye size={22} />
                  )
                ) : showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </span>
            </div>
          ))}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-yellow-50 text-richblack-900 rounded-md py-2 px-6 font-semibold shadow hover:bg-yellow-100 transition-all"
            >
              Update Password
            </button>
          </div>
        </form>

        {/* Delete Account */}
        <div className="my-10 flex flex-col md:flex-row items-start gap-5 rounded-md border border-pink-700 bg-pink-900 p-6 md:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-700">
            <svg
              onClick={onDeleteAccount}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="text-pink-200 h-6 w-6 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h12M9 6V4h6v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6z"
              />
            </svg>
          </div>
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold">Delete Account</h2>
            <p className="text-pink-200">
              Deleting your account will permanently remove all your courses and
              data.
            </p>
            <button
              onClick={onDeleteAccount}
              className="text-pink-300 italic hover:text-pink-100 transition-all"
            >
              I want to delete my account.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
