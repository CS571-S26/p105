// FireflyLayer.jsx
// Renders all firefly dots on the stage.

function FireflyLayer({ firefliesData, currentTheme, themeColors }) {
  return (
    <>
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
            boxShadow: "0 0 10px 5px rgba(255, 254, 176, 0.4)",
          }}
        />
      ))}
    </>
  );
}

export default FireflyLayer;
