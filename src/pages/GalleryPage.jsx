import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-aria-components";
import { artworkByYear, YEARS } from "../data/artworkData";
import ArtworkCard from "../components/ui/ArtworkCard";

// ── Year gallery ─────────────────────────────────────────────────
function YearGallery({ year }) {
  const navigate = useNavigate();
  const artworks = artworkByYear[year] || [];
  const yearIdx = YEARS.indexOf(year);
  const prevYear = yearIdx > 0 ? YEARS[yearIdx - 1] : null;
  const nextYear = yearIdx < YEARS.length - 1 ? YEARS[yearIdx + 1] : null;

  return (
    <div className="max-w-5xl mx-auto px-16 pt-10 pb-24">
      {/* Year header */}
      <div className="mb-12 border-b border-stone-100 pb-4 flex justify-between items-end">
        <h1 className="font-['Outfit',_sans-serif] text-3xl text-stone-800 tracking-wide">
          {year}
        </h1>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-10">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} yearSlug={year} />
        ))}
      </div>

      {/* Year nav footer */}
      <div className="flex justify-between pt-12 mt-12 border-t border-stone-200">
        {prevYear ? (
          <Button
            className="font-['Outfit',_sans-serif] text-[0.75rem] text-stone-400 hover:text-stone-800 transition-colors outline-none cursor-pointer uppercase tracking-widest"
            onPress={() => navigate(`/artwork/${prevYear}`)}
          >
            ← {prevYear}
          </Button>
        ) : (
          <span />
        )}

        {nextYear ? (
          <Button
            className="font-['Outfit',_sans-serif] text-[0.75rem] text-stone-400 hover:text-stone-800 transition-colors outline-none cursor-pointer uppercase tracking-widest"
            onPress={() => navigate(`/artwork/${nextYear}`)}
          >
            {nextYear} →
          </Button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { year } = useParams();
  if (!year) return <ArtworkOverview />;
  return <YearGallery year={year} />;
}
