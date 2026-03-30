import {
  Link,
  Button,
  MenuTrigger,
  Popover,
  Menu,
  MenuItem,
} from "react-aria-components";
import { NavLink } from "react-router";
import logo from "../../assets/logo.gif";

export default function Navbar() {
  return (
    <nav className="flex">
      <Link href="/">
        <img src={logo} alt="logo"></img>
      </Link>

      <ul>
        <li>
          <NavLink to="/artwork">Artwork</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
      </ul>
    </nav>
  );
}
