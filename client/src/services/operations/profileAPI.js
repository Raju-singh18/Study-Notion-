import { setProgress } from "../../slices/loadingBarSlice.js";
import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../apis";
import { toast } from "react-hot-toast";
import { settingsEndpoints } from "../apis";
import { logout } from "./authAPI.js";

//getEnrolledCourses
export async function getUserCourses(token) {
  // const toastId = toast.loading("Loading...");
  // dispatch(setProgress);
  //console.log("token inside getUserCourses:",token);
  let result = [];
  try {
    //console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
    const response = await apiConnector(
      "GET",
      profileEndpoints.GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    // console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES", response);
    // console.log("GET_USER_ENROLLED_COURSES_API API RESPONSE............",response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (error) {
    //console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
    toast.error("Could Not Get Enrolled Courses");
  }
  // dispatch(setProgress(100));
  // toast.dismiss(toastId)
  return result;
}

//updateProfilePicture
export async function updatePfp(token, file) {
  const toastId = toast.loading("Uploading...");
  // console.log("token inside updatepfp:", token);
  try {
    const formData = new FormData();
    // console.log("profilePicture", file);
    formData.append("profilePicture", file);
    const response = await apiConnector(
      "PUT",
      settingsEndpoints.UPDATE_DISPLAY_PICTURE_API,
      formData,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    //console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE............",response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Profile Picture Updated Successfully");
    const imageUrl = response.data.imageUrl;
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("user")),
        image: imageUrl,
      })
    );
    //console.log(JSON.parse(localStorage.getItem("user")).image);
  } catch (error) {
   // console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
}

//updateAdditionalDetails
export async function updateAdditionalDetails(token, additionalDetails) {
  //console.log("additionalDetails", additionalDetails);
  const { firstName, lastName, dateOfBirth, gender, contactNumber, about } =
    additionalDetails;
  //console.log("additionalDetails", additionalDetails);
  const toastId = toast.loading("Updating...");
  try {
    const response = await apiConnector(
      "PUT",
      settingsEndpoints.UPDATE_PROFILE_API,
      { firstName, lastName, dateOfBirth, gender, contactNumber, about },
      {
        Authorization: `Bearer ${token}`,
      }
    );
   // console.log("UPDATE_ADDITIONAL_DETAILS_API API RESPONSE............",response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Additional Details Updated Successfully");
    const user = JSON.parse(localStorage.getItem("user"));
    const updatedUser = {
      ...user,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      additionalDetails: {
        ...user.additionalDetails,
        dateOfBirth: dateOfBirth || user.additionalDetails.dateOfBirth,
        contactNumber: contactNumber || user.additionalDetails.contactNumber,
        about: about || user.additionalDetails.about,
        gender: gender || user.additionalDetails.gender,
      },
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success("Additional details updated successfully");
  } catch (error) {
   // console.log("UPDATE_ADDITIONAL_DETAILS_API API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
}

//updatePassword
export async function updatePassword(token, password) {
  const {
    oldPassword,
    newPassword,
    confirmPassword: confirmNewPassword,
  } = password;
  //console.log("password", password);
  const toastId = toast.loading("Updating...");
  try {
    const response = await apiConnector(
      "PUT",
      settingsEndpoints.CHANGE_PASSWORD_API,
      { oldPassword, newPassword, confirmNewPassword },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    //console.log("UPDATE_PASSWORD_API API RESPONSE............", response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Password Updated Successfully");
  } catch (error) {
    //console.log("UPDATE_PASSWORD_API API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
}

//deleteAccount
export async function deleteAccount(token, dispatch, navigate) {
  const toastId = toast.loading("Deleting...");
  try {
    const response = await apiConnector(
      "DELETE",
      settingsEndpoints.DELETE_PROFILE_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
   // console.log("DELETE_ACCOUNT_API API RESPONSE............", response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Account Deleted Successfully");
    dispatch(logout(navigate));
  } catch (error) {
    //console.log("DELETE_ACCOUNT_API API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
}

//get instructor dashboard
export async function getInstructorDashboard(token, dispatch) {
  if (!token) {
  //  console.error("Authorization token is missing");
    return [];
  }

  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    //console.log("BEFORE Calling BACKEND API FOR INSTRUCTOR DASHBOARD");

    const response = await apiConnector(
      "GET",
      profileEndpoints.GET_ALL_INSTRUCTOR_DASHBOARD_DETAILS_API,
      null,
      {
        Authorization: `Bearer ${token}`, // Ensure correct header format
      }
    );

   // console.log("AFTER Calling BACKEND API FOR INSTRUCTOR DASHBOARD");
    //console.log("GET_INSTRSUTOR_API_RESPONSE:", response);

    // Check response structure safely
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch data");
    }

    result = response.data.courses || [];
   // console.log("Instructor dashboard courses:", result);
  } catch (error) {
    //console.error("GET_INSTRUCTOR_DASHBOARD_API ERROR:", error);
    toast.error(error?.message || "Could not get instructor dashboard");
  } finally {
    toast.dismiss(toastId); // Ensure toast is always dismissed
  }
  return result;
}
