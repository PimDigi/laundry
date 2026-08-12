"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, MessageCircle, Phone, CheckCircle, ChevronRight, X, User, Printer, AlertCircle, Check, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generatePrintLogoPayload } from "@/utils/escpos";

const operationalSteps = [
  { status: 'Diterima', label: 'Diterima', color: 'bg-slate-50 text-slate-600 border-slate-200' },
  { status: 'Dicuci', label: 'Dicuci', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { status: 'Dikeringkan', label: 'Dikeringkan', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { status: 'Disetrika', label: 'Disetrika', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { status: 'Selesai', label: 'Siap Diambil', color: 'bg-green-50 text-green-600 border-green-200' }
];

export default function DetailPesanan({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const orderId = decodeURIComponent(resolvedParams.id);
  
  const [order, setOrder] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    laundryName: "Laundry Kilat",
    branchName: "Pusat",
    address: "Jl. Contoh No. 123",
    notaHeader: "LAVORA LAUNDRY",
    notaFooter: "Terima kasih atas kepercayaannya!",
    paperSize: "58mm",
    cashierName: "Kasir"
  });
  
  // Modals state
  const [isPaymentSubModalOpen, setIsPaymentSubModalOpen] = useState(false);
  const [pelunasanMethod, setPelunasanMethod] = useState("Tunai");

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Salah Input Layanan / Jumlah");
  const [cancelReasonOther, setCancelReasonOther] = useState("");

  const [showPhotoFallbackModal, setShowPhotoFallbackModal] = useState(false);
  const [fallbackPhoto, setFallbackPhoto] = useState<string | null>(null);
  const [pendingWaUrl, setPendingWaUrl] = useState<string | null>(null);

  const loadOrder = () => {
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
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Memuat Data Pesanan...</p>
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
  const opStatus = order.operationalStatus || (order.status === 'Baru' ? 'Diterima' : order.status) || 'Diterima';
  
  const isExpress = order.service?.toLowerCase().includes('express') || order.service?.toLowerCase().includes('kilat') || order.service?.toLowerCase().includes('24 jam');
  const serviceCategory = isExpress ? 'Express' : 'Reguler';
  
  const handleNextOpStatus = () => {
    const currentIndex = operationalSteps.findIndex(s => s.status === opStatus);
    if (currentIndex < operationalSteps.length - 1) {
      const nextStatus = operationalSteps[currentIndex + 1].status;
      
      const savedOrders = JSON.parse(localStorage.getItem('lavora_orders') || '[]');
      const updatedOrders = savedOrders.map((o: any) => {
        if (o.id === order.id) {
          return { ...o, operationalStatus: nextStatus, status: (nextStatus === 'Selesai' || nextStatus === 'Diambil' ? 'Selesai' : 'Proses') };
        }
        return o;
      });
      localStorage.setItem('lavora_orders', JSON.stringify(updatedOrders));
      loadOrder();
    }
  };

  const handleSetStatus = (targetStatus: string) => {
    const savedOrders = JSON.parse(localStorage.getItem('lavora_orders') || '[]');
    const updatedOrders = savedOrders.map((o: any) => {
      if (o.id === order.id) {
        return { ...o, operationalStatus: targetStatus, status: (targetStatus === 'Selesai' || targetStatus === 'Diambil' ? 'Selesai' : 'Proses') };
      }
      return o;
    });
    localStorage.setItem('lavora_orders', JSON.stringify(updatedOrders));
    loadOrder();
  };

  const confirmPelunasan = () => {
    const wasBelum = order.paymentStatus === 'Belum';
    const savedOrders = JSON.parse(localStorage.getItem('lavora_orders') || '[]');
    const updatedOrders = savedOrders.map((o: any) => {
      if (o.id === order.id) {
        return { 
          ...o, 
          paymentStatus: 'Lunas', 
          pelunasanMethod: pelunasanMethod,
          pelunasanAmount: sisaTagihan,
          paymentStatusWasBelum: wasBelum
        };
      }
      return o;
    });
    
    localStorage.setItem('lavora_orders', JSON.stringify(updatedOrders));
    setIsPaymentSubModalOpen(false);
    loadOrder(); 
  };

  const confirmCancel = () => {
    const finalReason = cancelReason === 'Lainnya' ? cancelReasonOther : cancelReason;
    if (cancelReason === 'Lainnya' && !finalReason.trim()) {
      alert("Harap masukkan alasan pembatalan");
      return;
    }

    const savedOrders = JSON.parse(localStorage.getItem('lavora_orders') || '[]');
    const updatedOrders = savedOrders.map((o: any) => {
      if (o.id === order.id) {
        return { 
          ...o, 
          status: 'Dibatalkan',
          operationalStatus: 'Dibatalkan', 
          alasan_pembatalan: finalReason,
          cancel_timestamp: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })
        };
      }
      return o;
    });
    
    localStorage.setItem('lavora_orders', JSON.stringify(updatedOrders));
    setIsCancelModalOpen(false);
    loadOrder();
  };

  const handleDownloadFallback = () => {
    if (fallbackPhoto) {
      const a = document.createElement("a");
      a.href = fallbackPhoto;
      a.download = `Bukti_Pesanan_${new Date().getTime()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const proceedToWaFallback = () => {
    if (pendingWaUrl) window.open(pendingWaUrl, '_blank');
    setShowPhotoFallbackModal(false);
  };

  const base64ToBlob = async (base64: string) => {
    const res = await fetch(base64);
    return await res.blob();
  };

  const copyImageToClipboard = async (base64Str: string) => {
    try {
      let finalBase64 = base64Str;
      if (base64Str.startsWith('data:image/jpeg')) {
         const img = new Image();
         await new Promise((resolve) => {
           img.onload = resolve;
           img.src = base64Str;
         });
         const canvas = document.createElement('canvas');
         canvas.width = img.width;
         canvas.height = img.height;
         const ctx = canvas.getContext('2d');
         ctx?.drawImage(img, 0, 0);
         finalBase64 = canvas.toDataURL('image/png');
      }

      const blob = await base64ToBlob(finalBase64);
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      return true;
    } catch (err) {
      console.error("Failed to copy image to clipboard:", err);
      return false;
    }
  };



  const handleSendWA = async () => {
    try {
      if (!order) return;
      const safePhone = order.phone || "";
      let waNumber = safePhone.replace(/\D/g, '');
      if (waNumber.startsWith('0')) {
        waNumber = '62' + waNumber.substring(1);
      } else if (!waNumber.startsWith('62') && waNumber.length > 0) {
        waNumber = '62' + waNumber; 
      }

      const laundryName = settings.laundryName || "Lavora Laundry";
      const waSettings = settings.waSettings || {};
      const promoText = waSettings.promoText || settings.waTemplateMessage || "";
      const customFooter = promoText ? `\n\n${promoText}` : "";

      let greeting = waSettings.greetingText || `Halo {namaPelanggan}, Berikut adalah rincian pesanan laundry Anda:`;
      greeting = greeting.replace(/{namaPelanggan}/g, order.name || "");

      const itemsText = order.items ? Object.entries(order.items).map(([id, itemData]) => {
        const service = services.find(s => s.id === id) || { name: id, unit: 'Pcs', price: 0 };
        const q = typeof itemData === 'object' && itemData !== null ? ((itemData as any).totalQty || 1) : (itemData || 1);
        const unit = service.unit || 'Pcs';
        const subtotal = service.price * Number(q);
        
        let text = `• ${service.name} (${q} ${unit}) : Rp ${subtotal.toLocaleString('id-ID')}`;
        
        if (typeof itemData === 'object' && itemData !== null && (itemData as any).details && (itemData as any).details.length > 0) {
          text += `\n  Rincian: ${(itemData as any).details.map((d: any) => `[${d.label}]`).join(', ')}`;
        }
        return text;
      }).filter(Boolean).join('\n') : `${order.service} (${order.qty}) : Rp ${order.price?.toLocaleString('id-ID')}`;

      let statusString = "";
      if (order.paymentStatus === "Lunas") {
        statusString = "LUNAS ✅";
      } else if (order.paymentStatus === "Belum") {
        statusString = "BELUM BAYAR ❌";
      } else if (order.paymentStatus === "DP") {
        const nominalDP = order.dpAmount || 0;
        const sisaTagihan = order.price - nominalDP;
        statusString = `DP (Sudah Bayar Rp ${nominalDP.toLocaleString('id-ID')} | Sisa Rp ${sisaTagihan.toLocaleString('id-ID')}) ⏳`;
      }

      let discountText = "";
      if (order.discount > 0) {
        discountText = `SUBTOTAL : Rp ${(order.subtotal || order.price).toLocaleString('id-ID')}\nDISKON : - Rp ${order.discount.toLocaleString('id-ID')}\n`;
      }
      if (order.isMemberApplied) {
        discountText += `PAKAI KUOTA : -${Number(order.usedQuota).toFixed(1)} Kg\n`;
      }
      
      let notesText = "";
      if (order.notes) {
        notesText = `\nCATATAN:\n${order.notes}\n`;
      }

      const rawMessage = `${laundryName} | Nota Digital : ${order.id}
Atas Nama : ${order.name || ""}

Pesan Dari ${laundryName}

${greeting}

ORDER ID : ${order.id}
EST SELESAI : ${order.estimatedCompletion || "Belum diatur"}

📋 *RINCIAN LAYANAN:*
${itemsText}

${discountText}TOTAL : Rp ${order.price?.toLocaleString('id-ID')}
STATUS PEMBAYARAN : ${statusString}${notesText}
${order.isMemberApplied ? `\n-----------------------------------\nINFO PEMAKAIAN MEMBER BULANAN\nPemakaian Hari Ini : ${Number(order.usedQuota).toFixed(1)} Kg\nSisa Kuota Terbaru : ${Number(order.remainingQuota).toFixed(1)} Kg\n-----------------------------------` : ''}

Salam, ${laundryName}${customFooter}`;

      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(rawMessage)}`;

      if (order.photoProof) {
        const copySuccess = await copyImageToClipboard(order.photoProof);
        if (copySuccess) {
          alert("Foto bukti berhasil disalin! Tinggal Paste (Ctrl+V) di chat WA 📋\n\nDi HP: Tahan (Long Press) kolom chat WA lalu pilih 'Paste / Tempel' 📋");
          window.open(waUrl, '_blank');
        } else {
          setFallbackPhoto(order.photoProof);
          setPendingWaUrl(waUrl);
          setShowPhotoFallbackModal(true);
        }
      } else {
        window.open(waUrl, '_blank');
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat membuat teks WhatsApp.");
    }
  };

  const handlePrintThermal = async () => {
    if (!order) return;

    const printFallback = () => {
      alert("Membuka antarmuka cetak sistem... 🖨️");
      window.print();
    };

    const nav = navigator as any;
    if (!nav.bluetooth) {
      printFallback();
      return;
    }

    try {
      let device;
      try {
        device = await nav.bluetooth.requestDevice({
          filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }],
          optionalServices: ['00001101-0000-1000-8000-00805f9b34fb', 'e7810a71-73ae-499d-8c15-faa9aef0c3f2']
        });
      } catch (filterError) {
        device = await nav.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb', 'e7810a71-73ae-499d-8c15-faa9aef0c3f2', '00001101-0000-1000-8000-00805f9b34fb']
        });
      }

      const server = await device.gatt.connect();
      
      let printCharacteristic: any = null;
      const btServices = await server.getPrimaryServices();
      
      for (const service of btServices) {
        const characteristics = await service.getCharacteristics();
        for (const characteristic of characteristics) {
          if (characteristic.properties.write || characteristic.properties.writeWithoutResponse) {
            printCharacteristic = characteristic;
            break;
          }
        }
        if (printCharacteristic) break;
      }

      if (printCharacteristic) {
         const encoder = new TextEncoder();
         const INIT = new Uint8Array([0x1B, 0x40]);
         const ALIGN_CENTER = new Uint8Array([0x1B, 0x61, 0x01]);
         const ALIGN_LEFT = new Uint8Array([0x1B, 0x61, 0x00]);
         const BOLD_ON = new Uint8Array([0x1B, 0x45, 0x01]);
         const BOLD_OFF = new Uint8Array([0x1B, 0x45, 0x00]);

         let data = new Uint8Array([...INIT]);

         const addText = (text: string) => {
           const buf = encoder.encode(text);
           const newData = new Uint8Array(data.length + buf.length);
           newData.set(data);
           newData.set(buf, data.length);
           data = newData;
         };

         const addCmd = (cmd: Uint8Array) => {
           const newData = new Uint8Array(data.length + cmd.length);
           newData.set(data);
           newData.set(cmd, data.length);
           data = newData;
         };

         const printSettings = settings.printSettings || {};
         const headerText = printSettings.headerText || settings.notaHeader || "LAVORA LAUNDRY";
         const footerText = printSettings.footerText || settings.notaFooter || "Terima kasih atas kepercayaannya";
         const cashierName = settings.cashierName || "Kasir";

         addCmd(ALIGN_CENTER);
         if (printSettings.logoUrl) {
           const logoPayload = await generatePrintLogoPayload(printSettings.logoUrl);
           if (logoPayload) {
             addCmd(logoPayload);
           }
         }

         addCmd(BOLD_ON);
         addText(`${headerText}\n`);
         addCmd(BOLD_OFF);
         addText(`Nota: ${order.id}\n`);
         addText('--------------------------------\n');
         
         addCmd(ALIGN_LEFT);
         if (printSettings.showBigCustomerName !== false) {
           addCmd(BOLD_ON);
           addText(`Pelanggan: ${order.name}\n`);
           addCmd(BOLD_OFF);
         } else {
           addText(`Pelanggan: ${order.name}\n`);
         }
         
         addText(`Tgl Order  : ${order.date}\n`);
         if (printSettings.showEstSelesai !== false && order.estimatedCompletion) {
           addText(`Est Selesai: ${order.estimatedCompletion}\n`);
         }
         addText('--------------------------------\n');
         
         if (order.items) {
           Object.entries(order.items).forEach(([id, itemData]) => {
             const service = services.find(s => s.id === id) || { name: id, unit: 'Pcs', price: 0 };
             const q = typeof itemData === 'object' && itemData !== null ? ((itemData as any).totalQty || 1) : (itemData || 1);
             const subtotal = service.price * Number(q);
             addText(`${service.name} (${q} ${service.unit || 'Pcs'})\n`);
             addText(`Rp ${subtotal.toLocaleString('id-ID')}\n`);
           });
         } else {
             addText(`${order.service} (${order.qty})\n`);
             addText(`Rp ${order.price?.toLocaleString('id-ID')}\n`);
         }
         
         addText('--------------------------------\n');
         if (order.discount > 0) {
           addText(`Sub Total: Rp ${(order.subtotal || order.price).toLocaleString('id-ID')}\n`);
           addText(`Diskon   :-Rp ${order.discount.toLocaleString('id-ID')}\n`);
         }
         addText(`Total: Rp ${order.price?.toLocaleString('id-ID')}\n`);
         
         let statusString = order.paymentStatus;
         if (order.paymentStatus === 'DP') {
             const nominalDP = order.dpAmount || 0;
             statusString = `DP Rp ${nominalDP.toLocaleString('id-ID')}`;
         }
         addText(`Status: ${statusString}\n`);
         addText('--------------------------------\n');
         
         addCmd(ALIGN_CENTER);
         addText(`${footerText}\n`);
         if (printSettings.showCashierDetails !== false) {
           addText(`Kasir: ${cashierName}\n`);
         }
         if (order.notes) {
           addText(`\nCatatan:\n${order.notes}\n`);
         }
         addText('\n\n\n'); 

         const CHUNK_SIZE = 512;
         for (let i = 0; i < data.length; i += CHUNK_SIZE) {
             const chunk = data.slice(i, i + CHUNK_SIZE);
             if (printCharacteristic.properties.write) {
                 await printCharacteristic.writeValue(chunk);
             } else {
                 await printCharacteristic.writeValueWithoutResponse(chunk);
             }
             await new Promise(r => setTimeout(r, 20));
         }

         alert("Struk berhasil dicetak via Bluetooth!");
      } else {
         throw new Error("Karakteristik write Bluetooth tidak ditemukan.");
      }

    } catch (btError) {
      console.warn("Bluetooth print failed or cancelled:", btError);
      printFallback();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20 relative print:hidden">
      {/* Top Navigation */}
      <div className="bg-white sticky top-0 z-40 border-b border-slate-200">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-bold text-slate-800 text-lg mr-6">Detail Pesanan</h1>
        </div>
        
        {/* Header Status (Lunas/Belum/Batal) */}
        {opStatus === 'Dibatalkan' ? (
          <div className="px-4 py-3 bg-red-600 text-white">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-200" />
                <span className="font-bold text-lg">DIBATALKAN</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/80 block uppercase tracking-wider">Pada</span>
                <span className="text-sm font-bold">{order.cancel_timestamp || '-'}</span>
              </div>
            </div>
            <p className="text-xs bg-red-700/50 p-2 rounded-lg mt-2 font-medium">Alasan: {order.alasan_pembatalan || '-'}</p>
          </div>
        ) : (
          <div className={`px-4 py-3 ${isLunas ? 'bg-green-600' : 'bg-red-500'} text-white`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {isLunas ? <CheckCircle className="w-5 h-5 text-green-200" /> : <AlertCircle className="w-5 h-5 text-red-200" />}
                <span className="font-bold text-lg">{isLunas ? 'LUNAS' : (order.paymentStatus === 'DP' ? 'DP (SEBAGIAN)' : 'BELUM BAYAR')}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/80 block uppercase tracking-wider">Est. Selesai</span>
                <span className="text-sm font-bold">{order.estimatedCompletion || (() => {
                  if (!order.date) return "Belum diatur";
                  const parts = order.date.split(' ');
                  if (parts.length >= 2) {
                    const day = parseInt(parts[0]);
                    if (!isNaN(day)) return `${day + 1} ${parts[1]} ${parts[2] || ''}`.trim();
                  }
                  return order.date;
                })()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-3 flex flex-col gap-3">
        {/* Sub Header */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">No. Transaksi</p>
            <p className="font-bold text-slate-800">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-0.5">Tgl Pesanan</p>
            <p className="font-bold text-slate-800 text-sm">{order.date}</p>
          </div>
        </div>

        {/* Customer Data */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">{order.name}</p>
                <p className="text-xs font-medium text-slate-500">{order.phone || '-'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleSendWA}
                className="w-9 h-9 bg-green-50 text-green-600 border border-green-200 rounded-full flex items-center justify-center hover:bg-green-100"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button onClick={handlePrintThermal} className="w-9 h-9 bg-blue-50 text-blue-600 border border-blue-200 rounded-full flex items-center justify-center hover:bg-blue-100">
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Order Details (Services) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
            <span>📦</span> Detail Pesanan
          </h3>
          
          <div className="border border-slate-100 bg-slate-50 rounded-xl p-3 mb-4">
            <div className="flex flex-col mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-max mb-3 ${
                isExpress ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {serviceCategory}
              </span>
              
              {/* Item List */}
              <div className="flex flex-col w-full">
                {order.items ? (
                  Object.entries(order.items).map(([id, itemData], index, arr) => {
                    const service = services.find(s => s.id === id);
                    const isLast = index === arr.length - 1;
                    
                    if (!service) return null;
                    
                    // For Karpet
                    if (service.unit === 'm²' && typeof itemData === 'object' && (itemData as any).details) {
                      const details = (itemData as any).details;
                      return (
                        <div key={id} className={`flex flex-col py-2 ${!isLast ? 'border-b border-slate-200' : ''}`}>
                          <span className="font-bold text-slate-800 text-sm mb-1">{service.name}</span>
                          {details.map((d: any, i: number) => (
                            <div key={i} className="flex justify-between items-start mb-1 last:mb-0">
                              <span className="text-xs text-slate-500">
                                {d.l}cm x {d.w}cm = {d.area} {service.unit} x Rp {service.price.toLocaleString('id-ID')}/{service.unit}
                              </span>
                              <span className="font-bold text-slate-700 text-sm whitespace-nowrap ml-2">
                                Rp {(d.area * service.price).toLocaleString('id-ID')}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    
                    // For Kiloan & Satuan
                    const q = typeof itemData === 'object' ? ((itemData as any).totalQty || 1) : (itemData || 1);
                    return (
                      <div key={id} className={`flex justify-between items-center py-2 ${!isLast ? 'border-b border-slate-200' : ''}`}>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-sm">{service.name}</span>
                          <span className="text-xs text-slate-500 mt-0.5">
                            {q} {service.unit} x Rp {service.price.toLocaleString('id-ID')}/{service.unit}
                          </span>
                        </div>
                        <span className="font-bold text-slate-700 text-sm">
                          Rp {(q * service.price).toLocaleString('id-ID')}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  // Legacy Format
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800 text-sm">{order.service}</span>
                    <span className="font-bold text-slate-700">
                      {typeof order.qty === 'object' ? (order.qty?.totalQty || 1) : (order.qty || 1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-500">Status:</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${operationalSteps.find(s=>s.status===opStatus)?.color || 'bg-slate-100 text-slate-600'}`}>
                {opStatus}
              </span>
            </div>
          </div>
          
          {/* Action Buttons for Operational Status */}
          {opStatus !== 'Dibatalkan' && (
            <div className="grid grid-cols-2 gap-2">
               <button 
                 onClick={() => handleSetStatus("Selesai")}
                 disabled={opStatus === "Selesai" || opStatus === "Diambil"}
                 className="py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-bold disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 active:scale-95 transition-all"
               >
                 Siap Diambil
               </button>
               <button 
                 onClick={handleNextOpStatus}
                 disabled={opStatus === "Selesai" || opStatus === "Diambil"}
                 className="py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 active:scale-95 transition-all"
               >
                 Proses Lanjut
               </button>
            </div>
          )}
        </div>

        {/* Photo Proof */}
        {order.photoProof && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
              <span>📸</span> Foto Bukti Barang
            </h3>
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              <img src={order.photoProof} alt="Bukti Pesanan" className="w-full h-auto object-cover max-h-48" />
            </div>
          </div>
        )}

        {/* Billing Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
            <span>💳</span> Rincian Tagihan
          </h3>
          
          <div className="flex flex-col gap-2 text-xs text-slate-600 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-slate-800">Rp {order.price?.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Jemput</span>
              <span className="font-medium text-slate-800">Rp 0</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Kirim</span>
              <span className="font-medium text-slate-800">Rp 0</span>
            </div>
            <div className="flex justify-between">
              <span>Diskon</span>
              <span className="font-medium text-green-600">-Rp 0</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-red-50 border border-red-100 rounded-lg p-2 text-center">
               <span className="block text-[9px] text-red-500 font-bold mb-0.5">TOTAL HARGA</span>
               <span className="block text-xs font-bold text-red-700">Rp {order.price?.toLocaleString('id-ID')}</span>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-2 text-center">
               <span className="block text-[9px] text-green-600 font-bold mb-0.5">DIBAYAR</span>
               <span className="block text-xs font-bold text-green-700">Rp {amountPaid.toLocaleString('id-ID')}</span>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-2 text-center">
               <span className="block text-[9px] text-orange-600 font-bold mb-0.5">SISA TAGIHAN</span>
               <span className="block text-xs font-bold text-orange-700">Rp {sisaTagihan.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {sisaTagihan > 0 && opStatus !== 'Dibatalkan' && (
            <button 
              onClick={() => setIsPaymentSubModalOpen(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white font-bold text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              Pelunasan Tagihan
            </button>
          )}
        </div>

        {/* Logs & Danger Zone */}
        <div className="mt-2 text-center">
           <p className="text-[10px] text-slate-400 mb-4">Pesanan dibuat oleh Admin Lavora pada {order.date}</p>
           {opStatus !== 'Dibatalkan' && (
             <button 
               onClick={() => setIsCancelModalOpen(true)}
               className="w-full py-3 bg-white text-red-500 font-bold text-sm border border-red-100 rounded-xl hover:bg-red-50 active:scale-95 transition-all"
             >
               Batalkan Pesanan
             </button>
           )}
        </div>
      </div>

      {/* Sub-modal Konfirmasi Pelunasan */}
      {isPaymentSubModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/70 z-[80] backdrop-blur-sm" onClick={() => setIsPaymentSubModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl z-[90] p-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-slate-800 text-lg mb-4 text-center">Konfirmasi Pelunasan</h3>
            
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Sisa Tagihan</label>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex justify-between items-center">
                <span className="font-bold text-orange-600 text-xl">
                  Rp {sisaTagihan.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Pilih Metode</label>
              <div className="grid grid-cols-2 gap-2">
                {["Tunai", "QRIS"].map(method => (
                  <button 
                    key={method}
                    onClick={() => setPelunasanMethod(method)}
                    className={`py-2.5 text-sm font-bold rounded-xl border-2 flex justify-center items-center gap-2 transition-all ${
                      pelunasanMethod === method 
                        ? "border-orange-500 bg-orange-50 text-orange-600" 
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    {pelunasanMethod === method && <Check className="w-4 h-4" />} 
                    {method === "Tunai" ? "💵" : "📲"} {method}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsPaymentSubModalOpen(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmPelunasan}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white shadow-lg shadow-orange-500/30 active:scale-95 transition-all"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </>
      )}

      {/* Sub-modal Batal Pesanan */}
      {isCancelModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/70 z-[80] backdrop-blur-sm" onClick={() => setIsCancelModalOpen(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-2xl z-[90] p-5 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
            <h3 className="font-bold text-slate-800 text-lg mb-1">Batalkan Pesanan?</h3>
            <p className="text-sm text-slate-500 mb-4">Tindakan ini tidak dapat dikembalikan dan akan memengaruhi laporan harian Anda.</p>
            
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Alasan Pembatalan</label>
              <div className="flex flex-col gap-2">
                {["Salah Input Layanan / Jumlah", "Pelanggan Batal Mencuci", "Layanan Tidak Tersedia", "Lainnya"].map(reason => (
                  <button 
                    key={reason}
                    onClick={() => setCancelReason(reason)}
                    className={`text-left p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                      cancelReason === reason 
                        ? "bg-red-50 border-red-200 text-red-700" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${cancelReason === reason ? 'border-red-500' : 'border-slate-300'}`}>
                      {cancelReason === reason && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                    </div>
                    <span className="text-sm font-medium">{reason}</span>
                  </button>
                ))}
              </div>
            </div>

            {cancelReason === 'Lainnya' && (
              <div className="mb-6">
                <input 
                  type="text" 
                  placeholder="Ketik alasan pembatalan..." 
                  value={cancelReasonOther}
                  onChange={(e) => setCancelReasonOther(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-red-500 transition-all"
                />
              </div>
            )}
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Kembali
              </button>
              <button 
                onClick={confirmCancel}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 text-white shadow-lg shadow-red-500/30 active:scale-95 transition-all"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </>
      )}

      {/* Fallback Photo Modal for Clipboard Failure */}
      {showPhotoFallbackModal && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 z-[100] backdrop-blur-sm" onClick={proceedToWaFallback} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl z-[110] p-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-lg">Foto Bukti Barang</h3>
              <button onClick={proceedToWaFallback} className="p-1 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-slate-500 mb-4">
              Browser tidak mendukung salin otomatis ke Clipboard. Anda dapat mengunduh foto ini untuk melampirkannya ke WhatsApp.
            </p>

            {fallbackPhoto && (
              <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <img src={fallbackPhoto} alt="Bukti" className="w-full h-auto object-cover max-h-64" />
              </div>
            )}
            
            <div className="flex gap-2">
              <button 
                onClick={handleDownloadFallback}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Unduh Foto
              </button>
              <button 
                onClick={proceedToWaFallback}
                className="flex-[2] py-3 rounded-xl font-bold text-sm bg-green-500 text-white shadow-lg shadow-green-500/30 hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Buka WhatsApp
              </button>
            </div>
          </div>
        </>
      )}

      {/* Print Only Section */}
      <div className={`hidden print:block p-4 font-mono text-sm w-full ${settings.printSettings?.paperSize === '80mm' ? 'max-w-[80mm]' : 'max-w-[58mm]'} mx-auto text-black bg-white h-screen`}>
        {settings.printSettings?.logoUrl && (
          <img src={settings.printSettings.logoUrl} alt="Logo" className="mx-auto mb-2 grayscale" style={{ maxHeight: '60px' }} />
        )}
        <h2 className="text-center font-bold text-xl mb-1">{settings.printSettings?.headerText || settings.notaHeader}</h2>
        <p className="text-center text-xs mb-4">{settings.address}</p>
        <div className="border-b border-dashed border-black pb-2 mb-2 text-xs">
          <p>Nota  : {order.id}</p>
          <p>Kasir : {settings.cashierName}</p>
          <p className={settings.printSettings?.showBigCustomerName !== false ? 'font-bold' : ''}>Plg   : {order.name}</p>
          <p>Tgl Order: {order.date}</p>
          {settings.printSettings?.showEstSelesai !== false && (
            <p>Est Selesai: {order.estimatedCompletion || (() => {
              if (!order.date) return "Belum diatur";
              const parts = order.date.split(' ');
              if (parts.length >= 2) {
                const day = parseInt(parts[0]);
                if (!isNaN(day)) return `${day + 1} ${parts[1]} ${parts[2] || ''}`.trim();
              }
              return order.date;
            })()}</p>
          )}
        </div>
        <div className="border-b border-dashed border-black pb-2 mb-2 text-xs">
          {/* Check if items exist (new orders) or use the summary string (old orders) */}
          {order.items ? (
            Object.entries(order.items).map(([id, itemData]) => {
              const q = typeof itemData === 'object' && itemData !== null 
                ? ((itemData as any).details ? (itemData as any).details.length : ((itemData as any).totalQty || 1)) 
                : (itemData || 1);
              const service = services.find(s => s.id === id) || { name: id };
              return (
                <div key={id} className="flex justify-between mb-1">
                  <span>{service.name} x{q}</span>
                </div>
              );
            })
          ) : (
            <div className="flex justify-between mb-1">
               <span>{order.service} ({order.qty})</span>
               <span>Rp {order.price?.toLocaleString('id-ID')}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between font-bold text-sm mb-1">
          <span>TOTAL</span>
          <span>Rp {order.price?.toLocaleString('id-ID')}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-xs mb-3 text-gray-600">
            <span>Diskon</span>
            <span>- Rp {order.discount.toLocaleString('id-ID')}</span>
          </div>
        )}
        <div className="text-xs mb-4 mt-2 border-t border-dashed border-black pt-2">
          <p>Status : {order.paymentStatus}</p>
          <p>Metode : {order.paymentMethod}</p>
        </div>
        {order.notes && (
          <div className="text-xs mb-4 border-t border-dashed border-black pt-2">
            <p className="font-bold">Catatan:</p>
            <p className="whitespace-pre-line">{order.notes}</p>
          </div>
        )}
        <p className="text-center text-xs whitespace-pre-line mt-4">{settings.printSettings?.footerText || settings.notaFooter}</p>
      </div>
    </div>
  );
}
