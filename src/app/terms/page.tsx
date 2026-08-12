"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import { User, Bike, Mail, Phone, ClockIcon, Scale, FileText, AlertCircle, Percent } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState<"customer" | "driver">("customer");

  return (
    <main className="min-h-screen relative overflow-hidden pt-28">
      {/* Global Ambient Lighting */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-400/10 rounded-full blur-[150px] -translate-y-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-24 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10 mt-10">
          <span className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold tracking-widest mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            DOKUMEN LEGAL • PT ANAK NEGERI DIGITAL
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Syarat & Ketentuan <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Layanan</span>
          </h1>
          <p className="text-lg text-blue-100/90 leading-relaxed font-light max-w-2xl mx-auto mb-6">
            Perjanjian hukum resmi yang mengikat bagi Pengguna (Penumpang) Pimpim dan Mitra Driver (Pim Driver).
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-blue-200 text-sm mb-12">
            <ClockIcon className="w-4 h-4 text-cyan-400" /> Terakhir Diperbarui: Juni 2026
          </div>
        </div>

        {/* Segment Switcher */}
        <div className="flex p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl mb-12 max-w-md mx-auto relative z-20">
          <button
            onClick={() => setActiveTab("customer")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${activeTab === "customer" ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]" : "text-blue-100/70 hover:text-white hover:bg-white/5"}`}
          >
            <User className="w-5 h-5" /> S&K Pengguna
          </button>
          <button
            onClick={() => setActiveTab("driver")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${activeTab === "driver" ? "bg-blue-500/20 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "text-blue-100/70 hover:text-white hover:bg-white/5"}`}
          >
            <Bike className="w-5 h-5" /> S&K Mitra Driver
          </button>
        </div>

        {/* Document Content */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 mb-16 shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all duration-500">
          <div className="prose prose-invert prose-blue max-w-none prose-headings:text-white prose-p:text-blue-100/80 prose-strong:text-white prose-li:text-blue-100/80 prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
            
            {activeTab === "customer" ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                  <FileText className="w-8 h-8 text-cyan-400" />
                  <h2 className="text-3xl font-bold m-0">S&K Pengguna (Penumpang)</h2>
                </div>
                
                <section className="mb-10">
                  <h3 className="text-xl font-bold text-cyan-300">Pasal 1: Definisi Layanan</h3>
                  <p>Aplikasi Pimpim adalah perusahaan teknologi, bukan perusahaan transportasi. Kami menyediakan platform yang menghubungkan Pengguna (Penumpang) dengan pihak ketiga penyedia layanan transportasi mandiri (Mitra Driver).</p>
                </section>

                <section className="mb-10">
                  <h3 className="text-xl font-bold text-cyan-300">Pasal 2: Ketentuan Akun & Batasan Usia</h3>
                  <p>Pengguna diwajibkan berusia minimal 17 tahun atau memiliki KTP/identitas yang sah secara hukum. Pengguna wajib memberikan data yang akurat dan menjaga kerahasiaan OTP. Segala aktivitas dari akun Anda adalah tanggung jawab Anda sepenuhnya.</p>
                </section>

                <section className="mb-10">
                  <h3 className="text-xl font-bold text-cyan-300">Pasal 3: Sistem Pembayaran & Transaksi</h3>
                  <p>Tarif layanan bersifat final dan transparan sebelum pesanan dibuat (Upfront Pricing). Pembayaran dilakukan secara tunai langsung kepada Mitra Driver atau melalui saldo/e-wallet pihak ketiga (jika tersedia). Biaya tambahan (tol, parkir kawasan) ditanggung Pengguna.</p>
                </section>

                <section className="mb-10">
                  <h3 className="text-xl font-bold text-cyan-300">Pasal 4: Lokasi, Peta, & Navigasi</h3>
                  <p>Kami menggunakan infrastruktur Mapbox dan Google Maps API untuk estimasi harga dan panduan rute. Pengguna menyetujui bahwa titik kordinat jemput dan antar dapat memiliki toleransi akurasi. Pastikan pin lokasi akurat saat memesan.</p>
                </section>

                <section className="mb-10">
                  <h3 className="text-xl font-bold text-cyan-300">Pasal 5: Larangan & Kode Etik Pengguna</h3>
                  <p>Pengguna dilarang melakukan order fiktif (prank), membawa barang terlarang, melanggar batas maksimum kapasitas penumpang, atau melakukan pelecehan, intimidasi, kekerasan fisik maupun verbal terhadap Mitra Driver kami.</p>
                </section>

                <section className="mb-10">
                  <h3 className="text-xl font-bold text-cyan-300">Pasal 6 & 7: Pembatalan Pesanan, Sanksi & Penonaktifan Akun</h3>
                  <p>Pengguna dapat membatalkan pesanan sebelum driver tiba. Pembatalan berlebih (excessive cancellation), pembuatan order fiktif, atau pelanggaran Kode Etik akan mengakibatkan sanksi berupa teguran, penangguhan sementara (suspend), hingga penghapusan akun permanen dan pelaporan hukum.</p>
                </section>

                <section className="mb-10">
                  <h3 className="text-xl font-bold text-cyan-300">Pasal 8 & 9: Batas Tanggung Jawab & Keadaan Kahar (Force Majeure)</h3>
                  <p>Pimpim tidak bertanggung jawab atas kerugian tidak langsung, insiden laka lantas, kehilangan barang, atau perselisihan pribadi di luar aplikasi. Dalam keadaan Force Majeure (bencana alam, pemadaman massal, gangguan satelit GPS), layanan dapat terhenti tanpa kewajiban kompensasi.</p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-cyan-300">Pasal 10: Perubahan Ketentuan</h3>
                  <p>Pimpim berhak mengubah S&K ini sewaktu-waktu. Kelangsungan penggunaan aplikasi Anda setelah perubahan mengindikasikan persetujuan Anda terhadap S&K baru.</p>
                </section>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                  <Scale className="w-8 h-8 text-blue-400" />
                  <h2 className="text-3xl font-bold m-0">S&K Mitra Driver (Pim Driver)</h2>
                </div>

                <section className="mb-8">
                  <h3 className="text-xl font-bold text-blue-300">Pasal 1: Definisi & Sifat Kemitraan</h3>
                  <p>Mitra Driver adalah pihak independen yang menjalin kerja sama kemitraan (partnership) dengan Pimpim, dan BUKAN merupakan karyawan, pekerja, atau agen Pimpim. Mitra bebas menentukan jam operasional mandiri.</p>
                </section>

                <section className="mb-8">
                  <h3 className="text-xl font-bold text-blue-300">Pasal 2: Ketentuan Akun, Kendaraan, & Batasan Usia</h3>
                  <p>Mitra diwajibkan berusia minimal 17 tahun, memiliki SIM yang sah, STNK aktif, dan kendaraan yang layak jalan. Akun mitra dan kendaraan tidak boleh dipindahtangankan (disewakan/dipinjamkan) kepada orang lain.</p>
                </section>

                <section className="mb-10">
                  <h3 className="text-xl font-bold text-blue-300 mb-4">Pasal 3: Skema Saldo, Potongan Komisi & Kebijakan Refund</h3>
                  
                  <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden my-4 shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Percent className="w-24 h-24 text-blue-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-400" /> Aturan Komisi 8% & Refund Saldo
                    </h4>
                    <p className="m-0 mb-4 text-sm leading-relaxed">
                      Pimpim menerapkan skema komisi platform (Biaya Layanan) sebesar <strong>8% per transaksi selesai</strong>. Komisi ini akan dipotong secara otomatis dari dompet saldo aplikasi Pim Driver Anda. Jika saldo kurang, Anda tidak dapat menerima pesanan tunai.
                    </p>
                    <ul className="list-disc pl-5 m-0 space-y-2 text-sm">
                      <li><strong>Top Up Saldo:</strong> Dilakukan via Payment Gateway (iPaymu) dengan transfer bank/virtual account. Saldo digunakan murni untuk operasional biaya layanan.</li>
                      <li><strong>Syarat Refund (Penarikan Saldo):</strong> Saldo tidak dapat di-withdraw secara bebas harian. Pengajuan Refund Saldo hanya dilayani apabila Mitra memutuskan <strong>Berhenti Bermitra Selamanya (Penghapusan Akun)</strong>.</li>
                      <li><strong>Ketentuan Refund:</strong> Pengajuan wajib melampirkan identitas diri. Minimal refund adalah Rp 25.000. Proses pencairan dana maksimal <strong>2x24 jam kerja</strong> dipotong biaya administrasi bank (jika ada).</li>
                    </ul>
                  </div>
                </section>

                <section className="mb-8">
                  <h3 className="text-xl font-bold text-blue-300">Pasal 4: Lokasi & Penggunaan Lokasi Latar Belakang</h3>
                  <p>Mitra menyetujui bahwa aplikasi Pim Driver wajib mengakses koordinat GPS di Latar Belakang (Background Location Access) selama akun dalam status "Online". Hal ini vital untuk sistem OpenStreetMap (OSM) dan OSRM server kami dalam mengukur estimasi jarak yang adil bagi tarif.</p>
                </section>

                <section className="mb-8">
                  <h3 className="text-xl font-bold text-blue-300">Pasal 5: Larangan & Kode Etik Mitra Driver</h3>
                  <p>Dilarang keras memanipulasi lokasi (Fake GPS / Tuyul), membuat order fiktif, melakukan transaksi di luar aplikasi, meminta tambahan tarif secara paksa (pemerasan), atau melakukan tindakan kekerasan verbal/fisik kepada pengguna. Aturan keselamatan berkendara (Helm, Sabuk Pengaman) wajib ditaati mutlak.</p>
                </section>

                <section className="mb-8">
                  <h3 className="text-xl font-bold text-blue-300">Pasal 6: Sanksi, Suspend, & Hak Banding</h3>
                  <p>Pelanggaran S&K dapat berujung pada pembekuan akun (Suspend) sementara atau permanen (Banned). Mitra Driver berhak melakukan upaya Banding / Klarifikasi atas pembekuan dengan menyertakan bukti kuat ke pihak Customer Service paling lambat 3x24 jam sejak notifikasi penangguhan.</p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-blue-300">Pasal 7 & 8: Batas Tanggung Jawab & Perubahan Ketentuan</h3>
                  <p>Tanggung jawab kepatuhan rambu lalu lintas dan perizinan jalan mutlak di tangan Mitra Driver. Pimpim tidak bertanggung jawab atas tilang atau kecelakaan lalu lintas. S&K ini dapat diperbarui dan disesuaikan berdasarkan regulasi pemerintah yang berlaku.</p>
                </section>
              </div>
            )}

          </div>
        </div>

        {/* Floating Support Banner */}
        <div className="bg-gradient-to-br from-[#0B48C5]/40 to-[#021342]/70 backdrop-blur-2xl border border-cyan-400/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_30px_rgba(6,182,212,0.2)]">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <Scale className="w-6 h-6 text-cyan-300" />
                Pertanyaan Hukum & Ketentuan?
              </h2>
              <p className="text-blue-100/90 font-light text-sm max-w-md">
                Tim legal dan support kami siap memberikan pencerahan atas Syarat & Ketentuan ini.
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[250px]">
              <a href="mailto:support@pimpim.id" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                <Mail className="w-5 h-5 text-cyan-300" />
                <span className="text-white text-sm font-semibold group-hover:text-cyan-300 transition-colors">support@pimpim.id</span>
              </a>
              <a href="https://wa.me/6285284469067" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                <Phone className="w-5 h-5 text-cyan-300" />
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold group-hover:text-cyan-300 transition-colors">CS: 0852-8446-9067</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
