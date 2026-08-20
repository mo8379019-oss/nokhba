import { Link } from "react-router-dom";
import { FileText, Headphones, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { Lecture } from "../../types";

const statusMap = {
  NOT_STARTED: { label: "لم يبدأ", icon: Circle, className: "bg-gray-light/60 text-dark-light" },
  IN_PROGRESS: { label: "جارٍ", icon: PlayCircle, className: "bg-gold/20 text-gold-dark" },
  COMPLETED: { label: "مكتمل", icon: CheckCircle2, className: "bg-green-100 text-green-700" },
};

export function LectureCard({ lecture }: { lecture: Lecture }) {
  const status = statusMap[lecture.studentStatus ?? "NOT_STARTED"];
  const StatusIcon = status.icon;

  return (
    <Link
      to={`/lectures/${lecture.id}`}
      className="card flex items-center gap-4 p-4 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/5">
        {lecture.thumbnailUrl ? (
          <img src={lecture.thumbnailUrl} alt="" className="h-full w-full rounded-xl object-cover" />
        ) : (
          <FileText className="h-6 w-6 text-primary/60" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate font-semibold text-dark">{lecture.title}</h4>
        {lecture.description && <p className="line-clamp-1 text-sm text-dark-light">{lecture.description}</p>}
        <div className="mt-1.5 flex items-center gap-3 text-xs text-dark-light/80">
          {lecture.pdfUrl && (
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" /> PDF
            </span>
          )}
          {lecture.audioUrl && (
            <span className="flex items-center gap-1">
              <Headphones className="h-3.5 w-3.5" /> صوتي
            </span>
          )}
        </div>
      </div>

      <span className={`badge flex-shrink-0 ${status.className}`}>
        <StatusIcon className="h-3.5 w-3.5" />
        {status.label}
      </span>
    </Link>
  );
}
