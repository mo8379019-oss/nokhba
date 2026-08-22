import { apiClient } from "./client";
import { ApiResponse, Subject } from "../types";

export interface SubjectInput {
  name: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  status?: "ACTIVE" | "INACTIVE";
}

export const subjectsApi = {
  listByTeam: (teamId: string, all = false) =>
    apiClient
      .get<ApiResponse<Subject[]>>(`/teams/${teamId}/subjects`, { params: all ? { all: true } : {} })
      .then((r) => r.data.data),

  get: (id: string) => apiClient.get<ApiResponse<Subject>>(`/subjects/${id}`).then((r) => r.data.data),

  create: (teamId: string, data: SubjectInput) =>
    apiClient.post<ApiResponse<Subject>>(`/teams/${teamId}/subjects`, data).then((r) => r.data.data),

  update: (id: string, data: Partial<SubjectInput>) =>
    apiClient.patch<ApiResponse<Subject>>(`/subjects/${id}`, data).then((r) => r.data.data),

  remove: (id: string) => apiClient.delete(`/subjects/${id}`),
};