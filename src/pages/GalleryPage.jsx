// pages/GalleryPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-aria-components";
import { artworkByYear, YEARS } from "../data/artworkData";

// ── Single artwork entry ─────────────────────────────────────────
function ArtworkRow({ artwork, yearSlug, navigate }) {
  const caption = [artwork.title, artwork.medium, artwork.size, artwork.note]
    .filter(Boolean)
    .join(" | ");

  return (
    <div className="mb-6 break-inside-avoid">
      <Button
        className="block w-full outline-none cursor-pointer group
                   focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-4"
        onPress={() => navigate(`/artwork/${yearSlug}/${artwork.id}`)}
      >
        <div className="relative group-hover:brightness-80 transition-[filter] duration-300">
          <img
            src={artwork.image}
            alt={artwork.title || "artwork"}
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>
      </Button>

      {caption && (
        <p className="mt-2 font-['Jost'] text-[0.78rem] text-stone-500 leading-snug">
          {caption}
        </p>
      )}
    </div>
  );
}

// ── Year gallery ─────────────────────────────────────────────────
function YearGallery({ year }) {
  const navigate = useNavigate();
  const artworks = artworkByYear[year] || [];
  const idx = YEARS.indexOf(year);
  const prev = idx > 0 ? YEARS[idx - 1] : null;
  const next = idx < YEARS.length - 1 ? YEARS[idx + 1] : null;

  return (
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-24">
      <div className="columns-2 md:columns-3 gap-6">
        {artworks.map((artwork) => (
          <ArtworkRow
            key={artwork.id}
            artwork={artwork}
            yearSlug={year}
            navigate={navigate}
          />
        ))}
      </div>

      <div className="flex justify-between pt-6 mt-4 border-t border-stone-200">
        {prev ? (
          <Button
            className="font-['Jost'] text-[0.75rem] text-stone-400 hover:text-stone-800
                       transition-colors outline-none cursor-pointer
                       focus-visible:ring-2 focus-visible:ring-stone-400 rounded-sm"
            onPress={() => navigate(`/artwork/${prev}`)}
          >
            {"< "}
            {prev}
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button
            className="font-['Jost'] text-[0.75rem] text-stone-400 hover:text-stone-800
                       transition-colors outline-none cursor-pointer
                       focus-visible:ring-2 focus-visible:ring-stone-400 rounded-sm"
            onPress={() => navigate(`/artwork/${next}`)}
          >
            {next}
            {" >"}
          </Button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

// ── /artwork index — plain year list ────────────────────────────
function ArtworkOverview() {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <ul className="space-y-2">
        {YEARS.map((y) => (
          <li key={y}>
            <Button
              className="font-['Jost'] text-[0.78rem] text-stone-500 hover:text-stone-900
                         transition-colors outline-none cursor-pointer
                         focus-visible:ring-2 focus-visible:ring-stone-400 rounded-sm"
              onPress={() => navigate(`/artwork/${y}`)}
            >
              {y}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Route component ──────────────────────────────────────────────
function GalleryPage() {
  const { year } = useParams();
  if (!year) return <ArtworkOverview />;
  return <YearGallery year={year} />;
}

export default GalleryPage;
