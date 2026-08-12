"use client";

import { Bell, MapPin, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TopNav() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm py-3.5 px-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="/logo-lavora.webp" alt="Lavora POS" className="w-8 h-8 object-cover" />
        <div className="flex flex-col justify-center">
          <h1 className="text-orange-500 font-bold text-base leading-tight uppercase tracking-wide">LAVORA POS</h1>
        </div>
      </div>
      
      <button 
        onClick={() => {
          if(confirm("Apakah Anda yakin ingin keluar?")) {
            localStorage.removeItem("lavora_session");
            router.push("/login");
          }
        }}
        className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
        title="Logout"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </header>
  );
}
