import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  withCredentials: true, // send HTTP-only cookie
  headers: { "Content-Type": "application/json" },
});

// Attach a friendlier error message
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.message ?? "حدث خطأ غير متوقع، برجاء المحاولة مرة أخرى";
    return Promise.reject(new Error(message));
  }
);
