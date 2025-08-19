import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import ReactPlayer from "react-player";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData || editData || ""
  );
  const inputRef = useRef(null);

  // Drop handler
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
    }
  };

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: video ? { "video/*": [] } : { "image/*": [] },
    onDrop,
  });

  // Preview setup
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setPreviewSource(reader.result);
  };

  // Handle "Browse" click
  const handleBrowseClick = () => {
    inputRef.current.click();
  };

  // Main fix: set file value in form
  useEffect(() => {
    if (selectedFile) {
      setValue(name, selectedFile, { shouldValidate: true });
    } else {
      setValue(name, null, { shouldValidate: true });
    }
  }, [selectedFile, name, setValue]);

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className="text-sm">
        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
          {label}
        </span>{" "}
        {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      {/* Optional hidden input for validation */}
      <input type="hidden" {...register(name, { required: true })} />

      {/* Dropzone container */}
      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } relative flex min-h-[250px] w-full cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
        onClick={(event) => {
          if (!event.target.tagName.toLowerCase() === "input") {
            event.stopPropagation();
          }
        }}
      >
        {/* Actual file input */}
        <input {...getInputProps()} ref={inputRef} />

        {/* Preview section */}
        {previewSource ? (
          <div className="w-full p-4">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <div className="w-full rounded-md overflow-hidden">
                <ReactPlayer
                  url={previewSource}
                  controls
                  width="100%"
                  height="auto"
                />
              </div>
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          // Dropzone placeholder
          <div className="flex w-full flex-col items-center p-6">
            <div
              className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800"
              onClick={handleBrowseClick}
            >
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span> a
              file
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>

      {/* Validation error */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}
