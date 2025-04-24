import React from "react";
import moment from "moment";
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";
import { Share2 } from "lucide-react"; // Import Share icon

const TravelStoryCard = ({
  storyId,
  imageUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick,
}) => {
  const formattedDate = date ? moment(date).format("Do MMM YYYY") : "Date Unknown";

  // Share Story Function
  const handleShare = async (e) => {
    e.stopPropagation(); // Prevent card click triggering
    const storyUrl = `${window.location.origin}/story/${storyId}`;

    const shareData = {
      title: title || "Travel Story",
      text: story || "Check out this amazing travel story!",
      url: storyUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Story shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(storyUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="border rounded-lg bg-white shadow-md hover:shadow-lg transition-all cursor-pointer w-full max-w-[280px]">
      {/* Image Section */}
      <div className="relative w-full h-[180px] overflow-hidden rounded-t-lg">
        <img
          src={imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
          alt={title || "Travel Story"}
          className="w-full h-full object-cover"
          onClick={onClick}
        />

        {/* Favourite Button */}
        <button
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            onFavouriteClick();
          }}
        >
          <FaHeart className={`text-xl ${isFavourite ? "text-red-500" : "text-gray-300"}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4" onClick={onClick}>
        <h6 className="text-lg font-semibold text-gray-800 truncate">{title || "Untitled Story"}</h6>
        <span className="text-xs text-gray-500">{formattedDate}</span>

        {/* Story */}
        <p className="text-sm text-gray-600 mt-2 truncate">{story || "No Story Available..."}</p>

        {/* Visited Location */}
        {Array.isArray(visitedLocation) && visitedLocation.length > 0 ? (
          <div className="mt-3 flex items-center gap-2 text-sm text-cyan-700 bg-cyan-200/40 rounded px-3 py-1">
            <GrMapLocation />
            {visitedLocation.join(", ")}
          </div>
        ) : (
          <div className="text-xs text-gray-400 mt-3">Location not available</div>
        )}

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="mt-3 flex items-center gap-2 text-blue-600 bg-blue-100 px-3 py-1 rounded hover:bg-blue-200"
        >
          <Share2 size={16} /> Share
        </button>
      </div>
    </div>
  );
};

export default TravelStoryCard;
