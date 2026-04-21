"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

type Props = {
  title: string;
  href: string;
  isActive: boolean;
  children: React.ReactNode;
};

export default function TutorialSidebarSeries({
  title,
  href,
  isActive,
  children,
}: Props) {
  return (
    <details
      open={isActive}
      className="group border-b border-gray-100 pb-6 last:border-0 last:pb-0"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 select-none [&::-webkit-details-marker]:hidden">
        <Link
          href={href}
          onClick={(e) => e.stopPropagation()}
          className={`min-w-0 flex-1 text-sm font-semibold ${
            isActive ? "text-primary" : "text-gray-900"
          } hover:text-primary`}
        >
          {title}
        </Link>
        <Icon
          icon="mingcute:down-line"
          className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
