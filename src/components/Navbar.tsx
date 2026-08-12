"use client";

import Link from "next/link";
import { ChevronDown, Download, Zap, Menu, X, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Beranda", href: "/" },
  { name: "Layanan", href: "/#services" },
  { 
    name: "Gabung Mitra", 
    href: "#", 
    hasDropdown: true,
    subItems: [
      { name: "Mitra Driver", href: "https://play.google.com/store/apps/details?id=com.ptanaknegeridigital.pimdriver", external: true },
      { name: "Mitra Merchant (Pim Food)", href: "/#join-merchant" }
    ]
  },
  { name: "PimPulse", href: "/pimpulse", isNew: true },
  { name: "Blog", href: "/blog" },
  { name: "Bantuan", href: "/faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className="w-full py-4 px-6 fixed top-0 left-0 z-50 bg-[#020D2E]/80 backdrop-blur-md border-b border-cyan-400/30 flex items-center min-h-[60px]"
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          
          {/* Left: Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/Logo/publiclogo.png" alt="Pimpim Logo" className="h-16 md:h-24 w-auto object-contain scale-150 md:scale-[1.8] origin-left -my-2" />
          </Link>

          {/* Center: Navigation Dock (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 md:gap-4 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,102,255,0.3)] transition-all duration-300 shrink-0 mx-4">
            {navItems.map((item) => (
              <div 
                key={item.name} 
                className="relative group"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
              >
                <Link 
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white border border-transparent hover:border-cyan-400 hover:text-cyan-300 hover:scale-105 hover:bg-white/10 transition-all shrink-0 whitespace-nowrap"
                >
                  {item.name}
                  {item.hasDropdown && <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />}
                  {item.isNew && (
                    <>
                      <Zap className="w-3 h-3 text-cyan-400 animate-pulse ml-0.5" />
                      <span className="bg-cyan-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        NEW
                      </span>
                    </>
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.hasDropdown && item.subItems && (
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-[0_10px_30px_rgba(0,102,255,0.4)] overflow-hidden"
                      >
                        {item.subItems.map(subItem => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            target={subItem.external ? "_blank" : undefined}
                            rel={subItem.external ? "noopener noreferrer" : undefined}
                            className="flex items-center justify-between px-4 py-3 text-sm text-blue-100 hover:bg-white/10 hover:text-cyan-300 rounded-xl transition-all"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span>{subItem.name}</span>
                            {subItem.external && <ExternalLink className="w-3 h-3 opacity-50" />}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 relative z-50">
            <a 
              href="https://play.google.com/store/apps/details?id=com.ptanaknegeridigital.pimpim" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 border border-electric-blue/50 text-white text-sm font-semibold shadow-[0_0_15px_rgba(0,82,255,0.4)] hover:shadow-[0_0_25px_rgba(0,82,255,0.7)] hover:bg-electric-blue/20 transition-all z-40"
            >
              <Download className="w-4 h-4 text-neon-cyan" />
              <span className="hidden sm:inline">Download App</span>
              <span className="sm:hidden">App</span>
            </a>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-2xl pt-24 pb-6 px-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              {navItems.map((item) => (
                <div key={item.name} className="flex flex-col">
                  {item.hasDropdown && item.subItems ? (
                    <>
                      <div className="px-4 py-3 text-lg font-bold text-white border-b border-white/10 opacity-70">
                        {item.name}
                      </div>
                      <div className="flex flex-col pl-4 mt-2 gap-2">
                        {item.subItems.map(subItem => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            target={subItem.external ? "_blank" : undefined}
                            rel={subItem.external ? "noopener noreferrer" : undefined}
                            className="flex items-center justify-between px-4 py-3 text-base text-blue-100 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 hover:text-cyan-300 transition-all"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span>{subItem.name}</span>
                            {subItem.external && <ExternalLink className="w-4 h-4 opacity-50 text-cyan-400" />}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link 
                      href={item.href}
                      className="flex items-center justify-between px-4 py-3 text-lg font-bold text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-cyan-400 hover:text-cyan-300 transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{item.name}</span>
                      {item.isNew && (
                        <span className="bg-cyan-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <Zap className="w-3 h-3" /> NEW
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
