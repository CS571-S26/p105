// ButterflyLayer.jsx
// Renders all butterfly sprites on the stage.

function ButterflyLayer({ butterfliesData, draggedBfId }) {
  return (
    <>
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
    </>
  );
}

export default ButterflyLayer;
