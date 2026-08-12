"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import { Search, ChevronDown, User, Bike, Mail, Phone, Clock } from "lucide-react";

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<"customer" | "driver">("customer");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const customerFaqs = [
    { q: "Apa itu Pimpim?", a: "Pimpim adalah platform transportasi online karya anak negeri yang dikelola oleh PT Anak Negeri Digital, menyediakan layanan ride-hailing cepat dan terpercaya di Jatinangor dan sekitarnya." },
    { q: "Bagaimana cara membuat akun?", a: "Unduh aplikasi Pimpim via Play Store atau App Store, masukkan nomor HP Anda, dan verifikasi menggunakan kode OTP yang dikirim melalui SMS/WhatsApp." },
    { q: "Bagaimana cara memesan perjalanan?", a: "Buka aplikasi, pilih layanan Pim Ride atau Pim Car, masukkan lokasi penjemputan dan lokasi tujuan, lalu tekan 'Pesan'." },
    { q: "Bagaimana jika tidak ada driver yang menerima pesanan?", a: "Silakan tunggu beberapa saat atau coba buat pesanan kembali setelah beberapa menit. Sistem kami akan terus mencari driver terdekat." },
    { q: "Bagaimana cara membatalkan pesanan?", a: "Anda dapat menekan tombol 'Batal' di layar pesanan selama driver belum tiba di titik penjemputan." },
    { q: "Metode pembayaran apa saja yang tersedia?", a: "Saat ini kami menerima pembayaran tunai (cash) langsung ke driver dan dompet digital (e-wallet) yang terintegrasi." },
    { q: "Bagaimana jika saya mengalami kendala saat pembayaran?", a: "Segera simpan bukti kendala/screenshot dan hubungi Customer Support kami via WhatsApp atau email." },
    { q: "Bagaimana jika driver sulit ditemukan?", a: "Gunakan fitur chat atau panggilan suara di dalam aplikasi untuk memandu driver ke titik jemput presisi Anda." },
    { q: "Apakah saya dapat menghubungi driver?", a: "Ya, Anda bisa menghubungi driver via fitur chat atau telepon bawaan di aplikasi setelah pesanan diterima." },
    { q: "Bagaimana jika saya meninggalkan barang di kendaraan?", a: "Segera hubungi driver melalui riwayat pesanan, atau laporkan barang tertinggal ke Customer Support kami secepatnya." },
    { q: "Bagaimana jika terjadi kesalahan lokasi penjemputan atau tujuan?", a: "Beri tahu driver via chat/telepon, atau silakan batalkan pesanan dan buat pesanan baru yang sesuai jika driver belum jalan jauh." },
    { q: "Bagaimana cara memberikan penilaian kepada driver?", a: "Setelah perjalanan selesai, akan muncul pop-up rating bintang dan kolom ulasan di aplikasi Anda." },
    { q: "Bagaimana cara melaporkan pelayanan yang kurang memuaskan?", a: "Gunakan fitur ulasan aplikasi atau laporkan detail pesanan melalui WhatsApp CS kami untuk ditindaklanjuti." },
    { q: "Bagaimana jika akun saya tidak dapat login?", a: "Pastikan nomor HP aktif, sinyal stabil, dan Anda tidak menggunakan VPN. Jika masih gagal, hubungi CS kami." },
    { q: "Bagaimana jika saya mengganti nomor telepon?", a: "Anda dapat memperbarui nomor HP di menu Pengaturan Profil akun Anda dengan memverifikasi OTP baru." },
    { q: "Apakah data pribadi saya aman?", a: "Ya, PT Anak Negeri Digital berkomitmen penuh menjaga privasi dan kerahasiaan data Anda dengan standar keamanan terkripsi." },
    { q: "Bagaimana cara menghubungi Customer Support?", a: "Melalui email support@pimpim.id atau chat WhatsApp di 0852-8446-9067 saat jam operasional." },
    { q: "Apakah Pimpim tersedia di semua kota?", a: "Saat ini Pimpim beroperasi optimal secara hiper-lokal di Jatinangor dan area Kabupaten Sumedang sekitarnya." },
    { q: "Apakah tarif perjalanan sudah termasuk biaya tambahan?", a: "Tarif di aplikasi adalah biaya dasar perjalanan. Biaya parkir tol/kawasan ditanggung oleh penumpang secara tunai." },
    { q: "Bagaimana cara menyampaikan saran atau masukan?", a: "Kami sangat menghargai masukan Anda! Silakan kirimkan saran melalui email support@pimpim.id." }
  ];

  const driverFaqs = [
    { q: "Apa itu Pim Driver?", a: "Pim Driver adalah aplikasi resmi khusus bagi mitra pengemudi Pimpim untuk menerima dan mengelola pesanan harian." },
    { q: "Bagaimana cara menjadi mitra driver?", a: "Silakan mendaftar melalui Form Driver di website/aplikasi Pimpim, dan lengkapi dokumen persyaratan yang diminta." },
    { q: "Dokumen apa saja yang diperlukan?", a: "Siapkan foto KTP, SIM aktif, STNK kendaraan, Foto Kendaraan jelas, dan pas Foto Profil terbaru." },
    { q: "Berapa lama proses verifikasi akun?", a: "Proses verifikasi memakan waktu 1-3 hari kerja setelah seluruh dokumen terkirim lengkap dan jelas." },
    { q: "Bagaimana jika akun saya belum disetujui?", a: "Pastikan dokumen tidak buram. Hubungi CS Pimpim jika pengajuan belum diproses lebih dari 3 hari kerja." },
    { q: "Bagaimana cara menerima order?", a: "Pastikan saldo mencukupi dan geser tombol (toggle) menjadi 'Online' di beranda aplikasi Pim Driver Anda." },
    { q: "Bagaimana sistem pembayaran kepada driver?", a: "Pembayaran tunai diterima langsung oleh Anda. Pembayaran non-tunai otomatis masuk ke saldo akun aplikasi." },
    { q: "Apakah ada potongan komisi?", a: "Ya, terdapat biaya layanan (komisi) yang akan dipotong otomatis dari saldo aplikasi untuk setiap pesanan yang selesai." },
    { q: "Mengapa saya harus melakukan Top Up saldo?", a: "Saldo di aplikasi berguna sebagai deposit untuk pemotongan biaya layanan, khususnya saat Anda menerima order tunai." },
    { q: "Bagaimana cara Top Up saldo?", a: "Top Up dapat dilakukan melalui transfer bank virtual account atau lewat agen/merchant rekanan resmi Pimpim." },
    { q: "Apakah saldo dapat ditarik (withdraw)?", a: "Tidak. Saldo aplikasi tidak dapat ditarik langsung (withdraw), namun Anda dapat mengajukan refund saldo jika ingin berhenti bermitra sesuai Kebijakan Refund." },
    { q: "Bagaimana cara mengajukan refund?", a: "Anda dapat mengajukan refund dengan mengisi Formulir Pengembalian Saldo (Refund) yang tersedia di Pusat Bantuan aplikasi." },
    { q: "Berapa lama proses refund?", a: "Proses transfer refund memakan waktu maksimal 2x24 jam kerja setelah pengajuan diverifikasi dan disetujui." },
    { q: "Bagaimana jika saya mengganti nomor telepon?", a: "Demi keamanan akun, hubungi CS kami dengan membawa bukti identitas untuk proses pembaruan nomor HP driver." },
    { q: "Bagaimana jika saya mengganti kendaraan?", a: "Lakukan pembaruan data kendaraan (pelat nomor) dan lampirkan foto STNK baru di menu Pengaturan Akun Driver." },
    { q: "Bagaimana jika saya lupa kata sandi?", a: "Gunakan fitur 'Lupa Kata Sandi' pada layar awal login aplikasi Pim Driver untuk reset password via OTP." },
    { q: "Mengapa akun saya dinonaktifkan?", a: "Akun dapat dibekukan akibat pelanggaran kode etik, masa berlaku dokumen habis (SIM/STNK), atau laporan negatif berulang dari penumpang." },
    { q: "Bagaimana cara melaporkan kendala aplikasi?", a: "Gunakan fitur Lapor Kendala di profil aplikasi, atau tangkap layar (screenshot) error dan kirimkan ke WhatsApp CS." },
    { q: "Apakah saldo dapat diwariskan?", a: "Ya, saldo mitra dapat diteruskan kepada ahli waris yang sah dengan menyertakan dokumen legal sesuai Refund Policy kami." },
    { q: "Bagaimana cara menghubungi Customer Support?", a: "Hubungi Hotline CS Mitra di WhatsApp 0852-8446-9067 (Chat Only) atau email support@pimpim.id pada jam kerja." }
  ];

  const currentFaqs = activeTab === "customer" ? customerFaqs : driverFaqs;
  const filteredFaqs = currentFaqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen relative overflow-hidden pt-28">
      {/* Global Ambient Lighting */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-400/10 rounded-full blur-[150px] -translate-y-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-24 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 mt-10">
          <span className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold tracking-widest mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            PUSAT BANTUAN • PIMPIM
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ada yang Bisa <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Kami Bantu?</span>
          </h1>
        </div>

        {/* Segment Switcher */}
        <div className="flex p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl mb-8 max-w-md mx-auto">
          <button
            onClick={() => { setActiveTab("customer"); setOpenIndex(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${activeTab === "customer" ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]" : "text-blue-100/70 hover:text-white hover:bg-white/5"}`}
          >
            <User className="w-5 h-5" /> FAQ Customer
          </button>
          <button
            onClick={() => { setActiveTab("driver"); setOpenIndex(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${activeTab === "driver" ? "bg-blue-500/20 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "text-blue-100/70 hover:text-white hover:bg-white/5"}`}
          >
            <Bike className="w-5 h-5" /> FAQ Pim Driver
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-cyan-400" />
          </div>
          <input
            type="text"
            placeholder="Ketik kata kunci pertanyaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-blue-100/50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all shadow-inner"
          />
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-4 mb-20">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-white pr-8">{index + 1}. {faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-blue-100/90 leading-relaxed pt-2 border-t border-white/10">{faq.a}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-blue-100/70">Tidak menemukan pertanyaan yang cocok.</p>
            </div>
          )}
        </div>

        {/* Floating Support Banner */}
        <div className="bg-gradient-to-br from-[#0B48C5]/30 to-[#021342]/70 backdrop-blur-2xl border border-cyan-400/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_30px_rgba(6,182,212,0.2)]">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Belum menemukan jawabanmu?</h2>
            <p className="text-blue-100/90 font-light text-sm">Tim Customer Support kami siap membantu menyelesaikan kendalamu.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <Mail className="w-6 h-6 text-cyan-300 mb-3" />
              <h4 className="text-white font-semibold text-sm mb-1">Email</h4>
              <a href="mailto:support@pimpim.id" className="text-blue-200 text-xs hover:text-cyan-300">support@pimpim.id</a>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <Phone className="w-6 h-6 text-cyan-300 mb-3" />
              <h4 className="text-white font-semibold text-sm mb-1">CS WhatsApp</h4>
              <a href="https://wa.me/6285284469067" target="_blank" rel="noopener noreferrer" className="text-blue-200 text-xs hover:text-cyan-300">0852-8446-9067</a>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <Clock className="w-6 h-6 text-cyan-300 mb-3" />
              <h4 className="text-white font-semibold text-sm mb-1">Senin - Jumat</h4>
              <span className="text-blue-200 text-xs">07.00 - 17.00 WIB</span>
              <span className="text-red-400 text-[10px] mt-1 font-semibold">Sabtu, Minggu, Libur: Tutup</span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
