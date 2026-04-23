import { Link } from "react-router-dom";
import { Dropdown, DropdownItem } from "../ui/dropdown";
import logo from "../../assets/logo.gif";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-48 py-2 bg-white">
      <Link to="/">
        <img src={logo} alt="logo" className="h-20 w-auto" />
      </Link>

      <ul className="flex items-center gap-8 list-none m-0 p-0">
        <li>
          <Dropdown label="artwork">
            <DropdownItem as={Link} to="/artwork/2026">
              2026
            </DropdownItem>
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
          <Dropdown label="store" />
        </li>
      </ul>
    </nav>
  );
}
