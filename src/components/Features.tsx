"use client";

import { BrainCircuit, Crosshair, LeafyGreen, ShieldCheck, Zap } from "lucide-react";

export default function Features() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Kenapa <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Harus Pimpim?</span></h2>
          <p className="text-blue-100 max-w-2xl mx-auto">Lebih dari sekadar perjalanan. Kami hadirkan teknologi presisi dan kenyamanan terbaik untuk mobilitas harianmu.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          
          {/* Smart Fair Algorithm (Large Card) */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 hover:bg-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-electric-blue/20 rounded-full blur-[80px] group-hover:bg-electric-blue/30 transition-colors" />
            <div className="relative z-10">
              <BrainCircuit className="w-14 h-14 text-cyan-400 bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Harga Fair & Transparan</h3>
              <p className="text-blue-100 max-w-md">Harga adil tanpa lonjakan tak masuk akal, disesuaikan secara real-time untuk pengemudi dan penumpang.</p>
            </div>
          </div>

          {/* Precision GPS */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 hover:bg-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
             <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-neon-cyan/20 rounded-full blur-[60px] group-hover:bg-neon-cyan/30 transition-colors" />
            <div className="relative z-10">
              <Crosshair className="w-14 h-14 text-cyan-400 bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">GPS Presisi Jatinangor</h3>
              <p className="text-blue-100 text-sm">Akurasi titik jemput hingga hitungan meter, gak ada lagi cerita driver kebingungan lokasi.</p>
            </div>
          </div>

          {/* Eco-Friendly */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 hover:bg-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[60px] group-hover:bg-emerald-500/30 transition-colors" />
            <div className="relative z-10">
              <LeafyGreen className="w-14 h-14 text-cyan-400 bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Dukungan Armada Listrik</h3>
              <p className="text-blue-100 text-sm">Pilihan armada bertenaga listrik hemat energi untuk perjalanan yang lebih hijau.</p>
            </div>
          </div>

          {/* Security */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 hover:bg-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300 flex items-center justify-between group relative overflow-hidden">
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/10 rounded-full blur-[100px]" />
            <div className="relative z-10 pr-8">
              <ShieldCheck className="w-14 h-14 text-cyan-400 bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Sistem Keamanan Berlapis</h3>
              <p className="text-blue-100 max-w-md">Verifikasi driver ketat dan pemantauan rute real-time berbasis AI untuk perjalanan tenang dan aman.</p>
            </div>
            {/* Visual element placeholder for security */}
            <div className="hidden md:flex relative z-10 w-32 h-32 items-center justify-center bg-white/10 rounded-2xl border border-white/20 shadow-2xl shadow-purple-500/20">
              <Zap className="w-12 h-12 text-purple-400 animate-pulse" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
