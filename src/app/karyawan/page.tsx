"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, UserX, User, Mail, Lock, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchEmployees, createEmployee, deleteEmployee } from "@/lib/supabase";

export default function KelolaKaryawan() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const init = async () => {
      const session = JSON.parse(localStorage.getItem("lavora_session") || "{}");
      if (session.role !== "owner") {
        setIsOwner(false);
        return;
      }
      setIsOwner(true);
      await loadEmployees();
    };

    init();
  }, []);

  const loadEmployees = async () => {
    const saved = await fetchEmployees();
    setEmployees(saved);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      alert("Semua field wajib diisi!");
      return;
    }

    const emailExists = employees.some(emp => {
      const existingEmail = emp.email || emp.email_username || emp.emailUsername || "";
      return existingEmail.toLowerCase() === form.email.toLowerCase();
    });
    if (emailExists) {
      alert("Email / Username sudah digunakan karyawan lain!");
      return;
    }

    const newEmployee = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email.toLowerCase(),
      password: form.password,
      role: "employee",
      createdAt: new Date().toISOString()
    };

    const saved = await createEmployee(newEmployee);
    setEmployees(prev => [saved, ...prev]);
    setForm({ name: "", email: "", password: "" });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus akses karyawan ini?")) {
      await deleteEmployee(id);
      const updated = employees.filter(emp => emp.id !== id);
      setEmployees(updated);
    }
  };

  if (!isOwner) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Akses Ditolak</h2>
        <p className="text-sm text-slate-500 mb-6">Halaman ini hanya dapat diakses oleh Owner / Pemilik usaha.</p>
        <button onClick={() => router.push("/")} className="px-6 py-2 bg-slate-900 text-white font-medium rounded-xl">Kembali ke Dashboard</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600 hover:bg-slate-50">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Manajemen Karyawan</h1>
            <p className="text-xs text-slate-500">Kelola akses akun staf kasir</p>
          </div>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)} 
            className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
          <h2 className="text-base font-bold text-slate-800 mb-4">Tambah Karyawan Baru</h2>
          <form onSubmit={handleSave} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 ml-1">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Misal: Budi Santoso"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 ml-1">Email / Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="budi@lavora.com"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 ml-1">Password / PIN</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Minimal 4 karakter"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-200"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/30"
              >
                Simpan Akun
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Karyawan */}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-slate-800 text-sm mt-2 flex justify-between items-center">
          Daftar Staf Terdaftar
          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-md text-slate-500">{employees.length} Karyawan</span>
        </h3>
        
        {employees.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-3 rounded-full shadow-sm mb-3">
              <UserX className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Belum ada karyawan terdaftar</p>
            <p className="text-slate-400 text-xs mt-1">Tambahkan akun untuk memberikan akses ke kasir.</p>
          </div>
        ) : (
          employees.map((emp) => (
            <div key={emp.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{emp.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{emp.email}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(emp.id)}
                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                title="Hapus Karyawan"
              >
                <UserX className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
