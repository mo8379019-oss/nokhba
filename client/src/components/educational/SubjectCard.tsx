import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Subject } from "../../types";
import { ProgressBadge } from "./ProgressBar";

export function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link to={`/teams/${subject.teamId}/subjects/${subject.id}`} className="card group flex flex-col overflow-hidden">
      <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-gold/30 to-gold/10">
        {subject.imageUrl ? (
          <img
            src={subject.imageUrl}
            alt={subject.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-10 w-10 text-primary/60" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-bold text-dark">{subject.name}</h3>
        {subject.description && <p className="line-clamp-2 text-sm text-dark-light">{subject.description}</p>}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-dark-light">
          <span>{subject._count?.lectures ?? 0} محاضرة</span>
        </div>
        {subject.progress && <ProgressBadge percent={subject.progress.percent} />}
      </div>
    </Link>
  );
}
