"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, User, Lock, Store } from "lucide-react";
import { loginEmployee } from "@/lib/supabase";

const AnimatedMascot = ({ isEmailFocused, isPasswordFocused, isSuccess, emailLength }: { isEmailFocused: boolean, isPasswordFocused: boolean, isSuccess: boolean, emailLength: number }) => {
  // Eye tracking logic
  const maxEyeMove = 8;
  const eyeX = isEmailFocused ? Math.min(maxEyeMove, (emailLength / 25) * maxEyeMove * 2 - maxEyeMove) : 0;
  const eyeY = isEmailFocused ? 2 : 0;

  return (
    <div className="w-28 h-28 relative mx-auto mb-2 drop-shadow-xl z-20">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Background / Body */}
        <circle cx="100" cy="120" r="80" fill="#FDBA74" />
        
        {/* Ears */}
        <circle cx="45" cy="65" r="25" fill="#F97316" className={`transition-transform duration-500 origin-bottom ${isSuccess ? 'rotate-12' : ''}`} />
        <circle cx="155" cy="65" r="25" fill="#F97316" className={`transition-transform duration-500 origin-bottom ${isSuccess ? '-rotate-12' : ''}`} />
        <circle cx="45" cy="65" r="12" fill="#FED7AA" />
        <circle cx="155" cy="65" r="12" fill="#FED7AA" />
        
        {/* White Muzzle */}
        <ellipse cx="100" cy="140" rx="35" ry="25" fill="#FFF" />
        {/* Nose */}
        <ellipse cx="100" cy="130" rx="12" ry="8" fill="#1E293B" />
        
        {/* Smile (Happy) vs Neutral */}
        {isSuccess ? (
          <path d="M 85 145 Q 100 160 115 145" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        ) : (
          <path d="M 90 145 Q 100 148 110 145" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        )}
        
        {/* Eyes (Whites) */}
        <circle cx="70" cy="100" r="16" fill="#FFF" />
        <circle cx="130" cy="100" r="16" fill="#FFF" />
        
        {/* Pupils (Animate based on state) */}
        {isSuccess ? (
          <>
            {/* Happy closed eyes ^ ^ */}
            <path d="M 58 100 Q 70 88 82 100" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
            <path d="M 118 100 Q 130 88 142 100" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle 
              cx={70 + (!isPasswordFocused ? eyeX : 0)} 
              cy={100 + (!isPasswordFocused ? eyeY : 0)} 
              r="7" 
              fill="#1E293B" 
              className="transition-all duration-100 ease-out" 
            />
            <circle 
              cx={130 + (!isPasswordFocused ? eyeX : 0)} 
              cy={100 + (!isPasswordFocused ? eyeY : 0)} 
              r="7" 
              fill="#1E293B" 
              className="transition-all duration-100 ease-out"
            />
          </>
        )}

        {/* Arms/Hands - Animate these to cover eyes */}
        <g className={`transition-all duration-300 ease-in-out ${isPasswordFocused ? '-translate-y-16' : 'translate-y-10'}`}>
          <rect x="35" y="150" width="35" height="50" rx="17.5" fill="#F97316" className={`transition-transform duration-300 origin-top ${isPasswordFocused ? 'rotate-[25deg] translate-x-4' : ''}`} />
          <rect x="130" y="150" width="35" height="50" rx="17.5" fill="#F97316" className={`transition-transform duration-300 origin-top ${isPasswordFocused ? '-rotate-[25deg] -translate-x-4' : ''}`} />
          
          {/* Paws inner color */}
          <rect x="42" y="155" width="20" height="25" rx="10" fill="#FED7AA" className={`transition-transform duration-300 origin-top ${isPasswordFocused ? 'rotate-[25deg] translate-x-4 opacity-100' : 'opacity-0'}`} />
          <rect x="137" y="155" width="20" height="25" rx="10" fill="#FED7AA" className={`transition-transform duration-300 origin-top ${isPasswordFocused ? '-rotate-[25deg] -translate-x-4 opacity-100' : 'opacity-0'}`} />
        </g>
        
        {/* Success Thumbs up / Sparkles */}
        {isSuccess && (
          <g className="animate-bounce">
            <path d="M 20 50 L 25 40 L 30 50 L 40 55 L 30 60 L 25 70 L 20 60 L 10 55 Z" fill="#FBBF24" />
            <path d="M 170 40 L 175 30 L 180 40 L 190 45 L 180 50 L 175 60 L 170 50 L 160 45 Z" fill="#FBBF24" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan Password wajib diisi.");
      return;
    }

    // 1. Cek kredensial Owner
    if (email === "owner@lavora.com" && password === "admin") {
      setIsSuccess(true);
      setTimeout(() => {
        const session = { name: "Owner", email, role: "owner" };
        localStorage.setItem("lavora_session", JSON.stringify(session));
        router.push("/");
      }, 1000);
      return;
    }

    const employee = await loginEmployee(email, password);
    if (employee) {
      setIsSuccess(true);
      setTimeout(() => {
        const session = { name: employee.name, email, role: employee.role || "employee" };
        localStorage.setItem("lavora_session", JSON.stringify(session));
        router.push("/");
      }, 1000);
      return;
    }

    setError("Email atau Password salah!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        
        {/* Dekorasi Latar Belakang */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -z-0 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-tr-full -z-0 opacity-50"></div>

        <div className="relative z-10">
          <div className="flex flex-col items-center justify-center mb-6">
            <AnimatedMascot 
              isEmailFocused={isEmailFocused} 
              isPasswordFocused={isPasswordFocused} 
              isSuccess={isSuccess} 
              emailLength={email.length} 
            />
            <h1 className="text-2xl font-bold text-slate-800">LAVORA POS</h1>
            <p className="text-sm text-slate-500 mt-1">Silakan login untuk mengakses kasir</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email / Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="contoh: owner@lavora.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password / PIN</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-5 h-5" />
              Masuk Sekarang
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400">
            <p>Untuk Owner: owner@lavora.com / admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
