"use client";

import { Check, ChevronRight, Minus, Plus, User, X, Printer, MessageCircle, Shirt, Zap, Footprints, Layers, Package, Trash2, Search, Camera, Crown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { generatePrintLogoPayload } from "@/utils/escpos";
import { addOrder, updateMember, fetchMembers } from "@/lib/supabase";

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('kilo') || cat.includes('cuci')) return <Shirt className="w-5 h-5" />;
  if (cat.includes('satuan')) return <Shirt className="w-5 h-5" />;
  if (cat.includes('express') || cat.includes('kilat')) return <Zap className="w-5 h-5" />;
  if (cat.includes('sepatu')) return <Footprints className="w-5 h-5" />;
  if (cat.includes('karpet')) return <Layers className="w-5 h-5" />;
  return <Package className="w-5 h-5" />;
};

export default function Kasir() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Semua");
  
  // Cart: { [id]: { totalQty: number, details: { l: number, w: number, area: number, label: string }[] } }
  const [cart, setCart] = useState<{ [id: string]: { totalQty: number, details?: { l: number, w: number, area: number, label: string }[] } }>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Dimension Input Modal State
  const [isDimModalOpen, setIsDimModalOpen] = useState(false);
  const [activeDimService, setActiveDimService] = useState<any>(null);
  const [dimInput, setDimInput] = useState({ length: "", width: "" });
  
  // Qty Input Modal State
  const [isQtyModalOpen, setIsQtyModalOpen] = useState(false);
  const [activeQtyService, setActiveQtyService] = useState<any>(null);
  const [qtyInput, setQtyInput] = useState("");
  
  // Date State for hydration issue
  const [currentDate, setCurrentDate] = useState("");
  
  // Customer State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  
  // Auto-suggest State
  const [customers, setCustomers] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Member State
  const [memberships, setMemberships] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [useMemberQuota, setUseMemberQuota] = useState(false);

  // Payment State
  const [paymentStatus, setPaymentStatus] = useState("Belum"); // Lunas, DP, Belum
  const [dpAmount, setDpAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Tunai"); // Tunai, QRIS, Kuota Member
  const [photoProof, setPhotoProof] = useState<string | null>(null);
  const [showPhotoFallbackModal, setShowPhotoFallbackModal] = useState(false);
  const [fallbackPhoto, setFallbackPhoto] = useState<string | null>(null);
  const [pendingWaUrl, setPendingWaUrl] = useState<string | null>(null);
  
  const [orderNotes, setOrderNotes] = useState("");
  const [discountType, setDiscountType] = useState<"Rp" | "%">("Rp");
  const [discountValue, setDiscountValue] = useState("");
  
  const [draftInvoiceId, setDraftInvoiceId] = useState("");

  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [services, setServices] = useState<any[]>([]);
  const [searchService, setSearchService] = useState("");
  
  const [appSettings, setAppSettings] = useState<any>({});

  const safeDate = (value: unknown) => {
    const date = value ? new Date(value as any) : new Date();
    return Number.isNaN(date.getTime()) ? new Date() : date;
  };

  // Initialize data from local storage
  useEffect(() => {
    setCurrentDate(new Date().toLocaleString('id-ID'));
    setAppSettings(JSON.parse(localStorage.getItem('lavora_settings') || '{}'));
    
    // Categories
    const savedCats = localStorage.getItem('lavora_categories');
    if (savedCats) {
      let cats = JSON.parse(savedCats);
      if (cats.includes("Karpet")) {
        cats = cats.filter((c: string) => c !== "Karpet");
        localStorage.setItem('lavora_categories', JSON.stringify(cats));
      }
      setCategories(["Semua", ...cats]);
    } else {
      setCategories(["Semua", "Kiloan", "Satuan", "Express"]);
    }

    // Services
    const savedServices = localStorage.getItem('lavora_services');
    if (savedServices) {
      const parsed = JSON.parse(savedServices);
      // Migrate old data if necessary
      const migrated = parsed.map((s: any) => {
        let cat = s.category;
        if (cat === "Karpet" || s.unit === "m²") {
          cat = "Satuan";
        }
        if (!s.durationValue) {
          return {
            ...s,
            category: cat,
            durationValue: s.durationHours || 24,
            durationUnit: "Jam"
          }
        }
        return { ...s, category: cat };
      });
      setServices(migrated);
      localStorage.setItem('lavora_services', JSON.stringify(migrated));
    } else {
      const defaultServices = [
        { id: "S1", name: "Cuci Komplit Reguler", category: "Kiloan", unit: "Kg", price: 7000, durationHours: 48 },
        { id: "S2", name: "Cuci Komplit Kilat", category: "Kiloan", unit: "Kg", price: 10000, durationHours: 24 },
        { id: "S3", name: "Selimut Kecil", category: "Satuan", unit: "Pcs", price: 15000, durationHours: 48 },
        { id: "S4", name: "Bedcover Besar", category: "Satuan", unit: "Pcs", price: 35000, durationHours: 72 },
      ];
      localStorage.setItem('lavora_services', JSON.stringify(defaultServices));
      setServices(defaultServices);
    }
    
    // Customers
    const savedCustomers = localStorage.getItem('lavora_customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      const dummyCustomers = [
        { id: '1', name: 'Budi Santoso', phone: '081234567890' },
        { id: '2', name: 'Siti Aminah', phone: '081298765432' }
      ];
      localStorage.setItem('lavora_customers', JSON.stringify(dummyCustomers));
      setCustomers(dummyCustomers);
    }

    // Click outside handler for auto-suggest
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    // Memberships: try remote first, fallback to local
    (async () => {
      try {
        const remoteMembers = await fetchMembers();
        if (remoteMembers && remoteMembers.length > 0) {
          setMemberships(remoteMembers);
          localStorage.setItem('lavora_memberships', JSON.stringify(remoteMembers));
        } else {
          const savedMemberships = localStorage.getItem('lavora_memberships');
          if (savedMemberships) setMemberships(JSON.parse(savedMemberships));
        }
      } catch {
        const savedMemberships = localStorage.getItem('lavora_memberships');
        if (savedMemberships) setMemberships(JSON.parse(savedMemberships));
      }
    })();

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groupedServices = services
    .filter(s => s.name.toLowerCase().includes(searchService.toLowerCase()))
    .reduce((acc: any, curr: any) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
    }, {});

  const combinedCustomers = [
    ...memberships.map(m => ({ ...m, phone: m.phone || "", isMember: true })),
    ...customers.map(c => ({ ...c, phone: c.phone || "", isMember: false }))
  ].filter((v, i, a) => a.findIndex(t => (t.phone === v.phone)) === i);

  const searchNameStr = customerName.toLowerCase();
  const searchPhoneStr = customerPhone.toLowerCase();
  const searchStr = searchNameStr || searchPhoneStr; // Use whichever has value
  
  const filteredCustomers = combinedCustomers.filter(c => {
    const name = (c.name || "").toLowerCase();
    const phone = String(c.phone || "").toLowerCase();
    return searchStr.length > 0 && (name.includes(searchStr) || phone.includes(searchStr));
  });

  const handleCardClick = (service: any) => {
    if (service.unit === 'm²') {
      setActiveDimService(service);
      setDimInput({ length: "", width: "" });
      setIsDimModalOpen(true);
    } else if (service.unit === 'Kg' || service.category.toLowerCase() === 'kiloan') {
      setActiveQtyService(service);
      const currentQty = cart[service.id]?.totalQty || "";
      setQtyInput(currentQty.toString());
      setIsQtyModalOpen(true);
    } else {
      // Add 1 immediately to cart for Pcs/other units
      setCart(prev => {
        const currentQty = prev[service.id]?.totalQty || 0;
        return {
          ...prev,
          [service.id]: { totalQty: currentQty + 1 }
        };
      });
    }
  };

  const handleMinusClick = (service: any) => {
    setCart(prev => {
      const updated = { ...prev };
      if (!updated[service.id]) return prev;

      if (service.unit === 'm²' || service.unit === 'Kg' || service.category.toLowerCase() === 'kiloan') {
        // Hapus langsung dari keranjang
        delete updated[service.id];
      } else {
        // Satuan (Pcs): kurangi 1
        const currentQty = updated[service.id].totalQty;
        if (currentQty <= 1) {
          delete updated[service.id];
        } else {
          updated[service.id] = { totalQty: currentQty - 1 };
        }
      }
      return updated;
    });
  };

  const handleSaveQty = () => {
    const qty = parseFloat(qtyInput);
    if (isNaN(qty) || qty < 0) {
      alert("Masukkan angka yang valid.");
      return;
    }

    setCart(prev => {
      const updated = { ...prev };
      const id = activeQtyService.id;
      
      if (qty === 0) {
        delete updated[id];
      } else {
        updated[id] = { totalQty: qty };
      }
      return updated;
    });
    
    setIsQtyModalOpen(false);
  };

  const handleAddDimension = () => {
    const l = parseFloat(dimInput.length);
    const w = parseFloat(dimInput.width);
    if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) {
      alert("Masukkan angka panjang dan lebar yang valid (cm).");
      return;
    }
    
    const area = (l * w) / 10000;
    const label = `${l}cm x ${w}cm = ${area} m²`;
    
    setCart(prev => {
      const id = activeDimService.id;
      const currentQty = prev[id]?.totalQty || 0;
      const currentDetails = prev[id]?.details || [];
      return {
        ...prev,
        [id]: {
          totalQty: currentQty + area,
          details: [...currentDetails, { l, w, area, label }]
        }
      };
    });
    setIsDimModalOpen(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.6);
          setPhotoProof(compressedDataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + (b.details ? b.details.length : b.totalQty), 0);
  const subtotalPrice = Math.round(Object.entries(cart).reduce((total, [id, item]) => {
    const service = services.find(s => s.id === id);
    return total + (service ? service.price * item.totalQty : 0);
  }, 0));
  let totalKiloanKg = 0;
  let totalKiloanPrice = 0;
  
  Object.entries(cart).forEach(([id, itemData]) => {
    const service = services.find(s => s.id === id);
    if (service && service.category === 'Kiloan') {
      const q = typeof itemData === 'object' ? ((itemData as any).totalQty || 0) : Number(itemData || 0);
      totalKiloanKg += q;
      totalKiloanPrice += (service.price * q);
    }
  });

  let usedQuota = 0;
  let quotaDiscount = 0;
  const isMemberActive = selectedMember && safeDate(selectedMember.expiredDate) >= new Date();

  if (isMemberActive && paymentMethod === 'Kuota Member' && selectedMember.remainingQuota > 0 && totalKiloanKg > 0) {
    usedQuota = Math.min(selectedMember.remainingQuota, totalKiloanKg);
    quotaDiscount = (usedQuota / totalKiloanKg) * totalKiloanPrice;
  }

  let discountAmount = 0;
  const parsedDiscount = parseFloat(discountValue.replace(/\D/g, '')) || 0;
  if (discountType === "%") {
    discountAmount = Math.round((subtotalPrice * parsedDiscount) / 100);
  } else {
    discountAmount = parsedDiscount;
  }
  
  const totalPrice = Math.max(0, subtotalPrice - discountAmount - Math.round(quotaDiscount));

  const generateInvoiceNumber = () => {
    if (draftInvoiceId) return draftInvoiceId;
    const now = new Date();
    const ts = now.getTime().toString().slice(-6);
    const newId = `INV-${ts}`;
    setDraftInvoiceId(newId);
    return newId;
  };

  const saveCustomerIfNew = () => {
    if (!customerName) return;
    
    // Check if exactly matches existing
    const exists = customers.some(c => c.name.toLowerCase() === customerName.toLowerCase() && c.phone === customerPhone);
    
    if (!exists) {
      const newCustomer = {
        id: Date.now().toString(),
        name: customerName,
        phone: customerPhone
      };
      const updatedCustomers = [...customers, newCustomer];
      localStorage.setItem('lavora_customers', JSON.stringify(updatedCustomers));
      setCustomers(updatedCustomers);
    }
  };

  const cleanOldPhotos = (orders: any[]) => {
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    return orders.map(order => {
       if (order.photoProof) {
         const isCompleted = order.operationalStatus === 'Selesai' || order.operationalStatus === 'Diambil' || order.paymentStatus === 'Lunas';
         let isOld = false;
         if (order.createdAt) {
            isOld = (now - order.createdAt) > sevenDaysMs;
         }
         if (isCompleted || isOld) {
            order.photoProof = null;
         }
       }
       return order;
    });
  };

  const buildDraftOrder = () => {
    if (!customerName || customerName.trim() === "") {
      alert("Masukkan nama pelanggan terlebih dahulu.");
      return null;
    }
    
    let maxHours = 0;
    Object.keys(cart).forEach(id => {
      const s = services.find(srv => srv.id === id);
      if (s) {
        let hrs = 24;
        if (s.durationValue && s.durationUnit) {
           hrs = parseFloat(s.durationValue) || 24;
           if (s.durationUnit.toLowerCase() === 'hari') hrs *= 24;
           if (s.durationUnit.toLowerCase() === 'minggu') hrs *= 24 * 7;
           if (s.durationUnit.toLowerCase() === 'bulan') hrs *= 24 * 30;
        } else if (s.duration) {
           const match = String(s.duration).match(/([\d\.]+)\s*(hari|jam|minggu|bulan)/i);
           if (match) {
             let val = parseFloat(match[1]);
             let unit = match[2].toLowerCase();
             if (unit === 'hari') hrs = val * 24;
             else if (unit === 'jam') hrs = val;
             else if (unit === 'minggu') hrs = val * 24 * 7;
             else if (unit === 'bulan') hrs = val * 24 * 30;
           }
        }
        if (hrs > maxHours) maxHours = hrs;
      }
    });

    const completionDate = new Date(Date.now() + (maxHours || 24) * 3600000);
    const estimatedCompletion = completionDate.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }).replace(/\./g, ':');

    return {
      id: generateInvoiceNumber(),
      name: customerName,
      phone: customerPhone || "",
      status: "Baru",
      operationalStatus: "Diterima",
      service: Object.keys(cart).map(id => services.find(s => s.id === id)?.name).join(", "),
      qty: `${totalItems} Item`,
      price: totalPrice,
      subtotal: subtotalPrice,
      discount: discountAmount > 0 ? discountAmount : 0,
      notes: orderNotes,
      paymentStatus,
      dpAmount: paymentStatus === 'DP' ? (parseInt(dpAmount.replace(/\D/g, '')) || 0) : 0,
      paymentMethod,
      date: new Date().toISOString(),
      estimatedCompletion,
      items: cart,
      photoProof,
      createdAt: Date.now(),
      usedQuota: paymentMethod === 'Kuota Member' ? usedQuota : 0,
      remainingQuota: selectedMember ? (selectedMember.remainingQuota - (paymentMethod === 'Kuota Member' ? usedQuota : 0)) : 0,
      isMemberApplied: paymentMethod === 'Kuota Member' && usedQuota > 0,
      memberId: selectedMember ? selectedMember.id : null
    };
  };

  const resetForm = () => {
    setCart({});
    setCustomerName("");
    setCustomerPhone("");
    setPaymentStatus("Belum");
    setDpAmount("");
    setPaymentMethod("Tunai");
    setPhotoProof(null);
    setOrderNotes("");
    setDiscountType("Rp");
    setDiscountValue("");
    setDraftInvoiceId("");
    setIsCheckoutOpen(false);
  };

  const handleSimpanSaja = async () => {
    const newOrder = buildDraftOrder();
    if (!newOrder) return;
    
    try {
      saveCustomerIfNew();
      
      if (newOrder.isMemberApplied && newOrder.memberId && newOrder.usedQuota > 0) {
        let savedMemberships = JSON.parse(localStorage.getItem('lavora_memberships') || '[]');
        savedMemberships = savedMemberships.map((m: any) => {
          if (m.id === newOrder.memberId) {
             const updatedMember = { ...m, remainingQuota: Math.max(0, m.remainingQuota - newOrder.usedQuota) };
             updateMember(updatedMember.id, updatedMember).catch(() => null);
             return updatedMember;
          }
          return m;
        });
        localStorage.setItem('lavora_memberships', JSON.stringify(savedMemberships));
        setMemberships(savedMemberships);
      }
      
      let existingOrders = JSON.parse(localStorage.getItem('lavora_orders') || '[]');
      existingOrders = cleanOldPhotos(existingOrders);
      let updatedOrders = [newOrder, ...existingOrders];
      
      let saved = false;
      while (!saved && updatedOrders.length > 0) {
         try {
            localStorage.setItem('lavora_orders', JSON.stringify(updatedOrders));
            saved = true;
         } catch (e: any) {
            if (e.name === 'QuotaExceededError') {
               let photoRemoved = false;
               for (let i = updatedOrders.length - 1; i >= 0; i--) {
                  if (updatedOrders[i].photoProof && updatedOrders[i].id !== newOrder.id) {
                     updatedOrders[i].photoProof = null;
                     photoRemoved = true;
                     break;
                  }
               }
               if (!photoRemoved) {
                   alert("Penyimpanan perangkat sangat penuh! Tidak dapat menyimpan foto bukti lagi, harap hapus data lama.");
                   newOrder.photoProof = null;
                   updatedOrders[0].photoProof = null;
               }
            } else {
               throw e;
            }
         }
      }

      await addOrder(newOrder);
      
      if (paymentStatus !== 'Belum') {
        const finances = JSON.parse(localStorage.getItem('lavora_finances') || '{"tunai":0, "qris":0}');
        if (paymentMethod === 'Tunai') finances.tunai += totalPrice;
        if (paymentMethod === 'QRIS') finances.qris += totalPrice;
        localStorage.setItem('lavora_finances', JSON.stringify(finances));
      }

      alert("Transaksi Berhasil Disimpan! 🎉");
      resetForm();
    } catch (err: any) {
      alert("Terjadi kesalahan saat menyimpan pesanan: " + err.message);
      console.error(err);
    }
  };



  const handlePrint = async () => {
    try {
      const order = buildDraftOrder();
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

           const settings = JSON.parse(localStorage.getItem('lavora_settings') || '{}');
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
           
           Object.entries(cart).forEach(([id, itemData]) => {
             const service = services.find(s => s.id === id);
             if (service) {
                const q = typeof itemData === 'object' ? ((itemData as any).totalQty || 1) : itemData;
                const subtotal = service.price * Number(q);
                addText(`${service.name} (${q} ${service.unit || 'Pcs'})\n`);
                addText(`Rp ${subtotal.toLocaleString('id-ID')}\n`);
             }
           });
           
           addText('--------------------------------\n');
           if (discountAmount > 0) {
             addText(`Sub Total: Rp ${subtotalPrice.toLocaleString('id-ID')}\n`);
             addText(`Diskon   :-Rp ${discountAmount.toLocaleString('id-ID')}\n`);
           }
           if (order.isMemberApplied) {
             addText(`Pakai Kuota: -${order.usedQuota.toFixed(1)} Kg\n`);
           }
           addText(`Total: Rp ${totalPrice.toLocaleString('id-ID')}\n`);
           
           let statusString = paymentStatus;
           if (paymentStatus === 'DP') {
               const nominalDP = parseInt(dpAmount.replace(/\D/g, '')) || 0;
               statusString = `DP Rp ${nominalDP.toLocaleString('id-ID')}`;
           }
           addText(`Status: ${statusString}\n`);
           addText('--------------------------------\n');
           
           if (order.isMemberApplied) {
             addText(`INFO PEMAKAIAN MEMBER BULANAN\n`);
             addText(`Pemakaian Hari Ini : ${order.usedQuota.toFixed(1)} Kg\n`);
             addText(`Sisa Kuota Terbaru : ${order.remainingQuota.toFixed(1)} Kg\n`);
             addText('--------------------------------\n');
           }
           
           addCmd(ALIGN_CENTER);
           addText(`${footerText}\n`);
           if (printSettings.showCashierDetails !== false) {
             addText(`Kasir: ${cashierName}\n`);
           }
           if (orderNotes) {
             addText(`\nCatatan:\n${orderNotes}\n`);
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

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat mencetak.");
    }
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

  const handleWhatsApp = async () => {
    try {
      const order = buildDraftOrder();
      if (order) {
        const safePhone = customerPhone || "";
        let waNumber = safePhone.replace(/\D/g, '');
        if (waNumber.startsWith('0')) {
          waNumber = '62' + waNumber.substring(1);
        } else if (!waNumber.startsWith('62') && waNumber.length > 0) {
          waNumber = '62' + waNumber; 
        }

        const settings = JSON.parse(localStorage.getItem('lavora_settings') || '{}');
        const laundryName = settings.laundryName || "Lavora Laundry";
        
        const waSettings = settings.waSettings || {};
        const promoText = waSettings.promoText || settings.waTemplateMessage || "";
        const customFooter = promoText ? `\n\n${promoText}` : "";

        let greeting = waSettings.greetingText || `Halo {namaPelanggan}, Berikut adalah rincian pesanan laundry Anda:`;
        greeting = greeting.replace(/{namaPelanggan}/g, customerName || "");

        const itemsText = Object.entries(cart).map(([id, itemData]) => {
          const service = services.find(s => s.id === id);
          if (!service) return "";
          const q = typeof itemData === 'object' ? ((itemData as any).totalQty || 1) : itemData;
          const unit = service.unit || 'Pcs';
          const subtotal = service.price * Number(q);
          
          let text = `• ${service.name} (${q} ${unit}) : Rp ${subtotal.toLocaleString('id-ID')}`;
          
          if (typeof itemData === 'object' && (itemData as any).details && (itemData as any).details.length > 0) {
            text += `\n  Rincian: ${(itemData as any).details.map((d: any) => `[${d.label}]`).join(', ')}`;
          }
          return text;
        }).filter(Boolean).join('\n');

        let statusString = "";
        if (paymentStatus === "Lunas") {
          statusString = "LUNAS ✅";
        } else if (paymentStatus === "Belum") {
          statusString = "BELUM BAYAR ❌";
        } else if (paymentStatus === "DP") {
          const nominalDP = parseInt(dpAmount.replace(/\D/g, '')) || 0;
          const sisaTagihan = totalPrice - nominalDP;
          statusString = `DP (Sudah Bayar Rp ${nominalDP.toLocaleString('id-ID')} | Sisa Rp ${sisaTagihan.toLocaleString('id-ID')}) ⏳`;
        }

        let discountText = "";
        if (discountAmount > 0) {
          discountText = `SUBTOTAL : Rp ${subtotalPrice.toLocaleString('id-ID')}\nDISKON : - Rp ${discountAmount.toLocaleString('id-ID')}\n`;
        }
        if (order.isMemberApplied) {
          discountText += `PAKAI KUOTA : -${order.usedQuota.toFixed(1)} Kg\nSISA KUOTA : ${order.remainingQuota.toFixed(1)} Kg\n`;
        }
        
        let notesText = "";
        if (orderNotes) {
          notesText = `\nCATATAN:\n${orderNotes}\n`;
        }

        const rawMessage = `${laundryName} | Nota Digital : ${order.id}
Atas Nama : ${customerName || ""}

Pesan Dari ${laundryName}

${greeting}

ORDER ID : ${order.id}
EST SELESAI : ${order.estimatedCompletion || "Belum diatur"}

📋 *RINCIAN LAYANAN:*
${itemsText}

${discountText}TOTAL : Rp ${totalPrice.toLocaleString('id-ID')}
STATUS PEMBAYARAN : ${statusString}${notesText}
${order.isMemberApplied ? `\n-----------------------------------\nINFO PEMAKAIAN MEMBER BULANAN\nPemakaian Hari Ini : ${order.usedQuota.toFixed(1)} Kg\nSisa Kuota Terbaru : ${order.remainingQuota.toFixed(1)} Kg\n-----------------------------------` : ''}

Salam, ${laundryName}${customFooter}`;

        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(rawMessage)}`;

        if (photoProof) {
          const copySuccess = await copyImageToClipboard(photoProof);
          if (copySuccess) {
            alert("Foto bukti berhasil disalin! Tinggal Paste (Ctrl+V) di chat WA 📋\n\nDi HP: Tahan (Long Press) kolom chat WA lalu pilih 'Paste / Tempel' 📋");
            window.open(waUrl, '_blank');
          } else {
            setFallbackPhoto(photoProof);
            setPendingWaUrl(waUrl);
            setShowPhotoFallbackModal(true);
          }
        } else {
          window.open(waUrl, '_blank');
        }
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat membuat teks WhatsApp.");
    }
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
    resetForm();
  };

  const handleSelectCustomer = (customer: any) => {
    setCustomerName(customer.name || "");
    setCustomerPhone(customer.phone || "");
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col h-full relative print:hidden">
      {/* Customer Form */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-4 relative" ref={wrapperRef}>
        <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Data Pelanggan</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Nama" 
              value={customerName}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setShowSuggestions(true);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-8 pr-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
            {/* Auto-suggest dropdown */}
            {showSuggestions && filteredCustomers.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {filteredCustomers.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCustomer(c)}
                    className="w-full text-left px-3 py-2 text-sm border-b border-slate-100 hover:bg-orange-50 focus:bg-orange-50 transition-colors last:border-b-0 flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{c.name}</span>
                      <span className="text-[10px] text-slate-500">{c.phone}</span>
                    </div>
                    {c.isMember && (
                       <div className="bg-blue-100 text-blue-600 p-1 rounded-md" title="Member">
                          <Crown className="w-3 h-3" />
                       </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">+62</span>
            <input 
              type="tel" 
              placeholder="No. WA" 
              value={customerPhone}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                setShowSuggestions(true);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Service Search */}
      <div className="px-3 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari nama layanan (misal: Reguler, Karpet)..."
            value={searchService}
            onChange={(e) => setSearchService(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Services List Grouped */}
      <div className="flex-1 pb-32 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {Object.keys(groupedServices).length === 0 ? (
             <div className="text-center text-slate-400 py-10 text-sm font-semibold">Tidak ada layanan ditemukan.</div>
          ) : (
            Object.keys(groupedServices).map(category => (
              <div key={category} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-1 mx-1">
                {/* Header Container */}
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center relative">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                      {getCategoryIcon(category)}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-800 text-base">{category}</h2>
                      <div className="flex gap-1 mt-1">
                        <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full uppercase">Cuci</span>
                        <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full uppercase">Kering</span>
                        <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full uppercase">Setrika</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* List Items */}
                <div className="flex flex-col p-2 gap-2">
                  {groupedServices[category].map((service: any) => {
                    const cartItem = cart[service.id];
                    const displayQty = cartItem ? (cartItem.details ? cartItem.details.length : cartItem.totalQty) : 0;
                    return (
                      <div 
                        key={service.id} 
                        className={`p-3 rounded-xl border flex justify-between items-center shadow-sm transition-all ${
                          displayQty > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200 hover:border-orange-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            displayQty > 0 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-500'
                          }`}>
                            {getCategoryIcon(service.category)}
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-bold text-sm mb-0.5 ${displayQty > 0 ? 'text-orange-900' : 'text-slate-800'}`}>
                              {service.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                displayQty > 0 ? 'bg-orange-200/50 text-orange-700' : 'bg-orange-100 text-orange-600'
                              }`}>
                                {service.durationValue ? `${service.durationValue} ${service.durationUnit}` : (service.duration || '')}
                              </span>
                              <span className={`text-xs font-semibold ${displayQty > 0 ? 'text-orange-700' : 'text-slate-500'}`}>
                                Rp {service.price.toLocaleString('id-ID')}/{service.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Selected Indicator and Plus Button */}
                        <div className="flex items-center gap-2">
                          {displayQty > 0 ? (
                            <>
                              <button
                                onClick={() => handleMinusClick(service)}
                                className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-500 flex items-center justify-center shadow-sm hover:bg-slate-50 hover:text-red-500 active:scale-90 transition-all shrink-0"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <div 
                                className="flex flex-col items-center justify-center min-w-[3.5rem] cursor-pointer active:scale-95 transition-transform"
                                onClick={() => handleCardClick(service)}
                                title="Ketuk untuk ubah jumlah"
                              >
                                <span className="text-[9px] font-bold text-orange-600 mb-0.5">Terpilih</span>
                                <span className="text-[11px] font-black text-orange-600 bg-white px-2 py-0.5 rounded-md shadow-sm border border-orange-100 whitespace-nowrap">
                                  {service.unit === 'm²' ? `${displayQty} item` : `${displayQty} ${service.unit}`}
                                </span>
                              </div>
                              <button 
                                onClick={() => handleCardClick(service)}
                                className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/40 hover:bg-orange-600 active:scale-90 transition-all shrink-0"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleCardClick(service)}
                              className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 hover:bg-orange-600 active:scale-90 transition-all shrink-0"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Checkout Bar */}
      {totalItems > 0 && !isCheckoutOpen && (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 max-w-md mx-auto">
          <div className="bg-slate-900 rounded-2xl p-2.5 flex justify-between items-center shadow-lg shadow-black/20">
            <div className="px-3">
              <p className="text-xs text-slate-400 mb-0.5">{totalItems} Item Terpilih</p>
              <p className="text-white font-bold text-lg leading-none">Rp {totalPrice.toLocaleString('id-ID')}</p>
            </div>
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-1 shadow-lg shadow-orange-500/30 hover:brightness-110 active:scale-95 transition-all"
            >
              Lanjut <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-Up Checkout Drawer */}
      {isCheckoutOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm transition-opacity" onClick={() => setIsCheckoutOpen(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-50 rounded-t-3xl z-[70] flex flex-col max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center p-5 bg-white border-b border-slate-200 rounded-t-3xl">
              <h3 className="font-bold text-slate-800 text-lg">Konfirmasi Pembayaran</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 flex flex-col gap-4">
              {/* Customer Input (if empty) */}
              {(!customerName || !customerPhone) && (
                <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl shadow-sm relative" ref={wrapperRef}>
                   <p className="text-xs text-orange-600 mb-2">⚠ Lengkapi data pelanggan untuk melanjutkan</p>
                   
                   <div className="relative">
                     <input 
                        type="text" 
                        placeholder="Nama Pelanggan" 
                        value={customerName}
                        onFocus={() => setShowSuggestions(true)}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          setShowSuggestions(true);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-orange-500 mb-2"
                      />
                      {/* Auto-suggest dropdown inside modal */}
                      {showSuggestions && filteredCustomers.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredCustomers.map(c => (
                            <button
                              key={c.id}
                              onClick={() => handleSelectCustomer(c)}
                              className="w-full text-left px-3 py-2 text-sm border-b border-slate-100 hover:bg-orange-50 focus:bg-orange-50 transition-colors last:border-b-0 flex items-center justify-between"
                            >
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">{c.name}</span>
                                <span className="text-[10px] text-slate-500">{c.phone}</span>
                              </div>
                              {c.isMember && (
                                 <div className="bg-blue-100 text-blue-600 p-1 rounded-md" title="Member">
                                    <Crown className="w-3 h-3" />
                                 </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                   </div>
                   
                    <input 
                      type="tel" 
                      placeholder="No. WhatsApp" 
                      value={customerPhone}
                      onFocus={() => setShowSuggestions(true)}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        setShowSuggestions(true);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-orange-500"
                    />
                </div>
              )}

              {/* Order Notes */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Catatan Pesanan</h4>
                <textarea
                  placeholder="Ketik catatan khusus pesanan... (opsional)"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Order Summary */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Rincian Pesanan</h4>
                <div className="flex flex-col gap-2 mb-3">
                  {Object.entries(cart).map(([id, item]) => {
                    const service = services.find(s => s.id === id);
                    if (!service) return null;
                    return (
                      <div key={id} className="flex flex-col gap-1 text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <span className="text-slate-600">{service.name} <span className="font-bold text-slate-500 ml-1">x{item.totalQty} {service.unit}</span></span>
                          <span className="font-semibold text-slate-800">Rp {(service.price * item.totalQty).toLocaleString('id-ID')}</span>
                        </div>
                        {item.details && item.details.map((d, i) => (
                          <span key={i} className="text-[10px] text-slate-400 pl-2 border-l-2 border-slate-200 ml-1">
                            {d.label}
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-dashed border-slate-200 pt-3 flex flex-col gap-3 mb-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">Sub Total</span>
                    <span className="font-semibold text-slate-800">Rp {subtotalPrice.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select 
                      value={discountType} 
                      onChange={e => {
                        setDiscountType(e.target.value as "Rp" | "%");
                        setDiscountValue("");
                      }}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500 font-bold text-slate-700 outline-none"
                    >
                      <option value="Rp">Rp</option>
                      <option value="%">%</option>
                    </select>
                    <input 
                      type="text"
                      placeholder="Nominal Diskon"
                      value={discountValue}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (discountType === "%" && parseInt(val) > 100) return;
                        setDiscountValue(val ? (discountType === "Rp" ? parseInt(val).toLocaleString('id-ID') : val) : "");
                      }}
                      className="flex-1 bg-white border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500 text-right font-bold text-slate-700"
                    />
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600 font-bold bg-green-50 p-2 rounded-lg border border-green-100">
                      <span>Potongan Diskon</span>
                      <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Total Akhir</span>
                  <span className="text-xl font-black text-orange-500">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Photo Proof */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">📸 Foto Bukti Timbangan / Barang</h4>
                {photoProof ? (
                  <div className="relative">
                    <img src={photoProof} alt="Bukti" className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                    <button 
                      onClick={() => setPhotoProof(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg shadow-md hover:bg-red-600 transition-colors"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 hover:border-orange-400 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">Ambil / Unggah Foto Bukti</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      className="hidden" 
                      onChange={handlePhotoUpload}
                    />
                  </label>
                )}
              </div>

              {/* Payment Status & Method */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Status Pembayaran</h4>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["Lunas", "DP", "Belum"].map(status => (
                    <button 
                      key={status}
                      onClick={() => setPaymentStatus(status)}
                      className={`py-2 text-sm font-bold rounded-lg border-2 flex justify-center items-center gap-1 transition-all ${
                        paymentStatus === status 
                          ? "border-orange-500 bg-orange-50 text-orange-600" 
                          : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      {paymentStatus === status && <Check className="w-4 h-4" />} {status}
                    </button>
                  ))}
                </div>
                
                {paymentStatus === "DP" && (
                  <div className="mb-4 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Nominal DP (Rp)</label>
                    <input 
                      type="text" 
                      value={dpAmount} 
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setDpAmount(val ? parseInt(val).toLocaleString('id-ID') : "");
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-bold focus:outline-none focus:border-orange-400"
                      placeholder="Masukkan jumlah DP"
                    />
                  </div>
                )}
                
                <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Metode</h4>
                <div className={`grid ${selectedMember && new Date(selectedMember.expiredDate) >= new Date() ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-2'}`}>
                  {["Tunai", "QRIS", ...(selectedMember && new Date(selectedMember.expiredDate) >= new Date() ? ["Kuota Member"] : [])].map(method => (
                    <button 
                      key={method}
                      onClick={() => {
                        setPaymentMethod(method);
                        if (method === 'Kuota Member') setPaymentStatus('Lunas');
                      }}
                      className={`py-2 text-sm font-bold rounded-lg border-2 flex justify-center items-center gap-1 transition-all ${
                        paymentMethod === method 
                          ? "border-orange-500 bg-orange-50 text-orange-600" 
                          : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      {paymentMethod === method && <Check className="w-4 h-4" />} {method === "Kuota Member" ? "[ 💳 Potong Kuota Member ]" : method}
                    </button>
                  ))}
                </div>
                {selectedMember && new Date(selectedMember.expiredDate) >= new Date() && paymentMethod === 'Kuota Member' && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-700 text-xs text-center">
                     <p className="font-bold mb-1">Sisa Kuota Saat Ini: {selectedMember.remainingQuota.toFixed(1)} Kg</p>
                     {totalKiloanKg > 0 ? (
                        <p>Akan dipotong: {usedQuota.toFixed(1)} Kg (Sisa Nanti: {(selectedMember.remainingQuota - usedQuota).toFixed(1)} Kg)</p>
                     ) : (
                        <p className="text-red-500 font-bold mt-1">*Tambahkan layanan Kiloan untuk memotong kuota.</p>
                     )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-3 pb-24 z-50 relative">
              <button onClick={handleSimpanSaja} className="w-full py-3 font-bold text-sm rounded-xl bg-slate-800 text-white shadow-lg flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-95 transition-all">
                💾 Simpan
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handlePrint} className="py-3 font-bold text-sm rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all">
                  <Printer className="w-4 h-4" /> Cetak Thermal
                </button>
                <button onClick={handleWhatsApp} className="py-3 font-bold text-sm rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <MessageCircle className="w-4 h-4" /> Kirim WA Nota
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Qty Input Modal */}
      {isQtyModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 z-[80] backdrop-blur-sm" onClick={() => setIsQtyModalOpen(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-2xl z-[90] p-5 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <h3 className="font-bold text-slate-800 text-lg mb-1">{activeQtyService?.name}</h3>
            <p className="text-xs text-slate-500 mb-4">Masukkan kuantitas pesanan ({activeQtyService?.unit}). Dapat menggunakan angka desimal (misal: 2.5).</p>
            
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Jumlah / Berat ({activeQtyService?.unit})</label>
              <input 
                type="number" 
                value={qtyInput}
                onChange={(e) => setQtyInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-center font-bold text-xl focus:outline-none focus:border-orange-500 transition-all"
                placeholder="0"
                autoFocus
                step="0.01"
              />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setCart(prev => {
                    const updated = { ...prev };
                    delete updated[activeQtyService?.id];
                    return updated;
                  });
                  setIsQtyModalOpen(false);
                }}
                className="py-3 px-4 rounded-xl font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                title="Hapus dari Keranjang"
              >
                <Trash2 className="w-5 h-5 mx-auto" />
              </button>
              <button 
                onClick={() => setIsQtyModalOpen(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveQty}
                className="flex-[2] py-3 rounded-xl font-bold text-sm bg-orange-500 text-white shadow-lg shadow-orange-500/30 active:scale-95 transition-all"
              >
                Simpan
              </button>
            </div>
          </div>
        </>
      )}

      {/* Dimension Input Modal */}
      {isDimModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 z-[80] backdrop-blur-sm" onClick={() => setIsDimModalOpen(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-2xl z-[90] p-5 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <h3 className="font-bold text-slate-800 text-lg mb-1">Ukuran {activeDimService?.name}</h3>
            <p className="text-xs text-slate-500 mb-4">Masukkan dimensi dalam satuan sentimeter (cm).</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Panjang (cm)</label>
                <input 
                  type="number" 
                  value={dimInput.length}
                  onChange={(e) => setDimInput({...dimInput, length: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-center font-bold text-lg focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="0"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Lebar (cm)</label>
                <input 
                  type="number" 
                  value={dimInput.width}
                  onChange={(e) => setDimInput({...dimInput, width: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-center font-bold text-lg focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setIsDimModalOpen(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleAddDimension}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-orange-500 text-white shadow-lg shadow-orange-500/30 active:scale-95 transition-all"
              >
                Simpan & Hitung
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
      {(() => {
        const printSettings = appSettings?.printSettings || {};
        return (
          <div className={`hidden print:block p-4 font-mono text-sm w-full ${printSettings.paperSize === '80mm' ? 'max-w-[80mm]' : 'max-w-[58mm]'} mx-auto text-black bg-white h-screen`}>
            {printSettings.logoUrl && (
              <img src={printSettings.logoUrl} alt="Logo" className="mx-auto mb-2 grayscale" style={{ maxHeight: '60px' }} />
            )}
            <h2 className="text-center font-bold text-xl mb-1">{printSettings.headerText || appSettings?.notaHeader || "LAVORA LAUNDRY"}</h2>
            <p className="text-center text-xs mb-4">{appSettings?.address || "Jl. Contoh No. 123, Pusat"}</p>
            <div className="border-b border-dashed border-black pb-2 mb-2">
              <p>Tgl : {currentDate}</p>
              <p>Plg : {customerName}</p>
              <p>HP  : {customerPhone}</p>
              <p>Est : {(() => {
                let maxHours = 0;
                Object.keys(cart).forEach(id => {
                  const s = services.find(srv => srv.id === id);
              if (s) {
                let hrs = 24;
                if (s.durationValue && s.durationUnit) {
                   hrs = parseFloat(s.durationValue) || 24;
                   if (s.durationUnit.toLowerCase() === 'hari') hrs *= 24;
                   if (s.durationUnit.toLowerCase() === 'minggu') hrs *= 24 * 7;
                   if (s.durationUnit.toLowerCase() === 'bulan') hrs *= 24 * 30;
                } else if (s.duration) {
                   const match = String(s.duration).match(/([\d\.]+)\s*(hari|jam|minggu|bulan)/i);
                   if (match) {
                     let val = parseFloat(match[1]);
                     let unit = match[2].toLowerCase();
                     if (unit === 'hari') hrs = val * 24;
                     else if (unit === 'jam') hrs = val;
                     else if (unit === 'minggu') hrs = val * 24 * 7;
                     else if (unit === 'bulan') hrs = val * 24 * 30;
                   }
                }
                if (hrs > maxHours) maxHours = hrs;
              }
            });
            const completionDate = new Date(Date.now() + (maxHours || 24) * 3600000);
            return completionDate.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }).replace(/\./g, ':');
          })()}</p>
        </div>
        <div className="border-b border-dashed border-black pb-2 mb-2">
          {Object.entries(cart).map(([id, item]) => {
            const service = services.find(s => s.id === id);
            if (!service) return null;
            return (
              <div key={id} className="mb-2">
                <div className="flex justify-between text-xs mb-0.5">
                  <span>{service.name} x{item.totalQty} {service.unit}</span>
                  <span>Rp {(service.price * item.totalQty).toLocaleString('id-ID')}</span>
                </div>
                {item.details && item.details.map((d, i) => (
                  <div key={i} className="text-[10px] text-gray-500 ml-2">
                    - {d.label}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between font-bold text-sm mb-4">
          <span>TOTAL</span>
          <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
        </div>
        <p className="text-xs">Status : {paymentStatus}</p>
        <p className="text-xs mb-6">Metode : {paymentMethod}</p>
        <p className="text-center text-xs">{printSettings.footerText || appSettings?.notaFooter || "Terima kasih atas kepercayaannya!"}</p>
      </div>
        );
      })()}
    </div>
  );
}
