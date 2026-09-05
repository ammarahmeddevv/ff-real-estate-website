export interface NavLink {
  label: string;
  href: string;
}

/** Primary navigation, in display order. Shared by desktop nav and mobile menu. */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Projects", href: "/projects" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Why F.F", href: "/why-ff" },
  { label: "Contact", href: "/contact" },
];
