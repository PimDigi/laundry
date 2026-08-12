"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import { Search, ArrowRight, Tag, Clock, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedRegion, setSelectedRegion] = useState("Semua Wilayah");

  const regions = [
    "Semua Wilayah",
    "📍 JaBaSu",
    "🏙️ Jakarta",
    "🇮🇩 Nasional",
    "🌐 Internasional"
  ];
  
  const categories = ["Semua", "Promo", "Tips", "Kuliner", "Berita"];

  const articles = [
    {
      title: "5 Kuliner Hits Jatinangor yang Wajib Kamu Coba di Pim Food",
      slug: "kuliner-hits-jatinangor",
      excerpt: "Jelajahi berbagai hidangan lokal favorit mahasiswa dari seblak hingga ayam geprek legendaris. Kini semuanya bisa dipesan langsung ke kosanmu!",
      category: "Kuliner",
      region: "📍 JaBaSu",
      date: "10 Agustus 2026",
      readTime: "4 Min Read",
      imageColor: "from-orange-500/20 to-amber-500/10",
      iconColor: "text-amber-400"
    },
    {
      title: "Naik Pim Eco: Solusi Hemat & Ramah Lingkungan untuk Mahasiswa",
      slug: "naik-pim-eco",
      excerpt: "Kenalan dengan Pim Eco, armada motor listrik terbaru dari Pimpim. Bebas polusi, suara mesin halus, dan pastinya lebih hemat untuk dompet mahasiswa.",
      category: "Berita",
      region: "📍 JaBaSu",
      date: "05 Agustus 2026",
      readTime: "3 Min Read",
      imageColor: "from-emerald-500/20 to-teal-500/10",
      iconColor: "text-emerald-400"
    },
    {
      title: "Panduan Lengkap Cara Mendaftar Jadi Mitra Driver Pimpim",
      slug: "panduan-daftar-driver",
      excerpt: "Ingin tambah penghasilan di sela-sela waktu luang? Simak langkah-langkah mudah mendaftar menjadi Pim Driver dari persiapan dokumen hingga akun aktif.",
      category: "Tips",
      region: "🇮🇩 Nasional",
      date: "28 Juli 2026",
      readTime: "5 Min Read",
      imageColor: "from-cyan-500/20 to-blue-500/10",
      iconColor: "text-cyan-400"
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Semua" || article.category === activeCategory;
    const matchesRegion = selectedRegion === "Semua Wilayah" || article.region === selectedRegion;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  // Helper function to extract a short version of the region for the badge
  const getShortRegion = (regionString: string) => {
    const icon = regionString.split(' ')[0];
    if (regionString.includes('JaBaSu')) return `${icon} JaBaSu`;
    if (regionString.includes('Jakarta')) return `${icon} Jakarta`;
    if (regionString.includes('Nasional')) return `${icon} Nasional`;
    if (regionString.includes('Internasional')) return `${icon} Internasional`;
    return regionString;
  };

  return (
    <main className="min-h-screen relative overflow-hidden pt-28">
      {/* Global Ambient Lighting */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-400/10 rounded-full blur-[150px] -translate-y-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-24 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center mb-12 mt-10">
          <span className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold tracking-widest mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            PIMPIM NEWS • KABAR & WAKTU REAL-TIME
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Pim News & <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Cerita Terhangat</span>
          </h1>
          <p className="text-lg text-blue-100/90 leading-relaxed font-light max-w-2xl mx-auto mb-10">
            Dapatkan berita terkini, promo, dan kabar dari wilayah JaBaSu hingga kabar nasional dan internasional.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="flex flex-col gap-6 mb-16 max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-cyan-400" />
            </div>
            <input
              type="text"
              placeholder="Cari artikel atau berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-blue-100/50 rounded-full py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all shadow-inner"
            />
          </div>

          <div>
            {/* Wilayah Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shrink-0 ${
                    selectedRegion === region
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 border border-transparent"
                      : "bg-white/10 text-blue-100 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shrink-0 ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 border border-transparent"
                      : "bg-white/10 text-blue-100 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, idx) => (
              <div 
                key={idx}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-cyan-400/50 hover:shadow-[0_15px_40px_rgba(6,182,212,0.2)] transition-all duration-300 flex flex-col h-full relative"
              >
                {/* Image Placeholder */}
                <Link href={`/blog/${article.slug}`} className={`h-48 w-full bg-gradient-to-br ${article.imageColor} relative overflow-hidden flex items-center justify-center block`}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 group-hover:scale-110 transition-transform duration-700" />
                  <Tag className={`w-12 h-12 ${article.iconColor} opacity-50 group-hover:scale-110 group-hover:opacity-80 transition-all duration-500`} />
                  
                  {/* Category Badge on Image */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                    <span className={`text-xs font-bold ${article.iconColor}`}>{article.category}</span>
                  </div>
                  
                  {/* Region Badge on Image */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-500/20 backdrop-blur-md rounded-full border border-cyan-500/30">
                    <span className="text-xs font-bold text-cyan-300">
                      {getShortRegion(article.region)}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-blue-100/60 mb-4">
                    <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {article.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
                  </div>
                  
                  <Link href={`/blog/${article.slug}`} className="block">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  
                  <p className="text-blue-100/80 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>
                  
                  <Link href={`/blog/${article.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 mt-auto group/btn">
                    Baca Selengkapnya <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-blue-100/70 text-lg">Tidak ada berita yang ditemukan untuk Wilayah & Kategori ini.</p>
            </div>
          )}
        </div>

      </div>
      
      <Footer />
    </main>
  );
}
