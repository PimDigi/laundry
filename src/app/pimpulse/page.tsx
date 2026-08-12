import Footer from "@/components/Footer";
import { Zap, Activity, Map, Leaf, ArrowRight, ShieldCheck, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: 'PimPulse⚡ - Status Ekosistem Jatinangor Real-time',
  description: 'Pantau metrik langsung operasional Pimpim di area Jatinangor.',
};

export default function PimPulsePage() {
  return (
    <main className="min-h-screen relative overflow-hidden pt-28">
      {/* Global Ambient Lighting */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-400/10 rounded-full blur-[150px] -translate-y-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-electric-blue/10 rounded-full blur-[150px] translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-24">
        
        {/* Hero Section */}
        <div className="text-center mb-16 mt-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold tracking-widest mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            PIMPIM LIVE METRICS • REAL-TIME RADAR
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight flex flex-col md:flex-row items-center justify-center gap-3">
            PimPulse
            <Zap className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-6">
            Status Ekosistem Jatinangor
          </h2>
          <p className="text-lg text-blue-100/90 leading-relaxed font-light max-w-2xl mx-auto mb-10">
            Pantau ketersediaan armada, tingkat kepadatan lalu lintas, dan estimasi waktu penjemputan secara real-time dari Command Center Pimpim.
          </p>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          
          {/* Card 1: Status Armada Aktif */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/30 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Activity className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping absolute" />
                  <span className="w-2 h-2 rounded-full bg-green-400 relative" />
                  <span className="text-green-300 text-xs font-bold uppercase">Live</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Status Armada Aktif</h3>
              
              <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <span className="text-xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">98% Driver Siap Antar</span>
                </div>
                <p className="text-blue-100/80 text-sm mt-3 border-t border-white/10 pt-3 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span>Rata-rata waktu jemput: <strong>3-5 Menit</strong> di area Jatinangor</span>
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Pantauan Lalu Lintas Local */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Map className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                  <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">Radar Area</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-6">Pantauan Lalin Lokal</h3>
              
              <ul className="space-y-4">
                <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-blue-100/90 text-sm font-medium">Jalan Raya Jatinangor</span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">Ramai Lancar</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-blue-100/90 text-sm font-medium">Sekitar Kampus UNPAD/ITB</span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/30">Lancar</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-blue-100/90 text-sm font-medium">Simpang Cileunyi</span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/30">Lancar</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Eco-Movement Impact */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Leaf className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-300" />
                  <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">Impact</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-6">Eco-Movement ⚡</h3>
              
              <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-50" />
                <h4 className="text-4xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] mb-2 relative z-10">12.4 Ton</h4>
                <p className="text-blue-100/80 text-sm font-medium relative z-10">Reduksi Emisi Karbon (CO2)</p>
                <div className="w-full h-px bg-white/10 my-4 relative z-10" />
                <p className="text-blue-100/60 text-xs relative z-10">Berkat kontribusi operasional armada motor listrik (Pim Eco) di bulan ini.</p>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0B48C5]/40 to-[#021342]/70 backdrop-blur-2xl border border-cyan-400/30 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_30px_rgba(6,182,212,0.2)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <ShieldCheck className="w-16 h-16 text-cyan-300 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Jalanan Sedang Bersahabat!
            </h2>
            <p className="text-blue-100/90 font-light text-lg mb-8 max-w-xl mx-auto">
              Sistem radar PimPulse mendeteksi ketersediaan armada yang melimpah dan lalu lintas yang mendukung. Mulai perjalanan Anda sekarang.
            </p>
            <Link 
              href="https://play.google.com/store/apps/details?id=com.ptanaknegeridigital.pimpim" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg hover:shadow-[0_10px_30px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all duration-300"
            >
              Pesan Perjalanan Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>
      
      <Footer />
    </main>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
