"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "היום", icon: "◉" },
  { href: "/history", label: "היסטוריה", icon: "⊙" },
  { href: "/library", label: "ספריית מזון", icon: "⊟" },
  { href: "/templates", label: "תבניות", icon: "⊞" },
  { href: "/export", label: "ייצוא", icon: "↓" },
  { href: "/settings", label: "הגדרות", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 flex items-center gap-3 px-4 h-12">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="p-1 rounded text-gray-600 hover:bg-gray-100"
          aria-label="פתח תפריט"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-semibold text-brand-700 text-sm">יומן תזונה</span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — right side for RTL */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-30 h-full w-56 bg-white border-l border-gray-200 flex flex-col transition-transform",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-12 flex items-center px-5 border-b border-gray-100">
          <span className="font-bold text-brand-700 text-sm">יומן תזונה</span>
        </div>

        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <span className="text-base leading-none w-4 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">יומן אישי · פרטי</p>
        </div>
      </aside>

      {/* Push content on desktop */}
      <div className="hidden lg:block w-56 shrink-0" />

      {/* Mobile top bar spacer */}
      <div className="lg:hidden h-12" />
    </>
  );
}
