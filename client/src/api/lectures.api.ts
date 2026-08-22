import { apiClient } from "./client";
import { ApiResponse, Lecture } from "../types";

export interface LectureInput {
  title: string;
  description?: string;
  pdfUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  order?: number;
  status?: "ACTIVE" | "INACTIVE";
}

export const lecturesApi = {
  listBySubject: (subjectId: string, all = false) =>
    apiClient
      .get<ApiResponse<Lecture[]>>(`/subjects/${subjectId}/lectures`, { params: all ? { all: true } : {} })
      .then((r) => r.data.data),

  get: (id: string) => apiClient.get<ApiResponse<Lecture>>(`/lectures/${id}`).then((r) => r.data.data),

  create: (subjectId: string, data: LectureInput) =>
    apiClient.post<ApiResponse<Lecture>>(`/subjects/${subjectId}/lectures`, data).then((r) => r.data.data),

  update: (id: string, data: Partial<LectureInput>) =>
    apiClient.patch<ApiResponse<Lecture>>(`/lectures/${id}`, data).then((r) => r.data.data),

  remove: (id: string) => apiClient.delete(`/lectures/${id}`),

  reorder: (subjectId: string, items: { id: string; order: number }[]) =>
    apiClient.patch(`/subjects/${subjectId}/lectures/reorder`, { items }),
};