 
import React, { useState } from "react";
import toast from "react-hot-toast";
import { createCategory } from "../../../../../services/operations/courseDetailsAPI";
import { useSelector } from "react-redux";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { token } = useSelector((state) => state.auth);

  // Function to create category
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      if (!name || !description) {
        toast.error("Please enter both fields");
        return;
      }

      const data = { name, description };
      const response = await createCategory(data, token);
      if (response) {
        toast.success("Category created successfully");
      }

      setName("");
      setDescription("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-richblack-900 px-4">
      <div className="w-full max-w-lg p-8 bg-richblack-800 shadow-xl rounded-2xl border border-richblack-700">
        <h2 className="text-3xl font-bold text-center mb-8 text-richblack-5">
          Create New Category
        </h2>

        {/* Title input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-richblack-200">
            Category Title
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category title"
            className="w-full px-4 py-3 rounded-lg bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          />
        </div>

        {/* Description input */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2 text-richblack-200">
            Category Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter category description"
            rows="4"
            className="w-full px-4 py-3 rounded-lg bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          />
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-richblack-900 font-bold hover:scale-105 shadow-lg transition-all duration-300"
        >
         Create Category
        </button>
      </div>
    </div>
  );
};

export default CreateCategory;
