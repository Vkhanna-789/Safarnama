import React, { useRef, useState } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ImageSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(image || null); // Initialize with existing image if available

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setImage(file);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setImage(null);
    inputRef.current.value = ""; // Reset input value
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={handleImageChange}
      />

      {previewUrl ? (
        <div className="relative w-full h-[220px] flex justify-center items-center bg-slate-50 rounded border border-slate-200/50">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded"
          />
          <button
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
            onClick={removeImage}
          >
            <MdDeleteOutline className="text-xl" />
          </button>
        </div>
      ) : (
        <button
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
          onClick={onChooseFile}
        >
          <div>
            <FaRegFileImage className="text-3xl text-cyan-500" />
          </div>
          <p className="text-sm text-slate-500">Browse image files to upload</p>
        </button>
      )}
    </div>
  );
};

export default ImageSelector;
