import React, { useState } from "react";
import ProfileInfo from "./Cards/ProfileInfo";
import LOGO from "../assets/images/TRAVEL-STORIES-LOGO.svg";
import { useNavigate } from "react-router-dom";
import SearchBar from "./Input/SearchBar";
import { Menu, X } from "lucide-react"; // Icons for mobile menu

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // For mobile search

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      onSearchNote(searchQuery);
    }
  };

  // Handle clearing search input
  const onClearSearch = () => {
    setSearchQuery(""); // ✅ Clear search input
    handleClearSearch(); // ✅ Reset stories to default
  };

  return (
    <div className="bg-white flex items-center justify-between px-4 md:px-6 py-2 shadow-md sticky top-0 z-10">
      {/* Logo */}
      <img src={LOGO} alt="travel story" className="h-8 md:h-9" />

      {isToken && (
        <>
          {/* Mobile Search Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 justify-center">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
            />
          </div>

          {/* Profile Info */}
          <div className="hidden md:block">
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </div>

          {/* Mobile Dropdown Menu */}
          {isSearchOpen && (
            <div className="absolute top-14 left-0 w-full bg-white p-4 shadow-md md:hidden">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
              />
            </div>
          )}

          {/* Mobile Profile Dropdown */}
          <div className="md:hidden">
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
