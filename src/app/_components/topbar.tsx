"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMap,
  faChartBar,
  faInfoCircle,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

import clsx from "clsx";

const links = [
  { label: "Home", href: "/", icon: faHome },
  { label: "Map", href: "/map", icon: faMap },
  { label: "Data", href: "/data", icon: faChartBar },
  { label: "Demo", href: "/demo", icon: faPlay },
  { label: "About Us", href: "/about-us", icon: faInfoCircle },
];

export default function TopBar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div
      className={clsx(
        "absolute inset-x-0 top-16 z-50 flex w-full items-center justify-between py-4 pr-8 pl-2",
        className,
      )}
    >
      <div className="w-0"></div>

      <nav className="absolute left-1/2 flex -translate-x-1/2 transform items-center gap-2 rounded-full border border-white/10 bg-black/30 px-6 py-3 shadow-lg backdrop-blur-md">
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

      <div className="w-0"></div>
    </div>
  );
}
