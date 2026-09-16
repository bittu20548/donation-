import axios from "axios";

// =========================================
// API BASE URL
// =========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://donation-he.onrender.com/api";


// =========================================
// AXIOS INSTANCE
// =========================================

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});


// =========================================
// REQUEST INTERCEPTOR
// Automatically sends JWT token
// =========================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("digitalHeroesToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// =========================================
// RESPONSE INTERCEPTOR
// Handle expired/invalid token
// =========================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (
      error.response &&
      error.response.status === 401
    ) {
      const currentPath =
        window.location.pathname;

      // Don't automatically redirect
      // while already on auth pages
      if (
        currentPath !== "/login" &&
        currentPath !== "/register"
      ) {
        localStorage.removeItem(
          "digitalHeroesToken"
        );

        localStorage.removeItem(
          "digitalHeroesUser"
        );

        window.location.href =
          "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default api;