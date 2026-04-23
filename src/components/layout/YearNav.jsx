// components/layout/YearNav.jsx
import { useNavigate } from "react-router-dom";
import { Button } from "react-aria-components";
import { YEARS } from "../../data/artworkData";

function YearNav({ currentYear }) {
  const navigate = useNavigate();
  const idx = YEARS.indexOf(currentYear);
  const prev = idx > 0 ? YEARS[idx - 1] : null;
  const next = idx < YEARS.length - 1 ? YEARS[idx + 1] : null;

  return (
    <div className="flex items-center justify-between pt-8 mt-12 border-t border-stone-200">
      {/* Prev */}
      {prev ? (
        <Button
          className="font-['Jost'] text-[0.75rem] uppercase tracking-[0.1em] text-stone-400
                     hover:text-stone-900 transition-colors outline-none cursor-pointer
                     focus-visible:ring-2 focus-visible:ring-stone-800 rounded-sm px-1"
          onPress={() => navigate(`/artwork/${prev}`)}
        >
          ← {prev}
        </Button>
      ) : (
        <span />
      )}

      {/* Dot indicators */}
      <div
        className="flex items-center gap-2"
        role="tablist"
        aria-label="Year navigation"
      >
        {YEARS.map((y) => (
          <Button
            key={y}
            role="tab"
            aria-selected={y === currentYear}
            aria-label={y}
            className={`rounded-full border-none outline-none cursor-pointer transition-all duration-200
                        focus-visible:ring-2 focus-visible:ring-stone-800
                        ${
                          y === currentYear
                            ? "w-2 h-2 bg-stone-800 scale-[1.4]"
                            : "w-1.5 h-1.5 bg-stone-300 hover:bg-stone-500"
                        }`}
            onPress={() => navigate(`/artwork/${y}`)}
          />
        ))}
      </div>

      {/* Next */}
      {next ? (
        <Button
          className="font-['Jost'] text-[0.75rem] uppercase tracking-[0.1em] text-stone-400
                     hover:text-stone-900 transition-colors outline-none cursor-pointer
                     focus-visible:ring-2 focus-visible:ring-stone-800 rounded-sm px-1"
          onPress={() => navigate(`/artwork/${next}`)}
        >
          {next} →
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}

export default YearNav;
