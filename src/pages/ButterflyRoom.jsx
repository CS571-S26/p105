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
    top: "#4a2c40", // Muted Plum (Darker top for better contrast)
    middle: "#cb765f", // Dusky Terracotta
    bottom: "#8e443d", // Deep Rust
    firefly: "#fffeb0",
    text: "#3d1e16", // Deep Burnt Umber for legibility
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

  // Initialize with a random theme
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
    const ESCAPE_SPEED_BOOST = 2.5;
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
    <div className="butterfly-room">
      <div
        className="bfr-stage"
        ref={containerRef}
        onMouseDown={handleMouseDown}
      >
        <div
          className="bfr-bg-overlay"
          style={{
            background: `linear-gradient(to bottom, ${themeColors.top} 0%, ${themeColors.middle} 50%, ${themeColors.bottom} 100%)`,
          }}
        />

        {firefliesData.map((f) => (
          <div
            key={f.id}
            className="bfr-firefly"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: f.size,
              height: f.size,
              opacity: currentTheme === "day" ? f.opacity * 0.2 : f.opacity,
              backgroundColor: themeColors.firefly,
            }}
          />
        ))}

        {butterfliesData.map((bf) => {
          const frameTime = 5000;
          const step = Math.floor((Date.now() + bf.flutterOffset) / frameTime);
          const jitter = ((step % 3) - 1) * 3;

          return (
            <div
              key={bf.id}
              className={`bfr-butterfly ${selectedBfId === bf.id ? "is-caught" : ""} ${draggedBfId === bf.id ? "is-dragging" : ""}`}
              style={{
                left: `${bf.x}%`,
                top: `${bf.y}%`,
                width: `${bf.displaySize}px`,
                transform: `
                  translate(-50%, -50%)
                  scaleX(${bf.flipH ? -1 : 1})
                  rotate(${bf.rotation + jitter}deg)
                `,
              }}
            >
              <img
                src={bf.image}
                alt={bf.name}
                className="bfr-bf-img"
                style={{ width: "100%", display: "block" }}
              />
            </div>
          );
        })}
      </div>

      <div
        className="bfr-bottom-panel"
        style={{
          background: `linear-gradient(to top, ${themeColors.bottom} 85%, transparent)`,
        }}
      >
        <div className="bfr-panel-container">
          <div className={`bfr-info-content ${caughtBf ? "is-active" : ""}`}>
            {caughtBf && (
              <>
                <img
                  src={caughtBf.image}
                  alt={caughtBf.name}
                  className="bfr-info-img"
                />
                <div className="bfr-info-text">
                  <p className="bfr-info-name">{caughtBf.name}</p>
                  <p
                    className="bfr-info-meta"
                    style={{ color: themeColors.text }}
                  >
                    {caughtBf.size} · {caughtBf.year}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className={`bfr-general-desc ${!caughtBf ? "is-active" : ""}`}>
            <p style={{ color: themeColors.text }}>
              A convention is a useful artist’s tool: a handy template to
              revisit and practice any time. Nature created a dazzling diversity
              of butterflies and moths, which are the inspiration for this
              artistic convention.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .butterfly-room {
          min-height: 125vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .bfr-stage {
          position: relative;
          height: 110vh;
          width: 100%;
          overflow: hidden;
          cursor: crosshair;
        }
        .bfr-stage:active { cursor: grabbing; }
        .bfr-bg-overlay {
          position: absolute;
          inset: 0;
          transition: background 1s ease;
        }
        .bfr-firefly {
          position: absolute;
          border-radius: 50%;
          box-shadow: 0 0 10px 2px rgba(255, 254, 176, 0.4);
          pointer-events: none;
        }
        .bfr-butterfly {
          position: absolute;
          pointer-events: none;
          z-index: 5;
          will-change: left, top, transform;
        }
        .bfr-butterfly.is-dragging { z-index: 100; }
        .bfr-bf-img {
          filter: drop-shadow(0 0 10px rgba(0,0,0,0.2));
          transition: transform 0.5s cubic-bezier(0.1, 0, 0.2, 1), filter 0.5s ease;
        }
        .bfr-bottom-panel {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 140px; 
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          pointer-events: none;
        }
        .bfr-panel-container {
          position: relative;
          width: 100%;
          max-width: 700px;
          height: 100px;
        }
        .bfr-info-content, .bfr-general-desc {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          transition: opacity 0.4s ease, transform 0.4s ease;
          opacity: 0;
          transform: translateY(8px);
        }
        .bfr-info-content.is-active, .bfr-general-desc.is-active {
          opacity: 1;
          transform: translateY(0);
        }
        .bfr-info-img { height: 65px; }
        .bfr-info-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem; 
          margin: 0; color: #fff;
          font-style: italic;
        }
        .bfr-info-meta {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .bfr-general-desc p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          line-height: 1.6;
          font-style: italic;
          text-align: center;
          max-width: 600px;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default ButterflyRoom;
