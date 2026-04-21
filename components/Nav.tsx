"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/models", label: "Models" },
  { href: "/tools", label: "Tools" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/projects", label: "Projects" },
  {
    href: "https://forum.seeedstudio.com/c/recomputer-ai-lab",
    label: "Forums",
    external: true,
  },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-baseline gap-[5px] text-xl font-semibold transition hover:opacity-90"
        >
          <span className="text-gray-900">reComputer</span>
          <span className="text-primary"> AI Lab</span>
        </Link>
        <div className="flex items-center gap-8">
          {navItems.map(({ href, label, external }) =>
            external ? (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition ${
                  pathname === href || (href !== "/" && pathname.startsWith(href))
                    ? "text-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
