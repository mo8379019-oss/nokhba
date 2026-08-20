import { apiClient } from "./client";
import { ApiResponse, Team } from "../types";

export const teamsApi = {
  list: (all = false) =>
    apiClient.get<ApiResponse<Team[]>>("/teams", { params: all ? { all: true } : {} }).then((r) => r.data.data),

  get: (id: string) => apiClient.get<ApiResponse<Team>>(`/teams/${id}`).then((r) => r.data.data),

  create: (formData: FormData) =>
    apiClient
      .post<ApiResponse<Team>>("/teams", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data.data),

  update: (id: string, formData: FormData) =>
    apiClient
      .patch<ApiResponse<Team>>(`/teams/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data.data),

  remove: (id: string) => apiClient.delete(`/teams/${id}`),
};
