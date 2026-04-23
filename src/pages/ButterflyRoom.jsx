// pages/ButterflyRoom.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { butterflies } from "../data/artworkData";

// --- THEME PRESETS ---
const THEMES = {
  day: {
    top: "#e0f2fe",
    middle: "#bae6fd",
    bottom: "#7dd3fc",
    firefly: "rgba(255, 255, 255, 0.6)",
    text: "#2c5a73",
  },
  sunset: {
    top: "#4a2c40",
    middle: "#cb765f",
    bottom: "#8e443d",
    firefly: "#fffeb0",
    text: "#3d1e16",
  },
  twilight: {
    top: "#2c3e50",
    middle: "#4ca1af",
    bottom: "#2c3e50",
    firefly: "#fffeb0",
    text: "#4a5073",
  },
  night: {
    top: "#05071a",
    middle: "#02040f",
    bottom: "#05071a",
    firefly: "#fffeb0",
    text: "#5d6385",
  },
};

function initButterfly(bf) {
  const rawSize = bf.size || "10cm";
  const numValue = parseFloat(rawSize.replace(/[^0-9.]/g, "")) || 10;
  const normalizedCm = numValue > 40 ? numValue / 10 : numValue;
  const sizeMultiplier = 50;

  return {
    ...bf,
    x: Math.random() * 100,
    y: Math.random() * 100,
    angle: Math.random() * Math.PI * 2,
    speed: 0.03 + Math.random() * 0.02,
    tx: Math.random() * 100,
    ty: Math.random() * 100,
    wanderTimer: Math.random() * 200,
    displaySize: normalizedCm * sizeMultiplier + 80,
    flipH: Math.random() > 0.5,
    rotation: 0,
    flutterOffset: Math.random() * 5000,
  };
}

function initFirefly() {
  return {
    id: Math.random(),
    x: Math.random() * 100,
    y: Math.random() * 100,
    vx: (Math.random() - 0.5) * 0.015,
    vy: (Math.random() - 0.5) * 0.015,
    size: 1.2 + Math.random() * 2,
    opacity: Math.random(),
    pulse: 0.004 + Math.random() * 0.006,
  };
}

