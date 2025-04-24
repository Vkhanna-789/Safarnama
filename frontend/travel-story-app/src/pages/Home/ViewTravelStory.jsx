import React, { useEffect, useState } from "react";
import { GrMapLocation } from "react-icons/gr";
import { MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import moment from "moment";
import Comments from "../../components/Comments.jsx";
import AddComment from "../../components/AddComment.jsx";

const ViewTravelStory = ({ setOpenViewModal, setOpenAddEditModal, storyInfo, onClose, onDeleteClick }) => {
  const [comments, setComments] = useState([]);
const BASE_URL = "https://travel-story-app-c4qg.onrender.com"; // Deployed backend
  useEffect(() => {
    console.log("Story ID before fetching comments:", storyInfo?._id);

    if (!storyInfo?._id) {
      console.warn("Story ID is undefined, skipping fetch.");
      return;
    }

    fetch(`https://travel-story-app-c4qg.onrender.com/stories/${storyInfo._id}/comments`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setComments(data))
      .catch((err) => console.error("Error fetching comments:", err));
  }, [storyInfo?._id]); // ✅ Corrected dependency array

  return (
    <div className="overlay" onClick={onClose}>
      <div className="model-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-slate-950">
            {storyInfo?.title || "No Title"}
          </h1>
          <button className="btn-small" onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex flex-col gap-2 py-4">
          <span className="text-xs text-slate-500">
            {storyInfo?.visitedDate
              ? moment(storyInfo.visitedDate).format("Do MMM YYYY")
              : "Unknown Date"}
          </span>

          {/* Location */}
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1">
              <GrMapLocation className="text-sm" />
              {Array.isArray(storyInfo?.visitedLocation)
                ? storyInfo.visitedLocation.join(", ")
                : "Unknown Location"}
            </div>
          </div>

          

<img
  src={storyInfo?.imageUrl?.trim() ? `${BASE_URL}/uploads/${storyInfo.imageUrl}` : "https://via.placeholder.com/150"}
  alt="Travel Story"
  className="w-full h-[300px] object-cover rounded-lg"
/>


          {/* Story Text */}
          <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line mt-4">
            {storyInfo?.story || "No story available."}
          </p>

          {/* ✅ Comments Section */}
          {/* ✅ Comments Section */}
<div className="mt-4">
  <h2 className="text-lg font-semibold">Comments</h2>
  {storyInfo?._id && <Comments storyId={storyInfo._id} />}
  
  {/* ✅ Fix: Use 'fullName' instead of 'username' */}
  {/* <strong>User:</strong> {comment?.userId?.username || comment?.userId?.email || "Unknown User"} */}
  
  <AddComment storyId={storyInfo._id} setComments={setComments} />
</div>

        </div>

        {/* Modal Footer - Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="btn-small flex items-center gap-1 px-3 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
            onClick={() => {
              setOpenViewModal({ isShown: false, data: null }); // Close View Story Modal
              setOpenAddEditModal({ isShown: true, type: "edit", data: storyInfo }); // Open Update Story Modal
            }}
          >
            <MdUpdate className="text-lg" /> Update Story
          </button>

          <button
            className="btn-delete flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onDeleteClick}
          >
            <MdDeleteOutline className="text-lg" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTravelStory;
