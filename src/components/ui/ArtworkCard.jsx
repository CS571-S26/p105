// components/ui/ArtworkCard.jsx
import { useNavigate } from "react-router-dom";
import { Button } from "react-aria-components";

function ArtworkCard({ artwork, yearSlug }) {
  const navigate = useNavigate();

  return (
    <Button
      className="group block w-full text-left break-inside-avoid mb-6
                 outline-none cursor-pointer rounded-sm
                 focus-visible:ring-2 focus-visible:ring-stone-800 focus-visible:ring-offset-2"
      onPress={() => navigate(`/artwork/${yearSlug}/${artwork.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-stone-100">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-auto block transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                     group-hover:scale-[1.03]"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center
                     bg-black/0 group-hover:bg-black/[0.18] transition-colors duration-300"
        >
          <span
            className="font-['Jost'] text-[0.68rem] uppercase tracking-[0.12em] text-white
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            click to view
          </span>
        </div>
      </div>

      {/* Caption */}
      <div className="pt-2.5">
        <p className="font-['Cormorant_Garamond'] text-[0.9rem] italic leading-snug text-stone-800 mb-0.5">
          {artwork.title}
        </p>
        {(artwork.medium || artwork.size) && (
          <p className="font-['Jost'] text-[0.7rem] tracking-[0.04em] text-stone-400">
            {artwork.medium}
            {artwork.size ? ` | ${artwork.size}` : ""}
          </p>
        )}
      </div>
    </Button>
  );
}

export default ArtworkCard;
