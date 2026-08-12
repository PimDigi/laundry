"use client";

import { Home, PlusSquare, ClipboardList, Store, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Kasir", href: "/kasir", icon: PlusSquare },
    { label: "Pesanan", href: "/riwayat", icon: ClipboardList },
    { label: "Outlet", href: "/outlet", icon: Store },
    { label: "Menu", href: "/pengaturan", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 py-2 px-3 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              isActive ? "text-orange-500" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className={`relative ${isActive ? "scale-110 transition-transform" : ""}`}>
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
              )}
            </div>
            <span className={`text-[10px] font-medium ${isActive ? "text-orange-500" : ""}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
