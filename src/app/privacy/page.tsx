import Footer from "@/components/Footer";
import { ShieldCheck, Mail, Phone, Info, Trash2, ShieldAlert, Lock, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: 'Kebijakan Privasi & Penghapusan Akun - Pimpim',
  description: 'Komitmen kami dalam mengelola dan melindungi data pengguna.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen relative overflow-hidden pt-28">
      {/* Global Ambient Lighting */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-400/10 rounded-full blur-[150px] -translate-y-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-24 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-10">
          <span className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold tracking-widest mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            LEGAL & PRIVASI • PT ANAK NEGERI DIGITAL
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Kebijakan Privasi & <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Penghapusan Akun</span>
          </h1>
          <p className="text-lg text-blue-100/90 leading-relaxed font-light max-w-2xl mx-auto mb-6">
            Komitmen kami dalam mengumpulkan, mengelola, melindungi, dan menghapus data pribadi pengguna serta mitra driver Pimpim.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-blue-200 text-sm">
            <ClockIcon className="w-4 h-4 text-cyan-400" /> Terakhir Diperbarui: Juni 2026
          </div>
        </div>

        {/* Document Content */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 mb-16 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
          <div className="prose prose-invert prose-blue max-w-none prose-headings:text-white prose-p:text-blue-100/80 prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-strong:text-white prose-li:text-blue-100/80">
            
            <section className="mb-10 border-b border-white/10 pb-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">1</span>
                Data yang Kami Kumpulkan
              </h3>
              <p>PT Anak Negeri Digital mengumpulkan data untuk keperluan operasional layanan Pimpim, meliputi:</p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li><strong>Informasi Akun:</strong> Nama lengkap, nomor telepon, alamat email, dan foto profil.</li>
                <li><strong>Otentikasi:</strong> Data akses pihak ketiga seperti kredensial Google OAuth (jika Anda mendaftar melalui Google).</li>
                <li><strong>Data Lokasi (GPS):</strong> Koordinat GPS real-time untuk keperluan penjemputan dan rute pengantaran.</li>
                <li><strong>Informasi Perangkat:</strong> Model perangkat keras, sistem operasi, IP Address, dan pengenal unik perangkat.</li>
                <li><strong>Data Finansial:</strong> Catatan transaksi, isi ulang saldo, dan mutasi komisi layanan (8%).</li>
                <li><strong>Dokumen Kemitraan (Khusus Driver/Merchant):</strong> KTP, SIM, STNK, serta dokumen pendukung armada lainnya.</li>
              </ul>
            </section>

            <section className="mb-10 border-b border-white/10 pb-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">2</span>
                Penggunaan Data
              </h3>
              <p>
                Informasi yang kami kumpulkan digunakan secara eksklusif untuk operasional layanan kami, seperti pencocokan penumpang dengan driver terdekat, pemrosesan transaksi, dukungan pelanggan (Customer Service), serta identifikasi dan pencegahan aktivitas penipuan (fraud).
              </p>
            </section>

            <section className="mb-10 border-b border-white/10 pb-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30">3</span>
                Informasi Lokasi & Akses Latar Belakang (Background Location)
              </h3>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 my-4">
                <p className="m-0 text-blue-100">
                  <strong>Penting:</strong> Aplikasi Pim Driver membutuhkan akses lokasi latar belakang (Background Location) untuk dapat beroperasi maksimal. Hal ini memungkinkan sistem tetap mencocokkan Anda dengan penumpang, menghitung tarif akurat, dan menjamin keselamatan rute <strong>walaupun aplikasi sedang tidak dibuka di layar (berjalan di background).</strong> Pengguna penumpang (Customer) juga dimintai akses lokasi untuk titik jemput yang lebih presisi.
                </p>
              </div>
            </section>

            <section className="mb-10 border-b border-white/10 pb-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">4</span>
                Layanan & Kebijakan Pihak Ketiga
              </h3>
              <p>Dalam operasionalnya, aplikasi Pimpim terintegrasi dengan layanan pihak ketiga. Kebijakan privasi mereka berlaku untuk layanan yang disediakannya:</p>
              <ul className="list-disc pl-5 space-y-1 mt-4">
                <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Play Services & Google Maps</a></li>
                <li><a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener noreferrer">Mapbox (Sistem Peta)</a></li>
                <li><a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer">OpenStreetMap / OSRM</a></li>
                <li><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Firebase (Otentikasi & Notifikasi)</a></li>
                <li><a href="https://ipaymu.com/id/privacy-policy" target="_blank" rel="noopener noreferrer">iPaymu (Payment Gateway)</a></li>
              </ul>
            </section>

            <section className="mb-10 border-b border-white/10 pb-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">5</span>
                Pembagian Informasi
              </h3>
              <p>
                Kami tidak pernah menjual data pribadi Anda. Kami hanya membagikan data Anda secara sangat terbatas kepada:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Mitra driver/penumpang (nama, lokasi, nomor telepon tersamar/langsung) hanya selama pesanan berlangsung.</li>
                <li>Mitra payment gateway (iPaymu) khusus untuk pemrosesan transaksi top-up atau pembayaran.</li>
                <li>Instansi penegak hukum yang berwenang jika diwajibkan secara hukum yang sah.</li>
              </ul>
            </section>

            <section className="mb-10 border-b border-white/10 pb-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">6 & 7</span>
                Penyimpanan & Perlindungan Data
              </h3>
              <p>
                Seluruh pertukaran transmisi data antara aplikasi klien dan server kami diamankan menggunakan protokol enkripsi HTTPS/SSL. Data sensitif pada pusat data dilindungi secara fisik maupun elektronik dengan pembatasan akses staf yang sangat ketat sesuai dengan regulasi PDP (Pelindungan Data Pribadi).
              </p>
            </section>

            <section className="mb-10 border-b border-white/10 pb-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 text-red-400 text-sm border border-red-500/30">8</span>
                Hak Pengguna & Kebijakan Penghapusan Akun
              </h3>
              
              <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Trash2 className="w-24 h-24 text-red-500" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" /> Prosedur Penghapusan Akun
                </h4>
                <p className="mb-4">
                  Sebagai pengguna, Anda memiliki hak penuh untuk meminta penghapusan akun serta data pribadi Anda dari sistem kami. Anda dapat melakukan penghapusan melalui salah satu cara berikut:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li><strong>Melalui Aplikasi:</strong> Buka aplikasi Pimpim / Pim Driver {'>'} Masuk ke menu Akun {'>'} Pengaturan {'>'} Pilih <strong>Hapus Akun</strong>.</li>
                  <li><strong>Melalui Customer Service:</strong> Hubungi WhatsApp CS kami di <strong>0821-2161-6716</strong> atau email ke <strong>support@pimpim.id</strong>.</li>
                </ul>

                <h4 className="text-lg font-bold text-white mb-3">Waktu Pemrosesan & Retensi Data Tersamar</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="m-0 text-sm">Permintaan penghapusan akun akan diproses dalam waktu <strong>maksimal 7 hari kerja</strong> setelah Anda memverifikasi permintaan penghapusan tersebut melalui OTP atau pencocokan dokumen identitas.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="m-0 text-sm"><strong>Pengecualian Retensi:</strong> Walaupun akun dan data profil Anda dihapus, kami secara hukum wajib menyimpan catatan riwayat transaksi keuangan (top up/pembayaran) serta log sistem keamanan <strong>dalam format yang disamarkan (anonymized)</strong> demi keperluan audit, pajak, dan penyelesaian sengketa hukum di masa depan.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">9 & 10</span>
                Batasan Usia & Perubahan Kebijakan
              </h3>
              <p>
                Layanan ini ditujukan bagi individu yang telah berusia minimal 17 tahun atau sudah memiliki Kartu Tanda Penduduk (KTP). Kami berhak dan dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Pembaruan yang substansial akan diinformasikan kepada Anda melalui email atau notifikasi pada platform kami.
              </p>
            </section>
            
          </div>
        </div>

        {/* Floating Support Banner */}
        <div className="bg-gradient-to-br from-[#0B48C5]/40 to-[#021342]/70 backdrop-blur-2xl border border-cyan-400/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_30px_rgba(6,182,212,0.2)]">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-cyan-300" />
                Butuh bantuan mengenai data atau penghapusan akun?
              </h2>
              <p className="text-blue-100/90 font-light text-sm max-w-md">
                Jangan ragu untuk menghubungi Data Protection Officer (DPO) / Tim Support kami.
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[250px]">
              <a href="mailto:support@pimpim.id" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                <Mail className="w-5 h-5 text-cyan-300" />
                <span className="text-white text-sm font-semibold group-hover:text-cyan-300 transition-colors">support@pimpim.id</span>
              </a>
              <a href="https://wa.me/6282121616716" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                <Phone className="w-5 h-5 text-cyan-300" />
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold group-hover:text-cyan-300 transition-colors">CS: 0821-2161-6716</span>
                  <span className="text-blue-200 text-[10px]">atau 0852-8446-9067</span>
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
