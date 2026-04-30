export function initButterfly(bf) {
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
    flutterOffset: Math.random() * 4000,
  };
}

export function initFirefly() {
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
