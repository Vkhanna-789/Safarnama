import React, { useState } from "react";
import { MdAdd, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosinstance";

import { toast } from "react-toastify";
import axios from "axios";

const AddEditTravelStory = ({ storyInfo, onClose, getAllTravelStories, type }) => {
  const [story, setStory] = useState(storyInfo?.story || "");
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || "");
  const [errors, setErrors] = useState("");

  // ✅ Debugging: Log whenever an image is selected
  const handleImageChange = (file) => {
    console.log("Image selected:", file);
    setStoryImg(file);
  };

  // ✅ Image Upload Function
  const handleImageUpload = async (file) => {
    if (!file || !(file instanceof File)) {
      console.error("Invalid file type:", file);
      return "";
    }

    try {
      const formData = new FormData();
      formData.append("image", file); // ✅ Fix: Use "image" as the key

      console.log("Uploading Image...");
      const response = await axios.post("https://travel-story-app-c4qg.onrender.com/image-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Uploaded Image Response:", response.data);
      return response.data.imageUrl || ""; // ✅ Fix: Correct property name
    } catch (error) {
      console.error("Image upload error:", error);
      return "";
    }
  };


  // ✅ Handle Add or Update Story
  const [loading, setLoading] = useState(false);

const handleAddOrUpdateClick = async () => {
  if (loading) return; // Prevent multiple submissions
  setLoading(true); // Start loading

  try {
    if (type === "add") {
      await addNewTravelStory();
    } else {
      await updateTravelStory();
    }
  } catch (error) {
    console.error("Error saving story:", error);
    toast.error("An error occurred.");
  } finally {
    setLoading(false); // Stop loading
  }
};


  // ✅ Add New Travel Story
  const addNewTravelStory = async () => {
    try {
      let imageUrl = storyImg;
  
      if (storyImg instanceof File) {
        imageUrl = await handleImageUpload(storyImg);
        if (!imageUrl) {
          toast.error("Image upload failed. Please try again.");
          return;
        }
      }
  
      const postData = {
        title,
        story,
        imageUrl,
        visitedLocation,
        visitedDate: visitedDate ? new Date(visitedDate).toISOString() : null
        // Ensure correct format
      };
      
  
      const response = await axiosInstance.post("/add-travel-story", postData);
  
      console.log("API Response:", response.data); // ✅ Log actual response
  
      // ✅ Fix: Check if response contains 'message' instead of 'success'
      if (response.data && response.data.message === "Added Successfully") {
        console.log("Selected Date:", visitedDate);

        toast.success("New travel story added!");
        getAllTravelStories();
        onClose();
      } else {
        throw new Error(`Unexpected response: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      console.error("Error adding story:", error);
      toast.error(`Failed to add story: ${error.message}`);
    }
  };
  

  // ✅ Update Travel Story
  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      let imageUrl = storyImg;

      // Upload image if it's a File object
      if (storyImg && typeof storyImg === "object") {
        console.log("Uploading new image...");
        imageUrl = await handleImageUpload(storyImg);
      }

      const postData = {
        title,
        story,
        imageUrl,
        visitedLocation,
        visitedDate: visitedDate ? new Date(visitedDate).toISOString() : null, // Ensure correct format
      };
      

      const response = await axiosInstance.put(`/edit-story/${storyId}`, postData);

      if (response.data && response.data.story) {
        toast.success("Story updated successfully!");
        onClose();
        getAllTravelStories();
      }
    } catch (error) {
      console.error("Error updating story:", error);
      toast.error("Failed to update the story.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg p-6 relative max-h-[90vh] overflow-y-auto pb-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium text-slate-700">
            {type === "add" ? "Add Story" : "Update Story"}
          </h5>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300" onClick={onClose}>
            <MdClose className="text-xl text-slate-600" />
          </button>
        </div>

        {/* Title Input */}
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="input-label">Title</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Date Picker */}
        <div className="my-3">
          <label className="text-gray-600 text-sm font-medium">Add Date</label>
          <DateSelector date={visitedDate} setDate={(date) => {
    console.log("Date Selected:", date);
    setVisitedDate(date);
}} />

        </div>

        {/* Image Upload */}
        <div className="mt-5">
          <ImageSelector image={storyImg} setImage={handleImageChange} />
        </div>

        {/* Story Input */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-gray-600 text-sm font-medium">Story</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-lg mt-1 outline-none resize-none"
            placeholder="Your Story"
            rows={6}
            value={story}
            onChange={({ target }) => setStory(target.value)}
          />
        </div>

        {/* Visited Location */}
        <div className="pt-3">
          <label className="text-cyan-700 text-sm font-medium">Visited Location</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
        </div>

        {/* Buttons */}
        <div className="flex justify-end items-center p-2 rounded-lg">
          <button
            className="px-3 py-1 bg-cyan-400 text-white rounded-md flex items-center gap-1 hover:bg-cyan-500 transition"
            onClick={handleAddOrUpdateClick}
          >
            {type === "add" ? <MdAdd className="text-lg" /> : <MdUpdate className="text-lg" />}
            {type === "add" ? "Add Story" : "Update Story"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
