import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[1000px] mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-3xl font-medium text-richblack-5 text-center sm:text-left">
        My Profile
      </h1>

      {/* Section 1: Basic Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-0 rounded-md border border-richblack-700 bg-richblack-800 p-6 md:p-8">
        <div className="flex items-center gap-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="w-[78px] h-[78px] rounded-full object-cover"
          />
          <div className="flex flex-col gap-1 break-words">
            <p className="text-lg font-semibold text-richblack-5">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs md:text-sm text-richblack-300 max-w-[220px] md:max-w-full break-words">
              {user?.email}
            </p>
          </div>
        </div>
        <div>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          />
        </div>
      </div>

      {/* Section 2: About */}
      {/* <div className="mt-8 flex flex-col md:flex-row justify-between rounded-md border border-richblack-700 bg-richblack-800 p-6 md:p-8">
        <div className="flex items-center justify-between w-full">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          />
        </div>
        <p className="mt-4 md:mt-2 text-sm text-richblack-400 font-medium">
          {user?.additionalDetails?.about ?? "Write something about yourself"}
        </p>
      </div> */}
      <div className="mt-8 rounded-md border border-richblack-700 bg-richblack-800 p-6 md:p-8">
  {/* Header Row */}
  <div className="flex items-center justify-between w-full">
    <p className="text-lg font-semibold text-richblack-5">About</p>
    <IconBtn
      text="Edit"
      onclick={() => navigate("/dashboard/settings")}
    />
  </div>

  {/* About Text */}
  <p className="mt-4 text-sm text-richblack-400 font-medium">
    {user?.additionalDetails?.about ?? "Write something about yourself"}
  </p>
</div>


      {/* Section 3: Personal Details */}
      <div className="mt-8 flex flex-col gap-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-richblack-100 mb-1">First Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="text-sm text-richblack-100 mb-1">Email</p>
              <p className="text-sm font-medium text-richblack-5 break-words">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-richblack-100 mb-1">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-richblack-100 mb-1">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-richblack-100 mb-1">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ??
                  "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="text-sm text-richblack-100 mb-1">Date of Birth</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
