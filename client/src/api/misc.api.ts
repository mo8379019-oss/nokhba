import { apiClient } from "./client";
import { ApiResponse, Banner, SearchResult, User } from "../types";

export const searchApi = {
  search: (params: { q: string; team?: string; subject?: string; type?: "pdf" | "audio" | "both" }) =>
    apiClient.get<ApiResponse<SearchResult>>("/search", { params }).then((r) => r.data.data),
};

export const bannersApi = {
  list: (all = false) =>
    apiClient.get<ApiResponse<Banner[]>>("/banners", { params: all ? { all: true } : {} }).then((r) => r.data.data),

  create: (formData: FormData) =>
    apiClient
      .post<ApiResponse<Banner>>("/banners", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data.data),

  update: (id: string, formData: FormData) =>
    apiClient
      .patch<ApiResponse<Banner>>(`/banners/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data.data),

  remove: (id: string) => apiClient.delete(`/banners/${id}`),
};

export const usersApi = {
  list: (params: { page?: number; limit?: number; search?: string; teamId?: string }) =>
    apiClient.get<ApiResponse<User[]>>("/users", { params }).then((r) => r.data),

  get: (id: string) => apiClient.get<ApiResponse<User>>(`/users/${id}`).then((r) => r.data.data),

  getProgress: (id: string) => apiClient.get(`/users/${id}/progress`).then((r) => r.data.data),

  update: (id: string, data: Partial<{ name: string; phone: string; email: string; teamId: string; status: string }>) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data).then((r) => r.data.data),

  remove: (id: string) => apiClient.delete(`/users/${id}`),
};

export const dashboardApi = {
  overview: () => apiClient.get("/admin/dashboard/overview").then((r) => r.data.data),
};
