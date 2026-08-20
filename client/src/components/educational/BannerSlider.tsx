import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Banner } from "../../types";

export function BannerSlider({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[index];

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-card sm:h-80 md:h-96">
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img src={b.imageUrl} alt={b.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />
          <div className="absolute bottom-0 right-0 max-w-lg p-6 text-white sm:p-10">
            <h2 className="text-xl font-extrabold sm:text-3xl">{b.title}</h2>
            {b.description && <p className="mt-2 text-sm text-white/90 sm:text-base">{b.description}</p>}
            {b.buttonText && b.link && (
              <Link to={b.link} className="btn-primary mt-4 inline-flex">
                {b.buttonText}
              </Link>
            )}
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur hover:bg-white/50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur hover:bg-white/50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-gold" : "w-1.5 bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
