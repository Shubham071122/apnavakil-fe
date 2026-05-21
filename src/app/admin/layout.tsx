"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, Scale, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Legal Vault", href: "/admin/documents", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      <aside className="hidden w-72 flex-col border-r border-white/8 bg-[#121212] p-6 lg:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-white/10 bg-[#18181B]">
            <Scale size={20} strokeWidth={1.85} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">ApnaVakil</p>
            <p className="text-xs text-[#71717A]">Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition duration-200 ${
                  isActive
                    ? "bg-white/[0.075] text-white"
                    : "text-[#A1A1AA] hover:bg-white/[0.045] hover:text-white"
                }`}
              >
                <item.icon size={18} strokeWidth={1.85} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/8 pt-5">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#71717A] transition-colors hover:bg-white/[0.045] hover:text-white">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
