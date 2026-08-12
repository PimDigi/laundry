"use client";

import { AlertCircle, ArrowDownCircle, ArrowUpCircle, Banknote, CalendarClock, Clock, Plus, Receipt, Wallet, CheckCircle, X, Check, ArrowRightCircle, ChevronDown, ChevronRight, Activity, Users, Box, TrendingUp, HandCoins, Droplets, Zap, Wrench, Trash2, Calendar, FileSpreadsheet, BarChart2, ArrowLeft, Camera, Database, UserCheck, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { fetchOrders, fetchExpenses, addExpense } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  
  const [storeProfile, setStoreProfile] = useState({
    storeName: "Lavora",
    appLogoUrl: ""
  });
  
  const [finances, setFinances] = useState({ 
    tunai: 0, 
    qris: 0, 
    memberRp: 0,
    memberKg: 0,
    tunaiBulanIni: 0,
    qrisBulanIni: 0,
    tunaiAllTime: 0,
    qrisAllTime: 0,
    pengeluaran: 0,
    pengeluaranAkumulasi: 0
  });

  const [summary, setSummary] = useState({
    dp: 0,
    lunas: 0,
    pelunasan: 0,
    piutang: 0,
    transaksiCount: 0,
    produksiKg: 0,
    produksiPcs: 0,
    konsumenCount: 0
  });

  // Sub-modal pelunasan
  const [isPaymentSubModalOpen, setIsPaymentSubModalOpen] = useState(false);
  const [pelunasanMethod, setPelunasanMethod] = useState("Tunai");

  // Accordion state
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // Deadline Counts
  const [deadlineH0, setDeadlineH0] = useState(0);
  const [deadlineH1, setDeadlineH1] = useState(0);

  // Keuangan States
  const [expenses, setExpenses] = useState<any[]>([]);
  const [omzet, setOmzet] = useState({
    hariIni: 0,
    akumulasi: 0
  });
  const [activeModal, setActiveModal] = useState("");
  const [form, setForm] = useState({
    id: "",
    category: "Deterjen & Parfum",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    isPrive: false,
    photo: ""
  });
  const defaultExpenseCats = ["Deterjen & Parfum", "Listrik & Air", "Gaji Karyawan", "Perawatan Mesin", "Lainnya"];
  const [expenseCategories, setExpenseCategories] = useState<string[]>(defaultExpenseCats);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const getExpenseIcon = (cat: string) => {
    switch (cat) {
      case "Deterjen & Parfum": return <Droplets className="w-5 h-5" />;
      case "Listrik & Air": return <Zap className="w-5 h-5" />;
      case "Gaji Karyawan": return <Users className="w-5 h-5" />;
      case "Perawatan Mesin": return <Wrench className="w-5 h-5" />;
      default: return <Receipt className="w-5 h-5" />;
    }
  };

  const getAmountPaid = (order: any) => {
    if (order.paymentStatus === 'Lunas') {
      if (order.pelunasanAmount) return order.price; 
      return order.price;
    }
    if (order.paymentStatus === 'DP') return order.amountPaid || (order.price / 2);
    return 0;
  };

  const [cashierName, setCashierName] = useState('Kasir');
  const [userRole, setUserRole] = useState('owner');

  const loadData = async () => {
    const savedOrders = await fetchOrders();
    const savedServices = JSON.parse(localStorage.getItem('lavora_services') || '[]');
    const session = JSON.parse(localStorage.getItem('lavora_session') || '{}');
    
    if (session.name) setCashierName(session.name);
    if (session.role) setUserRole(session.role);

    let totalTunai = 0;
    let totalQris = 0;
    let totalMemberRp = 0;
    let totalMemberKg = 0;
    let totalTunaiBulanIni = 0;
    let totalQrisBulanIni = 0;
    let totalTunaiAllTime = 0;
    let totalQrisAllTime = 0;
    
    let countH0 = 0;
    let countH1 = 0;

    let dpSum = 0;
    let lunasSum = 0;
    let pelunasanSum = 0;
    let piutangSum = 0;
    let txCount = 0;
    let kgSum = 0;
    let pcsSum = 0;

    const isToday = (dateString: string | number) => {
      if (!dateString) return false;
      const itemDate = new Date(dateString).toLocaleDateString('en-CA');
      const todayDate = new Date().toLocaleDateString('en-CA');
      return itemDate === todayDate;
    };

    const isThisMonth = (dateString: string | number) => {
      if (!dateString) return false;
      const itemDate = new Date(dateString);
      const todayDate = new Date();
      return itemDate.getMonth() === todayDate.getMonth() && itemDate.getFullYear() === todayDate.getFullYear();
    };

    savedOrders.forEach((order: any) => {
      const opStatus = order.operationalStatus || order.status || 'Diterima';
      if (opStatus === 'Dibatalkan') return;

      const isTodayOrder = isToday(order.createdAt || order.date);
      const isThisMonthOrder = isThisMonth(order.createdAt || order.date);

      // Hitung Keseluruhan & Bulan Ini
      let curTunai = 0;
      let curQris = 0;
      if (order.paymentStatus === 'Lunas') {
        if (order.pelunasanAmount) {
          const p = order.amountPaid || (order.paymentStatusWasBelum ? 0 : order.price / 2);
          if (order.paymentMethod === 'Tunai') curTunai += p;
          if (order.paymentMethod === 'QRIS' || order.paymentMethod === 'Transfer') curQris += p;
          
          if (order.pelunasanMethod === 'Tunai') curTunai += order.pelunasanAmount;
          if (order.pelunasanMethod === 'QRIS' || order.pelunasanMethod === 'Transfer') curQris += order.pelunasanAmount;
        } else {
          const p = order.price;
          if (order.paymentMethod === 'Tunai') curTunai += p;
          if (order.paymentMethod === 'QRIS' || order.paymentMethod === 'Transfer') curQris += p;
        }
      } else if (order.paymentStatus === 'DP') {
        const p = order.amountPaid || (order.price / 2);
        if (order.paymentMethod === 'Tunai') curTunai += p;
        if (order.paymentMethod === 'QRIS' || order.paymentMethod === 'Transfer') curQris += p;
      }
      
      totalTunaiAllTime += curTunai;
      totalQrisAllTime += curQris;
      
      if (isThisMonthOrder) {
        totalTunaiBulanIni += curTunai;
        totalQrisBulanIni += curQris;
      }

      // Produksi Calculation (Hari Ini)
      if (isTodayOrder) {
        txCount++;
        if (order.items && typeof order.items === 'object') {
          Object.entries(order.items).forEach(([id, item]: [string, any]) => {
            let q = 0;
            if (item && typeof item === 'object' && item.totalQty !== undefined) {
              q = item.details ? item.details.length : (Number(item.totalQty) || 0);
            } else {
              q = Number(item) || 0;
            }

            const service = savedServices.find((s: any) => s.id === id);
            
            const svcLower = (order.service || '').toLowerCase();
            const qtyLower = String(order.qty || '').toLowerCase();
            const isMemberRelated = svcLower.includes('member') || order.paymentMethod === 'Kuota Member';
            
            if (service) {
              if (service.unit === 'Kg' || service.category === 'Kiloan' || isMemberRelated) {
                 kgSum += q;
              } else {
                 pcsSum += q;
              }
            } else {
              if (svcLower.includes('kilo') || qtyLower.includes('kg') || isMemberRelated) {
                 kgSum += q;
              } else {
                 pcsSum += q;
              }
            }
          });
        } else {
          const parsedQty = parseFloat(order.qty) || 0;
          const svcLower = (order.service || '').toLowerCase();
          const qtyLower = String(order.qty || '').toLowerCase();
          const isMemberRelated = svcLower.includes('member') || order.paymentMethod === 'Kuota Member';
          
          if (svcLower.includes('kilo') || qtyLower.includes('kg') || isMemberRelated) {
             kgSum += parsedQty;
          } else {
             pcsSum += Math.round(parsedQty);
          }
        }
      }

      // Finance Calculation (Hari Ini)
      if (isTodayOrder) {
        let paid = 0;
        if (order.paymentStatus === 'Lunas') {
          if (order.pelunasanAmount) {
             paid = order.amountPaid || (order.paymentStatusWasBelum ? 0 : order.price / 2);
             
             if (order.paymentStatusWasBelum) {
                // Was Belum then Lunas
             } else {
                dpSum += paid;
             }
             
             pelunasanSum += order.pelunasanAmount;
             
             if (order.paymentMethod === 'Tunai') totalTunai += paid;
             if (order.paymentMethod === 'QRIS' || order.paymentMethod === 'Transfer') totalQris += paid;
             if (order.paymentMethod === 'Kuota Member') {
               totalMemberRp += Number(order.totalPrice || 0);
               totalMemberKg += Number(order.usedQuota || 0);
             }
             
             if (order.pelunasanMethod === 'Tunai') totalTunai += order.pelunasanAmount;
             if (order.pelunasanMethod === 'QRIS' || order.pelunasanMethod === 'Transfer') totalQris += order.pelunasanAmount;
          } else {
             paid = order.price;
             lunasSum += paid;
             
             if (order.paymentMethod === 'Tunai') totalTunai += paid;
             if (order.paymentMethod === 'QRIS' || order.paymentMethod === 'Transfer') totalQris += paid;
             if (order.paymentMethod === 'Kuota Member') {
               totalMemberRp += Number(order.totalPrice || 0);
               totalMemberKg += Number(order.usedQuota || 0);
             }
          }
        } else if (order.paymentStatus === 'DP') {
          paid = order.amountPaid || (order.price / 2);
          dpSum += paid;
          piutangSum += (order.price - paid);
          
          if (order.paymentMethod === 'Tunai') totalTunai += paid;
          if (order.paymentMethod === 'QRIS' || order.paymentMethod === 'Transfer') totalQris += paid;
          if (order.paymentMethod === 'Kuota Member') {
            totalMemberRp += Number(order.totalPrice || 0);
            totalMemberKg += Number(order.usedQuota || 0);
          }
        } else if (order.paymentStatus === 'Belum') {
          piutangSum += order.price;
        }
      }

      // Deadline Calculation
      if (opStatus !== 'Selesai' && opStatus !== 'Diambil') {
        const isExpress = order.service?.toLowerCase().includes('express') || order.service?.toLowerCase().includes('kilat') || order.service?.toLowerCase().includes('24 jam');
        if (isExpress) countH0++;
        else countH1++;
      }
    });

    setDeadlineH0(countH0);
    setDeadlineH1(countH1);

    // Expenses (Hari Ini & Akumulasi)
    const savedExpenses = await fetchExpenses();
    let totalPengeluaran = 0;
    let totalPengeluaranAkumulasi = 0;
    savedExpenses.forEach((exp: any) => {
      const amt = Number(exp.amount || 0);
      totalPengeluaranAkumulasi += amt;
      if (isToday(exp.date || exp.createdAt)) {
        totalPengeluaran += amt;
      }
    });

    // Customers
    const savedCustomers = JSON.parse(localStorage.getItem('lavora_customers') || '[]');
    const konsumenCount = savedCustomers.length;

    setFinances({ 
      tunai: totalTunai, 
      qris: totalQris, 
      memberRp: totalMemberRp,
      memberKg: totalMemberKg,
      tunaiBulanIni: totalTunaiBulanIni,
      qrisBulanIni: totalQrisBulanIni,
      tunaiAllTime: totalTunaiAllTime,
      qrisAllTime: totalQrisAllTime,
      pengeluaran: totalPengeluaran, 
      pengeluaranAkumulasi: totalPengeluaranAkumulasi 
    });
    setSummary({
      dp: isNaN(dpSum) ? 0 : dpSum,
      lunas: isNaN(lunasSum) ? 0 : lunasSum,
      pelunasan: isNaN(pelunasanSum) ? 0 : pelunasanSum,
      piutang: isNaN(piutangSum) ? 0 : piutangSum,
      transaksiCount: isNaN(txCount) ? 0 : txCount,
      produksiKg: isNaN(kgSum) ? 0 : kgSum,
      produksiPcs: isNaN(pcsSum) ? 0 : pcsSum,
      konsumenCount: isNaN(konsumenCount) ? 0 : konsumenCount
    });

    const savedProfile = localStorage.getItem('storeProfile');
    if (savedProfile) {
      setStoreProfile(JSON.parse(savedProfile));
    }
    
    // Keuangan Initialization
    const savedExpCats = localStorage.getItem('lavora_expense_categories');
    if (savedExpCats) setExpenseCategories(JSON.parse(savedExpCats));
    
    savedExpenses.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setExpenses(savedExpenses);
    
    // Omzet Calculation
    const lastResetStr = localStorage.getItem('lastOmzetResetDate');
    const lastResetTime = lastResetStr ? Number(lastResetStr) : 0;
    let omzetAkum = 0;
    let omzetHariIni = 0;

    savedOrders.forEach((order: any) => {
      const opStatus = order.operationalStatus || order.status || 'Diterima';
      if (opStatus === 'Dibatalkan') return;

      const isTodayOrder = isToday(order.createdAt || order.date);
      let orderRevenue = Number(order.price) || 0;

      if (isTodayOrder) {
        omzetHariIni += orderRevenue;
      }
      
      if (order.createdAt && order.createdAt >= lastResetTime) {
        omzetAkum += orderRevenue;
      } else if (!order.createdAt && lastResetTime === 0) {
        omzetAkum += orderRevenue;
      }
    });
    
    setOmzet({ hariIni: omzetHariIni, akumulasi: omzetAkum });
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setForm({
      id: Date.now().toString(),
      category: "Deterjen & Parfum",
      amount: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      isPrive: false,
      photo: ""
    });
    setActiveModal("pengeluaran");
  };

  const saveExpenseCategory = () => {
    if (!newCatName.trim()) return;
    const newCats = [...expenseCategories, newCatName.trim()];
    setExpenseCategories(newCats);
    localStorage.setItem('lavora_expense_categories', JSON.stringify(newCats));
    setForm({ ...form, category: newCatName.trim() });
    setNewCatName("");
    setShowNewCatInput(false);
  };

  const deleteExpenseCategory = (cat: string) => {
    if (confirm(`Hapus kategori pengeluaran "${cat}"?`)) {
      const newCats = expenseCategories.filter(c => c !== cat);
      setExpenseCategories(newCats);
      localStorage.setItem('lavora_expense_categories', JSON.stringify(newCats));
      if (form.category === cat) {
        setForm({ ...form, category: "Deterjen & Parfum" });
      }
    }
  };

  const handleSaveExpense = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Masukkan nominal pengeluaran yang valid.");
      return;
    }
    const newExpense = {
      ...form,
      id: Date.now().toString(),
      amount: Number(form.amount),
      date: form.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    await addExpense(newExpense);
    setActiveModal("");
    await loadData();
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm("Hapus catatan pengeluaran ini?")) {
      const updated = expenses.filter(e => e.id !== id);
      setExpenses(updated);
      localStorage.setItem('lavora_expenses', JSON.stringify(updated));
      await loadData();
    }
  };


  
  const exportToExcel = () => {
    const savedOrders = JSON.parse(localStorage.getItem('lavora_orders') || '[]');
    
    const excelData = savedOrders.map((order: any) => {
      const rawDate = order.createdAt || order.date || order.created_at || new Date().toISOString();
      const d = new Date(rawDate);
      const dateStr = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
      
      const totalAkhir = Number(order.price) || 0;
      const diskon = Number(order.discount) || 0;
      const subtotal = totalAkhir + diskon;

      return {
        "ID Pesanan": order.id,
        "Tanggal Transaksi": dateStr,
        "Nama Pelanggan": order.name || order.customerName || "",
        "Status Pembayaran": order.paymentStatus || order.status || "",
        "Metode Bayar": order.paymentMethod || "",
        "Subtotal (Rp)": subtotal,
        "Diskon (Rp)": diskon,
        "Total Akhir (Rp)": totalAkhir
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Inject Excel Formula for "Total Akhir" (Column H)
    for (let i = 0; i < excelData.length; i++) {
      const rowIndex = i + 2;
      const cellAddress = 'H' + rowIndex;
      worksheet[cellAddress] = { t: 'n', f: `F${rowIndex}-G${rowIndex}` };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Transaksi");

    const fileName = `Laporan_Transaksi_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const labaBersih = (finances.tunai + finances.qris) - finances.pengeluaran;

  const todayISO = new Date().toISOString().split('T')[0];
  const displayExpenses = expenses.filter(e => e.date.substring(0, 7) === todayISO.substring(0, 7));

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-3">
          {storeProfile.appLogoUrl && (
            <img src={storeProfile.appLogoUrl} alt="Logo" className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200 bg-white" />
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-800">Halo, {cashierName}! 👋</h2>
            <p className="text-sm text-slate-500" suppressHydrationWarning>Ringkasan hari ini, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
        <Link href="/kasir" className="bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white p-2 rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-1 text-sm font-medium hover:scale-105 transition-transform">
          <Plus className="w-4 h-4" />
          Nota Baru
        </Link>
      </div>

      {/* Deadline Warnings */}
      <div className="flex flex-col gap-2">
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-700">Deadline Hari Ini (H-0)</h3>
              <p className="text-xs text-red-600">{deadlineH0} Pesanan harus selesai</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/riwayat?filter=h-0')}
            className="text-xs font-semibold bg-white text-red-600 px-3 py-1.5 rounded-lg border border-red-200 shadow-sm hover:bg-red-50 transition-colors"
          >
            Lihat
          </button>
        </div>
        
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <CalendarClock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-orange-700">Deadline Besok (H-1)</h3>
              <p className="text-xs text-orange-600">{deadlineH1} Pesanan masuk antrean</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/riwayat?filter=h-1')}
            className="text-xs font-semibold bg-white text-orange-600 px-3 py-1.5 rounded-lg border border-orange-200 shadow-sm hover:bg-orange-50 transition-colors"
          >
            Lihat
          </button>
        </div>
      </div>

      {/* Produksi Grid */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Box className="w-4 h-4 text-teal-500" /> Produksi Hari Ini
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <span className="text-sm">⚖️</span>
              <span className="text-xs font-medium">Kiloan Hari Ini</span>
            </div>
            <p className="text-lg font-bold text-slate-800">
              {(Number(summary.produksiKg) || 0).toFixed(2)} Kg
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <span className="text-sm">👕</span>
              <span className="text-xs font-medium">Satuan Hari Ini</span>
            </div>
            <p className="text-lg font-bold text-slate-800">
              {Math.round(Number(summary.produksiPcs) || 0)} Pcs
            </p>
          </div>
        </div>
      </div>

      {userRole === 'owner' && (
        <>
      {/* Omzet Grid */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-emerald-500" /> Ringkasan Omzet
          </div>
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <Banknote className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Hari Ini</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold mb-0.5">TOTAL OMZET</p>
              <p className="text-lg font-black text-slate-800">Rp {omzet.hariIni.toLocaleString('id-ID')}</p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <ArrowUpCircle className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Akumulasi</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold mb-0.5">TOTAL KESELURUHAN</p>
              <p className="text-lg font-black text-slate-800">Rp {omzet.akumulasi.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Finance Grid */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-orange-500" /> Keuangan Hari Ini
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <ArrowUpCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs font-bold">Pemasukan Kas</span>
            </div>
            <p className="text-lg font-black text-slate-800">Rp {(finances.tunai + finances.qris).toLocaleString('id-ID')}</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <ArrowDownCircle className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold">Pengeluaran</span>
            </div>
            <p className="text-lg font-black text-slate-800">Rp {finances.pengeluaran.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className={`rounded-2xl p-4 shadow-sm border ${labaBersih >= 0 ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-400 text-white' : 'bg-gradient-to-br from-red-500 to-red-600 border-red-400 text-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1 opacity-90">
                <Banknote className="w-4 h-4" />
                <span className="text-xs font-bold">Laba Bersih Hari Ini</span>
              </div>
              <p className="text-2xl font-black">Rp {labaBersih.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
      
      {/* Quick Access Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 w-full mb-3">
          <button onClick={openAddModal} className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all w-full min-w-0 group">
            <div className="bg-red-50 text-red-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 text-center mt-1.5 line-clamp-1 leading-tight w-full break-words">Pengeluaran</span>
          </button>

          {userRole === 'owner' ? (
            <button onClick={() => setActiveModal("pemasukan")} className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all w-full min-w-0 group">
              <div className="bg-green-50 text-green-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <ArrowUpCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-700 text-center mt-1.5 line-clamp-1 leading-tight w-full break-words">Pemasukan</span>
            </button>
          ) : (
            <button disabled className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 opacity-50 cursor-not-allowed w-full min-w-0">
              <div className="bg-slate-100 text-slate-400 p-2 rounded-xl">
                <ArrowUpCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 text-center mt-1.5 line-clamp-1 leading-tight w-full break-words">Pemasukan</span>
            </button>
          )}

          {userRole === 'owner' ? (
            <button onClick={() => setActiveModal("keuangan")} className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all w-full min-w-0 group">
              <div className="bg-blue-50 text-blue-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-700 text-center mt-1.5 line-clamp-1 leading-tight w-full break-words">Keuangan</span>
            </button>
          ) : (
            <button disabled className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 opacity-50 cursor-not-allowed w-full min-w-0">
              <div className="bg-slate-100 text-slate-400 p-2 rounded-xl">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 text-center mt-1.5 line-clamp-1 leading-tight w-full break-words">Keuangan</span>
            </button>
          )}

          {userRole === 'owner' ? (
            <button onClick={exportToExcel} className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all w-full min-w-0 group">
              <div className="bg-emerald-50 text-emerald-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-700 text-center mt-1.5 line-clamp-1 leading-tight w-full break-words">Export Excel</span>
            </button>
          ) : (
            <button disabled className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 opacity-50 cursor-not-allowed w-full min-w-0">
              <div className="bg-slate-100 text-slate-400 p-2 rounded-xl">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 text-center mt-1.5 line-clamp-1 leading-tight w-full break-words">Export Excel</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 w-full">
          <button onClick={() => router.push('/member')} className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all w-[calc(25%-9px)] min-w-0 group">
            <div className="bg-indigo-50 text-indigo-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 text-center mt-1.5 line-clamp-1 leading-tight w-full break-words">Member</span>
          </button>

          {userRole === 'owner' ? (
            <button onClick={() => router.push("/karyawan")} className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all w-[calc(25%-9px)] min-w-0 group">
              <div className="bg-pink-50 text-pink-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-700 text-center mt-1.5 line-clamp-1 leading-tight w-full break-words">Karyawan</span>
            </button>
          ) : (
            <button disabled className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 opacity-50 cursor-not-allowed w-[calc(25%-9px)] min-w-0">
              <div className="bg-slate-100 text-slate-400 p-2 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 text-center mt-1.5 line-clamp-1 leading-tight w-full break-words">Karyawan</span>
            </button>
          )}

          <button onClick={() => setActiveModal("coming_soon_absensi")} className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all w-[calc(25%-9px)] min-w-0 group">
            <div className="bg-cyan-50 text-cyan-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 text-center mt-1.5 line-clamp-1 leading-tight w-full break-words">Absensi</span>
          </button>
        </div>
      </div>

      {/* Rincian Ringkasan Finansial Accordion */}
      <div className="pb-20">
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" /> Rincian Ringkasan
        </h3>
        <div className="flex flex-col gap-2">
          {userRole === 'owner' && (
          <>
          {/* Accordion 1: Detail Pemasukan */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleAccordion("pemasukan")}
              className="w-full p-3 flex justify-between items-center bg-green-50/50 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                  <ArrowUpCircle className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-slate-800">Detail Pemasukan</span>
                  <span className="block text-xs font-semibold text-green-600">Rp {(summary.dp + summary.lunas + summary.pelunasan).toLocaleString('id-ID')}</span>
                </div>
              </div>
              {activeAccordion === "pemasukan" ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
            </button>
            {activeAccordion === "pemasukan" && (
              <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>🚩 TR Dengan DP</span>
                  <span className="font-semibold text-slate-800">Rp {summary.dp.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>✅ TR Langsung Lunas</span>
                  <span className="font-semibold text-slate-800">Rp {summary.lunas.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>🚚 TR Pengambilan / Pelunasan</span>
                  <span className="font-semibold text-slate-800">Rp {summary.pelunasan.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2: Pengeluaran */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleAccordion("pengeluaran")}
              className="w-full p-3 flex justify-between items-center bg-red-50/50 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                  <ArrowDownCircle className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-slate-800">Total Pengeluaran Akumulasi</span>
                  <span className="block text-xs font-semibold text-red-600">Rp {finances.pengeluaranAkumulasi.toLocaleString('id-ID')}</span>
                </div>
              </div>
              {activeAccordion === "pengeluaran" ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
            </button>
            {activeAccordion === "pengeluaran" && (
              <div className="p-3 bg-white border-t border-slate-100">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Biaya Operasional Keseluruhan</span>
                  <span className="font-semibold text-slate-800">Rp {finances.pengeluaranAkumulasi.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 4: Piutang Konsumen */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleAccordion("piutang")}
              className="w-full p-3 flex justify-between items-center bg-orange-50/50 hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-slate-800">Piutang Konsumen</span>
                  <span className="block text-xs font-semibold text-orange-600">Rp {summary.piutang.toLocaleString('id-ID')}</span>
                </div>
              </div>
              {activeAccordion === "piutang" ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
            </button>
            {activeAccordion === "piutang" && (
              <div className="p-3 bg-white border-t border-slate-100">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Sisa Tagihan (Belum Lunas)</span>
                  <span className="font-semibold text-slate-800">Rp {summary.piutang.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}
          </div>
          </>
          )}

          {/* Accordion 5: Aktifitas Transaksi */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleAccordion("aktifitas")}
              className="w-full p-3 flex justify-between items-center bg-blue-50/50 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-slate-800">Aktifitas Transaksi</span>
                  <span className="block text-xs font-semibold text-blue-600">{summary.transaksiCount} Transaksi</span>
                </div>
              </div>
              {activeAccordion === "aktifitas" ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
            </button>
            {activeAccordion === "aktifitas" && (
              <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Nota Dibuat Hari Ini</span>
                  <span className="font-semibold text-slate-800">{summary.transaksiCount} Nota</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Kiloan Transaksi</span>
                  <span className="font-semibold text-slate-800">{(Number(summary.produksiKg) || 0).toFixed(2)} Kg</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Satuan Transaksi</span>
                  <span className="font-semibold text-slate-800">{Math.round(Number(summary.produksiPcs) || 0)} Pcs</span>
                </div>
              </div>
            )}
          </div>



          {/* Accordion 7: Konsumen */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleAccordion("konsumen")}
              className="w-full p-3 flex justify-between items-center bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-slate-800">Konsumen</span>
                  <span className="block text-xs font-semibold text-indigo-600">{summary.konsumenCount} Aktif</span>
                </div>
              </div>
              {activeAccordion === "konsumen" ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
            </button>
            {activeAccordion === "konsumen" && (
              <div className="p-3 bg-white border-t border-slate-100">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Kontak Tersimpan</span>
                  <span className="font-semibold text-slate-800">{summary.konsumenCount} Orang</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modal Tambah Pengeluaran Full-Screen */}
      {activeModal === "pengeluaran" && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
          <div className="max-w-md md:max-w-lg mx-auto min-h-screen bg-slate-50 shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
            <div className="sticky top-0 bg-blue-600 text-white p-4 shadow-md z-10">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setActiveModal("")} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="font-bold text-lg">Tambah Pengeluaran Biaya</h2>
            </div>
            <p className="text-blue-100 text-sm ml-10">Catat pengeluaran operasional bisnis Anda</p>
          </div>
          
          <div className="p-4 pb-32 space-y-4">
            
            {/* Card 1: Detail Transaksi */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" /> Detail Transaksi
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Tanggal</label>
                  <input 
                    type="date" 
                    value={form.date}
                    onChange={(e) => setForm({...form, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Deskripsi Pengeluaran</label>
                  <input 
                    type="text" 
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-orange-500"
                    placeholder="Contoh: Bayar listrik ruko bulan ini"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Kategori Pengeluaran */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-orange-500" /> Kategori Pengeluaran
              </h3>
              <div className="flex flex-wrap gap-2">
                {expenseCategories.map(cat => (
                  <div key={cat} className="relative inline-block">
                    <button
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        form.category === cat 
                          ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-orange-200'
                      }`}
                    >
                      {cat}
                    </button>
                    {!defaultExpenseCats.includes(cat) && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteExpenseCategory(cat); }}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-0.5 hover:bg-red-200 shadow-sm transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  onClick={() => setShowNewCatInput(true)} 
                  className="px-3 py-2 rounded-xl text-xs font-bold transition-all border bg-slate-50 border-slate-200 text-slate-500 border-dashed hover:border-orange-500 hover:text-orange-500"
                >
                  + Tambah Kategori
                </button>
              </div>
              {showNewCatInput && (
                <div className="flex gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
                  <input 
                    type="text" 
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="Nama Kategori Baru"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 shadow-sm"
                    autoFocus
                  />
                  <button onClick={saveExpenseCategory} className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 shadow-sm transition-colors">
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Card 3: Nominal & Prive */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-orange-500" /> Nominal
              </h3>
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                <input 
                  type="number" 
                  value={form.amount}
                  onChange={(e) => setForm({...form, amount: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-lg font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                  placeholder="0"
                />
              </div>
              
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={form.isPrive}
                  onChange={(e) => setForm({...form, isPrive: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-bold text-slate-700">Tandai sebagai Transaksi Prive</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Penarikan modal untuk keperluan pribadi</p>
                </div>
              </label>
            </div>

            {/* Card 4: Upload Bukti */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Camera className="w-4 h-4 text-orange-500" /> Bukti Pendukung
              </h3>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                <Camera className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-500 text-center">Upload Foto Nota/Struk<br/>(Opsional)</span>
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>

            {/* Riwayat List within Modal */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <h3 className="font-bold text-sm text-slate-700 mb-4 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-orange-500" /> Riwayat Bulan Ini
              </h3>
              {displayExpenses.length === 0 ? (
                <div className="text-center border border-dashed border-slate-200 rounded-2xl p-6">
                  <p className="text-slate-400 text-xs font-medium">Belum ada riwayat pengeluaran.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {displayExpenses.map(exp => (
                    <div key={exp.id} className="bg-white p-3 rounded-2xl border border-slate-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                          {getExpenseIcon(exp.category)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs">{exp.category} {exp.isPrive && <span className="text-[9px] bg-purple-100 text-purple-600 px-1 py-0.5 rounded">PRIVE</span>}</h4>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(exp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-black text-red-600">-Rp {exp.amount.toLocaleString('id-ID')}</span>
                        <button 
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="text-[10px] text-slate-400 hover:text-red-500 font-bold"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>

            <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md md:max-w-lg p-4 bg-white border-t border-slate-100 z-20 pb-safe">
              <button 
                onClick={handleSaveExpense}
                className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" /> Simpan Pengeluaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pemasukan Full-Screen Placeholder */}
      {activeModal === "pemasukan" && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
          <div className="max-w-md md:max-w-lg mx-auto min-h-screen bg-slate-50 shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
            <div className="sticky top-0 bg-blue-600 text-white p-4 shadow-md z-10">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setActiveModal("")} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="font-bold text-lg">Rekap Pemasukan Kas</h2>
            </div>
            <p className="text-blue-100 text-sm ml-10">Pencatatan pendapatan dari transaksi</p>
          </div>
          
          <div className="p-4 flex flex-col gap-4">
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-green-500" /> Rincian Kas Hari Ini
              </h3>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">💵</div>
                    <span className="font-semibold text-slate-700 text-sm">Tunai</span>
                  </div>
                  <span className="font-black text-slate-800 text-sm">Rp {finances.tunai.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">📱</div>
                    <span className="font-semibold text-slate-700 text-sm">QRIS / Transfer</span>
                  </div>
                  <span className="font-black text-slate-800 text-sm">Rp {finances.qris.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">💳</div>
                    <div>
                      <span className="font-semibold text-indigo-700 text-sm block">Pemakaian Kuota Member</span>
                      <span className="text-[10px] text-indigo-500 font-bold">*(Non-Kas)*</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-indigo-800 text-sm block">{finances.memberKg.toFixed(2)} Kg</span>
                    {finances.memberRp > 0 && (
                      <span className="text-[10px] text-indigo-500 font-bold">~ Rp {finances.memberRp.toLocaleString('id-ID')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" /> Rincian Kas Bulan Ini
                </h3>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-md">Otomatis Reset Setiap Awal Bulan</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">💵</div>
                    <span className="font-semibold text-slate-700 text-sm">Tunai Bulan Ini</span>
                  </div>
                  <span className="font-black text-slate-800 text-sm">Rp {finances.tunaiBulanIni.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">📱</div>
                    <span className="font-semibold text-slate-700 text-sm">QRIS / Transfer Bulan Ini</span>
                  </div>
                  <span className="font-black text-slate-800 text-sm">Rp {finances.qrisBulanIni.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-500" /> Akumulasi Kas Keseluruhan
                </h3>
                <span className="text-[10px] font-bold bg-purple-100 text-purple-600 px-2 py-1 rounded-md">Total Semua Transaksi</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">💵</div>
                    <span className="font-semibold text-slate-700 text-sm">Total Tunai Keseluruhan</span>
                  </div>
                  <span className="font-black text-slate-800 text-sm">Rp {finances.tunaiAllTime.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">📱</div>
                    <span className="font-semibold text-slate-700 text-sm">Total QRIS / Transfer Keseluruhan</span>
                  </div>
                  <span className="font-black text-slate-800 text-sm">Rp {finances.qrisAllTime.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 text-orange-700 p-4 rounded-xl text-xs font-medium leading-relaxed border border-orange-100">
              <span className="font-bold block mb-1">💡 Info:</span>
              Nilai Tunai dan QRIS mencakup pembayaran awal (Lunas/DP) dan pelunasan pada saat pengambilan. Pemakaian Kuota Member tidak dihitung sebagai pemasukan kas masuk.
            </div>

          </div>
          </div>
        </div>
      )}

      {/* Modal Coming Soon Full-Screen */}
      {activeModal.startsWith("coming_soon") && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner backdrop-blur-sm">
                🚀
              </div>
              <h2 className="font-bold text-xl text-white mb-1">Fitur Akan Segera Hadir</h2>
            </div>
            <div className="p-6 text-center">
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Modul <span className="font-bold text-indigo-600">{activeModal === "coming_soon_karyawan" ? "Manajemen Karyawan" : "Absensi Karyawan"}</span> sedang dalam tahap pengembangan dan akan siap digunakan pada pembaruan mendatang!
              </p>
              <button 
                onClick={() => setActiveModal("")}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Mengerti / Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Keuangan Full-Screen Placeholder */}
      {activeModal === "keuangan" && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
          <div className="max-w-md md:max-w-lg mx-auto min-h-screen bg-slate-50 shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
            <div className="sticky top-0 bg-blue-600 text-white p-4 shadow-md z-10">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setActiveModal("")} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="font-bold text-lg">Data Keuangan & Laba Rugi</h2>
            </div>
            <p className="text-blue-100 text-sm ml-10">Laporan mendalam keuangan bisnis Anda</p>
          </div>
          
          <div className="p-4 flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <BarChart2 className="w-10 h-10" />
            </div>
            <h2 className="font-bold text-xl text-slate-800 mb-2">Detail Keuangan</h2>
            <p className="text-slate-500 px-4">Laporan laba rugi bulanan lengkap akan segera hadir dalam pembaruan berikutnya.</p>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
