import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-aria-components";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { artworkByYear, YEARS } from "../data/artworkData";

// ── Gallery thumbnail ─────────────────────────────────────────────
function ArtworkThumb({ artwork }) {
  const caption = [artwork.title, artwork.medium, artwork.size, artwork.note]
    .filter(Boolean)
    .join(" | ");

  return (
    <div className="mb-10 break-inside-avoid group">
      {/* We use the Zoom component here. 
          The user clicks the image, it zooms in place. 
      */}
      <div className="relative overflow-hidden bg-stone-100 transition-colors duration-300">
        <Zoom>
          <img
            src={artwork.image}
            alt={artwork.title || "artwork"}
            className="w-full h-auto block cursor-zoom-in hover:brightness-95 transition-all duration-500"
            loading="lazy"
          />
        </Zoom>
      </div>

      {/* Info remains visible on the gallery page under the image */}
      {caption && (
        <div className="mt-3 px-1">
          <h3 className="font-['Cormorant_Garamond'] italic text-lg text-stone-900 leading-tight">
            {artwork.title}
          </h3>
          <p className="mt-1 font-['Jost'] text-[0.72rem] uppercase tracking-widest text-stone-400 leading-snug">
            {artwork.medium} <span className="mx-1 opacity-30">|</span>{" "}
            {artwork.size}
          </p>
          {artwork.note && (
            <p className="mt-2 font-['Jost'] text-[0.7rem] italic text-stone-300 border-l border-stone-200 pl-3">
              {artwork.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Year gallery ─────────────────────────────────────────────────
function YearGallery({ year }) {
  const navigate = useNavigate();
  const artworks = artworkByYear[year] || [];
  const yearIdx = YEARS.indexOf(year);
  const prevYear = yearIdx > 0 ? YEARS[yearIdx - 1] : null;
  const nextYear = yearIdx < YEARS.length - 1 ? YEARS[yearIdx + 1] : null;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-24">
      {/* Header for the Year */}
      <div className="mb-12 border-b border-stone-100 pb-4 flex justify-between items-end">
        <h2 className="font-['Cormorant_Garamond'] text-3xl italic text-stone-800">
          {year}
        </h2>
        <span className="font-['Jost'] text-[0.65rem] tracking-[0.2em] text-stone-300 uppercase">
          {artworks.length} Works
        </span>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-10">
        {artworks.map((artwork) => (
          <ArtworkThumb key={artwork.id} artwork={artwork} />
        ))}
      </div>

      {/* Year Navigation Footer */}
      <div className="flex justify-between pt-12 mt-12 border-t border-stone-200">
        {prevYear ? (
          <Button
            className="font-['Jost'] text-[0.75rem] text-stone-400 hover:text-stone-800 transition-colors outline-none cursor-pointer uppercase tracking-widest"
            onPress={() => navigate(`/artwork/${prevYear}`)}
          >
            ← {prevYear}
          </Button>
        ) : (
          <span />
        )}

        <Button
          className="font-['Jost'] text-[0.75rem] text-stone-300 hover:text-stone-800 transition-colors uppercase tracking-widest"
          onPress={() => navigate("/artwork")}
        >
          Index
        </Button>

        {nextYear ? (
          <Button
            className="font-['Jost'] text-[0.75rem] text-stone-400 hover:text-stone-800 transition-colors outline-none cursor-pointer uppercase tracking-widest"
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

// ── /artwork index ────────────────────────────────────────────────
function ArtworkOverview() {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="font-['Cormorant_Garamond'] italic text-4xl mb-12 text-stone-800">
        Archives
      </h1>
      <div className="flex flex-col gap-4">
        {YEARS.map((y) => (
          <Button
            key={y}
            className="font-['Jost'] text-xl text-stone-400 hover:text-stone-900 transition-colors outline-none cursor-pointer tracking-[0.3em]"
            onPress={() => navigate(`/artwork/${y}`)}
          >
            {y}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { year } = useParams();
  if (!year) return <ArtworkOverview />;
  return <YearGallery year={year} />;
}
