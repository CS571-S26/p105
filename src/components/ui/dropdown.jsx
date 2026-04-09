import { useState } from "react";
import { Button, Menu, MenuItem, MenuTrigger } from "react-aria-components";
import { NavLink } from "react-router";

export function Dropdown({ label, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onPointerEnter={(e) => e.pointerType === "mouse" && setIsOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setIsOpen(false)}
      className="relative inline-block"
    >
      <MenuTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button className="text-sm tracking-wide text-rose-200 hover:text-rose-300 bg-transparent border-none cursor-pointer p-0 outline-none">
          {label}
        </Button>
        {isOpen && (
          <div className="absolute top-full right-0 pt-1">
            <Menu className="flex flex-col bg-white py-2 pr-3 pl-30 w-max shadow-sm outline-none text-right">
              {children}
            </Menu>
          </div>
        )}
      </MenuTrigger>
    </div>
  );
}

export function DropdownItem({ to, children }) {
  return (
    <MenuItem className="outline-none">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `block px-0 py-1 text-sm tracking-wide text-rose-200 hover:text-rose-300 ${
            isActive ? "underline decoration-rose-200" : "no-underline"
          }`
        }
      >
        {children}
      </NavLink>
    </MenuItem>
  );
}
