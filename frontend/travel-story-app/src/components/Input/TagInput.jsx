import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const addNewTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      setTags([...tags, trimmedValue]); // ✅ Add only trimmed value
      setInputValue("");  // ✅ Clear input
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // ✅ Prevent default form submit behavior
      addNewTag();
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Input Field */}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add Location"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-cyan-500 hover:bg-cyan-500 hover:text-white text-cyan-500"
          onClick={addNewTag}
        >
          <MdAdd className="text-2xl" />
        </button>
      </div>

      {/* Display Tags with Map Icon */}
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-cyan-500 text-white px-3 py-1 rounded-lg"
          >
            <GrMapLocation className="text-white text-lg" />
            <span>{tag}</span>

            <button onClick={() => removeTag(index)}>
              <MdClose className="text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
