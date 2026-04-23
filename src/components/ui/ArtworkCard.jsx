// ArtworkCard.jsx
import { useNavigate } from 'react-router-dom';

function ArtworkCard({ artwork, yearSlug }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/artwork/${yearSlug}/${artwork.id}`);
  };

  return (
    <div className="artwork-card" onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}>
      <div className="artwork-card-img-wrap">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="artwork-card-img"
          loading="lazy"
        />
        <div className="artwork-card-overlay">
          <span className="artwork-card-zoom-hint">click to view</span>
        </div>
      </div>
      <div className="artwork-card-info">
        <p className="artwork-card-title">{artwork.title}</p>
        {artwork.medium && (
          <p className="artwork-card-meta">
            {artwork.medium}{artwork.size ? ` | ${artwork.size}` : ''}
          </p>
        )}
      </div>

      <style>{`
        .artwork-card {
          cursor: pointer;
          break-inside: avoid;
          margin-bottom: 1.5rem;
        }
        .artwork-card-img-wrap {
          position: relative;
          overflow: hidden;
          background: #f5f5f3;
        }
        .artwork-card-img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .artwork-card:hover .artwork-card-img {
          transform: scale(1.03);
        }
        .artwork-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }
        .artwork-card:hover .artwork-card-overlay {
          background: rgba(0,0,0,0.18);
        }
        .artwork-card-zoom-hint {
          color: #fff;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .artwork-card:hover .artwork-card-zoom-hint {
          opacity: 1;
        }
        .artwork-card-info {
          padding: 0.6rem 0 0;
        }
        .artwork-card-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.9rem;
          font-style: italic;
          color: #1a1a1a;
          margin: 0 0 0.15rem;
          line-height: 1.3;
        }
        .artwork-card-meta {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          color: #888;
          letter-spacing: 0.04em;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default ArtworkCard;
