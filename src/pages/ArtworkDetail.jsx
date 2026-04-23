// ArtworkDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useRef, useState, useCallback, useEffect } from "react";
import { artworkByYear } from "../data/artworkData";

// ── Zoomable image viewer ───────────────────────────────────────────────────
function ZoomableImage({ src, alt }) {
  const containerRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 }); // % from top-left
  const [pan, setPan] = useState({ x: 50, y: 50 });

  const ZOOM_SCALE = 2.8;

  // Click to toggle zoom, and set origin at click point
  const handleClick = useCallback(
    (e) => {
      if (!zoomed) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setOrigin({ x, y });
        setPan({ x, y });
        setZoomed(true);
      } else {
        setZoomed(false);
      }
    },
    [zoomed],
  );

  // Mouse-move panning while zoomed
  const handleMouseMove = useCallback(
    (e) => {
      if (!zoomed) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      // Clamp to keep image visible
      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
      setPan({ x: clamp(x, 10, 90), y: clamp(y, 10, 90) });
    },
    [zoomed],
  );

  // Touch support
  const handleTouchEnd = useCallback(
    (e) => {
      const touch = e.changedTouches[0];
      if (!zoomed) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        setOrigin({ x, y });
        setPan({ x, y });
        setZoomed(true);
      } else {
        setZoomed(false);
      }
    },
    [zoomed],
  );

  // ESC to exit zoom
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const imgStyle = zoomed
    ? {
        transform: `scale(${ZOOM_SCALE})`,
        transformOrigin: `${pan.x}% ${pan.y}%`,
        cursor: "zoom-out",
        transition: "transform-origin 0.05s linear",
      }
    : {
        transform: "scale(1)",
        transformOrigin: `${origin.x}% ${origin.y}%`,
        cursor: "zoom-in",
        transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      };

  return (
    <div
      ref={containerRef}
      className="zoom-container"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onTouchEnd={handleTouchEnd}
      aria-label={zoomed ? "Click to zoom out" : "Click to zoom in"}
      role="img"
    >
      <img
        src={src}
        alt={alt}
        className="zoom-img"
        style={imgStyle}
        draggable={false}
      />
      <div className={`zoom-hint ${zoomed ? "hidden" : ""}`}>
        click to zoom · move mouse to pan
      </div>

      <style>{`
        .zoom-container {
          position: relative;
          overflow: hidden;
          background: #f5f3ef;
          max-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          border: 1px solid #e8e5e0;
        }
        .zoom-img {
          display: block;
          max-width: 100%;
          max-height: 80vh;
          width: auto;
          height: auto;
          will-change: transform;
        }
        .zoom-hint {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.4);
          background: rgba(255,255,255,0.7);
          padding: 0.3rem 0.8rem;
          border-radius: 2px;
          pointer-events: none;
          transition: opacity 0.3s;
          white-space: nowrap;
        }
        .zoom-hint.hidden { opacity: 0; }
      `}</style>
    </div>
  );
}

// ── Main detail page ────────────────────────────────────────────────────────
function ArtworkDetail() {
  const { year, artworkId } = useParams();
  const navigate = useNavigate();

  const artworks = artworkByYear[year] || [];
  const currentIdx = artworks.findIndex((a) => a.id === artworkId);
  const artwork = artworks[currentIdx];

  const goTo = (idx) => {
    if (idx >= 0 && idx < artworks.length) {
      navigate(`/artwork/${year}/${artworks[idx].id}`);
    }
  };

  // Keyboard navigation
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
      <div className="detail-error">
        <p>Artwork not found.</p>
        <button onClick={() => navigate(`/artwork/${year}`)}>
          ← Back to {year}
        </button>
      </div>
    );
  }

  return (
    <div className="detail-page">
      {/* Top bar */}
      <div className="detail-topbar">
        <button
          className="detail-back"
          onClick={() => navigate(`/artwork/${year}`)}
        >
          ← {year}
        </button>
        <span className="detail-counter">
          {currentIdx + 1} / {artworks.length}
        </span>
      </div>

      {/* Image viewer */}
      <ZoomableImage src={artwork.image} alt={artwork.title} />

      {/* Info */}
      <div className="detail-info">
        <h1 className="detail-title">{artwork.title}</h1>
        <div className="detail-meta-row">
          {artwork.medium && (
            <span className="detail-meta">{artwork.medium}</span>
          )}
          {artwork.size && <span className="detail-meta">{artwork.size}</span>}
          {artwork.year && <span className="detail-meta">{artwork.year}</span>}
        </div>
        {artwork.note && <p className="detail-note">{artwork.note}</p>}
      </div>

      {/* Prev / Next */}
      <div className="detail-nav">
        <button
          className="detail-nav-btn"
          onClick={() => goTo(currentIdx - 1)}
          disabled={currentIdx === 0}
        >
          ← previous
        </button>
        {/* Strip */}
        <div className="detail-strip">
          {artworks.map((a, i) => (
            <button
              key={a.id}
              className={`detail-strip-thumb ${i === currentIdx ? "active" : ""}`}
              onClick={() => navigate(`/artwork/${year}/${a.id}`)}
            >
              <img src={a.image} alt={a.title} />
            </button>
          ))}
        </div>
        <button
          className="detail-nav-btn"
          onClick={() => goTo(currentIdx + 1)}
          disabled={currentIdx === artworks.length - 1}
        >
          next →
        </button>
      </div>

      <style>{`
        .detail-page {
          max-width: 960px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 4rem;
        }
        .detail-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .detail-back {
          background: none;
          border: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #777;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }
        .detail-back:hover { color: #111; }
        .detail-counter {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          color: #aaa;
          letter-spacing: 0.08em;
        }
        .detail-info {
          margin-top: 1.25rem;
        }
        .detail-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.4rem, 3.5vw, 2rem);
          font-weight: 400;
          font-style: italic;
          color: #1a1a1a;
          margin: 0 0 0.5rem;
          line-height: 1.2;
        }
        .detail-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem 0.8rem;
        }
        .detail-meta {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.06em;
          color: #888;
        }
        .detail-meta + .detail-meta::before {
          content: '·';
          margin-right: 0.8rem;
          color: #ccc;
        }
        .detail-note {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          color: #aaa;
          margin-top: 0.4rem;
          font-style: italic;
        }
        .detail-nav {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 2.5rem;
          border-top: 1px solid #e8e5e0;
          padding-top: 1.5rem;
        }
        .detail-nav-btn {
          background: none;
          border: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #555;
          cursor: pointer;
          white-space: nowrap;
          padding: 0;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .detail-nav-btn:disabled { color: #ccc; cursor: default; }
        .detail-nav-btn:not(:disabled):hover { color: #111; }
        .detail-strip {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          flex: 1;
          scrollbar-width: none;
        }
        .detail-strip::-webkit-scrollbar { display: none; }
        .detail-strip-thumb {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border: 1px solid transparent;
          padding: 0;
          background: #f0ede8;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .detail-strip-thumb.active { border-color: #1a1a1a; }
        .detail-strip-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .detail-error {
          padding: 4rem 2rem;
          text-align: center;
          font-family: 'Cormorant Garamond', Georgia, serif;
          color: #888;
        }
      `}</style>
    </div>
  );
}

export default ArtworkDetail;
