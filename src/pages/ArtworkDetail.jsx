import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "react-aria-components";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { artworkByYear } from "../data/artworkData";

export default function ArtworkDetail() {
  const { year, artworkId } = useParams();
  const navigate = useNavigate();
  const artworks = artworkByYear[year] || [];
  const currentIdx = artworks.findIndex((a) => a.id === artworkId);
  const artwork = artworks[currentIdx];
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [artworkId]);

  if (!artwork)
    return (
      <div className="p-20 text-center font-['Outfit',_sans-serif] text-rose-200">
        Artwork not found.
      </div>
    );

  const slides = artworks.map((a) => ({ src: a.image, alt: a.title }));

  return (
    <div className="min-h-screen bg-white px-8 py-6 md:px-16 max-w-6xl mx-auto">
      {/* Back link */}
      <div className="pb-4">
        <Button
          className="font-['Outfit',_sans-serif] text-xs uppercase tracking-widest text-rose-200 hover:text-black transition-colors outline-none cursor-pointer"
          onPress={() => navigate(`/artwork/${year}`)}
        >
          ← {year}
        </Button>
      </div>

      {/* Main image */}
      <section className="flex justify-center pb-6">
        <button
          className="group relative cursor-zoom-in outline-none"
          onClick={() => setLightboxOpen(true)}
          aria-label="Open zoom view"
        >
          <img
            src={artwork.image}
            alt={artwork.title}
            className="max-h-[60vh] w-auto max-w-full object-contain transition-opacity duration-300 group-hover:brightness-90"
          />
        </button>
      </section>

      {/* Metadata */}
      <section className="max-w-2xl mx-auto pb-6 border-b border-stone-100">
        <h1 className="font-['Outfit',_sans-serif] text-2xl text-stone-500 mb-1 tracking-wide">
          {artwork.title}
        </h1>
        <p className="font-['Outfit',_sans-serif] text-xs uppercase tracking-widest text-rose-200">
          {[artwork.medium, artwork.size, artwork.year]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {artwork.note && (
          <p className="mt-3 font-['Outfit',_sans-serif] text-sm italic text-rose-200 border-l border-stone-200 pl-4">
            {artwork.note}
          </p>
        )}
      </section>

      {/* Filmstrip nav (Kept this one) */}
      <section className="max-w-2xl mx-auto pt-6">
        <p className="font-['Outfit',_sans-serif] text-[0.65rem] uppercase tracking-widest text-stone-300 mb-3">
          {year} — {currentIdx + 1} / {artworks.length}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {artworks.map((a, i) => (
            <Button
              key={a.id}
              onPress={() => navigate(`/artwork/${year}/${a.id}`)}
              className={`flex-shrink-0 w-14 h-14 transition-opacity outline-none cursor-pointer ${
                i === currentIdx
                  ? "opacity-100 ring-1 ring-black ring-offset-2"
                  : "opacity-30 hover:opacity-80"
              }`}
            >
              <img
                src={a.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </Button>
          ))}
        </div>
      </section>

      {/* Lightbox - Thumbnails plugin removed */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={currentIdx}
        plugins={[Zoom]}
        zoom={{ scrollToZoom: true, maxZoomPixelRatio: 3 }}
        on={{
          view: ({ index }) => {
            const target = artworks[index];
            if (target && target.id !== artworkId) {
              navigate(`/artwork/${year}/${target.id}`, { replace: true });
            }
          },
        }}
      />
    </div>
  );
}
