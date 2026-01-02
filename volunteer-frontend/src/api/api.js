import axios from "axios";

// This will use your live Render URL. 
// Tip: In the future, you can use process.env.VITE_API_URL for even more flexibility!
const API_BASE_URL = "https://volunteer-management.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;