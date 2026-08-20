import { apiClient } from "./client";
import { ApiResponse, Subject } from "../types";

export const subjectsApi = {
  listByTeam: (teamId: string, all = false) =>
    apiClient
      .get<ApiResponse<Subject[]>>(`/teams/${teamId}/subjects`, { params: all ? { all: true } : {} })
      .then((r) => r.data.data),

  get: (id: string) => apiClient.get<ApiResponse<Subject>>(`/subjects/${id}`).then((r) => r.data.data),

  create: (teamId: string, formData: FormData) =>
    apiClient.post<ApiResponse<Subject>>(`/teams/${teamId}/subjects`, formData).then((r) => r.data.data),

  update: (id: string, formData: FormData) =>
    apiClient.patch<ApiResponse<Subject>>(`/subjects/${id}`, formData).then((r) => r.data.data),

  remove: (id: string) => apiClient.delete(`/subjects/${id}`),
};