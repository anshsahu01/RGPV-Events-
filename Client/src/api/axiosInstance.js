import axios from "axios";
import { store } from "../redux/store";
import { setTokens } from "../redux/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // allow sending cookies
});


api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.accessToken || localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Response Interceptor — Handle Expired Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // agar token expire hua aur retry nahi hua abhi tak
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/user/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken, refreshToken } = res.data.data;

        // Redux update
        store.dispatch(setTokens({ accessToken, refreshToken }));

        // LocalStorage update
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Update header & retry original request
        originalRequest.headers.Authorization = accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
