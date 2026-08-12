"use client";

import { ClipboardList, Filter, Search } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function RiwayatContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter'); // 'h-0' or 'h-1'
  
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Antrian");

  // Counter states
  const [counts, setCounts] = useState({
    Antrian: 0,
    Proses: 0,
    Selesai: 0,
    Dibatalkan: 0
  });

  const categories = ["Antrian", "Proses", "Selesai", "Dibatalkan"];

  const getCategoryForOpStatus = (opStatus: string) => {
    if (opStatus === 'Dibatalkan') return 'Dibatalkan';
    if (opStatus === 'Diterima' || opStatus === 'Baru') return 'Antrian';
    if (['Dicuci', 'Dikeringkan', 'Disetrika'].includes(opStatus)) return 'Proses';
    if (opStatus === 'Selesai' || opStatus === 'Diambil') return 'Selesai';
    return 'Antrian';
  };

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('lavora_orders') || '[]');
    
    // Calculate counts
    const newCounts = { Antrian: 0, Proses: 0, Selesai: 0, Dibatalkan: 0 };
    savedOrders.forEach((o: any) => {
      const opStatus = o.operationalStatus || (o.status === 'Baru' ? 'Diterima' : o.status) || 'Diterima';
      const cat = getCategoryForOpStatus(opStatus);
      if (newCounts[cat as keyof typeof newCounts] !== undefined) {
         newCounts[cat as keyof typeof newCounts]++;
      }
    });
    setCounts(newCounts);

    let filteredOrders = savedOrders;

    if (filterParam === 'h-0') {
      filteredOrders = savedOrders.filter((order: any) => {
        const isExpress = order.service?.toLowerCase().includes('express') || order.service?.toLowerCase().includes('kilat') || order.service?.toLowerCase().includes('24 jam');
        const opStatus = order.operationalStatus || order.status || 'Diterima';
        return opStatus !== 'Selesai' && opStatus !== 'Diambil' && opStatus !== 'Dibatalkan' && isExpress;
      });
      if (activeTab === 'Antrian' && !searchParams.get('tab_changed')) {
        // Just let it show all for deadline, or override activeTab
      }
    } else if (filterParam === 'h-1') {
      filteredOrders = savedOrders.filter((order: any) => {
        const isExpress = order.service?.toLowerCase().includes('express') || order.service?.toLowerCase().includes('kilat') || order.service?.toLowerCase().includes('24 jam');
        const opStatus = order.operationalStatus || order.status || 'Diterima';
        return opStatus !== 'Selesai' && opStatus !== 'Diambil' && opStatus !== 'Dibatalkan' && !isExpress;
      });
    }

    if (!filterParam || searchParams.get('tab_changed')) {
      filteredOrders = savedOrders.filter((order: any) => {
         const opStatus = order.operationalStatus || (order.status === 'Baru' ? 'Diterima' : order.status) || 'Diterima';
         return getCategoryForOpStatus(opStatus) === activeTab;
      });
    }

    setOrders(filteredOrders);
  }, [filterParam, activeTab, searchParams]);

  return (
    <div className="flex flex-col h-full py-2">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Riwayat Pesanan</h2>
          {filterParam === 'h-0' && !searchParams.get('tab_changed') && <p className="text-xs font-semibold text-red-500">Filter: Deadline Hari Ini</p>}
          {filterParam === 'h-1' && !searchParams.get('tab_changed') && <p className="text-xs font-semibold text-orange-500">Filter: Deadline Besok</p>}
        </div>
        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 shadow-sm">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Main Tabs */}
      <div className="grid grid-cols-4 bg-slate-200/50 p-1 rounded-xl mb-4 text-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`py-1.5 px-1 rounded-lg text-[10px] font-bold sm:text-xs transition-all ${
              activeTab === cat 
                ? "bg-white text-orange-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {cat} ({counts[cat as keyof typeof counts]})
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col h-full items-center justify-center p-6 text-center mt-10">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ClipboardList className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-700 mb-1">Kosong</h2>
          <p className="text-sm text-slate-500">Tidak ada pesanan di kategori ini.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 pb-20 overflow-y-auto">
          {orders.map((order, idx) => {
            const opStatus = order.operationalStatus || (order.status === 'Baru' ? 'Diterima' : order.status) || 'Diterima';
            const isLunas = order.paymentStatus === 'Lunas';
            const isExpress = order.service?.toLowerCase().includes('express') || order.service?.toLowerCase().includes('kilat') || order.service?.toLowerCase().includes('24 jam');
            
            // Dummy estSelesai based on created date + duration
            const createdDate = order.date; // e.g. "10 Agt, 17:10"
            
            return (
              <Link 
                href={`/pesanan/${order.id}`}
                key={order.id || idx} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform block"
              >
                {/* Header Card */}
                <div className="flex justify-between items-center px-4 py-2 bg-slate-50 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-600">{order.id}</span>
                  <div className="bg-blue-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-blue-700">Rp {order.price?.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                
                {/* Body Card */}
                <div className="p-4 flex gap-3">
                  {/* Left Icon */}
                  <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 border border-orange-100">
                    <span className="text-2xl">🧺</span>
                  </div>
                  
                  {/* Center Content */}
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{order.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500">{order.date}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] font-medium text-slate-600 truncate">Est: {(() => {
                        const rawEst = order.estimatedDate || order.estimatedCompletion;
                        if (rawEst) return rawEst;
                        
                        // Fallback for Member transaction
                        if (order.isMemberApplied || (order.service && order.service.toLowerCase().includes('member'))) {
                          const orderDate = new Date(order.createdAt);
                          const daysToAdd = order.service?.toLowerCase().includes('express') ? 1 : 3;
                          orderDate.setDate(orderDate.getDate() + daysToAdd);
                          return orderDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                        }
                        
                        if (!order.date) return "Belum diatur";
                        const parts = order.date.split(' ');
                        if (parts.length >= 2) {
                          const day = parseInt(parts[0]);
                          if (!isNaN(day)) return `${day + 1} ${parts[1]} ${parts[2] || ''}`.trim();
                        }
                        return order.date;
                      })()}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                        isLunas ? 'bg-green-50 text-green-600 border-green-200' : 
                        order.paymentStatus === 'DP' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {order.paymentStatus === 'Belum' ? 'Belum Bayar' : (order.paymentStatus === 'DP' ? 'DP' : 'Lunas')}
                      </span>
                      
                      {/* Operational status embedded as small text */}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${opStatus === 'Dibatalkan' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {opStatus === 'Dibatalkan' ? 'Dibatalkan' : `Tahap: ${opStatus}`}
                      </span>
                      
                      {isExpress && opStatus !== 'Selesai' && opStatus !== 'Diambil' && opStatus !== 'Dibatalkan' && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 border border-orange-200">
                          H-0
                        </span>
                      )}
                    </div>
                    
                    {opStatus === 'Dibatalkan' && (
                      <p className="text-[10px] text-red-500 font-medium mt-1.5 line-clamp-1 border-t border-red-50 pt-1">
                        Alasan: {order.alasan_pembatalan}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}

export default function Riwayat() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-10"><p>Loading...</p></div>}>
      <RiwayatContent />
    </Suspense>
  );
}
