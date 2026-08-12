import Footer from "@/components/Footer";
import Link from "next/link";
import { Info, Building2, Handshake, Clock, Mail, Phone } from "lucide-react";

export const metadata = {
  title: 'Tentang Kami - Pimpim',
  description: 'Platform transportasi online karya anak negeri',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen relative overflow-hidden pt-28">
      {/* Global Ambient Lighting */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-400/10 rounded-full blur-[150px] -translate-y-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-24">
        {/* Hero Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 mt-10">
          <span className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold tracking-widest mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            PROFIL PERUSAHAAN • PT ANAK NEGERI DIGITAL
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Tentang <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Pimpim</span>
          </h1>
          <p className="text-lg text-blue-100/90 leading-relaxed font-light">
            Platform transportasi online karya anak negeri yang menghadirkan solusi mobilitas digital aman, inklusif, dan berkelanjutan.
          </p>
        </div>

        {/* Konten Utama (Bento / Grid Glassmorphic Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Tentang Pimpim */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300 flex flex-col relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Info className="w-7 h-7 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Tentang Pimpim</h2>
              <p className="text-blue-100/90 leading-relaxed font-light">
                Pimpim adalah platform transportasi online yang dikembangkan dan dikelola oleh PT Anak Negeri Digital, perusahaan teknologi asal Indonesia. Melalui aplikasi Pimpim dan Pim Driver, kami menghubungkan pelanggan dengan mitra pengemudi untuk memenuhi kebutuhan mobilitas sehari-hari secara cepat, nyaman, dan terpercaya.
              </p>
            </div>
          </div>

          {/* Card 2: Tentang PT Anak Negeri Digital */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300 flex flex-col relative overflow-hidden group">
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Building2 className="w-7 h-7 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Tentang PT Anak Negeri Digital</h2>
              <p className="text-blue-100/90 leading-relaxed font-light">
                PT Anak Negeri Digital berfokus pada pengembangan solusi digital untuk mendukung kebutuhan masyarakat. Pimpim merupakan salah satu produk unggulan dalam mendukung transformasi digital sektor transportasi. Kami percaya bahwa setiap perjalanan memiliki arti, dan teknologi harus membuka peluang ekonomi baru yang adil bagi masyarakat.
              </p>
            </div>
          </div>

          {/* Card 3: Nilai Kemitraan & Transformasi (Full Width) */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 hover:bg-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] transition-all duration-300 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex-1">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Handshake className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Nilai Kemitraan & Transformasi</h2>
              <p className="text-blue-100/90 leading-relaxed mb-8 max-w-3xl font-light text-lg">
                Dengan bergabung bersama Pimpim, mitra pengemudi & merchant memiliki kesempatan memperoleh penghasilan melalui sistem kemitraan yang transparan dan didukung oleh layanan Customer Support yang responsif.
              </p>
              <Link href="/register-mitra" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-[0_10px_25px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all duration-300">
                Gabung Kemitraan Sekarang
              </Link>
            </div>
          </div>
        </div>

        {/* Card Customer Support & Jam Operasional CS */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0B48C5]/30 to-[#021342]/70 backdrop-blur-2xl border border-cyan-400/30 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_30px_rgba(6,182,212,0.2)]">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Layanan Pelanggan</h2>
            <p className="text-blue-100/90 font-light">Kami siap membantu setiap kebutuhan dan pertanyaan Anda seputar Pimpim.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
                  <Mail className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email Support</h4>
                  <a href="mailto:support@pimpim.id" className="text-blue-200 hover:text-cyan-300 transition-colors block">support@pimpim.id</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
                  <Phone className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Customer Service / WhatsApp</h4>
                  <a href="https://wa.me/6285284469067" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-cyan-300 transition-colors block">0852-8446-9067</a>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-inner">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-cyan-400" />
                <h4 className="text-white font-semibold">Jam Operasional CS</h4>
              </div>
              <ul className="space-y-4 text-blue-100/90 text-sm">
                <li className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="font-medium">Senin – Jumat</span>
                  <span className="font-bold text-white bg-white/10 px-3 py-1 rounded-lg">07.00 – 17.00 WIB</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-medium">Sabtu, Minggu & Libur Nasional</span>
                  <span className="font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20">Tutup</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
