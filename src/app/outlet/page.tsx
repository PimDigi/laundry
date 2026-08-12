"use client";

import { Store, Plus, MapPin, CheckCircle, Crown, Clock, Building, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OutletManagement() {
  const router = useRouter();
  
  const [outlets, setOutlets] = useState<any[]>([]);
  const [activeOutletId, setActiveOutletId] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    address: ""
  });

  const loadData = () => {
    let savedOutlets = JSON.parse(localStorage.getItem('lavora_outlets') || '[]');
    let activeId = localStorage.getItem('lavora_active_outlet') || "";

    // If no outlets exist, create a default one from storeProfile or hardcoded
    if (savedOutlets.length === 0) {
      const savedProfile = JSON.parse(localStorage.getItem('storeProfile') || '{}');
      const defaultOutlet = {
        id: "outlet-" + Date.now().toString(),
        name: savedProfile.storeName || "Lavora Pusat",
        address: savedProfile.storeAddress || "Alamat belum diatur",
        package: "PREMIUM",
        expDate: "2026-08-28"
      };
      savedOutlets = [defaultOutlet];
      localStorage.setItem('lavora_outlets', JSON.stringify(savedOutlets));
      activeId = defaultOutlet.id;
      localStorage.setItem('lavora_active_outlet', activeId);
    }
    
    setOutlets(savedOutlets);
    setActiveOutletId(activeId);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSetActve = (id: string) => {
    localStorage.setItem('lavora_active_outlet', id);
    setActiveOutletId(id);
    alert("Berhasil beralih ke cabang yang dipilih!");
    router.push('/');
  };

  const handleSaveOutlet = () => {
    if (!form.name || !form.address) {
      alert("Lengkapi nama dan alamat outlet.");
      return;
    }
    const newOutlet = {
      id: "outlet-" + Date.now().toString(),
      name: form.name,
      address: form.address,
      package: "STANDARD",
      expDate: "2026-08-28"
    };
    
    const updated = [...outlets, newOutlet];
    setOutlets(updated);
    localStorage.setItem('lavora_outlets', JSON.stringify(updated));
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative pb-24 shadow-2xl">
      {/* Header */}
      <div className="bg-orange-500 text-white p-4 sticky top-0 z-40 shadow-md">
        <h1 className="font-bold text-lg text-center">Manajemen Outlet / Cabang</h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Building className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold">Total Outlet</span>
          </div>
          <span className="text-sm font-black text-slate-800">{outlets.length} Cabang Aktif</span>
        </div>

        {/* List Outlet */}
        <div className="flex flex-col gap-4 mt-2">
          {outlets.map((outlet) => {
            const isActive = outlet.id === activeOutletId;
            return (
              <div 
                key={outlet.id} 
                className={`bg-white rounded-2xl p-4 border-2 shadow-sm transition-all ${
                  isActive ? "border-orange-500 shadow-orange-500/20" : "border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${isActive ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"}`}>
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{outlet.name}</h3>
                      {isActive && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 mt-0.5">
                          <CheckCircle className="w-3 h-3" /> DIGUNAKAN SAAT INI
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-[10px] font-black bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3" /> {outlet.package || "STANDARD"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> EXP {outlet.expDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                  <p className="line-clamp-2">{outlet.address}</p>
                </div>

                {!isActive && (
                  <button 
                    onClick={() => handleSetActve(outlet.id)}
                    className="w-full py-2.5 rounded-xl font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors"
                  >
                    Gunakan Outlet Ini
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FAB Add Outlet */}
      <button 
        onClick={() => {
          setForm({ id: "", name: "", address: "" });
          setIsModalOpen(true);
        }}
        className="fixed bottom-24 right-4 sm:right-[calc(50vw-200px)] bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(249,115,22,0.4)] hover:shadow-[0_8px_30px_rgb(249,115,22,0.6)] hover:-translate-y-1 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal Tambah Outlet */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-3xl z-[70] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-800">Tambah Cabang Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Nama Cabang / Outlet</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Contoh: Lavora Cabang Utara"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Alamat Lengkap</label>
                <textarea 
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-orange-500 min-h-[100px] resize-none"
                  placeholder="Masukkan alamat lengkap cabang"
                />
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-white pb-safe">
              <button 
                onClick={handleSaveOutlet}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Simpan Cabang Baru
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
