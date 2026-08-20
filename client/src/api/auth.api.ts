import { apiClient } from "./client";
import { ApiResponse, User } from "../types";

export const authApi = {
  register: (data: { name: string; phone: string; email: string; password: string; teamId?: string }) =>
    apiClient.post<ApiResponse<{ user: User; token: string }>>("/auth/register", data).then((r) => r.data.data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<ApiResponse<{ user: User; token: string }>>("/auth/login", data).then((r) => r.data.data),

  logout: () => apiClient.post("/auth/logout"),

  me: () => apiClient.get<ApiResponse<User>>("/auth/me").then((r) => r.data.data),
};
