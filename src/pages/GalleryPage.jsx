// pages/GalleryPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabList, Tab, TabPanel, Button } from "react-aria-components";
import { artworkByYear, YEARS } from "../data/artworkData";
import ArtworkCard from "../components/ui/ArtworkCard";
import YearCard from "../components/ui/YearCard";
import YearNav from "../components/layout/YearNav";

// ── Overview: grid of year cards ────────────────────────────────
function ArtworkOverview() {
  const navigate = useNavigate();
  return (
    <div className="px-8 pt-16 pb-24 max-w-[1100px] mx-auto">
      <h1
        className="font-['Cormorant_Garamond'] font-light italic text-stone-900
                     text-[clamp(2rem,5vw,3.5rem)] mb-12"
      >
        artwork
      </h1>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {YEARS.map((y) => (
          <YearCard
            key={y}
            year={y}
            image={artworkByYear[y]?.[0]?.image}
            onPress={() => navigate(`/artwork/${y}`)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Year gallery: masonry grid with tab switcher ─────────────────
function YearGallery({ year }) {
  const navigate = useNavigate();
  const artworks = artworkByYear[year] || [];

  // React Aria Tabs uses the selected key to control which tab panel shows.
  // We keep the URL as source of truth — selecting a tab navigates instead.
  return (
    <div className="px-8 pt-8 pb-16 max-w-[1200px] mx-auto">
      {/* Back link */}
      <Button
        className="font-['Jost'] text-[0.72rem] uppercase tracking-[0.12em] text-stone-400
                   hover:text-stone-900 transition-colors outline-none cursor-pointer mb-3 block
                   focus-visible:ring-2 focus-visible:ring-stone-800 rounded-sm"
        onPress={() => navigate("/artwork")}
      >
        ← artwork
      </Button>

      {/* Year heading */}
      <h1
        className="font-['Cormorant_Garamond'] font-light italic text-stone-900
                     text-[clamp(2.5rem,6vw,4rem)] leading-none mb-6"
      >
        {year}
      </h1>

      {/* Year tab bar — React Aria Tabs */}
      <Tabs
        selectedKey={year}
        onSelectionChange={(key) => navigate(`/artwork/${key}`)}
        className="mb-8"
      >
        <TabList
          aria-label="Gallery year"
          className="flex border-b border-stone-200 overflow-x-auto scrollbar-none gap-0"
        >
          {YEARS.map((y) => (
            <Tab
              key={y}
              id={y}
              className={({ isSelected, isFocusVisible }) =>
                [
                  "font-['Jost'] text-[0.76rem] uppercase tracking-[0.08em] cursor-pointer",
                  "border-b-2 -mb-px pb-2 pr-4 whitespace-nowrap outline-none transition-colors duration-200",
                  isSelected
                    ? "border-stone-900 text-stone-900"
                    : "border-transparent text-stone-400 hover:text-stone-700",
                  isFocusVisible ? "ring-2 ring-stone-800 ring-offset-1" : "",
                ].join(" ")
              }
            >
              {y}
            </Tab>
          ))}
        </TabList>

        {/* Each TabPanel contains the masonry grid for that year.
            Only the active panel renders its children. */}
        {YEARS.map((y) => (
          <TabPanel key={y} id={y}>
            {y === year && (
              <>
                {artworks.length === 0 ? (
                  <p className="font-['Cormorant_Garamond'] italic text-stone-400 text-lg py-12">
                    No works found for this year.
                  </p>
                ) : (
                  <div
                    className="mt-6"
                    style={{ columns: "3 280px", columnGap: "1.5rem" }}
                  >
                    {artworks.map((artwork) => (
                      <ArtworkCard
                        key={artwork.id}
                        artwork={artwork}
                        yearSlug={year}
                      />
                    ))}
                  </div>
                )}

                <YearNav currentYear={year} />
              </>
            )}
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}

// ── Route-level component ────────────────────────────────────────
function GalleryPage() {
  const { year } = useParams();

  if (!year) return <ArtworkOverview />;
  return <YearGallery year={year} />;
}

export default GalleryPage;
