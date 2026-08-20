import { apiClient } from "./client";
import { ApiResponse, OverallProgress, Progress } from "../types";

export const progressApi = {
  listMine: () => apiClient.get<ApiResponse<Progress[]>>("/progress").then((r) => r.data.data),

  overall: () => apiClient.get<ApiResponse<OverallProgress>>("/progress/overall").then((r) => r.data.data),

  getForLecture: (lectureId: string) =>
    apiClient.get<ApiResponse<Progress | null>>(`/progress/${lectureId}`).then((r) => r.data.data),

  update: (
    lectureId: string,
    data: Partial<{
      status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
      progressPercent: number;
      audioProgress: number;
      pdfViewed: boolean;
      audioPlayed: boolean;
    }>
  ) => apiClient.patch<ApiResponse<Progress>>(`/progress/${lectureId}`, data).then((r) => r.data.data),
};
