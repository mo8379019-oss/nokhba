import { Link } from "react-router-dom";
import { Users, ArrowLeft } from "lucide-react";
import { Team } from "../../types";
import { ProgressBadge } from "./ProgressBar";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link to={`/teams/${team.id}`} className="card group flex flex-col overflow-hidden">
      <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-primary to-primary-dark">
        {team.imageUrl ? (
          <img
            src={team.imageUrl}
            alt={team.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Users className="h-12 w-12 text-gold/70" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-bold text-dark">{team.name}</h3>
        {team.description && <p className="line-clamp-2 text-sm text-dark-light">{team.description}</p>}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-dark-light">
          <span>{team._count?.subjects ?? 0} مادة</span>
          {team.progress && <div className="w-24"><ProgressBadge percent={team.progress.percent} /></div>}
        </div>
        <span className="btn-primary mt-2 w-full">
          دخول
          <ArrowLeft className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
