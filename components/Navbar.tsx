"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/scraper", label: "Alat Scraper" },
  { href: "/dokumentasi", label: "Dokumentasi" },
  { href: "/tentang", label: "Tentang" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base">
      <nav
        className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4"
        aria-label="Navigasi utama"
      >
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md bg-accent font-mono text-[11px] font-bold text-white"
            aria-hidden="true"
          >
            AM
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Alight Motion Scraper
          </span>
        </Link>

        {/* Menu desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`inline-flex h-11 items-center rounded-md px-3 text-sm transition-colors ${
                  isActive(link.href)
                    ? "text-ink"
                    : "text-muted hover:bg-surface hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Tombol menu mobile */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-ink md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Menu mobile */}
      {open && (
        <div id="menu-mobile" className="border-t border-line md:hidden">
          <ul className="mx-auto max-w-5xl px-2 py-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block rounded-md px-3 py-3 text-sm ${
                    isActive(link.href)
                      ? "bg-surface text-ink"
                      : "text-muted hover:bg-surface hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
