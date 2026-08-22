import { apiClient } from "./client";
import { ApiResponse, Team } from "../types";

export interface TeamInput {
  name: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  status?: "ACTIVE" | "INACTIVE";
}

export const teamsApi = {
  list: (all = false) =>
    apiClient.get<ApiResponse<Team[]>>("/teams", { params: all ? { all: true } : {} }).then((r) => r.data.data),

  get: (id: string) => apiClient.get<ApiResponse<Team>>(`/teams/${id}`).then((r) => r.data.data),

  create: (data: TeamInput) => apiClient.post<ApiResponse<Team>>("/teams", data).then((r) => r.data.data),

  update: (id: string, data: Partial<TeamInput>) =>
    apiClient.patch<ApiResponse<Team>>(`/teams/${id}`, data).then((r) => r.data.data),

  remove: (id: string) => apiClient.delete(`/teams/${id}`),
};