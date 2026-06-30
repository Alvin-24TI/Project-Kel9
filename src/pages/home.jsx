import React from 'react';
import { useNavigate } from 'react-router-dom';
import SobremesaImg from '../assets/Sobremessa2.png';

function Home() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen w-full flex flex-col justify-between items-center relative bg-cover bg-center bg-no-repeat font-sans px-4 select-none"
      style={{ backgroundImage: `url(${SobremesaImg})` }}
    >
      {/* Overlay Gelap Transparan agar Kontras */}
      <div className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/70 backdrop-blur-[2px] z-0"></div>

      {/* 1. HEADER BRANDING & NAVIGASI MINI PELANGGAN */}
      <header className="relative z-10 w-full max-w-7xl pt-8 flex justify-between items-center border-b border-white/10 pb-4">
        <span className="text-xl font-black tracking-widest text-white uppercase">
          SOBREMESA <span className="text-xs font-normal text-amber-400 block sm:inline sm:ml-2">MEMBER AREA</span>
        </span>
        <button 
          onClick={() => navigate('/login?role=manager')}
          className="text-[11px] text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
        >
          Staff Portal 💼
        </button>
      </header>

      {/* 2. AREA KARTU UTAMA: PORTAL MEMBER & PENUKARAN BENEFIT */}
      <main className="relative z-10 w-full max-w-md my-auto">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20 text-center space-y-6">
          
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              E-Membership Portal
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kumpulkan poin belanjaan Anda dan klaim keuntungan produk gratis
            </p>
          </div>

          {/* PILIHAN MENU EKSKLUSIF PELANGGAN */}
          <div className="space-y-3 pt-2">
            
            {/* Akses Masuk ke Profil Member (Cek Poin & Barcode QR) */}
            <button
              onClick={() => navigate('/login?role=member')}
              className="w-full flex items-center justify-between p-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center space-x-3 text-left">
                <span className="text-xl">💳</span>
                <div>
                  <h3 className="text-sm">Masuk ke Akun Member</h3>
                  <p className="text-[10px] text-amber-100 font-normal">Cek saldo poin & scan barcode QR</p>
                </div>
              </div>
              <span className="text-xs opacity-80 group-hover:translate-x-1 transition-transform">➔</span>
            </button>

            {/* Akses Cek Promo / Katalog Hadiah Penukaran Poin */}
            <button
              onClick={() => navigate('/promo-membership')}
              className="w-full flex items-center justify-between p-4 bg-slate-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl border border-gray-200 dark:border-gray-700 transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center space-x-3 text-left">
                <span className="text-xl">🎁</span>
                <div>
                  <h3 className="text-sm text-gray-900 dark:text-white">Lihat Katalog Promo</h3>
                  <p className="text-[10px] text-gray-400 font-normal">Daftar reward roti & kopi gratis berjalan</p>
                </div>
              </div>
              <span className="text-xs opacity-60 group-hover:translate-x-1 transition-transform">➔</span>
            </button>

          </div>

          {/* LINK REGISTRASI MANDIRI MANDAL */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
            Belum bergabung menjadi bagian dari kami?{' '}
            <button 
              onClick={() => navigate('/register-member')}
              className="text-amber-500 font-bold hover:underline"
            >
              Daftar Member Baru
            </button>
          </div>

        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="relative z-10 w-full max-w-7xl pb-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-400 gap-2 text-center sm:text-left border-t border-white/5 pt-4">
        <p>© 2026 Cafe & Bakery Sobremesa. All Rights Reserved.</p>
        <p className="font-medium">
          📍 Rumbai, Pekanbaru • ⏰ Open 09.00 - 22.00 WIB
        </p>
      </footer>

    </div>
  );
}

export default Home;