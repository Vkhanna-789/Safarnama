import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",  // ✅ Ensure correct backend URL
  withCredentials: true, // ✅ Ensures cookies & authentication headers are included
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // ✅ Decode token safely
        const tokenPayload = JSON.parse(atob(token.split(".")[1] || ""));
        const expirationTime = tokenPayload.exp * 1000;
        const currentTime = Date.now();

        if (currentTime > expirationTime) {
          console.warn("⚠️ Token expired, removing it.");
          localStorage.removeItem("token");
          return Promise.reject(new Error("Token expired"));
        }

        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("❌ Invalid token format, removing it.");
        localStorage.removeItem("token");
      }
    } else {
      console.warn("⚠️ No token found! Requests may fail.");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle token expiration & unauthorized access
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("⚠️ Unauthorized! Redirecting to login.");
        localStorage.removeItem("token");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login"; // ✅ Redirect only if not already on login page
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
