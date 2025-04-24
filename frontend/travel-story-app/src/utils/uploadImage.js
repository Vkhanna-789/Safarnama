import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Local backend URL // Ensure this matches your backend

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile); // "image" must match the backend field name

  return await axios.post(`${API_BASE_URL}/image-upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default uploadImage;
