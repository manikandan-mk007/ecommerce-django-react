import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;