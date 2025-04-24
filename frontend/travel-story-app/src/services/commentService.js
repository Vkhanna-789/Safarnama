import axios from "axios";

const API_BASE_URL = "https://travel-story-app-c4qg.onrender.com";

const commentService = {
  getComments: async (storyId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-comments?storyId=${storyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  addComment: async (storyId, text, token) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/add-comment`,
        { storyId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.comment;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  editComment: async (commentId, text, token) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/edit-comment/${commentId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.comment;
    } catch (error) {
      console.error("Error editing comment:", error);
      throw error;
    }
  },

  deleteComment: async (commentId, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete-comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },
};

export default commentService;
