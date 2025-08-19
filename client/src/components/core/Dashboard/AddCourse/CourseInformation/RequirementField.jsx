import React, { useEffect, useState } from "react";

const RequirementField = ({ name, label, register, errors, setValue }) => {
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);

  const handleAddRequirement = () => {
    if (requirement.trim()) {
      setRequirementList([...requirementList, requirement.trim()]);
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    const updatedList = [...requirementList];
    updatedList.splice(index, 1);
    setRequirementList(updatedList);
  };

  useEffect(() => {
    register(name, {
      required: true,
    });
  }, []);

  useEffect(() => {
    setValue(name, requirementList);
  }, [requirementList]);

  return (
    <div className="my-4">
      <label htmlFor={name} className="text-sm block mb-1">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                 {label}
              </span>{" "} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="w-full border border-richblack-600 bg-richblack-800 p-2 rounded-md text-richblack-5 placeholder:text-richblack-400 shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Enter requirement"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="px-3 py-2 bg-yellow-400 text-richblack-900 font-semibold rounded-md shadow hover:shadow-md hover:bg-yellow-300 transition-all"
        >
          Add
        </button>
      </div>

      {requirementList.length > 0 && (
        <ul className="list-disc ml-5 text-richblack-200 space-y-1">
          {requirementList.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="text-xs text-pink-200 hover:text-pink-400"
              >
                Remove
              </button>
            </li> 
          ))}
        </ul>
      )}

      {errors[name] && (
        <p className="mt-1 text-xs text-pink-200">{label} is required</p>
      )}
    </div>
  );
};

export default RequirementField;
