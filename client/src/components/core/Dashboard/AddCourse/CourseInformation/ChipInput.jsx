import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

const ChipInput = ({ name, label, register, errors, setValue }) => {
  const [tags, setTags] = useState([]);
  const { editCourse, course } = useSelector((state) => state.course);

  useEffect(() => {
    register(name, {
      required: true,
    });
    if (editCourse) {
      const parsedTags = JSON.parse(course?.tag);
      setTags(parsedTags);
      setValue(name, parsedTags);
    }
  }, []);

  const handleDeleteTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
    setValue(name, updatedTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !tags.includes(value)) {
        const updatedTags = [...tags, value];
        setTags(updatedTags);
        setValue(name, updatedTags);
        e.target.value = "";
      }
    }
  };

  return (
    <div className="my-4">
      <label htmlFor={name} className="text-sm text-richblack-5 block mb-1">
        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
          {label}
        </span>{" "}
        <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-sm text-richblack-800 shadow hover:shadow-md transition-all"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleDeleteTag(index)}
              className="text-richblack-800 hover:text-pink-500"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        id={name}
        placeholder="Press Enter or , to add a tag"
        onKeyDown={handleKeyDown}
        className="form-style w-full border border-richblack-600 bg-richblack-800 p-2 rounded-md text-richblack-5 placeholder:text-richblack-400 shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      {errors[name] && (
        <p className="mt-1 text-xs text-pink-200">Tags are required</p>
      )}
    </div>
  );
};

export default ChipInput;
