import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, FileText, Headphones, ArrowLeft } from "lucide-react";
import { searchApi } from "../api/misc.api";
import { teamsApi } from "../api/teams.api";
import { useDebounce } from "../hooks/useDebounce";
import { Loader } from "../components/common/Loader";
import { EmptyState } from "../components/common/States";

type ContentType = "all" | "pdf" | "audio" | "both";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [teamId, setTeamId] = useState("");
  const [type, setType] = useState<ContentType>("all");
  const debouncedQuery = useDebounce(query, 400);

  const teamsQuery = useQuery({ queryKey: ["teams"], queryFn: () => teamsApi.list() });

  const searchQuery = useQuery({
    queryKey: ["search", debouncedQuery, teamId, type],
    queryFn: () =>
      searchApi.search({
        q: debouncedQuery,
        team: teamId || undefined,
        type: type === "all" ? undefined : type,
      }),
    enabled: debouncedQuery.trim().length >= 2,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-extrabold text-dark">البحث في المحاضرات</h1>

      <div className="mb-6 rounded-2xl border border-gray-light/60 bg-white p-4 shadow-soft">
        <div className="relative mb-3">
          <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-light/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن محاضرة، مادة، أو فرقة..."
            className="input-field pr-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select value={teamId} onChange={(e) => setTeamId(e.target.value)} className="input-field w-auto text-sm">
            <option value="">كل الفرق</option>
            {teamsQuery.data?.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select value={type} onChange={(e) => setType(e.target.value as ContentType)} className="input-field w-auto text-sm">
            <option value="all">كل الأنواع</option>
            <option value="pdf">PDF فقط</option>
            <option value="audio">صوتي فقط</option>
            <option value="both">PDF + صوتي</option>
          </select>
        </div>
      </div>

      {debouncedQuery.trim().length < 2 && (
        <EmptyState title="ابدأ الكتابة للبحث" subtitle="اكتب حرفين على الأقل لعرض النتائج" />
      )}

      {searchQuery.isLoading && <Loader />}

      {searchQuery.data && (
        <div className="space-y-3">
          {searchQuery.data.lectures.length === 0 && (
            <EmptyState title="لا توجد نتائج مطابقة لبحثك" />
          )}
          {searchQuery.data.lectures.map((lecture) => (
            <Link
              key={lecture.id}
              to={`/lectures/${lecture.id}`}
              className="card flex items-center gap-4 p-4"
            >
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-semibold text-dark">{lecture.title}</h4>
                <p className="text-xs text-dark-light/80">{lecture.team} · {lecture.subject}</p>
                {lecture.description && (
                  <p className="mt-1 line-clamp-1 text-sm text-dark-light">{lecture.description}</p>
                )}
                <div className="mt-1.5 flex gap-3 text-xs text-dark-light/70">
                  {lecture.hasPdf && <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> PDF</span>}
                  {lecture.hasAudio && <span className="flex items-center gap-1"><Headphones className="h-3.5 w-3.5" /> صوتي</span>}
                </div>
              </div>
              <ArrowLeft className="h-4 w-4 flex-shrink-0 text-dark-light/50" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
