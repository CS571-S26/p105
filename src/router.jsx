import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CV from "./pages/cv";
import Contact from "./pages/contact";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cv" element={<CV />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="*"
        element={<div className="px-48 py-16 text-rose-300">404 Not Found</div>}
      />
    </Routes>
  );
}
