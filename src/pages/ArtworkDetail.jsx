import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "react-aria-components";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { artworkByYear } from "../data/artworkData";

export default function ArtworkDetail() {
  const { year, artworkId } = useParams();
  const navigate = useNavigate();
  const artworks = artworkByYear[year] || [];
  const currentIdx = artworks.findIndex((a) => a.id === artworkId);
  const artwork = artworks[currentIdx];
  const topRef = useRef(null);

  // Auto-scroll to top when moving between artworks
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [artworkId]);

  if (!artwork)
    return <div className="p-20 text-center">Artwork not found.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── Section 1: The "Hero" Image (Fullscreen feel) ── */}
      <section className="h-screen w-full flex flex-col items-center justify-center p-4 md:p-12 border-b border-stone-100">
        <div className="w-full h-full flex items-center justify-center relative">
          <Zoom key={artwork.id}>
            <img
              src={artwork.image}
              alt={artwork.title}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
            />
          </Zoom>

          {/* Subtle scroll hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
            <span className="font-['Jost'] text-[0.6rem] uppercase tracking-widest text-black">
              Scroll for details
            </span>
          </div>
        </div>
      </section>

      {/* ── Section 2: Artwork Details (Below the fold) ── */}
      <section className="max-w-4xl mx-auto w-full px-6 py-24">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Metadata */}
          <div className="md:col-span-2">
            <h1 className="font-['Cormorant_Garamond'] italic text-4xl md:text-5xl text-stone-900 mb-6">
              {artwork.title}
            </h1>
            <div className="space-y-4 font-['Jost'] text-stone-500 tracking-wide text-sm uppercase">
              <p>{artwork.medium}</p>
              <p>{artwork.size}</p>
              {artwork.note && (
                <p className="normal-case italic text-stone-400 mt-8 border-l border-stone-200 pl-4">
                  {artwork.note}
                </p>
              )}
            </div>
          </div>

          {/* Quick Nav / Year Link */}
          <div className="flex flex-col justify-between items-start md:items-end">
            <Button
              className="font-['Jost'] text-xs uppercase tracking-widest text-stone-400 hover:text-black transition-colors"
              onPress={() => navigate(`/artwork/${year}`)}
            >
              ← Back to {year}
            </Button>
          </div>
        </div>

        {/* ── Section 3: Filmstrip Navigation ── */}
        <div className="mt-24 pt-12 border-t border-stone-100">
          <div className="flex justify-between items-center mb-6">
            <span className="font-['Jost'] text-[0.65rem] uppercase tracking-widest text-stone-300">
              Collection {year} — {currentIdx + 1} of {artworks.length}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
            {artworks.map((a, i) => (
              <Button
                key={a.id}
                onPress={() => navigate(`/artwork/${year}/${a.id}`)}
                className={`flex-shrink-0 w-20 h-20 transition-opacity ${
                  i === currentIdx
                    ? "opacity-100 ring-1 ring-black ring-offset-2"
                    : "opacity-30 hover:opacity-100"
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
        </div>
      </section>
    </div>
  );
}
