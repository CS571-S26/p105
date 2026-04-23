// GalleryPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { artworkByYear, YEARS } from "../data/artworkData";
import ArtworkCard from "../components/ui/ArtworkCard";
import YearNav from "../components/layout/YearNav";

function GalleryPage() {
  const { year } = useParams();
  const navigate = useNavigate();
  const artworks = artworkByYear[year] || [];

  // If no year param, show the year-selection overview
  if (!year) {
    return (
      <div className="gallery-overview">
        <h1 className="gallery-overview-title">artwork</h1>
        <div className="gallery-year-grid">
          {YEARS.map((y) => (
            <div
              key={y}
              className="gallery-year-card"
              onClick={() => navigate(`/artwork/${y}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/artwork/${y}`)}
            >
              {artworkByYear[y]?.[0]?.image && (
                <img
                  src={artworkByYear[y][0].image}
                  alt={y}
                  className="gallery-year-card-img"
                />
              )}
              <div className="gallery-year-card-label">{y}</div>
            </div>
          ))}
        </div>

        <style>{`
          .gallery-overview {
            padding: 4rem 2rem 6rem;
            max-width: 1100px;
            margin: 0 auto;
          }
          .gallery-overview-title {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 300;
            font-style: italic;
            color: #1a1a1a;
            margin: 0 0 3rem;
          }
          .gallery-year-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
          }
          .gallery-year-card {
            cursor: pointer;
            position: relative;
            overflow: hidden;
            aspect-ratio: 4/3;
            background: #f0ede8;
          }
          .gallery-year-card-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .gallery-year-card:hover .gallery-year-card-img { transform: scale(1.04); }
          .gallery-year-card-label {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            padding: 2rem 1.2rem 1.2rem;
            background: linear-gradient(transparent, rgba(0,0,0,0.55));
            color: #fff;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1.5rem;
            font-weight: 300;
            letter-spacing: 0.06em;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <button
          className="gallery-back-btn"
          onClick={() => navigate("/artwork")}
        >
          ← artwork
        </button>
        <h1 className="gallery-year-title">{year}</h1>
        <div className="gallery-year-tabs">
          {YEARS.map((y) => (
            <button
              key={y}
              className={`gallery-year-tab ${y === year ? "active" : ""}`}
              onClick={() => navigate(`/artwork/${y}`)}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {artworks.length === 0 ? (
        <p className="gallery-empty">No works found for this year.</p>
      ) : (
        <div className="gallery-masonry">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} yearSlug={year} />
          ))}
        </div>
      )}

      <YearNav currentYear={year} />

      <style>{`
        .gallery-page {
          padding: 2rem 2rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .gallery-header {
          margin-bottom: 2.5rem;
        }
        .gallery-back-btn {
          background: none;
          border: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
          cursor: pointer;
          padding: 0;
          margin-bottom: 0.8rem;
          display: block;
          transition: color 0.2s;
        }
        .gallery-back-btn:hover { color: #111; }
        .gallery-year-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 300;
          font-style: italic;
          color: #1a1a1a;
          margin: 0 0 1.5rem;
          line-height: 1;
        }
        .gallery-year-tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid #e0ddd8;
          margin-bottom: 0.5rem;
          overflow-x: auto;
        }
        .gallery-year-tab {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          padding: 0.5rem 1rem 0.5rem 0;
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          color: #888;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .gallery-year-tab.active {
          color: #1a1a1a;
          border-bottom-color: #1a1a1a;
        }
        .gallery-year-tab:hover { color: #1a1a1a; }
        .gallery-masonry {
          columns: 3 280px;
          column-gap: 1.5rem;
        }
        @media (max-width: 700px) {
          .gallery-masonry { columns: 2 160px; }
        }
        @media (max-width: 450px) {
          .gallery-masonry { columns: 1; }
        }
        .gallery-empty {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.1rem;
          color: #888;
          font-style: italic;
          padding: 3rem 0;
        }
      `}</style>
    </div>
  );
}

export default GalleryPage;
