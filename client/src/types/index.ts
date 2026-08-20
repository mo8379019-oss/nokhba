export type Role = "STUDENT" | "ADMIN";
export type ContentStatus = "ACTIVE" | "INACTIVE";
export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  teamId: string | null;
  team?: Team | null;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  progress?: OverallProgress;
}

export interface Team {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  order: number;
  status: ContentStatus;
  _count?: { subjects: number };
  progress?: { percent: number } | null;
}

export interface Subject {
  id: string;
  teamId: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  order: number;
  status: ContentStatus;
  team?: Team;
  _count?: { lectures: number };
  progress?: { total: number; completed: number; percent: number } | null;
}

export interface Lecture {
  id: string;
  subjectId: string;
  title: string;
  description?: string | null;
  pdfUrl?: string | null;
  audioUrl?: string | null;
  thumbnailUrl?: string | null;
  order: number;
  status: ContentStatus;
  subject?: Subject;
  studentStatus?: ProgressStatus;
  progress?: Progress | null;
  createdAt: string;
}

export interface Progress {
  id: string;
  userId: string;
  lectureId: string;
  status: ProgressStatus;
  progressPercent: number;
  audioProgress: number;
  pdfViewed: boolean;
  audioPlayed: boolean;
  completedAt?: string | null;
  lastAccessedAt: string;
  lecture?: Lecture;
}

export interface OverallProgress {
  totalLectures: number;
  completedLectures: number;
  percent: number;
  teamProgress: number | null;
}

export interface Banner {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  buttonText?: string | null;
  link?: string | null;
  order: number;
  status: ContentStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: { total: number; page: number; limit: number; totalPages: number };
}

export interface SearchResult {
  lectures: {
    id: string;
    title: string;
    description?: string | null;
    subject: string;
    team: string;
    teamId: string;
    subjectId: string;
    hasPdf: boolean;
    hasAudio: boolean;
  }[];
  subjects: Subject[];
  teams: Team[];
}