function ButterflyRoom() {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef(null);

  const [currentTheme] = useState(() => {
    const keys = Object.keys(THEMES);
    return keys[Math.floor(Math.random() * keys.length)];
  });

  const [butterfliesData] = useState(() =>
    butterflies.map((bf) => initButterfly(bf)),
  );
  const [firefliesData] = useState(() =>
    Array.from({ length: 100 }, initFirefly),
  );

  const [, setRenderTick] = useState(0);
  const [selectedBfId, setSelectedBfId] = useState(null);
  const [draggedBfId, setDraggedBfId] = useState(null);

  const themeColors = THEMES[currentTheme];

  const handleMouseDown = useCallback(() => {
    if (selectedBfId) setDraggedBfId(selectedBfId);
  }, [selectedBfId]);

  const handleMouseUp = useCallback(() => {
    setDraggedBfId(null);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseUp]);

  useEffect(() => {
    const CATCH_RADIUS = 10;
    const GLIDE_RADIUS = 25;
    const GLIDE_STRENGTH = 0.2;
    const STEER_SPEED = 0.03;
    const ESCAPE_SPEED_BOOST = 4;
    const DRAG_EASING = 0.1;

    const tick = () => {
      const mouse = mouseRef.current;
      let closestId = null;
      let minDistance = Infinity;

      butterfliesData.forEach((bf) => {
        if (bf.id === draggedBfId) {
          bf.x += (mouse.x - bf.x) * DRAG_EASING;
          bf.y += (mouse.y - bf.y) * DRAG_EASING;
          bf.tx = bf.x;
          bf.ty = bf.y;
          bf.rotation *= 0.9;
          closestId = bf.id;
          return;
        }

        bf.wanderTimer--;
        if (bf.wanderTimer <= 0) {
          const pickCornerX = Math.random() > 0.5 ? 10 : 90;
          const pickCornerY = Math.random() > 0.5 ? 10 : 90;
          bf.tx = pickCornerX + (Math.random() - 0.5) * 20;
          bf.ty = pickCornerY + (Math.random() - 0.5) * 20;
          bf.wanderTimer = 400 + Math.random() * 600;
        }

        if (bf.x > 40 && bf.x < 60 && bf.y > 40 && bf.y < 60) {
          bf.tx = bf.x < 50 ? 5 : 95;
        }

        const dx = bf.tx - bf.x;
        const dy = bf.ty - bf.y;
        let targetAngle = Math.atan2(dy, dx);
        const dmx = bf.x - mouse.x;
        const dmy = bf.y - mouse.y;
        const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
        let moveSpeed = bf.speed;

        if (distMouse < GLIDE_RADIUS) {
          const angleAway = Math.atan2(dmy, dmx);
          const fleeUrgency = 1 - distMouse / GLIDE_RADIUS;
          targetAngle =
            angleAway * (GLIDE_STRENGTH + fleeUrgency) +
            targetAngle * (1 - GLIDE_STRENGTH - fleeUrgency);
          moveSpeed *= 1 + fleeUrgency * ESCAPE_SPEED_BOOST;
        }

        let diff = targetAngle - bf.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        bf.angle += diff * STEER_SPEED;

        const vx = Math.cos(bf.angle) * moveSpeed;
        const vy = Math.sin(bf.angle) * moveSpeed;
        bf.x += vx;
        bf.y += vy;
        bf.x = Math.max(2, Math.min(98, bf.x));
        bf.y = Math.max(2, Math.min(98, bf.y));

        if (distMouse < CATCH_RADIUS && distMouse < minDistance) {
          minDistance = distMouse;
          closestId = bf.id;
        }

        bf.flipH = Math.cos(bf.angle) < 0;
        const targetRot = Math.cos(bf.angle) * 10;
        bf.rotation += (targetRot - bf.rotation) * 0.2;
      });

      setSelectedBfId(closestId);
      setRenderTick((t) => t + 1);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [butterfliesData, draggedBfId]);

  const caughtBf = butterfliesData.find((b) => b.id === selectedBfId);

  return (
    <div className="min-h-[125vh] flex flex-col overflow-hidden">
      {/* ── Stage ── */}
      <div
        ref={containerRef}
        className="relative h-[110vh] w-full overflow-hidden cursor-crosshair active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        {/* Gradient background — dynamic colours prevent Tailwind, so inline style stays */}
        <div
          className="absolute inset-0 transition-[background] duration-1000 ease-in-out"
          style={{
            background: `linear-gradient(to bottom, ${themeColors.top} 0%, ${themeColors.middle} 50%, ${themeColors.bottom} 100%)`,
          }}
        />

        {/* Fireflies */}
        {firefliesData.map((f) => (
          <div
            key={f.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: f.size,
              height: f.size,
              opacity: currentTheme === "day" ? f.opacity * 0.2 : f.opacity,
              backgroundColor: themeColors.firefly,
              boxShadow: "0 0 10px 2px rgba(255, 254, 176, 0.4)",
            }}
          />
        ))}

        {/* Butterflies */}
        {butterfliesData.map((bf) => {
          const frameTime = 5000;
          const step = Math.floor((Date.now() + bf.flutterOffset) / frameTime);
          const jitter = ((step % 3) - 1) * 3;

          return (
            <div
              key={bf.id}
              className={[
                "absolute pointer-events-none will-change-[left,top,transform]",
                draggedBfId === bf.id ? "z-[100]" : "z-[5]",
              ].join(" ")}
              style={{
                left: `${bf.x}%`,
                top: `${bf.y}%`,
                width: `${bf.displaySize}px`,
                transform: `translate(-50%, -50%) scaleX(${bf.flipH ? -1 : 1}) rotate(${bf.rotation + jitter}deg)`,
              }}
            >
              <img
                src={bf.image}
                alt={bf.name}
                className="w-full block"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(0,0,0,0.2))",
                  transition:
                    "transform 0.5s cubic-bezier(0.1, 0, 0.2, 1), filter 0.5s ease",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ── Bottom panel ── */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[140px] flex items-center justify-center z-[200] pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${themeColors.bottom} 85%, transparent)`,
        }}
      >
        <div className="relative w-full max-w-[700px] h-[100px]">
          {/* Butterfly info — visible when a butterfly is near the cursor */}
          <div
            className={[
              "absolute inset-0 flex items-center justify-center gap-6",
              "transition-[opacity,transform] duration-[400ms] ease-in-out",
              caughtBf
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none",
            ].join(" ")}
          >
            {caughtBf && (
              <>
                <img
                  src={caughtBf.image}
                  alt={caughtBf.name}
                  className="h-[65px] w-auto"
                />
                <div>
                  <p className="font-['Cormorant_Garamond'] text-[1.6rem] italic text-white m-0">
                    {caughtBf.name}
                  </p>
                  <p
                    className="font-['Jost'] text-[0.75rem] tracking-[0.1em] uppercase m-0"
                    style={{ color: themeColors.text }}
                  >
                    {caughtBf.size} · {caughtBf.year}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* General description — visible when no butterfly is near */}
          <div
            className={[
              "absolute inset-0 flex items-center justify-center",
              "transition-[opacity,transform] duration-[400ms] ease-in-out",
              !caughtBf
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none",
            ].join(" ")}
          >
            <p
              className="font-['Cormorant_Garamond'] text-[1.1rem] leading-[1.6] italic text-center max-w-[600px] m-0"
              style={{ color: themeColors.text }}
            >
              A convention is a useful artist's tool: a handy template to
              revisit and practice any time. Nature created a dazzling diversity
              of butterflies and moths, which are the inspiration for this
              artistic convention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ButterflyRoom;
