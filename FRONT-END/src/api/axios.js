import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://rento-backend-gmlw.onrender.com/api",
  timeout: 20000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const currentPath = window.location.pathname;

      const authPages = [
        "/customer-login",
        "/owner-login",
        "/admin-login",
        "/customer-register",
        "/owner-register",
      ];

      if (!authPages.includes(currentPath)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    return Promise.reject(error);
  }
);

export default API;