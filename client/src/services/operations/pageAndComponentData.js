import React from "react";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { categories } from "../apis";

export const getCatalogPageData = async (categoryId) => {
  if (!categoryId || categoryId.trim() === "") {
    toast.error("Invalid Category ID");
    return { success: false, message: "Invalid category ID" };
  }

  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("POST", categories.CATEGORIESPAGE_API, {
      categoryId,
    });
   // console.log("response in getCatalogPageData", response);
    if (!response?.data?.success) {
      throw new Error("Could not Fetch Category page data");
    }

    result = response?.data;
  } catch (error) {
   // console.log("Catalog page data api error..", error);
    toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};
