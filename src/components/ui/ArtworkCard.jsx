// components/ui/ArtworkCard.jsx
import { useNavigate } from "react-router-dom";
import { Button } from "react-aria-components";

function ArtworkCard({ artwork, yearSlug }) {
  const navigate = useNavigate();

  return (
    <Button
      className="group block w-full text-left break-inside-avoid mb-6
                 outline-none cursor-pointer
                 focus-visible:ring-2 focus-visible:ring-stone-800 focus-visible:ring-offset-2"
      onPress={() => navigate(`/artwork/${yearSlug}/${artwork.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-stone-100">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-auto block transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:brightness-90"
          loading="lazy"
        />
      </div>

      {/* Caption */}
      <div className="pt-2.5">
        <p className="font-['Outfit',_sans-serif] text-[0.88rem] leading-snug text-stone-800 mb-0.5">
          {artwork.title}
        </p>
        {(artwork.medium || artwork.size) && (
          <p className="font-['Outfit',_sans-serif] text-[0.7rem] tracking-[0.04em] text-stone-400">
            {artwork.medium}
            {artwork.size ? ` | ${artwork.size}` : ""}
          </p>
        )}
      </div>
    </Button>
  );
}

export default ArtworkCard;
