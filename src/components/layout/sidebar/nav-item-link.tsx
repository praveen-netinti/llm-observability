"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/cn";

import type { NavItem } from "./sidebar-data";

interface NavItemLinkProps {
  item: NavItem;
  onClick?: () => void;
}

export function NavItemLink({ item, onClick }: NavItemLinkProps) {
  const pathname = usePathname();
  const IconComponent = item.icon;
  const itemPath = item.href.split("?")[0];
  const isActive = pathname === itemPath;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex h-8 items-center gap-1.5 rounded-lg px-2 text-[13px] font-medium transition-colors duration-200",
        isActive
          ? "bg-bg-soft-200 text-text-strong-950"
          : "text-text-sub-600 hover:bg-bg-soft-200 hover:text-text-strong-950",
      )}
    >
      <IconComponent
        className={cn(
          "size-4 shrink-0",
          isActive ? "text-text-strong-950" : "text-text-soft-400 group-hover:text-text-sub-600",
        )}
      />
      <span className='flex-1 truncate'>{item.label}</span>
      {item.badge && (
        <span className='bg-error-base text-static-white size-4 rounded-full text-center text-2xs grid place-items-center leading-2 font-medium'>
          {item.badge}
        </span>
      )}
    </Link>
  );
}
