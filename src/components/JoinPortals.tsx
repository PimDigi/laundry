"use client";

import { ArrowRight, Store, Car } from "lucide-react";

export default function JoinPortals() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Driver Portal */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 hover:bg-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 relative overflow-hidden group">
            {/* Background & Hover Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-electric-blue/20 rounded-full blur-[80px] group-hover:bg-electric-blue/40 transition-colors duration-700 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full justify-between min-h-[300px]">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8 shadow-xl group-hover:border-electric-blue/50 transition-colors">
                <Car className="w-10 h-10 text-cyan-400" />
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Gabung Jadi Mitra Driver</h3>
                <p className="text-blue-100 mb-8 max-w-sm">Atur waktu kerja sendiri, nikmati bagi hasil adil, dan dapatkan penghasilan harian tanpa potongan ribet.</p>
                <a href="https://play.google.com/store/apps/details?id=com.ptanaknegeridigital.pimdriver" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all mt-4">
                  Gabung Mitra Driver <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Merchant Portal */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 hover:bg-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 relative overflow-hidden group">
            {/* Background & Hover Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-neon-cyan/20 rounded-full blur-[80px] group-hover:bg-neon-cyan/40 transition-colors duration-700 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full justify-between min-h-[300px]">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8 shadow-xl group-hover:border-neon-cyan/50 transition-colors">
                <Store className="w-10 h-10 text-cyan-400" />
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Kembangkan Usaha di Pim Food</h3>
                <p className="text-blue-100 mb-8 max-w-sm">Jangkau ribuan mahasiswa dan warga Jatinangor. Digitalisasikan tokomu dan tingkatkan penjualan harian.</p>
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold transition-all mt-4">
                  Gabung Merchant Pim Food <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
