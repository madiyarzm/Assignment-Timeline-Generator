"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/dashboard";
  
  return (
    <>
      {!hideNavbar && <Navbar />}
      <main style={hideNavbar ? {} : { padding: 16 }}>{children}</main>
    </>
  );
}

