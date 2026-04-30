// BottomPanel.jsx
// Fixed info panel at the bottom of the stage.
// Shows butterfly details when one is selected, or a descriptive blurb otherwise.

function BottomPanel({ themeColors, caughtBf }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-[180px] flex items-center justify-center z-[200] pointer-events-none"
      style={{
        background: `linear-gradient(to top, ${themeColors.bottom} 0%, ${themeColors.bottom}e6 50%, transparent 100%)`,
      }}
    >
      <div className="relative w-full max-w-[700px] h-[100px]">
        {/* Butterfly detail card */}
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
                  className="font-['Outfit'] text-[0.75rem] tracking-[0.1em] uppercase m-0"
                  style={{ color: themeColors.text }}
                >
                  {caughtBf.size} · {caughtBf.year}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Default blurb */}
        <div
          className={[
            "absolute inset-0 flex items-center justify-center",
            "transition-[opacity,transform] duration-[400ms] ease-in-out",
            !caughtBf
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-0 pointer-events-none",
          ].join(" ")}
        >
          <p
            className="font-['Cormorant_Garamond'] text-[1.1rem] leading-[1.6] italic text-center max-w-[1200px] m-0"
            style={{ color: themeColors.text }}
          >
            A convention is a useful artist's tool: a handy template to revisit
            and practice any time. Nature created a dazzling diversity of
            butterflies and moths, which are the inspiration for this artistic
            convention. They happen to be the perfect symbol of transformation
            with which to explore colors, details, and symmetry.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BottomPanel;
