import { MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-transparent text-blue-100 py-12 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand Info & Contact */}
          <div className="space-y-4">
            <Link href="/" className="inline-block mb-4">
              <img src="/Logo/publiclogo.png" alt="Pimpim Logo" className="h-14 md:h-20 w-auto object-contain" />
            </Link>
            <p className="text-sm text-blue-200 max-w-xs mb-4">
              Karya anak negeri, menghadirkan teknologi mobilitas dan ekosistem lokal terbaik untuk keseharian yang lebih mudah.
            </p>
            <div className="flex items-start gap-2.5 text-blue-100/90 text-sm">
              <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <span>Jatinangor, Sumedang, Jawa Barat, Indonesia</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-200 mt-2">
              <span className="w-5 h-5 flex items-center justify-center shrink-0">✉️</span>
              <a href="mailto:support@pimpim.id" className="hover:text-cyan-300 transition-colors">support@pimpim.id</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-200 mt-2">
              <span className="w-5 h-5 flex items-center justify-center shrink-0">📞</span>
              <a href="https://wa.me/6285284469067" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">0852-8446-9067</a>
            </div>
          </div>

          {/* Column 2: Layanan */}
          <div>
            <h3 className="text-white font-semibold mb-6">Layanan Utama</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-blue-200 hover:text-cyan-300 transition-colors">Pim Ride</Link></li>
              <li><Link href="#" className="text-blue-200 hover:text-cyan-300 transition-colors">Pim Car</Link></li>
              <li><Link href="#" className="text-blue-200 hover:text-cyan-300 transition-colors">Pim Food</Link></li>
              <li><Link href="#" className="text-blue-200 hover:text-cyan-300 transition-colors flex items-center gap-1">Pim Eco ⚡</Link></li>
            </ul>
          </div>

          {/* Column 3: Gabung Mitra */}
          <div>
            <h3 className="text-white font-semibold mb-6">Gabung Mitra</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="https://play.google.com/store/apps/details?id=com.ptanaknegeridigital.pimdriver" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-cyan-300 transition-colors">Gabung Mitra Driver</a></li>
              <li><Link href="#" className="text-blue-200 hover:text-cyan-300 transition-colors">Gabung Merchant Pim Food</Link></li>
            </ul>
          </div>

          {/* Column 4: Informasi & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6">Informasi & Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-blue-200 hover:text-cyan-300 transition-colors">Tentang Kami</Link></li>
              <li><Link href="/blog" className="text-blue-200 hover:text-cyan-300 transition-colors">Blog & Kabar Pimpim</Link></li>
              <li><Link href="/faq" className="text-blue-200 hover:text-cyan-300 transition-colors">Pusat Bantuan (FAQ)</Link></li>
              <li><Link href="/privacy" className="text-blue-200 hover:text-cyan-300 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="text-blue-200 hover:text-cyan-300 transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-500/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-300">© 2026 Pimpim. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/pimpim.indonesia/" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-cyan-400 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@pimpim.app" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-cyan-400 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
            </a>
            <a href="https://www.facebook.com/PimpimMoveEveryday" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-cyan-400 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/></svg>
            </a>
            <a href="https://x.com/PimpimIndonesia" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-cyan-400 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm text-blue-300 group cursor-pointer">
            <span>Website by <span className="text-blue-200 group-hover:text-white transition-colors">Pim Digi</span></span>
            {/* The Logo will be loaded if available, otherwise fallback to an icon for now */}
            <div className="w-6 h-6 rounded-full bg-blue-900 border border-blue-800 flex items-center justify-center overflow-hidden">
               <span className="text-[10px] font-bold text-white">PD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
