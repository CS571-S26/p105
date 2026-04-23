import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CV from "./pages/cv";
import Contact from "./pages/contact";
import GalleryPage from "./pages/GalleryPage";
import ArtworkDetail from "./pages/ArtworkDetail";
import ButterflyRoom from "./pages/ButterflyRoom";

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/artwork" element={<GalleryPage />} />
        <Route path="/artwork/:year" element={<GalleryPage />} />
        <Route path="/artwork/:year/:artworkId" element={<ArtworkDetail />} />
        <Route path="/butterfly-room" element={<ButterflyRoom />} />
        <Route
          path="*"
          element={
            <div className="px-48 py-16 text-rose-300">404 Not Found</div>
          }
        />
      </Routes>
    </HashRouter>
  );
}
