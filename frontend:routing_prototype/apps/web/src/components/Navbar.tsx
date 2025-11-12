"use client";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/register", label: "Register" },
  { href: "/login", label: "Login" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/assignments", label: "Assignments" },
  { href: "/timeline", label: "Timeline" },
  { href: "/calendar", label: "Calendar" },
  { href: "/forum", label: "Forum" },
  { href: "/settings", label: "Settings" }
];

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
      {links.map((l) => (
        <Link key={l.href} href={l.href}>{l.label}</Link>
      ))}
    </nav>
  );
}

