import Link from "next/link";
import { Scale } from "lucide-react";

type NavbarProps = {
  eyebrow?: string;
  simple?: boolean;
};

const navItems = [
  { href: "/#product", label: "Product" },
  { href: "/#workflow", label: "Workflow" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function Navbar({ eyebrow = "Legal intelligence", simple = false }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0A0A0A]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#18181B] shadow-sm">
            <Scale size={19} strokeWidth={1.9} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">ApnaVakil</p>
            <p className="text-xs text-[#71717A]">{eyebrow}</p>
          </div>
        </Link>

        {!simple && (
          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[#A1A1AA] transition-colors hover:text-[#F5F5F5]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-2xl px-4 py-2 text-sm font-medium text-[#D4D4D8] transition-colors hover:text-white sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="quiet-button rounded-2xl px-5 py-2.5 text-sm font-semibold transition duration-200"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
