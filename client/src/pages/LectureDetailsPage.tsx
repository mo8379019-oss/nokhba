import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, CheckCircle2, Calendar } from "lucide-react";
import { lecturesApi } from "../api/lectures.api";
import { progressApi } from "../api/progress.api";
import { PDFViewer } from "../components/educational/PDFViewer";
import { AudioPlayer } from "../components/educational/AudioPlayer";
import { Loader } from "../components/common/Loader";
import { ErrorState } from "../components/common/States";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/common/Toast";

export function LectureDetailsPage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [completing, setCompleting] = useState(false);

  const lectureQuery = useQuery({
    queryKey: ["lecture", lectureId],
    queryFn: () => lecturesApi.get(lectureId!),
    enabled: !!lectureId,
  });

  if (lectureQuery.isLoading) return <Loader />;
  if (lectureQuery.isError || !lectureQuery.data) return <ErrorState message="تعذر تحميل المحاضرة" />;

  const lecture = lectureQuery.data;
  const isCompleted = lecture.progress?.status === "COMPLETED";

  async function markAsCompleted() {
    if (!lectureId) return;
    setCompleting(true);
    try {
      await progressApi.update(lectureId, { status: "COMPLETED" });
      showToast("تم تسجيل المحاضرة كمكتملة 🎉");
      queryClient.invalidateQueries({ queryKey: ["lecture", lectureId] });
    } catch {
      showToast("تعذر تحديث حالة المحاضرة", "error");
    } finally {
      setCompleting(false);
    }
  }

  async function trackPdfViewed() {
    if (!lectureId || !isAuthenticated) return;
    await progressApi.update(lectureId, { pdfViewed: true, status: "IN_PROGRESS" });
  }

  async function trackAudioProgress(currentTime: number) {
    if (!lectureId || !isAuthenticated) return;
    await progressApi.update(lectureId, {
      audioProgress: Math.floor(currentTime),
      audioPlayed: true,
      status: "IN_PROGRESS",
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-dark-light">
        {lecture.subject?.team && (
          <>
            <Link to={`/teams/${lecture.subject.team.id}`} className="hover:text-primary">{lecture.subject.team.name}</Link>
            <ChevronLeft className="h-3.5 w-3.5" />
          </>
        )}
        {lecture.subject && (
          <>
            <Link to={`/teams/${lecture.subject.teamId}/subjects/${lecture.subject.id}`} className="hover:text-primary">
              {lecture.subject.name}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5" />
          </>
        )}
        <span className="font-medium text-dark">{lecture.title}</span>
      </nav>

      <div className="mb-6 rounded-2xl border border-gray-light/60 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-dark sm:text-2xl">{lecture.title}</h1>
            {lecture.description && <p className="mt-2 text-sm text-dark-light">{lecture.description}</p>}
            <p className="mt-2 flex items-center gap-1 text-xs text-dark-light/70">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(lecture.createdAt).toLocaleDateString("ar-EG")}
            </p>
          </div>

          {isAuthenticated && (
            <button
              onClick={markAsCompleted}
              disabled={isCompleted || completing}
              className={isCompleted ? "badge bg-green-100 text-green-700" : "btn-primary"}
            >
              <CheckCircle2 className="h-4 w-4" />
              {isCompleted ? "تم الانتهاء منها" : completing ? "جاري الحفظ..." : "تحديد كمكتملة"}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {lecture.pdfUrl && <PDFViewer url={lecture.pdfUrl} onFirstView={trackPdfViewed} />}
        {lecture.audioUrl && (
          <AudioPlayer
            src={lecture.audioUrl}
            initialTime={lecture.progress?.audioProgress ?? 0}
            onProgress={trackAudioProgress}
          />
        )}
        {!lecture.pdfUrl && !lecture.audioUrl && (
          <div className="rounded-2xl border border-dashed border-gray-light bg-white/50 py-16 text-center text-dark-light">
            لا يوجد محتوى مرفق لهذه المحاضرة حاليًا
          </div>
        )}
      </div>
    </div>
  );
}
