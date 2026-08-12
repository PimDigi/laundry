"use client";

import { motion } from "framer-motion";
import { Bike, Car, Pizza, Leaf } from "lucide-react";
import React, { useRef, useState } from "react";

const services = [
  {
    id: "ride",
    title: "Pim Ride",
    desc: "Antar jemput motor cepat, hemat, dan siap nemenin mobilitas harianmu.",
    icon: Bike,
    color: "from-[#0052FF] to-[#00F0FF]",
    glow: "shadow-[0_0_30px_rgba(0,82,255,0.3)]",
    hoverEffects: "hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:-translate-y-1",
  },
  {
    id: "car",
    title: "Pim Car",
    desc: "Perjalanan mobil yang nyaman, aman, dan pas buat jalan bareng teman.",
    icon: Car,
    color: "from-purple-500 to-pink-500",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    hoverEffects: "hover:border-fuchsia-400 hover:shadow-[0_0_25px_rgba(217,70,239,0.35)] hover:-translate-y-1",
  },
  {
    id: "food",
    title: "Pim Food",
    desc: "Kulineran favorit di Jatinangor diantar hangat langsung ke tempatmu.",
    icon: Pizza,
    color: "from-orange-500 to-yellow-400",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.3)]",
    hoverEffects: "hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:-translate-y-1",
  },
  {
    id: "eco",
    title: "Pim Eco",
    desc: "Perjalanan ramah lingkungan dengan armada motor listrik hemat energi.",
    icon: Leaf,
    color: "from-[#10B981] to-emerald-300",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    hoverEffects: "hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:-translate-y-1",
  },
];

function TiltCard({ service }: { service: typeof services[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXVal = ((y - centerY) / centerY) * -15;
    const rotateYVal = ((x - centerX) / centerX) * 15;

    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const Icon = service.icon;

  return (
    <div className="perspective-[1000px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className={`relative overflow-hidden h-[340px] flex flex-col justify-between p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl cursor-pointer group transition-all duration-300 ${service.hoverEffects}`}
      >
        {/* Background Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#021342]/80 via-[#021342]/20 to-transparent z-0 pointer-events-none" />

        {/* Top Header */}
        <div 
          className="flex justify-between items-center z-10"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} ${service.glow} flex items-center justify-center shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest px-2 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            {service.id}
          </span>
        </div>
        
        {/* Middle 3D Asset Placeholder */}
        <div 
          className="flex-grow flex items-center justify-center z-10 relative"
          style={{ transform: "translateZ(60px)" }}
        >
           {/* We use the Lucide icon as a scaled up 3D placeholder */}
           <Icon className="w-32 h-32 object-contain mx-auto my-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-white" />
        </div>

        {/* Bottom Text */}
        <div 
          className="z-10 mt-auto"
          style={{ transform: "translateZ(50px)" }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
          <p className="text-blue-100/90 text-sm leading-relaxed">{service.desc}</p>
        </div>

        {/* 3D background decorative element */}
        <div 
          style={{ transform: "translateZ(-20px)" }}
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        />
      </motion.div>
    </div>
  );
}

export default function ServiceShowcase() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Layanan <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Favorit Pimpim</span></h2>
          <p className="text-blue-100/90 max-w-2xl mx-auto">Satu aplikasi untuk semua kebutuhan aktivitas harianmu di Jatinangor & sekitarnya.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <TiltCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
