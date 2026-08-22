import axios from "axios";

const TOKEN_KEY = "ep_token";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT from localStorage as a fallback for cross-domain deployments
// where third-party cookies may be blocked by the browser (Safari ITP, Chrome, etc.)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.message ?? "حدث خطأ غير متوقع، برجاء المحاولة مرة أخرى";
    return Promise.reject(new Error(message));
  }
);