import axios from "axios";

const api = axios.create({
  baseURL: "https://vercelserver-sand.vercel.app",
  withCredentials: false,
});

// Tambahkan token otomatis dari localStorage (Bearer)
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
