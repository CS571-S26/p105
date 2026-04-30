import { useEffect, useRef, useState, useCallback } from "react";
import { butterflies } from "../data/artworkData";
import { THEMES } from "../data/themes";
import { initButterfly, initFirefly } from "../utils/butterflyUtils";
import FireflyLayer from "../components/ui/FireflyLayer";
import ButterflyLayer from "../components/ui/ButterflyLayer";
import BottomPanel from "../components/layout/BottomPanel";

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

  // --- PREVENT WHITE SCROLL VOID ---
  useEffect(() => {
    document.body.style.backgroundColor = themeColors.bottom;
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [themeColors.bottom]);

  const handleMouseDown = useCallback(() => {
    if (selectedBfId) setDraggedBfId(selectedBfId);
  }, [selectedBfId]);

  const handleMouseUp = useCallback(() => {
    setDraggedBfId(null);
  }, []);

  // --- MOUSE TRACKING ---
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

  // --- ANIMATION LOOP ---
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
    <div
      className="min-h-[125vh] flex flex-col overflow-x-hidden"
      style={{ backgroundColor: themeColors.bottom }}
    >
      {/* ── Stage ── */}
      <div
        ref={containerRef}
        className="relative h-[125vh] w-full overflow-hidden cursor-crosshair active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 transition-[background] duration-1000 ease-in-out"
          style={{
            background: `linear-gradient(to bottom, ${themeColors.top} 0%, ${themeColors.middle} 50%, ${themeColors.bottom} 100%)`,
          }}
        />

        <FireflyLayer
          firefliesData={firefliesData}
          currentTheme={currentTheme}
          themeColors={themeColors}
        />

        <ButterflyLayer
          butterfliesData={butterfliesData}
          draggedBfId={draggedBfId}
        />
      </div>

      <BottomPanel themeColors={themeColors} caughtBf={caughtBf} />
    </div>
  );
}

export default ButterflyRoom;
