"use client";

import { ChevronRight, Database, Headset, LogOut, Printer, RefreshCcw, Settings2, Store, User, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Pengaturan() {
  const router = useRouter();

  const [activeModal, setActiveModal] = useState<"none" | "profil" | "nota" | "kasir" | "reset">("none");
  const [resetInput, setResetInput] = useState("");

  const [storeProfile, setStoreProfile] = useState({
    storeName: "Lavora Laundry",
    storeAddress: "Pusat",
    appLogoUrl: ""
  });

  const [settings, setSettings] = useState<any>({
    laundryName: "Laundry Kilat",
    branchName: "Pusat",
    whatsapp: "08123456789",
    address: "Jl. Contoh No. 123",
    cashierName: "Kasir",
    printSettings: {
      headerText: "LAVORA LAUNDRY",
      footerText: "Terima kasih atas kepercayaannya",
      paperSize: "58mm",
      showBigCustomerName: true,
      showEstSelesai: true,
      showCashierDetails: true
    },
    waSettings: {
      promoText: "",
      greetingText: "Halo {namaPelanggan}, Berikut adalah rincian pesanan laundry Anda:"
    }
  });

  const [activeNotaTab, setActiveNotaTab] = useState<"thermal" | "wa">("thermal");
  const [userRole, setUserRole] = useState("employee");

  useEffect(() => {
    const saved = localStorage.getItem('lavora_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration logic for older flat structure
      if (!parsed.printSettings || !parsed.waSettings) {
        setSettings({
          ...parsed,
          printSettings: {
            headerText: parsed.notaHeader || "LAVORA LAUNDRY",
            footerText: parsed.notaFooter || "Terima kasih atas kepercayaannya",
            paperSize: parsed.paperSize || "58mm",
            showBigCustomerName: true,
            showEstSelesai: true,
            showCashierDetails: true
          },
          waSettings: {
            promoText: parsed.waTemplateMessage || "",
            greetingText: "Halo {namaPelanggan}, Berikut adalah rincian pesanan laundry Anda:"
          }
        });
      } else {
        setSettings(parsed);
      }
    }
    
    const savedProfile = localStorage.getItem('storeProfile');
    if (savedProfile) {
      setStoreProfile(JSON.parse(savedProfile));
    }

    const session = localStorage.getItem('lavora_session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession.role) {
          setUserRole(parsedSession.role);
        }
      } catch {
        // ignore invalid session data
      }
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Max width for 58mm printer is typically 384 pixels
        const MAX_WIDTH = 384;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Fill white background for transparency handling
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
          setSettings({
            ...settings, 
            printSettings: { ...settings.printSettings, logoUrl: compressedBase64 }
          });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem('lavora_settings', JSON.stringify(settings));
    localStorage.setItem('storeProfile', JSON.stringify(storeProfile));
    setActiveModal("none");
    // alert is optional, since modal closes it implies success
  };

  const handleProfileLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
          setStoreProfile({
            ...storeProfile, 
            appLogoUrl: compressedBase64
          });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleResetData = () => {
    if (resetInput !== "RESET") return;
    
    localStorage.removeItem("lavora_orders");
    localStorage.removeItem("lavora_customers");
    localStorage.removeItem("lavora_expenses");
    localStorage.removeItem("lavora_finances");
    localStorage.removeItem("lavora_categories");
    localStorage.removeItem("lavora_services");
    localStorage.removeItem("lavora_expense_categories");
    localStorage.removeItem("lavora_memberships");
    
    alert("Seluruh data berhasil direset ke awal!");
    setActiveModal("none");
    setResetInput("");
    router.push("/");
  };

  const menuList = [
    {
      id: "layanan",
      label: "Kelola Layanan",
      desc: "Atur harga, nama layanan, dan tipe",
      icon: Database,
      color: "text-blue-500",
      bg: "bg-blue-50",
      onClick: () => router.push("/layanan")
    },
    {
      id: "konsumen",
      label: "Manajemen Pelanggan / Konsumen",
      desc: "Daftar kontak customer, riwayat transaksi, & total poin",
      icon: Users,
      color: "text-rose-500",
      bg: "bg-rose-50",
      onClick: () => router.push("/konsumen")
    },
    {
      id: "profil",
      label: "Profil Laundry & Outlet",
      desc: "Ubah nama, cabang, dan alamat",
      icon: Store,
      color: "text-orange-500",
      bg: "bg-orange-50",
      onClick: () => setActiveModal("profil")
    },
    {
      id: "nota",
      label: "Pengaturan Nota & Struk",
      desc: "Header, footer, dan ukuran cetak",
      icon: Printer,
      color: "text-green-500",
      bg: "bg-green-50",
      onClick: () => setActiveModal("nota")
    },
    {
      id: "kasir",
      label: "Kelola Kasir & Operator",
      desc: "Nama yang tampil di nota & dashboard",
      icon: User,
      color: "text-purple-500",
      bg: "bg-purple-50",
      onClick: () => setActiveModal("kasir")
    },
    {
      id: "bantuan",
      label: "Kontak & Bantuan",
      desc: "Hubungi Customer Service",
      icon: Headset,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
      onClick: () => alert("Hubungi CS: lavorapos@gmail.com")
    }
  ];

  return (
    <div className="flex flex-col gap-4 py-2 pb-24">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xl font-bold text-slate-800">Pengaturan</h2>
      </div>

      <div className="bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] rounded-2xl p-4 text-white shadow-lg shadow-orange-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {storeProfile.appLogoUrl ? (
            <img src={storeProfile.appLogoUrl} alt="Logo" className="w-12 h-12 rounded-full object-cover border-2 border-white/50 bg-white" />
          ) : (
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <span className="font-bold text-xl">{storeProfile.storeName ? storeProfile.storeName.charAt(0) : "L"}</span>
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg leading-tight">{storeProfile.storeName} {storeProfile.storeAddress}</h3>
            <p className="text-orange-100 text-xs">Paket Premium • Berlaku 30 Hari</p>
          </div>
        </div>
        <button className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
          <Settings2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Menu List */}
      <div className="flex flex-col gap-3 mt-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navigasi Utama</h3>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {menuList.map((item, idx) => (
            <button 
              key={item.id}
              onClick={item.onClick}
              className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors active:bg-slate-100 ${
                idx !== menuList.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="flex items-center gap-3 text-left">
                <div className={`p-2.5 rounded-xl ${item.bg}`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <span className="font-bold text-slate-700 text-sm block">{item.label}</span>
                  <span className="text-xs text-slate-500 block mt-0.5">{item.desc}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>

        {/* Danger Zone */}
        {userRole === "owner" ? (
          <div className="mt-2">
            <h3 className="text-xs font-bold text-red-500 mb-3 uppercase tracking-wider">Zona Bahaya</h3>
            <div className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
              <button 
                onClick={() => setActiveModal("reset")}
                className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2.5 rounded-xl bg-red-50">
                    <RefreshCcw className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <span className="font-bold text-red-600 text-sm block">Reset Seluruh Data</span>
                    <span className="text-xs text-red-400 block mt-0.5">Menghapus riwayat transaksi secara permanen</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-300" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
      
      <div className="flex justify-center mt-4 pb-6">
        <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors">
          <LogOut className="w-4 h-4" /> Keluar dari Akun
        </button>
      </div>

      {/* Shared Slide-Up Modal Container */}
      {activeModal !== "none" && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/70 z-[80] backdrop-blur-sm transition-opacity" 
            onClick={() => setActiveModal("none")} 
          />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-3xl z-[90] p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[85vh] overflow-y-auto">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setActiveModal("none")}
                className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />            {/* Profil Modal Content */}
            {activeModal === "profil" && (
              <div>
                <h3 className="font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-orange-500" /> Profil Outlet
                </h3>
                <div className="flex flex-col gap-4">
                  
                  {/* Logo Upload */}
                  <div>
                     <label className="text-xs font-bold text-slate-500 block mb-1.5">Logo Aplikasi / Brand</label>
                     <div className="flex items-center gap-3">
                       {storeProfile.appLogoUrl ? (
                         <img src={storeProfile.appLogoUrl} alt="App Logo" className="h-16 w-16 object-cover rounded-xl border border-slate-200 bg-white" />
                       ) : (
                         <div className="h-16 w-16 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
                           <Store className="w-6 h-6" />
                         </div>
                       )}
                       <div className="flex flex-col gap-2">
                         <input 
                           type="file" 
                           accept="image/*" 
                           id="appLogoUpload" 
                           className="hidden" 
                           onChange={handleProfileLogoUpload} 
                         />
                         <label htmlFor="appLogoUpload" className="text-xs bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg font-bold cursor-pointer text-center hover:bg-orange-200 transition-colors">
                           Unggah Logo
                         </label>
                         {storeProfile.appLogoUrl && (
                           <button 
                             onClick={() => setStoreProfile({...storeProfile, appLogoUrl: ""})}
                             className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100 transition-colors"
                           >
                             Hapus Logo
                           </button>
                         )}
                       </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1.5">Nama Outlet / Laundry</label>
                      <input 
                        type="text" 
                        value={storeProfile.storeName}
                        onChange={e => setStoreProfile({...storeProfile, storeName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-orange-500 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1.5">Alamat Pendek / Cabang</label>
                      <input 
                        type="text" 
                        value={storeProfile.storeAddress}
                        onChange={e => setStoreProfile({...storeProfile, storeAddress: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-orange-500 transition-colors" 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleSave}
                    className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold text-sm mt-2 hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/30"
                  >
                    Simpan Profil
                  </button>
                </div>
              </div>
            )}

            {/* Nota Modal Content */}
            {activeModal === "nota" && (
              <div>
                <h3 className="font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-green-500" /> Pengaturan Nota
                </h3>
                
                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                  <button
                    onClick={() => setActiveNotaTab("thermal")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                      activeNotaTab === "thermal" ? "bg-white text-green-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    🖨️ Thermal
                  </button>
                  <button
                    onClick={() => setActiveNotaTab("wa")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                      activeNotaTab === "wa" ? "bg-white text-green-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    💬 WhatsApp
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {activeNotaTab === "thermal" ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-4">
                        <label className="text-xs font-bold text-slate-500 block mb-1.5">Logo Toko / Laundry</label>
                        {settings.printSettings?.logoUrl ? (
                          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <div className="bg-white p-2 border border-slate-200 rounded-lg shrink-0">
                              <img src={settings.printSettings.logoUrl} alt="Logo" className="grayscale" style={{ maxHeight: '60px' }} />
                            </div>
                            <button 
                              onClick={() => setSettings({...settings, printSettings: {...settings.printSettings, logoUrl: ""}})}
                              className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              Hapus Logo
                            </button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 hover:border-green-400 transition-colors">
                            <span className="text-xs font-bold text-slate-600">Pilih / Unggah Logo</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleLogoUpload}
                            />
                          </label>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="text-xs font-bold text-slate-500 block mb-1.5">Catatan Header (Nama Laundry dll)</label>
                        <input 
                          type="text" 
                          value={settings.printSettings?.headerText || ""}
                          onChange={e => setSettings({...settings, printSettings: {...settings.printSettings, headerText: e.target.value}})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-green-500 transition-colors" 
                        />
                      </div>
                      <div className="mb-4">
                        <label className="text-xs font-bold text-slate-500 block mb-1.5">Catatan Footer</label>
                        <textarea 
                          rows={2}
                          value={settings.printSettings?.footerText || ""}
                          onChange={e => setSettings({...settings, printSettings: {...settings.printSettings, footerText: e.target.value}})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-green-500 transition-colors" 
                        />
                      </div>
                      <div className="mb-4">
                        <label className="text-xs font-bold text-slate-500 block mb-2">Ukuran Kertas Struk</label>
                        <div className="grid grid-cols-2 gap-3">
                          {["58mm", "80mm"].map(size => (
                            <button
                              key={size}
                              onClick={() => setSettings({...settings, printSettings: {...settings.printSettings, paperSize: size}})}
                              className={`py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                                settings.printSettings?.paperSize === size 
                                  ? 'border-green-500 bg-green-50 text-green-700' 
                                  : 'border-slate-200 bg-white text-slate-500'
                              }`}
                            >
                              Kertas {size}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-2">Tampilkan Informasi</label>
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={settings.printSettings?.showBigCustomerName ?? true}
                              onChange={e => setSettings({...settings, printSettings: {...settings.printSettings, showBigCustomerName: e.target.checked}})}
                              className="w-4 h-4 text-green-500 rounded border-slate-300 focus:ring-green-500" 
                            />
                            <span className="text-sm font-medium text-slate-700">Nama Pelanggan Lebih Besar</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={settings.printSettings?.showEstSelesai ?? true}
                              onChange={e => setSettings({...settings, printSettings: {...settings.printSettings, showEstSelesai: e.target.checked}})}
                              className="w-4 h-4 text-green-500 rounded border-slate-300 focus:ring-green-500" 
                            />
                            <span className="text-sm font-medium text-slate-700">Estimasi Selesai (Due Date)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={settings.printSettings?.showCashierDetails ?? true}
                              onChange={e => setSettings({...settings, printSettings: {...settings.printSettings, showCashierDetails: e.target.checked}})}
                              className="w-4 h-4 text-green-500 rounded border-slate-300 focus:ring-green-500" 
                            />
                            <span className="text-sm font-medium text-slate-700">Nama Kasir di Footer</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                      <div className="mb-4">
                        <label className="text-xs font-bold text-slate-500 block mb-1.5 flex justify-between">
                          <span>Template Sapaan Atas</span>
                          <span className="text-blue-500 font-normal">Gunakan {"{namaPelanggan}"}</span>
                        </label>
                        <textarea 
                          rows={2}
                          value={settings.waSettings?.greetingText || ""}
                          onChange={e => setSettings({...settings, waSettings: {...settings.waSettings, greetingText: e.target.value}})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-green-500 transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1.5">Pesan Promo / Footer Khusus WA</label>
                        <textarea 
                          rows={3}
                          value={settings.waSettings?.promoText || ""}
                          onChange={e => setSettings({...settings, waSettings: {...settings.waSettings, promoText: e.target.value}})}
                          placeholder="Contoh: Dapatkan diskon 10% di cucian berikutnya!"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-green-500 transition-colors" 
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleSave}
                    className="w-full bg-green-500 text-white py-3.5 rounded-xl font-bold text-sm mt-4 hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-500/30"
                  >
                    Simpan Pengaturan Nota
                  </button>
                </div>
              </div>
            )}

            {/* Kasir Modal Content */}
            {activeModal === "kasir" && (
              <div>
                <h3 className="font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" /> Data Kasir
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Nama Kasir Aktif</label>
                    <input 
                      type="text" 
                      value={settings.cashierName}
                      onChange={e => setSettings({...settings, cashierName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-purple-500 transition-colors" 
                      placeholder="Contoh: Budi"
                    />
                    <p className="text-xs text-slate-400 mt-2">Nama ini akan disapa di Dashboard dan dicetak pada setiap struk nota transaksi.</p>
                  </div>
                  <button 
                    onClick={handleSave}
                    className="w-full bg-purple-500 text-white py-3.5 rounded-xl font-bold text-sm mt-2 hover:bg-purple-600 active:scale-95 transition-all shadow-lg shadow-purple-500/30"
                  >
                    Simpan Data Kasir
                  </button>
                </div>
              </div>
            )}

            {/* Reset Modal Content */}
            {activeModal === "reset" && (
              <div>
                <h3 className="font-bold text-red-600 text-xl mb-2 text-center">Reset Seluruh Data?</h3>
                <p className="text-sm text-slate-600 mb-6 text-center leading-relaxed">
                  Apakah Anda yakin ingin menghapus seluruh data transaksi, pelanggan, layanan, dan keuangan? Tindakan ini <b>tidak dapat dibatalkan</b>.
                </p>
                <div className="mb-6">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">Ketik &quot;RESET&quot; untuk Konfirmasi</label>
                  <input 
                    type="text" 
                    value={resetInput}
                    onChange={(e) => setResetInput(e.target.value)}
                    placeholder="RESET"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-center font-bold tracking-widest focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveModal("none")}
                    className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleResetData}
                    disabled={resetInput !== "RESET"}
                    className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-red-500 text-white disabled:bg-red-200 disabled:text-red-400 shadow-lg shadow-red-500/30 active:scale-95 transition-all"
                  >
                    Hapus Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
