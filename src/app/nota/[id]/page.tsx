"use client";

import { use, useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Camera, Check } from "lucide-react";

export default function NotaDigital({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = decodeURIComponent(resolvedParams.id);
  
  const [order, setOrder] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    laundryName: "Laundry Kilat",
    branchName: "Pusat",
    address: "Jl. Contoh No. 123",
  });

  useEffect(() => {
    // Attempt to load from localStorage (Simulating backend fetch)
    const savedOrders = JSON.parse(localStorage.getItem('lavora_orders') || '[]');
    const found = savedOrders.find((o: any) => o.id === orderId);
    if (found) {
      setOrder(found);
    }
    const savedServices = JSON.parse(localStorage.getItem('lavora_services') || '[]');
    setServices(savedServices);

    const savedSettings = JSON.parse(localStorage.getItem('lavora_settings') || '{}');
    if (Object.keys(savedSettings).length > 0) {
      setSettings((prev: any) => ({ ...prev, ...savedSettings }));
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Mencari Nota Anda...</p>
      </div>
    );
  }

  const getAmountPaid = () => {
    if (order.paymentStatus === 'Lunas') {
      if (order.pelunasanAmount) return order.price; 
      return order.price;
    }
    if (order.paymentStatus === 'DP') return order.amountPaid || (order.price / 2);
    return 0;
  };

  const amountPaid = getAmountPaid();
  const sisaTagihan = order.price - amountPaid;
  const isLunas = order.paymentStatus === 'Lunas';
  const isBatal = order.status === 'Dibatalkan';

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 items-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl relative pb-20">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] p-6 text-white text-center rounded-b-[40px] shadow-lg mb-6 relative">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-orange-500 font-bold text-3xl mx-auto shadow-md mb-3">
            {settings.laundryName.charAt(0)}
          </div>
          <h1 className="font-black text-2xl tracking-tight leading-none mb-1">{settings.laundryName}</h1>
          <p className="text-orange-100 text-sm font-medium">{settings.branchName}</p>
          <p className="text-orange-200 text-xs mt-2 w-3/4 mx-auto opacity-80">{settings.address}</p>
        </div>

        <div className="px-5">
          {/* Status Pembayaran Banner */}
          <div className={`p-4 rounded-2xl mb-5 flex items-center justify-between ${
            isBatal ? 'bg-red-50 border border-red-200 text-red-700' :
            isLunas ? 'bg-green-50 border border-green-200 text-green-700' : 
            'bg-orange-50 border border-orange-200 text-orange-700'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                isBatal ? 'bg-red-200' :
                isLunas ? 'bg-green-200' : 'bg-orange-200'
              }`}>
                {isBatal ? <AlertCircle className="w-5 h-5" /> :
                 isLunas ? <CheckCircle className="w-5 h-5" /> : 
                 <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Status Pembayaran</p>
                <p className="font-bold">{isBatal ? 'DIBATALKAN' : (isLunas ? 'LUNAS' : (order.paymentStatus === 'DP' ? 'DP (SEBAGIAN)' : 'BELUM BAYAR'))}</p>
              </div>
            </div>
          </div>

          {/* Rincian Nota */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-5">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center border-b border-slate-100 pb-3">Rincian Transaksi</h2>
            
            <div className="grid grid-cols-2 gap-y-4 text-sm mb-4">
              <div>
                <p className="text-slate-500 text-xs mb-0.5">No. Nota</p>
                <p className="font-bold text-slate-800">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs mb-0.5">Tanggal</p>
                <p className="font-bold text-slate-800">{order.date}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Pelanggan</p>
                <p className="font-bold text-slate-800">{order.name}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs mb-0.5">Estimasi Selesai</p>
                <p className="font-bold text-slate-800">{order.estimatedCompletion || (() => {
                  if (!order.date) return "Belum diatur";
                  const parts = order.date.split(' ');
                  if (parts.length >= 2) {
                    const day = parseInt(parts[0]);
                    if (!isNaN(day)) return `${day + 1} ${parts[1]} ${parts[2] || ''}`.trim();
                  }
                  return order.date;
                })()}</p>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-4 mb-4">
              <p className="text-xs font-bold text-slate-500 mb-3">DAFTAR LAYANAN</p>
              <div className="flex flex-col gap-3">
                {order.items ? (
                  Object.entries(order.items).map(([id, itemData]) => {
                    const service = services.find(s => s.id === id);
                    if (!service) return null;
                    
                    // Handle Karpet
                    if (service.unit === 'm²' && typeof itemData === 'object' && (itemData as any).details) {
                      const details = (itemData as any).details;
                      return (
                        <div key={id} className="flex flex-col text-sm mb-2">
                          <span className="font-bold text-slate-800">{service.name}</span>
                          {details.map((d: any, i: number) => (
                            <div key={i} className="flex justify-between items-center text-xs mt-1">
                              <span className="text-slate-500">{d.l}cm x {d.w}cm = {d.area} {service.unit}</span>
                              <span className="font-bold text-slate-700">Rp {(d.area * service.price).toLocaleString('id-ID')}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    
                    const q = typeof itemData === 'object' ? ((itemData as any).totalQty || 1) : (itemData || 1);
                    return (
                      <div key={id} className="flex justify-between items-center text-sm">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{service.name}</span>
                          <span className="text-xs text-slate-500">{q} {service.unit} x Rp {service.price.toLocaleString('id-ID')}</span>
                        </div>
                        <span className="font-bold text-slate-700">Rp {(q * service.price).toLocaleString('id-ID')}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-800">{order.service} ({order.qty})</span>
                    <span className="font-bold text-slate-700">Rp {order.price?.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 flex flex-col gap-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Subtotal</span>
                 <span className="font-medium">Rp {order.price?.toLocaleString('id-ID')}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Diskon</span>
                 <span className="font-medium text-green-500">- Rp 0</span>
               </div>
               <div className="flex justify-between text-lg font-black text-slate-800 mt-2">
                 <span>Total Bayar</span>
                 <span className="text-orange-500">Rp {order.price?.toLocaleString('id-ID')}</span>
               </div>
            </div>
          </div>

          {/* Photo Proof Gallery */}
          {order.photoProof && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-5">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center flex items-center justify-center gap-2">
                <Camera className="w-4 h-4" /> Foto Timbangan / Bukti
              </h2>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                <img src={order.photoProof} alt="Bukti Cucian" className="w-full h-auto object-cover max-h-64" />
              </div>
            </div>
          )}
          
          <p className="text-center text-[10px] text-slate-400 font-medium">
            Nota Digital ini diterbitkan oleh {settings.laundryName} via Lavora.
          </p>
        </div>
      </div>
    </div>
  );
}
