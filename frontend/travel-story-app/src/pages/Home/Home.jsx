import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import Navbar from "../../components/Navbar";
import TravelStoryCard from "../../components/Cards/TavelStoryCard";
import { MdAdd } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import AddEditTravelStory from "../Home/AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory"; // ✅ Import ViewTravelStory
import EmptyCard from "../../components/Cards/EmptyCard";
import EmptyImg from "../../assets/images/icons8-story-book-96.svg";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });


  //

  const getEmptyCardMessage = () => {
    return "No travel stories available! Start Creating your first Travel Story! Click the 'ADD' button to jot down your thoughts, ideas, and memories. Let's get started!";
  };

  // Add/Edit Modal State
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  // View Story Modal State
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  useEffect(() => {
    Modal.setAppElement("#root");
    getAllTravelStories();
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) setUserInfo(response.data.user);
    } catch (error) {
      console.error("User Info Error:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (Array.isArray(response.data.stories)) {
        setAllStories(response.data.stories);
      } else {
        setAllStories([]);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const updateIsFavourite = async (storyData) => {
    try {
      const response = await axiosInstance.put(`/update-is-favourite/${storyData._id}`, {
        isFavourite: !storyData.isFavourite,
      });

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");

        if (filterType === "search" && searchQuery) {
          onSearchStory(searchQuery);
        } else if (filterType === "date") {
          filterStoriesByDate(dateRange);
        } else {
          getAllTravelStories();
        }
      }

    } catch (error) {
      console.error("Error updating favorite:", error);
      toast.error("Failed to update favorite status.");
    }
  };

  // ✅ Open View Modal when a story is clicked
  const handleViewStory = (data) => setOpenViewModal({ isShown: true, data });

  const handleDelete = async (data) => {
    try {
      await axiosInstance.delete(`/delete-story/${data._id}`);
      toast.success("Story deleted successfully");
      setOpenViewModal({ isShown: false, data: null }); // Close modal
      getAllTravelStories();
    } catch (error) {
      console.error("Delete story error:", error);
      toast.error("Failed to delete story");
    }
  };
  //search
  const onSearchStory = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await axiosInstance.get("/search", { params: { query: searchQuery } });
      if (response.data?.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      } else {
        setAllStories([]);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  }
  //handle filter story date by date
  const filterStoriesByDate = async (day) => {
    try {
      if (!day?.from || !day?.to) return; // ✅ Check for null/undefined

      const startDate = moment(day.from).startOf("day").toISOString();
      const endDate = moment(day.to).endOf("day").toISOString();

      const response = await axiosInstance.get("/travel-stories/filter", {
        params: { startDate, endDate },
      });

      if (response.data?.stories) {
        setFilterType("date");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("Error filtering stories by date:", error);
    }
  };


  //handele date range
  const handleDayClick = (range) => {
    setDateRange(range); // ✅ Correctly updating state
    filterStoriesByDate(range); // ✅ Filtering stories
  };

  const resetFilter = () => {
    setSearchQuery(""); // ✅ Clears input
    setDateRange({ from: null, to: null });
    getAllTravelStories();
  };

  return (
    <>
      <Navbar
        userInfo={userInfo || {}}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory} // Ensure this function is correctly passed
        handleClearSearch={resetFilter}
      />

      {/* ✅ View Story Modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => setOpenViewModal({ isShown: false, data: null })}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 999 } }}
        className="modal-box shadow-lg rounded-lg p-6 bg-white"
      >
        {openViewModal.isShown && (
          <ViewTravelStory
            setOpenViewModal={setOpenViewModal}
            setOpenAddEditModal={setOpenAddEditModal} // ✅ Pass this prop
            storyInfo={openViewModal.data}
            onClose={() => setOpenViewModal({ isShown: false, data: null })}
            onDeleteClick={() => handleDelete(openViewModal.data)}
          />
        )}
      </Modal>

      {/* ✅ Add/Edit Story Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 999 } }}
        className="modal-box shadow-lg rounded-lg p-6 bg-white"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* Floating Add Button */}
      <button
        className="w-14 h-14 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-4 bottom-20 sm:right-3 sm:bottom-16 shadow-xl transition-transform transform hover:scale-110"
        style={{ zIndex: 1000 }}
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
          getAllTravelStories(); // Refresh stories after adding
        }}
      >
        <MdAdd className="text-[28px] text-white" />
      </button>


      <div className="flex flex-col lg:flex-row gap-6 px-6 pb-6">
        {/* Left Side - Date Picker */}
        <div className="w-full lg:w-[350px]">
          <div className="bg-white border border-slate-200 shadow-md rounded-lg p-4">
            <DayPicker
              captionLayout="dropdown-buttons"
              mode="range"
              selected={dateRange}
              onSelect={handleDayClick}
              pagedNavigation
            />
          </div>
        </div>

        {/* Right Side - Travel Stories */}
        <div className="flex-1">
          {allStories.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500 text-lg">
              <EmptyCard imgSrc={EmptyImg} message={getEmptyCardMessage()} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {allStories.map((story, index) => (
                <TravelStoryCard
                  key={index}
                  imageUrl={story.imageUrl?.trim() ? story.imageUrl : "https://via.placeholder.com/150"}
                  title={story.title || "Untitled"}
                  date={story.visitedDate}  // ✅ Fixed
                  story={story.story || "No description available"}
                  visitedLocation={story.visitedLocation || "Unknown Location"}
                  isFavourite={story.isFavourite}
                  onFavouriteClick={() => updateIsFavourite(story)}
                  onClick={() => handleViewStory(story)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Home;
