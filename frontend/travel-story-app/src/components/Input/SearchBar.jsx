import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value = "", handleSearch, onClearSearch, onChange }) => {
  return (
    <div className="flex items-center border-b border-gray-300 bg-white"> 
      <input
        type="text"
        placeholder="Search stories..."
        className="w-full text-xs bg-transparent py-[11px] outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && value.trim() !== "" && handleSearch(value)}
      />

      {value && (
        <IoMdClose
          className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3"
          onClick={onClearSearch}
        />
      )}

      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={() => value.trim() !== "" && handleSearch(value)}
      />
    </div>
  );
};

export default SearchBar;
