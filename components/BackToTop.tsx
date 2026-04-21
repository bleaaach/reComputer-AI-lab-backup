"use client";

import { useEffect, useState } from "react";

export default function BackToTop({ targetId }: { targetId?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = targetId ? document.getElementById(targetId) : window;
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = targetId
        ? (el as HTMLElement).scrollTop
        : window.scrollY;
      setShow(scrollTop > 300);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => el.removeEventListener("scroll", handleScroll);
  }, [targetId]);

  if (!show) return null;

  const scrollToTop = () => {
    const el = targetId ? document.getElementById(targetId) : window;
    if (el) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all hover:bg-gray-800 focus:outline-none"
      aria-label="Back to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}