"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Download, CarFront, MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 md:pt-32">
      {/* Background Ornaments */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-neon-cyan text-sm font-semibold tracking-wider uppercase mb-4">
            <Navigation className="w-4 h-4" />
            PIMPIM • MOVE EVERYDAY
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            Perjalanan & <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Ekosistem Lokal Terbaik.</span>
          </h1>
          
          <p className="text-lg text-blue-100 max-w-xl leading-relaxed">
            Temani setiap langkahmu. Jalani aktivitas harian di Jatinangor tanpa ribet bareng Pimpim.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <a href="https://play.google.com/store/apps/details?id=com.ptanaknegeridigital.pimpim" target="_blank" rel="noopener noreferrer" className="relative group px-8 py-4 bg-electric-blue text-white font-semibold rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,82,255,0.4)] hover:shadow-[0_0_30px_rgba(0,82,255,0.6)] transition-all flex items-center border border-cyan-400/30">
              <span className="relative z-10 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download App
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            
            <a href="https://play.google.com/store/apps/details?id=com.ptanaknegeridigital.pimdriver" target="_blank" rel="noopener noreferrer" className="px-8 py-4 glass-panel text-white font-semibold rounded-2xl hover:bg-slate-800/50 transition-all border border-cyan-400/30 hover:border-cyan-300 flex items-center gap-2">
              <CarFront className="w-5 h-5 text-neon-cyan" />
              Mitra Pimpim
            </a>
          </div>
        </motion.div>

        {/* Right 3D Element */}
        <div 
          className="relative h-[600px] flex items-center justify-center perspective-[1000px]"
          onMouseMove={handleMouse}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-[300px] h-[600px] rounded-[3rem] glass-panel glowing-border flex items-center justify-center bg-slate-900/60"
          >
            {/* Inner Phone Screen */}
            <div className="absolute inset-[8px] rounded-[2.5rem] bg-slate-950 overflow-hidden flex flex-col items-center justify-center z-20">
              <img src="/pimpim-app.webp" alt="Pimpim App" className="w-full h-full object-cover rounded-[38px]" />
              <div className="absolute top-4 w-32 h-6 bg-slate-900 rounded-full z-10" />
            </div>

            {/* 3D Floating Ornaments */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-12 top-20 w-24 h-24 glass-panel rounded-2xl flex items-center justify-center border-electric-blue/30 shadow-[0_0_30px_rgba(0,82,255,0.2)] z-10"
              style={{ translateZ: 100 }}
            >
              <CarFront className="w-10 h-10 text-electric-blue" />
            </motion.div>

            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -left-16 bottom-40 w-20 h-20 glass-panel rounded-full flex items-center justify-center border-neon-cyan/30 shadow-[0_0_30px_rgba(0,240,255,0.2)] z-10"
              style={{ translateZ: 150 }}
            >
              <MapPin className="w-8 h-8 text-neon-cyan" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
