import Footer from "@/components/Footer";
import { ArrowLeft, Clock, CalendarDays, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: 'Blog Pimpim - Kabar Jatinangor',
  description: 'Membaca artikel informatif tentang Pimpim.',
};

const articlesData = [
  {
    title: "5 Kuliner Hits Jatinangor yang Wajib Kamu Coba di Pim Food",
    slug: "kuliner-hits-jatinangor",
    category: "Kuliner",
    date: "10 Agustus 2026",
    readTime: "4 Min Read",
    imageColor: "from-orange-500/20 to-amber-500/10",
    iconColor: "text-amber-400",
    content: `
      <p>Jatinangor bukan sekadar kota pendidikan, tapi juga surga bagi pecinta kuliner, khususnya mahasiswa. Dengan berjalannya waktu, berbagai macam hidangan legendaris telah lahir dan menjadi bagian tak terpisahkan dari keseharian anak kos.</p>
      <p>Melalui layanan <strong>Pim Food</strong> di aplikasi Pimpim, kini kamu tidak perlu lagi repot keluar kosan, antre panjang, atau berpanas-panasan. Cukup dengan beberapa sentuhan jari, makanan favoritmu akan diantar hangat langsung ke depan pintu kos.</p>
      
      <h3>1. Ayam Geprek Jatinangor</h3>
      <p>Sensasi pedas yang nendang berpadu dengan gurihnya ayam goreng krispi membuat ayam geprek ini selalu jadi primadona. Porsinya yang melimpah dan harganya yang mahasiswa banget menjadikan kuliner ini santapan wajib, apalagi saat tanggal tua.</p>
      
      <h3>2. Seblak Prasmanan</h3>
      <p>Siapa yang tak kenal seblak? Di Jatinangor, tren seblak prasmanan semakin menjamur. Kamu bisa memilih sendiri aneka toping mulai dari kerupuk, makaroni, sosis, bakso, hingga ceker ayam. Kuah kencurnya yang pekat siap menghangatkan malam-malam begadang nugasmu.</p>
      
      <h3>3. Nasi Kuning Ciseke</h3>
      <p>Bagi yang butuh asupan karbohidrat ekstra di pagi hari, Nasi Kuning Ciseke adalah jawabannya. Lauknya yang komplit—mulai dari telur balado, orek tempe, mie goreng, hingga kerupuk—dijamin bikin energi terisi penuh untuk kuliah seharian.</p>
      
      <h3>4. Bakso Aci Khas Sunda</h3>
      <p>Gurih, kenyal, dan pedas! Tiga kata yang mendeskripsikan bakso aci. Disajikan dengan kuah kaldu yang hangat ditambah taburan pilus cikur, makanan ini sangat pas dinikmati di tengah sejuknya udara Jatinangor sore hari.</p>
      
      <h3>5. Minuman Boba Kekinian</h3>
      <p>Setelah makan yang pedas-pedas, paling cocok ditutup dengan yang manis-manis. Banyak merchant Pim Food yang menawarkan minuman boba dengan beragam rasa, mulai dari brown sugar hingga taro, siap menyegarkan tenggorokan.</p>
      
      <p><em>Tunggu apa lagi? Buka aplikasi Pimpim, pilih menu Pim Food, dan temukan ratusan merchant kuliner lokal terbaik di Jatinangor yang siap memanjakan lidahmu!</em></p>
    `
  },
  {
    title: "Naik Pim Eco: Solusi Hemat & Ramah Lingkungan untuk Mahasiswa",
    slug: "naik-pim-eco",
    category: "Berita",
    date: "05 Agustus 2026",
    readTime: "3 Min Read",
    imageColor: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400",
    content: `
      <p>Mobilitas yang tinggi antar fakultas maupun kampus memang menuntut solusi transportasi yang cepat. Namun, Pimpim hadir tidak hanya menawarkan kecepatan, tetapi juga kepedulian terhadap lingkungan melalui armada <strong>Pim Eco</strong>.</p>
      <p>Pim Eco merupakan layanan ride-hailing yang menggunakan 100% armada motor listrik. Inovasi ini adalah bentuk komitmen PT Anak Negeri Digital dalam mendukung gerakan pengurangan emisi karbon di Indonesia, khususnya di kawasan pendidikan Jatinangor.</p>
      
      <h3>Mengapa Mahasiswa Harus Memilih Pim Eco?</h3>
      <p>Ada beberapa alasan mengapa armada motor listrik kami menjadi pilihan utama:</p>
      <ul>
        <li><strong>Bebas Polusi Udara:</strong> Pim Eco menghasilkan emisi gas buang nol (zero emission). Dengan menggunakan layanan ini, kamu turut berkontribusi menjaga udara Jatinangor tetap bersih.</li>
        <li><strong>Suara Mesin Halus:</strong> Tidak ada lagi suara bising knalpot. Motor listrik menawarkan pengalaman berkendara yang senyap dan minim getaran.</li>
        <li><strong>Tarif Lebih Hemat:</strong> Karena tidak bergantung pada BBM, biaya operasional motor listrik jauh lebih murah, yang berdampak pada penawaran tarif perjalanan yang lebih bersahabat untuk kantong mahasiswa.</li>
      </ul>
      
      <p>Pimpim menargetkan konversi 30% armada aktif ke Pim Eco pada akhir tahun ini. Mari menjadi bagian dari <em>Eco-Movement</em> ini. Pesan Pim Eco sekarang melalui aplikasi Pimpim!</p>
    `
  },
  {
    title: "Panduan Lengkap Cara Mendaftar Jadi Mitra Driver Pimpim",
    slug: "panduan-daftar-driver",
    category: "Tips",
    date: "28 Juli 2026",
    readTime: "5 Min Read",
    imageColor: "from-cyan-500/20 to-blue-500/10",
    iconColor: "text-cyan-400",
    content: `
      <p>Menjadi mitra pengemudi Pimpim (Pim Driver) adalah peluang emas bagi siapa saja yang ingin mendapatkan penghasilan tambahan dengan jam kerja yang sangat fleksibel. Terlebih di kawasan Jatinangor yang padat mobilitas mahasiswa.</p>
      <p>Bagi kamu yang berminat untuk bergabung dengan ekosistem transportasi karya anak negeri ini, berikut adalah panduan lengkap cara mendaftarnya.</p>
      
      <h3>Persyaratan Utama</h3>
      <p>Sebelum mendaftar, pastikan kamu telah menyiapkan dokumen-dokumen berikut dalam bentuk foto asli yang jelas (tidak buram):</p>
      <ol>
        <li>Kartu Tanda Penduduk (KTP) yang masih berlaku.</li>
        <li>Surat Izin Mengemudi (SIM C untuk Pim Ride/Eco, SIM A untuk Pim Car).</li>
        <li>Surat Tanda Nomor Kendaraan (STNK) pajak aktif.</li>
        <li>Foto Profil terbaru dengan latar belakang polos.</li>
        <li>Foto Kendaraan dari sisi depan, belakang, dan samping (memperlihatkan plat nomor).</li>
      </ol>
      
      <h3>Langkah-langkah Pendaftaran</h3>
      <p>Jika semua dokumen sudah siap, ikuti langkah berikut:</p>
      <ul>
        <li><strong>Unduh Aplikasi:</strong> Download aplikasi <em>Pim Driver</em> melalui Google Play Store.</li>
        <li><strong>Isi Formulir:</strong> Buka aplikasi, pilih "Daftar Jadi Mitra", lalu isi formulir data diri secara lengkap dan benar.</li>
        <li><strong>Unggah Dokumen:</strong> Upload semua foto dokumen yang telah disiapkan pada kolom yang tersedia. Pastikan tulisan terbaca jelas.</li>
        <li><strong>Tunggu Verifikasi:</strong> Tim kami akan memverifikasi dokumenmu. Proses ini memakan waktu maksimal 1-3 hari kerja.</li>
        <li><strong>Aktivasi Akun:</strong> Jika disetujui, kamu akan menerima notifikasi. Silakan login, isi saldo awal minimal Rp25.000, dan kamu siap menerima order pertama!</li>
      </ul>
      
      <p>Bergabunglah bersama ribuan mitra sukses lainnya. Pimpim senantiasa memegang prinsip transparansi dan keadilan kemitraan (potongan komisi kompetitif hanya 8%).</p>
    `
  }
];

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = articlesData.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen relative overflow-hidden pt-28">
      {/* Global Ambient Lighting */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-400/10 rounded-full blur-[150px] -translate-y-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-24 max-w-4xl">
        
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold mb-10 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Kembali ke Blog
        </Link>

        {/* Article Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className={`px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold ${post.iconColor}`}>
              {post.category}
            </span>
            <div className="flex items-center gap-3 text-sm text-blue-100/70">
              <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {post.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
            {post.title}
          </h1>

          {/* Hero Image / Placeholder */}
          <div className={`w-full h-64 md:h-[400px] rounded-3xl bg-gradient-to-br ${post.imageColor} relative overflow-hidden flex items-center justify-center border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
            <Tag className={`w-32 h-32 ${post.iconColor} opacity-50 drop-shadow-2xl`} />
          </div>
        </div>

        {/* Article Body */}
        <article className="prose prose-invert prose-blue max-w-none prose-headings:text-white prose-p:text-blue-100/90 prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-strong:text-white prose-li:text-blue-100/90 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 mb-16 shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA Banner */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0B48C5]/40 to-[#021342]/70 backdrop-blur-2xl border border-cyan-400/30 rounded-3xl p-10 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_30px_rgba(6,182,212,0.2)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Mulai Perjalananmu Bersama Pimpim!
            </h2>
            <p className="text-blue-100/90 font-light text-lg mb-8 max-w-xl mx-auto">
              Nikmati kemudahan mobilitas harian di Jatinangor atau bergabunglah sebagai Mitra Driver kami sekarang juga.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="https://play.google.com/store/apps/details?id=com.ptanaknegeridigital.pimpim" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-[0_10px_30px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all duration-300"
              >
                Download Aplikasi
              </Link>
              <Link 
                href="https://play.google.com/store/apps/details?id=com.ptanaknegeridigital.pimdriver" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                Daftar Jadi Driver
              </Link>
            </div>
          </div>
        </div>

      </div>
      
      <Footer />
    </main>
  );
}
