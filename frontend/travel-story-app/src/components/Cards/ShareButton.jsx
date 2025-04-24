import React from "react";
import { Share2 } from "lucide-react"; // Icon library (install with: npm install lucide-react)

const ShareButton = ({ storyId, title, description }) => {
  const handleShare = async () => {
    const storyUrl = `${window.location.origin}/story/${storyId}`;

    const shareData = {
      title: title,
      text: description,
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
    <button
      onClick={handleShare}
      className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
    >
      <Share2 size={16} /> Share
    </button>
  );
};

export default ShareButton;
