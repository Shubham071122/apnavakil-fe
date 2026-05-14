"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Legal Vault", href: "/admin/documents", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200">
      {/* Premium Obsidian Sidebar */}
      <aside className="w-72 bg-[#050A18] border-r border-white/5 flex flex-col p-8 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#B89B5E]/5 blur-[100px] rounded-full" />
        
        <div className="relative z-10 flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B89B5E] to-[#8C7342] flex items-center justify-center shadow-lg shadow-[#B89B5E]/20">
             <span className="text-white font-bold text-xl">A</span>
          </div>
          <div className="text-xl font-display font-bold tracking-tight text-white">
            ApnaVakil <span className="text-[#B89B5E] font-light italic">Admin</span>
          </div>
        </div>
        
        <nav className="relative z-10 flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`group flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? "bg-gradient-to-r from-[#B89B5E]/10 to-transparent border border-[#B89B5E]/20 text-white shadow-inner shadow-[#B89B5E]/5" 
                    : "hover:bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <item.icon 
                  size={20} 
                  className={isActive ? "text-[#B89B5E]" : "group-hover:text-[#B89B5E] transition-colors"} 
                />
                <span className={isActive ? "font-semibold" : "font-medium"}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 pt-8 mt-auto border-t border-white/5">
          <button className="flex items-center gap-3 p-4 w-full rounded-2xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all duration-300">
            <LogOut size={20} />
            <span className="font-medium">Logout System</span>
          </button>
        </div>
      </aside>

      {/* Main Command Area */}
      <main className="flex-1 overflow-auto relative">
        {/* Ambient Page Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B89B5E]/5 blur-[150px] rounded-full -mr-64 -mt-64" />
        
        <div className="relative z-10 p-12">
          {children}
        </div>
      </main>
    </div>
  );
}

