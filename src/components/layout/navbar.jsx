import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dropdown, DropdownItem } from "../ui/dropdown";
import logo from "../../assets/logo.gif";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-48 py-2">
      {/* Solid white — visible only at the top */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{ opacity: scrolled ? 0 : 1, background: "rgba(255,255,255,1)" }}
      />

      {/* Gradient — fades in once scrolled */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: scrolled ? 1 : 0,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.6) 60%, rgba(255,255,255,0) 100%)",
        }}
      />

      <Link to="/" className="relative z-10">
        <img src={logo} alt="logo" className="h-20 w-auto" />
      </Link>

      <ul className="relative z-10 flex items-center gap-8 list-none m-0 p-0 font-['Outfit',_sans-serif] text-sm tracking-wide">
        <li>
          <Dropdown label="artwork">
            <DropdownItem to="/artwork/2026">2026</DropdownItem>
            <DropdownItem to="/artwork/2025">2025</DropdownItem>
            <DropdownItem to="/artwork/2024">2024</DropdownItem>
            <DropdownItem to="/artwork/2023">2023</DropdownItem>
            <DropdownItem to="/artwork/2022">2022</DropdownItem>
            <DropdownItem to="/artwork/2016-2021">2016–2021</DropdownItem>
            <DropdownItem to="/butterfly-room">butterfly room</DropdownItem>
          </Dropdown>
        </li>
        <li>
          <Dropdown label="about">
            <DropdownItem to="/cv">cv</DropdownItem>
            <DropdownItem to="/contact">contact me</DropdownItem>
          </Dropdown>
        </li>
        <li>
          <a
            href="https://www.etsy.com/shop/Authenticityi?ref=seller-platform-mcnav"
            target="_blank"
            rel="noopener noreferrer"
            className="font-['Outfit',_sans-serif] text-sm tracking-wide text-rose-200 hover:text-rose-300  hover:opacity-60 transition-opacity"
          >
            store
          </a>
        </li>
      </ul>
    </nav>
  );
}
