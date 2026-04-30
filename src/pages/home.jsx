import { useEffect, useState, useCallback, useRef } from "react";
import { artworkByYear } from "../data/artworkData";

const allArtworks = Object.values(artworkByYear).flat();

const FADE_MS = 1500;
const HOLD_MS = 6000;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const [queue, setQueue] = useState(() => shuffle(allArtworks));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(1);
  const [aOnTop, setAOnTop] = useState(true);
  const [slotA, setSlotA] = useState(allArtworks[0]);
  const [slotB, setSlotB] = useState(allArtworks[1]);
  const [transitioning, setTransitioning] = useState(false);
  const intervalRef = useRef(null);

  const advance = useCallback(
    (direction, currentQueue = queue, fromIdx = currentIdx) => {
      if (transitioning) return;

      let next = fromIdx + direction;
      let newQueue = currentQueue;
      if (next < 0) next = currentQueue.length - 1;
      if (next >= currentQueue.length) {
        newQueue = shuffle(allArtworks);
        setQueue(newQueue);
        next = 0;
      }

      const nextArtwork = newQueue[next];
      const nextNext = (next + 1) % newQueue.length;

      setTransitioning(true);

      setAOnTop((prev) => {
        if (prev) setSlotB(nextArtwork);
        else setSlotA(nextArtwork);
        return prev;
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAOnTop((prev) => !prev);
          setCurrentIdx(next);
          setNextIdx(nextNext);
          setTimeout(() => setTransitioning(false), FADE_MS);
        });
      });
    },
    [queue, currentIdx, transitioning],
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => advance(1), HOLD_MS + FADE_MS);
    return () => clearInterval(intervalRef.current);
  }, [advance]);

  const handleArrow = (dir) => {
    clearInterval(intervalRef.current);
    advance(dir);
    intervalRef.current = setInterval(() => advance(1), HOLD_MS + FADE_MS);
  };

  const current = queue[currentIdx];
  const transitionStyle = `opacity ${FADE_MS}ms ease-in-out`;

  return (
    <div className="fixed inset-0 z-0 bg-white overflow-hidden">
      {/* Slot A */}
      <img
        src={slotA.image}
        alt={slotA.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: aOnTop ? 1 : 0,
          transition: transitionStyle,
          zIndex: aOnTop ? 2 : 1,
        }}
      />

      {/* Slot B */}
      <img
        src={slotB.image}
        alt={slotB.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: aOnTop ? 0 : 1,
          transition: transitionStyle,
          zIndex: aOnTop ? 1 : 2,
        }}
      />

      {/* White gradient at top — solid for longer before fading */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{
          height: "40%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 30%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Caption */}
      <div className="absolute top-32 left-16 z-20">
        <h1 className="font-['Outfit',_sans-serif] font-light text-4xl tracking-wide text-stone-500 leading-tight mb-1">
          {current.title}
        </h1>
        {current.year && (
          <h2 className="font-['Outfit',_sans-serif] font-light text-xl tracking-widest text-rose-300">
            {current.year}
          </h2>
        )}
      </div>

      {/* Left arrow */}
      <button
        onClick={() => handleArrow(-1)}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white transition-colors text-2xl px-3 py-6 cursor-pointer"
        aria-label="Previous"
      >
        ←
      </button>

      {/* Right arrow */}
      <button
        onClick={() => handleArrow(1)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white transition-colors text-2xl px-3 py-6 cursor-pointer"
        aria-label="Next"
      >
        →
      </button>
    </div>
  );
}
