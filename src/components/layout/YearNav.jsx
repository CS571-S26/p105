// YearNav.jsx
import { useNavigate } from "react-router-dom";
import { YEARS } from "../../data/artworkData";

function YearNav({ currentYear }) {
  const navigate = useNavigate();
  const idx = YEARS.indexOf(currentYear);
  const prev = idx > 0 ? YEARS[idx - 1] : null;
  const next = idx < YEARS.length - 1 ? YEARS[idx + 1] : null;

  return (
    <div className="year-nav">
      {prev && (
        <button
          className="year-nav-btn"
          onClick={() => navigate(`/artwork/${prev}`)}
        >
          ← {prev}
        </button>
      )}
      <div className="year-nav-dots">
        {YEARS.map((y) => (
          <button
            key={y}
            className={`year-dot ${y === currentYear ? "active" : ""}`}
            onClick={() => navigate(`/artwork/${y}`)}
            title={y}
          />
        ))}
      </div>
      {next && (
        <button
          className="year-nav-btn"
          onClick={() => navigate(`/artwork/${next}`)}
        >
          {next} →
        </button>
      )}

      <style>{`
        .year-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem 0 3rem;
          border-top: 1px solid #e0ddd8;
          margin-top: 3rem;
        }
        .year-nav-btn {
          background: none;
          border: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #555;
          cursor: pointer;
          padding: 0.4rem 0;
          transition: color 0.2s;
        }
        .year-nav-btn:hover { color: #111; }
        .year-nav-dots {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .year-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ccc;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .year-dot.active {
          background: #1a1a1a;
          transform: scale(1.4);
        }
        .year-dot:hover { background: #888; }
      `}</style>
    </div>
  );
}

export default YearNav;
