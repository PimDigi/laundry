"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("lavora_session");
    
    if (!session && pathname !== "/login") {
      router.push("/login");
    } else if (session && pathname === "/login") {
      router.push("/");
    } else {
      if (session) {
        setIsAuthenticated(true);
      }
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Handle case where we're redirecting to prevent flash of content
  if (isChecking || (!isAuthenticated && pathname !== "/login")) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-500">
        <div className="animate-pulse flex flex-col items-center gap-2">
           <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-sm font-medium text-slate-600">Memuat Lavora POS...</p>
        </div>
      </div>
    );
  }

  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <TopNav />}
      <main className={`flex-1 overflow-y-auto ${!isLoginPage ? "px-3 py-2" : ""}`}>
        {children}
      </main>
      {!isLoginPage && <BottomNav />}
    </>
  );
}
