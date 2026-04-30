// components/ui/YearCard.jsx
import { Button } from "react-aria-components";

function YearCard({ year, image, onPress }) {
  return (
    <Button
      className="group relative overflow-hidden aspect-[4/3] bg-stone-100 w-full
                 outline-none cursor-pointer rounded-sm block
                 focus-visible:ring-2 focus-visible:ring-stone-800 focus-visible:ring-offset-2"
      onPress={onPress}
      aria-label={`View ${year} gallery`}
    >
      {image && (
        <img
          src={image}
          alt={year}
          className="absolute inset-0 w-full h-full object-cover
                     transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                     group-hover:scale-[1.04]"
        />
      )}

      {/* Gradient label */}
      <div
        className="absolute bottom-0 left-0 right-0 pt-16 pb-5 px-5
                   bg-gradient-to-t from-black/55 to-transparent"
      >
        <span className="font-['Outfit',_sans-serif] text-2xl font-light tracking-[0.06em] text-white">
          {year}
        </span>
      </div>
    </Button>
  );
}

export default YearCard;
