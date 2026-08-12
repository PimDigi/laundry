"use client";

import { ArrowLeft, Edit, Plus, Search, Trash2, MessageCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function KonsumenPage() {
  const router = useRouter();
  
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: ""
  });

  useEffect(() => {
    const savedCustomers = JSON.parse(localStorage.getItem('lavora_customers') || '[]');
    const savedOrders = JSON.parse(localStorage.getItem('lavora_orders') || '[]');
    
    // Sort customers by newest first or alphabetical
    setCustomers(savedCustomers.sort((a: any, b: any) => a.name.localeCompare(b.name)));
    setOrders(savedOrders);
  }, []);

  const saveCustomers = (newCustomers: any[]) => {
    localStorage.setItem('lavora_customers', JSON.stringify(newCustomers));
    setCustomers(newCustomers);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return alert("Nama pelanggan wajib diisi!");
    
    // Format phone to start with 62
    let phone = formData.phone.trim();
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    } else if (phone.startsWith('+62')) {
      phone = '62' + phone.substring(3);
    }
    
    let updated;
    if (editingId) {
      updated = customers.map(c => c.id === editingId ? { ...c, ...formData, phone } : c);
    } else {
      const newCustomer = {
        id: `CUST-${Date.now()}`,
        name: formData.name,
        phone,
        notes: formData.notes,
        createdAt: new Date().toISOString()
      };
      updated = [...customers, newCustomer];
    }
    
    saveCustomers(updated);
    setIsModalOpen(false);
    setFormData({ name: "", phone: "", notes: "" });
    setEditingId(null);
  };

  const handleEdit = (cust: any) => {
    setFormData({
      name: cust.name,
      phone: cust.phone,
      notes: cust.notes || ""
    });
    setEditingId(cust.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus pelanggan ini?")) {
      saveCustomers(customers.filter(c => c.id !== id));
    }
  };

  const openWhatsApp = (phone: string) => {
    if (!phone) return;
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  // derived filtered customers
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
        <button onClick={() => router.push('/pengaturan')} className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="font-bold text-lg text-slate-800">Manajemen Pelanggan</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-24">
        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau nomor WA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all shadow-sm"
          />
        </div>

        {/* List */}
        {filteredCustomers.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p>Tidak ada pelanggan ditemukan.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredCustomers.map(cust => {
              // Calculate stats
              const custOrders = orders.filter(o => o.name.toLowerCase() === cust.name.toLowerCase() || (cust.phone && o.phone === cust.phone));
              const totalOrders = custOrders.length;
              
              return (
                <div key={cust.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{cust.name}</h3>
                      {cust.phone ? (
                        <button 
                          onClick={() => openWhatsApp(cust.phone)}
                          className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg mt-1 hover:bg-emerald-100 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          +{cust.phone}
                        </button>
                      ) : (
                        <p className="text-xs text-slate-400 mt-1">Tidak ada nomor telepon</p>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleEdit(cust)}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cust.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between mt-1">
                    <div className="text-xs">
                      <span className="text-slate-500 block mb-0.5">Total Pesanan</span>
                      <span className="font-bold text-slate-700">{totalOrders} Pesanan</span>
                    </div>
                    {cust.notes && (
                      <div className="text-xs text-right max-w-[50%]">
                        <span className="text-slate-500 block mb-0.5">Catatan Khusus</span>
                        <span className="font-medium text-amber-600 truncate block">{cust.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky FAB */}
      <div className="fixed bottom-6 right-4 z-40">
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", phone: "", notes: "" });
            setIsModalOpen(true);
          }}
          className="bg-rose-500 text-white p-4 rounded-full shadow-xl shadow-rose-500/40 hover:bg-rose-600 active:scale-95 transition-all flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/70 z-[80] backdrop-blur-sm transition-opacity" 
            onClick={() => setIsModalOpen(false)} 
          />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-3xl z-[90] p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
            
            <h3 className="font-bold text-slate-800 text-xl mb-4">
              {editingId ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
            </h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Nama Lengkap *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-rose-500 transition-colors" 
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">No. WhatsApp</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-rose-500 transition-colors" 
                  placeholder="Contoh: 08123456789"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Catatan Khusus (Opsional)</label>
                <textarea 
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-rose-500 transition-colors" 
                  placeholder="Contoh: Alergi pewangi"
                />
              </div>
              
              <button 
                onClick={handleSave}
                className="w-full bg-rose-500 text-white py-3.5 rounded-xl font-bold text-sm mt-2 hover:bg-rose-600 active:scale-95 transition-all shadow-lg shadow-rose-500/30"
              >
                Simpan Data Pelanggan
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
