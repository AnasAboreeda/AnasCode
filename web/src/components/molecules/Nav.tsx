"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { site } from "@/content/site";

export default function Nav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav aria-label="Main navigation" className="w-full border-b border-zinc-200 dark:border-zinc-700 mb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center no-underline hover:no-underline" onClick={closeMenu}>
            <Image
              src="/anas-code-anas-aboreeda-logo.png"
              alt="Anas Code Logo"
              width={160}
              height={48}
              sizes="(max-width: 640px) 160px, 192px"
              className="h-10 w-auto sm:h-12"
              priority
              quality={100}
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-6 list-none p-0 m-0">
            <li>
              <Link
                href="/"
                className={`hover:opacity-70 transition-opacity ${pathname === "/" ? "font-semibold" : ""}`}
                style={{ textDecoration: "none" }}
                aria-current={pathname === "/" ? "page" : undefined}
              >
                Home
              </Link>
            </li>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`hover:opacity-70 transition-opacity ${pathname === item.href ? "font-semibold" : ""}`}
                  style={{ textDecoration: "none" }}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col gap-1 p-2 hover:opacity-70 transition-opacity"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen ? "true" : "false"}
          >
            <span
              className={`w-6 h-0.5 bg-current transition-transform ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            />
            <span className={`w-6 h-0.5 bg-current transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} />
            <span
              className={`w-6 h-0.5 bg-current transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6">
            <ul className="flex flex-col gap-4 list-none p-0 m-0">
              <li>
                <Link
                  href="/"
                  className={`block py-2 hover:opacity-70 transition-opacity ${pathname === "/" ? "font-semibold" : ""}`}
                  style={{ textDecoration: "none" }}
                  aria-current={pathname === "/" ? "page" : undefined}
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-2 hover:opacity-70 transition-opacity ${pathname === item.href ? "font-semibold" : ""}`}
                    style={{ textDecoration: "none" }}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
