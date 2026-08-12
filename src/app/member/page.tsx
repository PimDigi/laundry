"use client";

import { User, Plus, CheckCircle, Crown, Clock, ShieldCheck, X, Search, Phone, History, Save, Printer, MessageCircle, FileText, ShoppingBasket, Trash2, AlertTriangle } from "lucide-react";
import { generatePrintLogoPayload } from "@/utils/escpos";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import { fetchMembers, addMember, updateMember, addOrder } from "@/lib/supabase";

export default function MemberManagement() {
  const router = useRouter();
  
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"ADD" | "TOPUP">("ADD");
  
  const [form, setForm] = useState({
    id: "",
    name: "",
    phone: "",
    packageName: "Membership Reguler",
    customPackageName: "",
    quota: "20",
    price: "",
    paymentMethod: "Tunai"
  });

  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [usageForm, setUsageForm] = useState({
    id: "", name: "", phone: "", packageName: "", remainingQuota: 0, expiredDate: "", usageKg: "", usageNotes: "", duration: "Reguler (3 Hari)"
  });
  const [usageOrder, setUsageOrder] = useState<any>(null);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);

  const loadData = async () => {
    const savedMembers = await fetchMembers();
    setMembers(savedMembers);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveMember = async () => {
    const isCustom = form.packageName === "Custom (Input Manual)";
    const finalPackageName = isCustom ? form.customPackageName : form.packageName;

    if (!form.name || !form.phone || !form.quota || Number(form.quota) <= 0 || form.price === "" || Number(form.price) < 0 || (isCustom && !finalPackageName)) {
      alert("Lengkapi semua field dengan benar.");
      return;
    }

    const today = new Date();
    // Default 30 days expiry
    const expDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000)); 

    let updated = [...members];

    if (modalMode === "ADD") {
      const newMember = {
        id: "MBR-" + Date.now().toString(),
        name: form.name,
        phone: form.phone,
        packageName: finalPackageName,
        totalQuota: Number(form.quota),
        remainingQuota: Number(form.quota),
        joinDate: today.toISOString(),
        expiredDate: expDate.toISOString()
      };
      updated = [newMember, ...updated];
      await addMember(newMember);
    } else {
      updated = updated.map(m => {
        if (m.id === form.id) {
          const updatedMember = {
            ...m,
            packageName: finalPackageName,
            remainingQuota: m.remainingQuota + Number(form.quota),
            totalQuota: m.totalQuota + Number(form.quota),
            expiredDate: expDate.toISOString()
          };
          updateMember(updatedMember.id, updatedMember);
          return updatedMember;
        }
        return m;
      });
    }

    const daysToAddMember = finalPackageName.toLowerCase().includes("express") ? 1 : 3;
    const estFinishDateMember = new Date(today.getTime() + (daysToAddMember * 24 * 60 * 60 * 1000));
    const estCompletionStrMember = estFinishDateMember.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }).replace(/\./g, ':');

    const orderId = `INV-${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2,'0')}${today.getDate().toString().padStart(2,'0')}-${Math.floor(Math.random() * 1000)}`;
    const newOrder = {
      id: orderId,
      name: form.name,
      phone: form.phone,
      service: "Pembelian " + finalPackageName,
      qty: form.quota + " Kg",
      price: Number(form.price),
      totalPrice: Number(form.price),
      paymentStatus: "Lunas",
      paymentMethod: form.paymentMethod || "Tunai",
      createdAt: today.getTime(),
      estimatedDate: estCompletionStrMember,
      estimatedCompletion: estCompletionStrMember,
      notes: modalMode === "ADD" ? "Daftar Member Baru" : "Top-up Kuota"
    };

    await addOrder(newOrder);

    setMembers(updated);
    localStorage.setItem('lavora_memberships', JSON.stringify(updated));
    setIsModalOpen(false);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.phone.includes(search)
  );

  const handleDeleteMember = () => {
    if (!memberToDelete) return;
    const updatedMembers = members.filter(m => m.id !== memberToDelete.id);
    setMembers(updatedMembers);
    localStorage.setItem('lavora_memberships', JSON.stringify(updatedMembers));
    setMemberToDelete(null);
  };

  const handleOpenUsage = (member: any) => {
    if (new Date(member.expiredDate) < new Date()) {
      alert("Masa berlaku member sudah habis. Silakan perpanjang terlebih dahulu.");
      return;
    }
    setUsageForm({
      id: member.id,
      name: member.name,
      phone: member.phone,
      packageName: member.packageName,
      remainingQuota: member.remainingQuota,
      expiredDate: member.expiredDate,
      usageKg: "",
      usageNotes: "",
      duration: "Reguler (3 Hari)"
    });
    setIsUsageModalOpen(true);
  };

  const handleSaveUsage = async () => {
    const usage = Number(usageForm.usageKg);
    if (!usage || usage <= 0 || usage > usageForm.remainingQuota) {
      alert("Masukkan berat pemakaian yang valid (lebih dari 0 dan tidak melebihi sisa kuota).");
      return;
    }

    const today = new Date();
    const orderId = `INV-${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2,'0')}${today.getDate().toString().padStart(2,'0')}-${Math.floor(Math.random() * 1000)}`;

    const daysToAdd = usageForm.duration.includes("1 Hari") ? 1 : 3;
    const estFinishDate = new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    const estCompletionStr = estFinishDate.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }).replace(/\./g, ':');

    const newOrder = {
      id: orderId,
      name: usageForm.name,
      phone: usageForm.phone,
      service: "Pemakaian Kuota Member",
      qty: `${usage.toFixed(2)} Kg`,
      price: 0,
      paymentStatus: "Lunas",
      paymentMethod: "Kuota Member",
      createdAt: today.getTime(),
      estimatedDate: estCompletionStr,
      estimatedCompletion: estCompletionStr,
      estimatedFinish: estFinishDate.getTime(),
      usedQuota: usage,
      remainingQuota: usageForm.remainingQuota - usage,
      isMemberApplied: true,
      memberId: usageForm.id,
      notes: usageForm.usageNotes
    };

    const updatedMembers = members.map(m => {
      if (m.id === usageForm.id) {
        return { ...m, remainingQuota: m.remainingQuota - usage };
      }
      return m;
    });
    setMembers(updatedMembers);
    localStorage.setItem('lavora_memberships', JSON.stringify(updatedMembers));

    const updatedMember = updatedMembers.find(m => m.id === usageForm.id);
    if (updatedMember) {
      await updateMember(updatedMember.id, updatedMember);
    }
    await addOrder(newOrder);

    setUsageOrder(newOrder);
    setIsUsageModalOpen(false);
    setIsReceiptModalOpen(true);
  };

  const handlePrintUsage = async () => {
    if (!usageOrder) return;
    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }],
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

      let payload = new Uint8Array();
      const encoder = new TextEncoder();
      const INIT_PRINTER = new Uint8Array([0x1B, 0x40]);
      const ALIGN_CENTER = new Uint8Array([0x1B, 0x61, 0x01]);
      const ALIGN_LEFT = new Uint8Array([0x1B, 0x61, 0x00]);
      const BOLD_ON = new Uint8Array([0x1B, 0x45, 0x01]);
      const BOLD_OFF = new Uint8Array([0x1B, 0x45, 0x00]);

      const addCmd = (cmd: Uint8Array) => {
        const temp = new Uint8Array(payload.length + cmd.length);
        temp.set(payload);
        temp.set(cmd, payload.length);
        payload = temp;
      };
      const addText = (text: string) => {
        const buf = encoder.encode(text);
        addCmd(buf);
      };

      addCmd(INIT_PRINTER);
      addCmd(ALIGN_CENTER);
      
      const settings = JSON.parse(localStorage.getItem('lavora_settings') || '{}');
      const printSettings = settings.printSettings || {};
      if (printSettings.logoUrl) {
        const logoPayload = await generatePrintLogoPayload(printSettings.logoUrl);
        if (logoPayload) {
          addCmd(logoPayload);
        }
      }
      
      const laundryName = settings.laundryName || "LAVORA LAUNDRY";
      
      addCmd(BOLD_ON);
      addText(`${laundryName}\n`);
      addCmd(BOLD_OFF);
      
      addText(`MEMBERSHIP LAUNDRY\n`);
      addText('--------------------------------\n');
      
      addCmd(ALIGN_LEFT);
      addText(`ID    : ${usageOrder.id}\n`);
      addText(`Tgl   : ${new Date(usageOrder.createdAt).toLocaleDateString('id-ID', {day:'2-digit',month:'short',year:'numeric'})}\n`);
      addText(`Nama  : ${usageOrder.name}\n`);
      addText(`Paket : ${usageForm.packageName || "Kiloan"}\n`);
      addText('--------------------------------\n');
      
      addText(`Pemakaian  : ${usageOrder.usedQuota.toFixed(2)} Kg\n`);
      if (usageOrder.estimatedFinish) {
        addText(`Est Selesai: ${new Date(usageOrder.estimatedFinish).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'})}\n`);
      }
      addText(`SISA KUOTA : ${usageOrder.remainingQuota.toFixed(2)} Kg\n`);
      
      addText('--------------------------------\n');
      addCmd(ALIGN_CENTER);
      addText('Terima Kasih\n\n\n');

      const CHUNK_SIZE = 512;
      for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
        await characteristic.writeValue(payload.slice(i, i + CHUNK_SIZE));
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mencetak struk. Pastikan Bluetooth aktif dan terhubung.");
    }
  };

  const handleWAUsage = () => {
    if (!usageOrder) return;
    const settings = JSON.parse(localStorage.getItem('lavora_settings') || '{}');
    const laundryName = settings.laundryName || "LAVORA LAUNDRY";
    
    let phone = usageOrder.phone;
    if (phone.startsWith('0')) phone = '62' + phone.substring(1);
    
    const rawMessage = `${laundryName} | Membership
Atas Nama : ${usageOrder.name}

Pesan Dari ${laundryName}

Halo Kak ${usageOrder.name}, terima kasih sudah menggunakan layanan kami.

📋 *RINCIAN PEMAKAIAN KUOTA:*
-----------------------------------
MEMBERSHIP LAUNDRY
Pelanggan : ${usageOrder.name} (${usageOrder.phone})
Paket     : ${usageForm.packageName || "Kiloan 20 Kg"}
Pemakaian : ${usageOrder.usedQuota.toFixed(2)} Kg
SISA KUOTA: ${usageOrder.remainingQuota.toFixed(2)} Kg
${usageOrder.estimatedFinish ? `Est Selesai: ${new Date(usageOrder.estimatedFinish).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'})}\n` : ''}Masa Berlaku: ${new Date(usageForm.expiredDate || usageOrder.createdAt).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'})}
-----------------------------------
${usageOrder.notes ? `Catatan: ${usageOrder.notes}\n\n` : ''}
Salam, ${laundryName}`;

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(rawMessage)}`;
    window.open(waUrl, "_blank");
  };

  const handleOpenReceiptFromHistory = (member: any) => {
    setUsageForm({
      id: member.id,
      name: member.name,
      phone: member.phone,
      packageName: member.packageName,
      remainingQuota: member.remainingQuota,
      expiredDate: member.expiredDate,
      usageKg: "0",
      usageNotes: "",
      duration: "Reguler (3 Hari)"
    });
    setUsageOrder({
      id: "INFO-" + Date.now(),
      name: member.name,
      phone: member.phone,
      createdAt: Date.now(),
      usedQuota: 0,
      remainingQuota: member.remainingQuota
    });
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="max-w-md md:max-w-lg mx-auto min-h-screen bg-slate-50 relative pb-24 shadow-2xl">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-40 shadow-md">
        <h1 className="font-bold text-lg text-center">Manajemen Member</h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama atau no WA member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold">Total Member</span>
          </div>
          <span className="text-sm font-black text-slate-800">{members.length} Terdaftar</span>
        </div>

        {/* List Member */}
        <div className="flex flex-col gap-4 mt-2">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <User className="w-12 h-12 mx-auto mb-2 text-slate-400" />
              <p className="font-bold text-slate-500">Belum ada member terdaftar</p>
            </div>
          ) : (
            filteredMembers.map((member) => {
              const isExpired = new Date(member.expiredDate) < new Date();
              return (
                <div 
                  key={member.id} 
                  className={`bg-white rounded-2xl p-4 border shadow-sm transition-all ${
                    isExpired ? "border-red-200 opacity-80" : "border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${isExpired ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-1">
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {member.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-[10px] font-black bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" /> {member.packageName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${isExpired ? 'text-red-500' : 'text-emerald-500'}`}>
                          <Clock className="w-3 h-3" /> {isExpired ? 'EXPIRED' : 'AKTIF'}
                        </span>
                        <button 
                          onClick={() => setMemberToDelete(member)}
                          className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"
                          title="Hapus Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 mb-0.5">SISA KUOTA</p>
                      <p className={`font-black ${member.remainingQuota <= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                        {member.remainingQuota.toFixed(1)} Kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 mb-0.5">MASA BERLAKU</p>
                      <p className="font-bold text-slate-700 text-xs">
                        {new Date(member.expiredDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button 
                      onClick={() => handleOpenUsage(member)}
                      className="py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex justify-center items-center gap-1.5 text-xs shadow-sm"
                    >
                      <ShoppingBasket className="w-4 h-4" /> Catat Pemakaian
                    </button>
                    <button 
                      onClick={() => handleOpenReceiptFromHistory(member)}
                      className="py-2.5 rounded-xl font-bold text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors flex justify-center items-center gap-1.5 text-xs"
                    >
                      <MessageCircle className="w-4 h-4" /> Kirim Nota / Info
                    </button>
                    <button 
                      onClick={() => {
                        setForm({
                          id: member.id,
                          name: member.name,
                          phone: member.phone,
                          packageName: "Membership Reguler",
                          customPackageName: "",
                          quota: "20",
                          price: "",
                          paymentMethod: "Tunai"
                        });
                        setModalMode("TOPUP");
                        setIsModalOpen(true);
                      }}
                      className="col-span-2 py-2 text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 rounded-lg flex justify-center items-center gap-1 text-xs"
                    >
                      <Plus className="w-3 h-3" /> Top-up / Perpanjang Kuota
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FAB Add Member */}
      <button 
        onClick={() => {
          setForm({ id: "", name: "", phone: "", packageName: "Membership Reguler", customPackageName: "", quota: "20", price: "", paymentMethod: "Tunai" });
          setModalMode("ADD");
          setIsModalOpen(true);
        }}
        className="fixed bottom-24 right-4 sm:right-[calc(50vw-200px)] bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-40 flex items-center justify-center gap-2 font-bold"
      >
        <Plus className="w-5 h-5" />
      </button>

      <BottomNav />

      {/* Modal Add / Topup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-sm relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-5 text-white flex justify-between items-center">
              <h2 className="font-bold text-lg">{modalMode === "ADD" ? "Tambah Member Baru" : "Top-up Kuota Member"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-blue-700 p-1.5 rounded-full hover:bg-blue-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              {modalMode === "ADD" && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Nama Pelanggan</label>
                    <input 
                      type="text" 
                      value={form.name} 
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="Masukkan nama..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Nomor WhatsApp</label>
                    <input 
                      type="tel" 
                      value={form.phone} 
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      placeholder="Contoh: 08123456789"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {modalMode === "TOPUP" && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-2">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1">MEMBER TERPILIH</p>
                  <p className="font-black text-slate-800">{form.name}</p>
                  <p className="text-xs text-slate-500">{form.phone}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Paket Member</label>
                <select 
                  value={form.packageName}
                  onChange={(e) => {
                    const val = e.target.value;
                    let newQuota = form.quota;
                    if (val === "Membership Reguler") newQuota = "20";
                    if (val === "Membership Express") newQuota = "20";
                    if (val === "Membership Annual") newQuota = "240";
                    setForm({...form, packageName: val, quota: newQuota});
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-bold"
                >
                  <option value="Membership Reguler">Membership Reguler</option>
                  <option value="Membership Express">Membership Express</option>
                  <option value="Membership Annual">Membership Annual</option>
                  <option value="Custom (Input Manual)">Custom (Input Manual)</option>
                </select>
              </div>

              {form.packageName === "Custom (Input Manual)" && (
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Nama Paket Custom</label>
                  <input 
                    type="text" 
                    value={form.customPackageName} 
                    onChange={(e) => setForm({...form, customPackageName: e.target.value})}
                    placeholder="Contoh: Paket Family 100 Kg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Total Kuota (Kg)</label>
                <input 
                  type="number" 
                  value={form.quota} 
                  onChange={(e) => setForm({...form, quota: e.target.value})}
                  placeholder="20"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-bold text-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Harga Paket (Rp)</label>
                <input 
                  type="number" 
                  value={form.price} 
                  onChange={(e) => setForm({...form, price: e.target.value})}
                  placeholder="Contoh: 150000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center justify-center gap-2 py-3 border rounded-xl cursor-pointer transition-all ${form.paymentMethod === 'Tunai' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                    <input type="radio" name="paymentMethod" value="Tunai" checked={form.paymentMethod === 'Tunai'} onChange={() => setForm({...form, paymentMethod: 'Tunai'})} className="hidden" />
                    💵 Tunai
                  </label>
                  <label className={`flex items-center justify-center gap-2 py-3 border rounded-xl cursor-pointer transition-all ${form.paymentMethod === 'QRIS' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                    <input type="radio" name="paymentMethod" value="QRIS" checked={form.paymentMethod === 'QRIS'} onChange={() => setForm({...form, paymentMethod: 'QRIS'})} className="hidden" />
                    📱 QRIS / Transfer
                  </label>
                </div>
              </div>

              <button 
                onClick={handleSaveMember}
                className="w-full py-4 mt-2 rounded-xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-2"
              >
                <Save className="w-5 h-5" /> {modalMode === "ADD" ? "Simpan Member" : "Perpanjang & Tambah Kuota"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Input Pemakaian Kuota */}
      {isUsageModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsUsageModalOpen(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-sm relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-5 text-white flex justify-between items-center">
              <h2 className="font-bold text-lg">Catat Pemakaian Kuota</h2>
              <button onClick={() => setIsUsageModalOpen(false)} className="bg-blue-700 p-1.5 rounded-full hover:bg-blue-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                 <div>
                   <p className="text-[10px] text-blue-600 font-bold uppercase mb-0.5">SISA KUOTA SEKARANG</p>
                   <p className="font-black text-slate-800 text-xl">{usageForm.remainingQuota.toFixed(2)} Kg</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 mb-0.5">PEMAKAIAN TERBARU</p>
                   <p className="font-bold text-red-500 text-lg">- {Number(usageForm.usageKg || 0).toFixed(2)} Kg</p>
                 </div>
              </div>
              
              {usageForm.usageKg && Number(usageForm.usageKg) <= usageForm.remainingQuota && (
                 <div className="text-center text-sm font-bold text-emerald-600">
                    =&gt; Sisa Kuota Nanti: {(usageForm.remainingQuota - Number(usageForm.usageKg)).toFixed(2)} Kg
                 </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Berat Cucian (Kg)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={usageForm.usageKg} 
                  onChange={(e) => setUsageForm({...usageForm, usageKg: e.target.value})}
                  placeholder="Misal: 2.5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-xl text-center focus:outline-none focus:border-blue-500 font-black text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Jenis Layanan Durasi</label>
                <select 
                  value={usageForm.duration} 
                  onChange={(e) => setUsageForm({...usageForm, duration: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-bold"
                >
                  <option value="Reguler (3 Hari)">Reguler (3 Hari)</option>
                  <option value="Express (1 Hari)">Express (1 Hari)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Catatan (Opsional)</label>
                <textarea 
                  value={usageForm.usageNotes} 
                  onChange={(e) => setUsageForm({...usageForm, usageNotes: e.target.value})}
                  placeholder="Ketik catatan..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <button 
                onClick={handleSaveUsage}
                className="w-full py-4 mt-2 rounded-xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-2"
              >
                <Save className="w-5 h-5" /> Simpan & Potong Kuota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Struk & WA */}
      {isReceiptModalOpen && usageOrder && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setIsReceiptModalOpen(false)}></div>
          <div className="bg-slate-50 rounded-3xl w-full max-w-sm relative z-10 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-6">
              <div className="flex justify-end mb-2">
                 <button onClick={() => setIsReceiptModalOpen(false)} className="bg-slate-200 p-1.5 rounded-full hover:bg-slate-300 text-slate-600">
                   <X className="w-4 h-4" />
                 </button>
              </div>

              {/* Thermal Receipt Preview */}
              <div className="bg-white p-5 rounded-md shadow-sm border border-slate-200 font-mono text-sm leading-relaxed mb-6 mx-auto relative overflow-hidden" style={{maxWidth: '300px'}}>
                 <div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSI4Ij48cGF0aCBkPSJNMCA4IEwxMCAwIEwyMCA4IFoiIGZpbGw9IiNmOGZhZmMiLz48L3N2Zz4=')] opacity-50"></div>
                 
                 <div className="text-center font-bold mb-3 border-b border-dashed border-slate-300 pb-3">
                   MEMBERSHIP LAUNDRY
                 </div>
                 
                 <div className="space-y-1 text-xs">
                   <p>Pelanggan : {usageOrder.name}</p>
                   <p>Paket     : {usageForm.packageName}</p>
                   <p>Pemakaian : {usageOrder.usedQuota.toFixed(2)} Kg</p>
                   {usageOrder.estimatedFinish && (
                     <p>Est Selesai: {new Date(usageOrder.estimatedFinish).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'})}</p>
                   )}
                   <p className="font-bold">SISA KUOTA: {usageOrder.remainingQuota.toFixed(2)} Kg</p>
                   <p>Masa Berlaku: {new Date(usageForm.expiredDate).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'})}</p>
                 </div>
                 
                 <div className="mt-4 pt-3 border-t border-dashed border-slate-300 text-center text-xs">
                    Terima Kasih
                 </div>
                 
                 <div className="absolute bottom-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSI4Ij48cGF0aCBkPSJNMCAwIEwxMCA4IEwyMCAwIFoiIGZpbGw9IiNmOGZhZmMiLz48L3N2Zz4=')] opacity-50"></div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleWAUsage}
                  className="w-full py-3 rounded-xl font-bold text-white bg-[#25D366] hover:bg-[#128C7E] shadow-lg flex justify-center items-center gap-2 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-5 h-5" /> Kirim Struk WhatsApp
                </button>
                <button 
                  onClick={handlePrintUsage}
                  className="w-full py-3 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 shadow-sm flex justify-center items-center gap-2 active:scale-95 transition-all"
                >
                  <Printer className="w-5 h-5" /> Print Struk Thermal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Hapus Member */}
      {memberToDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMemberToDelete(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-xs relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="font-black text-slate-800 text-xl mb-2">Hapus Member?</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus data member <b className="text-slate-700">{memberToDelete.name}</b>? Tindakan ini akan menghapus sisa kuota dan status keanggotaannya.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setMemberToDelete(null)}
                className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleDeleteMember}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
