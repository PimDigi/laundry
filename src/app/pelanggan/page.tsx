"use client";

import { ArrowLeft, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Customer {
  id: string;
  name: string;
  phone: string;
}

export default function Pelanggan() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [itemToDelete, setItemToDelete] = useState<Customer | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lavora_customers');
    if (saved) {
      setCustomers(JSON.parse(saved));
    }
  }, []);

  const saveToLocalStorage = (newCustomers: Customer[]) => {
    localStorage.setItem('lavora_customers', JSON.stringify(newCustomers));
    setCustomers(newCustomers);
  };

  const handleSave = () => {
    if (!formName || !formPhone) return;

    if (editingId) {
      const updated = customers.map(c => 
        c.id === editingId ? { ...c, name: formName, phone: formPhone } : c
      );
      saveToLocalStorage(updated);
    } else {
      const newCustomer = {
        id: Date.now().toString(),
        name: formName,
        phone: formPhone
      };
      saveToLocalStorage([...customers, newCustomer]);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const confirmDelete = (customer: Customer) => {
    setItemToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      const updated = customers.filter(c => c.id !== itemToDelete.id);
      saveToLocalStorage(updated);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setFormName(customer.name);
    setFormPhone(customer.phone);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormName("");
    setFormPhone("");
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/pengaturan" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 shadow-sm hover:bg-slate-50">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-xl font-bold text-slate-800 flex-1">Kelola Pelanggan</h2>
      </div>

      {/* Action Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari nama atau no. WA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-sm"
          />
        </div>
        <button 
          onClick={openAdd}
          className="bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Customer List */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="flex flex-col gap-2">
          {filteredCustomers.length === 0 ? (
            <div className="text-center p-8 text-slate-500 text-sm">
              Tidak ada pelanggan ditemukan.
            </div>
          ) : (
            filteredCustomers.map(customer => (
              <div key={customer.id} className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg shrink-0">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm">{customer.name}</span>
                    <span className="text-xs text-slate-500">{customer.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => openEdit(customer)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => confirmDelete(customer)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal (Slide-Up) */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-50 rounded-t-2xl z-[70] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center p-4 bg-white border-b border-slate-200 rounded-t-2xl">
              <h3 className="font-bold text-slate-800 text-lg">{editingId ? "Edit Pelanggan" : "Tambah Pelanggan"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 flex flex-col gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Nama Pelanggan</label>
                <input 
                  type="text" 
                  placeholder="Masukkan nama"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Nomor WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">+62</span>
                  <input 
                    type="tel" 
                    placeholder="81234567890"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 pb-8">
              <button 
                onClick={handleSave}
                disabled={!formName || !formPhone}
                className="w-full py-3 font-bold text-sm rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all"
              >
                Simpan Kontak
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 z-[80] backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl z-[90] p-5 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Hapus Pelanggan?</h3>
            <p className="text-sm text-slate-500 mb-6">Anda yakin ingin menghapus data kontak <strong>{itemToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600 active:scale-95 transition-all"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
