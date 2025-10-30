"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMap, faPlay } from "@fortawesome/free-solid-svg-icons";

import clsx from "clsx";

const links = [
  { label: "Home", href: "/", icon: faHome },
  { label: "Map", href: "/map", icon: faMap },
  { label: "Demo", href: "/demo", icon: faPlay },
];

export default function TopBar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div
      className={clsx(
        "absolute inset-x-0 top-16 z-50 flex w-full items-center justify-center px-8 py-4",
        className,
      )}
    >
      <nav className="flex items-center gap-4 rounded-full border border-white/10 bg-black/30 px-6 py-3 shadow-lg backdrop-blur-md">
        <Image
          src="/logo.png"
          alt="Environmental Crisis Tracker Logo"
          width={48}
          height={48}
          className="h-12 w-12 rounded-lg border border-white/20 shadow-lg transition-transform duration-200 hover:scale-105"
        />
        {links.map(({ label, href, icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-2 rounded-full px-4 py-2 text-white/80 transition-all duration-200 hover:scale-105 hover:bg-white/10 hover:text-white",
              pathname === href && "bg-white/20 text-white shadow-md",
            )}
          >
            <FontAwesomeIcon icon={icon} className="text-sm" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
