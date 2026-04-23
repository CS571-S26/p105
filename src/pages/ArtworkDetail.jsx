// pages/ArtworkDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Button } from "react-aria-components";
import { artworkByYear } from "../data/artworkData";

// ── Zoomable viewer ──────────────────────────────────────────────
// All pan math lives in refs + rAF — zero React re-renders during panning.
function ZoomableImage({ src, alt }) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const hintRef = useRef(null);

  // Mutable zoom state — never triggers re-renders
  const z = useRef({
    zoomed: false,
    ox: 50,
    oy: 50, // current smoothed origin
    tx: 50,
    ty: 50, // target (mouse position)
    rafId: null,
  });

  const SCALE = 2.8;
  const LERP = 0.1; // smoothing factor per frame (0 = no movement, 1 = instant)

  const applyTransform = (ox, oy, scale) => {
    const img = imgRef.current;
    if (!img) return;
    img.style.transformOrigin = `${ox}% ${oy}%`;
    img.style.transform = `scale(${scale})`;
  };

  const startLoop = () => {
    const loop = () => {
      const s = z.current;
      if (!s.zoomed) return;
      // Lerp toward mouse target each frame — this is what makes it silky
      s.ox += (s.tx - s.ox) * LERP;
      s.oy += (s.ty - s.oy) * LERP;
      applyTransform(s.ox, s.oy, SCALE);
      s.rafId = requestAnimationFrame(loop);
    };
    z.current.rafId = requestAnimationFrame(loop);
  };

  const stopLoop = () => {
    cancelAnimationFrame(z.current.rafId);
    z.current.rafId = null;
  };

  const getPercent = (clientX, clientY) => {
    const rect = containerRef.current.getBoundingClientRect();
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    return {
      x: clamp(((clientX - rect.left) / rect.width) * 100, 5, 95),
      y: clamp(((clientY - rect.top) / rect.height) * 100, 5, 95),
    };
  };

  const zoomIn = (clientX, clientY) => {
    const { x, y } = getPercent(clientX, clientY);
    const s = z.current;
    s.zoomed = true;
    // Snap to click point instantly so there's no drift from centre on entry
    s.ox = x;
    s.oy = y;
    s.tx = x;
    s.ty = y;
    applyTransform(x, y, SCALE);
    // Drop CSS transition — rAF owns movement from here
    if (imgRef.current) imgRef.current.style.transition = "none";
    if (hintRef.current) hintRef.current.style.opacity = "0";
    if (containerRef.current) containerRef.current.style.cursor = "zoom-out";
    startLoop();
  };

  const zoomOut = () => {
    const s = z.current;
    s.zoomed = false;
    stopLoop();
    // Restore CSS transition for the smooth scale-down
    if (imgRef.current) {
      imgRef.current.style.transition =
        "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)";
      imgRef.current.style.transform = "scale(1)";
    }
    if (hintRef.current) hintRef.current.style.opacity = "1";
    if (containerRef.current) containerRef.current.style.cursor = "zoom-in";
  };

  const handleClick = (e) => {
    z.current.zoomed ? zoomOut() : zoomIn(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!z.current.zoomed) return;
    // Only update the target — the rAF loop reads it next frame
    const { x, y } = getPercent(e.clientX, e.clientY);
    z.current.tx = x;
    z.current.ty = y;
  };

  const handleTouchEnd = (e) => {
    const t = e.changedTouches[0];
    z.current.zoomed ? zoomOut() : zoomIn(t.clientX, t.clientY);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") zoomOut();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      stopLoop();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-stone-50 border border-stone-200
                 max-h-[80vh] flex items-center justify-center select-none"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onTouchEnd={handleTouchEnd}
      role="img"
      aria-label="Click to zoom; move mouse to pan; click again or Escape to zoom out"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick(e)}
      style={{ cursor: "zoom-in" }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        className="block max-w-full max-h-[80vh] w-auto h-auto"
        style={{
          willChange: "transform",
          transformOrigin: "50% 50%",
          transform: "scale(1)",
          transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      />

      <span
        ref={hintRef}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none
                   font-['Jost'] text-[0.65rem] uppercase tracking-[0.12em] text-black/40
                   bg-white/70 px-3 py-1 rounded-sm whitespace-nowrap"
        style={{ transition: "opacity 0.3s" }}
      >
        click to zoom · move mouse to pan
      </span>
    </div>
  );
}

// ── Filmstrip thumbnail ──────────────────────────────────────────
function StripThumb({ artwork, isActive, onPress }) {
  return (
    <Button
      className={`flex-shrink-0 w-12 h-12 overflow-hidden outline-none cursor-pointer
                  border transition-colors duration-200
                  focus-visible:ring-2 focus-visible:ring-stone-800
                  ${isActive ? "border-stone-800" : "border-transparent hover:border-stone-300"}`}
      onPress={onPress}
      aria-label={artwork.title}
      aria-current={isActive ? "true" : undefined}
    >
      <img
        src={artwork.image}
        alt={artwork.title}
        className="w-full h-full object-cover"
      />
    </Button>
  );
}

// ── Main detail page ─────────────────────────────────────────────
function ArtworkDetail() {
  const { year, artworkId } = useParams();
  const navigate = useNavigate();

  const artworks = artworkByYear[year] || [];
  const currentIdx = artworks.findIndex((a) => a.id === artworkId);
  const artwork = artworks[currentIdx];

  const goTo = (idx) => {
    if (idx >= 0 && idx < artworks.length)
      navigate(`/artwork/${year}/${artworks[idx].id}`);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goTo(currentIdx - 1);
      if (e.key === "ArrowRight") goTo(currentIdx + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIdx]);

  if (!artwork) {
    return (
      <div className="p-16 text-center font-['Cormorant_Garamond'] italic text-stone-400 text-lg">
        Artwork not found.{" "}
        <Button
          className="underline cursor-pointer outline-none focus-visible:ring-1"
          onPress={() => navigate(`/artwork/${year}`)}
        >
          ← Back to {year}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto px-6 pt-6 pb-16">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <Button
          className="font-['Jost'] text-[0.72rem] uppercase tracking-[0.1em] text-stone-400
                     hover:text-stone-900 transition-colors outline-none cursor-pointer
                     focus-visible:ring-2 focus-visible:ring-stone-800 rounded-sm"
          onPress={() => navigate(`/artwork/${year}`)}
        >
          ← {year}
        </Button>
        <span className="font-['Jost'] text-[0.68rem] tracking-[0.08em] text-stone-300">
          {currentIdx + 1} / {artworks.length}
        </span>
      </div>

      <ZoomableImage src={artwork.image} alt={artwork.title} />

      {/* Metadata */}
      <div className="mt-5">
        <h1
          className="font-['Cormorant_Garamond'] font-normal italic text-stone-900
                       text-[clamp(1.4rem,3.5vw,2rem)] leading-tight mb-2"
        >
          {artwork.title}
        </h1>
        <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
          {[artwork.medium, artwork.size, artwork.year]
            .filter(Boolean)
            .map((item, i, arr) => (
              <span key={i} className="flex items-center gap-3">
                <span className="font-['Jost'] text-[0.72rem] tracking-[0.06em] text-stone-400">
                  {item}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-stone-200 text-xs">·</span>
                )}
              </span>
            ))}
        </div>
        {artwork.note && (
          <p className="font-['Jost'] text-[0.7rem] italic text-stone-300 mt-1">
            {artwork.note}
          </p>
        )}
      </div>

      {/* Navigation bar */}
      <div className="flex items-center gap-3 mt-10 pt-6 border-t border-stone-200">
        <Button
          isDisabled={currentIdx === 0}
          className="font-['Jost'] text-[0.72rem] uppercase tracking-[0.1em] flex-shrink-0
                     text-stone-400 disabled:text-stone-200 hover:text-stone-900
                     transition-colors outline-none cursor-pointer
                     focus-visible:ring-2 focus-visible:ring-stone-800 rounded-sm
                     disabled:cursor-not-allowed"
          onPress={() => goTo(currentIdx - 1)}
        >
          ← prev
        </Button>

        <div className="flex gap-1.5 overflow-x-auto flex-1 scrollbar-none">
          {artworks.map((a, i) => (
            <StripThumb
              key={a.id}
              artwork={a}
              isActive={i === currentIdx}
              onPress={() => navigate(`/artwork/${year}/${a.id}`)}
            />
          ))}
        </div>

        <Button
          isDisabled={currentIdx === artworks.length - 1}
          className="font-['Jost'] text-[0.72rem] uppercase tracking-[0.1em] flex-shrink-0
                     text-stone-400 disabled:text-stone-200 hover:text-stone-900
                     transition-colors outline-none cursor-pointer
                     focus-visible:ring-2 focus-visible:ring-stone-800 rounded-sm
                     disabled:cursor-not-allowed"
          onPress={() => goTo(currentIdx + 1)}
        >
          next →
        </Button>
      </div>
    </div>
  );
}

export default ArtworkDetail;
