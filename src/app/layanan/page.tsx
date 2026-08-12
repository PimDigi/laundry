"use client";

import { ArrowLeft, Edit2, Plus, Search, Trash2, X, Shirt, Zap, Footprints, Layers, Package, Check, MoreVertical, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('kilo') || cat.includes('cuci')) return <Shirt className="w-5 h-5" />;
  if (cat.includes('satuan')) return <Shirt className="w-5 h-5" />;
  if (cat.includes('express') || cat.includes('kilat')) return <Zap className="w-5 h-5" />;
  if (cat.includes('sepatu')) return <Footprints className="w-5 h-5" />;
  if (cat.includes('karpet')) return <Layers className="w-5 h-5" />;
  return <Package className="w-5 h-5" />;
};

export default function Layanan() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["Kiloan", "Satuan", "Express"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuCategory, setActiveMenuCategory] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ 
    id: "", name: "", category: "Kiloan", unit: "Kg", price: 0, durationValue: 2, durationUnit: "Hari" 
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    // Categories
    const savedCats = localStorage.getItem('lavora_categories');
    if (savedCats) {
      let cats = JSON.parse(savedCats);
      if (cats.includes("Karpet")) {
        cats = cats.filter((c: string) => c !== "Karpet");
        localStorage.setItem('lavora_categories', JSON.stringify(cats));
      }
      setCategories(cats);
    } else {
      localStorage.setItem('lavora_categories', JSON.stringify(["Kiloan", "Satuan", "Express"]));
    }

    // Services
    const saved = localStorage.getItem('lavora_services');
    if (saved) {
      const parsed = JSON.parse(saved);
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
        { id: "S1", name: "Cuci Komplit Reguler", category: "Kiloan", unit: "Kg", price: 7000, durationValue: 2, durationUnit: "Hari" },
        { id: "S2", name: "Cuci Komplit Kilat", category: "Kiloan", unit: "Kg", price: 10000, durationValue: 24, durationUnit: "Jam" },
        { id: "S3", name: "Selimut Kecil", category: "Satuan", unit: "Pcs", price: 15000, durationValue: 2, durationUnit: "Hari" },
        { id: "S4", name: "Bedcover Besar", category: "Satuan", unit: "Pcs", price: 35000, durationValue: 3, durationUnit: "Hari" },
      ];
      localStorage.setItem('lavora_services', JSON.stringify(defaultServices));
      setServices(defaultServices);
    }
  }, []);

  const openAdd = () => {
    setForm({ id: Date.now().toString(), name: "", category: categories[0] || "Kiloan", unit: "Kg", price: 0, durationValue: 1, durationUnit: "Hari" });
    setIsEdit(false);
    setShowNewCatInput(false);
    setIsModalOpen(true);
  };

  const openEdit = (svc: any) => {
    setForm(svc);
    setIsEdit(true);
    setShowNewCatInput(false);
    setIsModalOpen(true);
  };

  const saveService = () => {
    if (!form.name || form.price <= 0) {
      alert("Lengkapi nama dan harga layanan.");
      return;
    }

    let finalCategory = form.category;
    if (showNewCatInput && newCatName.trim()) {
      finalCategory = newCatName.trim();
      const newCats = [...categories, finalCategory];
      setCategories(newCats);
      localStorage.setItem('lavora_categories', JSON.stringify(newCats));
    }

    const newServiceData = { ...form, category: finalCategory };

    let updated = [...services];
    if (isEdit) {
      updated = updated.map(s => s.id === form.id ? newServiceData : s);
    } else {
      updated.push({ ...newServiceData, id: Date.now().toString() });
    }

    setServices(updated);
    localStorage.setItem('lavora_services', JSON.stringify(updated));
    setIsModalOpen(false);
  };

  const deleteService = (id: string) => {
    if (confirm("Hapus layanan ini?")) {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      localStorage.setItem('lavora_services', JSON.stringify(updated));
      showToast("Layanan berhasil dihapus!");
    }
  };

  const filtered = services.filter(s => {
    return s.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Group services by category if "Semua" is active, otherwise just one group
  const groupedServices = filtered.reduce((acc: any, curr: any) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  const handleDeleteCategory = (category: string) => {
    if (["Kiloan", "Satuan", "Express"].includes(category)) {
      alert("Kategori bawaan sistem tidak dapat dihapus.");
      return;
    }
    if (confirm(`Hapus kategori "${category}" beserta seluruh layanannya?`)) {
      const newCats = categories.filter(c => c !== category);
      setCategories(newCats);
      localStorage.setItem('lavora_categories', JSON.stringify(newCats));
      
      const newServices = services.filter(s => s.category !== category);
      setServices(newServices);
      localStorage.setItem('lavora_services', JSON.stringify(newServices));
      
      setActiveMenuCategory(null);
      showToast("Kategori berhasil dihapus!");
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative pb-20 shadow-2xl">
      {/* Header */}
      <div className="bg-orange-500 text-white p-4 sticky top-0 z-50 flex items-center gap-3 shadow-md">
        <Link href="/pengaturan" className="p-2 hover:bg-orange-600 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-lg flex-1">Kelola Layanan</h1>
      </div>

      <div className="p-4">
        {/* Search */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Cari nama layanan..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* List Layanan Grouped */}
        <div className="flex flex-col gap-6">
          {Object.keys(groupedServices).length === 0 ? (
            <div className="text-center text-slate-400 py-10 text-sm font-semibold">Tidak ada layanan ditemukan.</div>
          ) : (
            Object.keys(groupedServices).map(category => (
              <div key={category} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                  
                  <button 
                    onClick={() => setActiveMenuCategory(activeMenuCategory === category ? null : category)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {/* Popover Menu Hapus Kategori */}
                  {activeMenuCategory === category && (
                    <div className="absolute right-4 top-14 bg-white border border-slate-200 rounded-xl shadow-xl z-10 w-48 overflow-hidden animate-in fade-in zoom-in-95">
                      <button 
                        onClick={() => handleDeleteCategory(category)}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 text-left transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus Kategori Ini
                      </button>
                    </div>
                  )}
                </div>
                
                {/* List Items */}
                <div className="flex flex-col p-2">
                  {groupedServices[category].map((svc: any) => (
                    <div key={svc.id} className="p-3 border-b border-slate-100 last:border-0 flex justify-between items-center group hover:bg-slate-50 transition-colors rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                          {getCategoryIcon(svc.category)}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-slate-800 text-sm">{svc.name}</h3>
                            <span className="text-[9px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> AKTIF
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-slate-600 mb-1">Rp {svc.price.toLocaleString('id-ID')} / {svc.unit}</span>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <Clock className="w-3 h-3" /> 
                            <span>{svc.durationValue} {svc.durationUnit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-100">
                        <button onClick={() => openEdit(svc)} className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 shadow-sm transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteService(svc.id)} className="p-2.5 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-200 shadow-sm transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={openAdd}
        className="fixed bottom-20 right-4 sm:right-[calc(50vw-200px)] bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(249,115,22,0.4)] hover:shadow-[0_8px_30px_rgb(249,115,22,0.6)] hover:-translate-y-1 transition-all z-40 flex items-center gap-2"
      >
        <Plus className="w-6 h-6" />
        <span className="font-bold hidden sm:block pr-2">Tambah</span>
      </button>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-50 rounded-t-2xl z-[70] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center p-4 bg-white border-b border-slate-200 rounded-t-2xl">
              <h3 className="font-bold text-slate-800 text-lg">{isEdit ? "Edit Layanan" : "Tambah Layanan"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Nama Layanan</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-orange-500" 
                  placeholder="Mis. Cuci Setrika Reguler" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Kategori</label>
                  {!showNewCatInput ? (
                    <div className="flex gap-2">
                      <select 
                        value={form.category} 
                        onChange={e => {
                          if (e.target.value === "new") {
                            setShowNewCatInput(true);
                          } else {
                            setForm({...form, category: e.target.value});
                          }
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-orange-500"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="new" className="font-bold text-orange-500">+ Tambah Kategori Baru</option>
                      </select>
                      
                      {/* Delete button for custom categories */}
                      {!["Kiloan", "Satuan", "Express"].includes(form.category) && (
                        <button 
                          onClick={() => {
                            if (confirm(`Hapus kategori "${form.category}"?`)) {
                              const newCats = categories.filter(c => c !== form.category);
                              setCategories(newCats);
                              localStorage.setItem('lavora_categories', JSON.stringify(newCats));
                              setForm({...form, category: "Kiloan"});
                              showToast("Kategori berhasil dihapus!");
                            }
                          }}
                          className="p-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                          title="Hapus Kategori"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <input 
                        type="text" 
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Ketik kategori..."
                        className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 pr-8 text-sm focus:outline-none focus:border-orange-500"
                        autoFocus
                      />
                      <button onClick={() => setShowNewCatInput(false)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Tipe Unit</label>
                  <div className="flex gap-2">
                    {["Kg", "Pcs", "m²"].map(u => (
                      <button 
                        key={u}
                        onClick={() => setForm({...form, unit: u})}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-colors ${form.unit === u ? 'bg-orange-50 text-orange-600 border-orange-500' : 'bg-white text-slate-500 border-slate-200'}`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Harga (Rp)</label>
                  <input 
                    type="number" 
                    value={form.price || ""} 
                    onChange={e => setForm({...form, price: Number(e.target.value)})} 
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-orange-500" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Durasi</label>
                  <div className="flex gap-1">
                    <input 
                      type="number" 
                      value={form.durationValue || ""} 
                      onChange={e => setForm({...form, durationValue: Number(e.target.value)})} 
                      className="w-16 bg-white border border-slate-200 rounded-lg py-2.5 px-2 text-center text-sm focus:outline-none focus:border-orange-500" 
                    />
                    <div className="flex flex-1 gap-1">
                       <button onClick={() => setForm({...form, durationUnit: "Jam"})} className={`flex-1 text-xs font-bold py-2.5 rounded-lg border transition-colors ${form.durationUnit === "Jam" ? 'bg-orange-50 text-orange-600 border-orange-500' : 'bg-white text-slate-500 border-slate-200'}`}>Jam</button>
                       <button onClick={() => setForm({...form, durationUnit: "Hari"})} className={`flex-1 text-xs font-bold py-2.5 rounded-lg border transition-colors ${form.durationUnit === "Hari" ? 'bg-orange-50 text-orange-600 border-orange-500' : 'bg-white text-slate-500 border-slate-200'}`}>Hari</button>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={saveService} 
                className="w-full py-3 mt-2 font-bold text-sm rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white shadow-lg shadow-orange-500/30 active:scale-95 transition-all"
              >
                Simpan Layanan
              </button>
            </div>
          </div>
        </>
      )}
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-xl text-sm font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
