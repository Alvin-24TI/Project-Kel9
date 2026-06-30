import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  // Data Menu Contoh ala Kopi Kenangan
  const menus = [
    { id: 1, name: 'Kopi Kenangan Mantan', price: 'Rp 18.000', desc: 'Perpaduan espresso espresso berkualitas dengan susu segar dan gula aren asli.' },
    { id: 2, name: 'Dual Shot Iced Shaken', price: 'Rp 22.000', desc: 'Double shot espresso yang dikocok hingga menghasilkan tekstur foam yang lembut.' },
    { id: 3, name: 'Milo Dinosaur Coffee', price: 'Rp 24.000', desc: 'Sensasi manisnya cokelat Milo berpadu dengan espresso shot yang mantap.' },
    { id: 4, name: 'Caramel Macchiato', price: 'Rp 26.000', desc: 'Espresso dengan susu hangat, sirup vanilla, dan siraman saus caramel di atasnya.' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased selection:bg-amber-700 selection:text-white">
      {/* HEADER / NAVIGATION BAR */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-stone-200 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="text-xl font-bold tracking-tight text-amber-900 cursor-pointer" onClick={() => setActiveTab('home')}>
            ☕ Kopi Kelompok 9
          </div>

          {/* Tab Navigation Buttons */}
          <div className="flex space-x-1 sm:space-x-4">
            {['home', 'menu', 'member'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-all duration-200 rounded-full ${
                  activeTab === tab
                    ? 'bg-amber-900 text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {tab === 'home' ? 'Beranda' : tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* RENDER KONTEN BERDASARKAN TAB YANG AKTIF */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* TAB 1: HOME (PERKENALAN USAHA) */}
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fadeIn">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 py-4">
              <div className="flex-1 space-y-6">
                <span className="text-amber-800 font-semibold tracking-wider text-sm uppercase">Welcome to Our Brew</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  Dari Hati, <br />
                  Untuk Pecinta Kopi.
                </h1>
                <p className="text-stone-600 leading-relaxed text-base md:text-lg">
                  Kami percaya bahwa segelas kopi berkualitas tidak harus mahal. Menggunakan biji kopi pilihan nusantara yang dipanggang dengan presisi, kami menghadirkan cita rasa otentik ke setiap cangkir Anda setiap hari.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="bg-amber-950 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md hover:bg-amber-900 transition-colors"
                  >
                    Lihat Menu Kami
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full max-w-sm aspect-square bg-gradient-to-tr from-amber-900 to-amber-700 rounded-2xl flex items-center justify-center p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="text-center space-y-2 z-10">
                  <span className="text-6xl block">☕</span>
                  <p className="font-serif italic text-xl">"Freshly brewed memories."</p>
                </div>
              </div>
            </div>

            {/* Visi Singkat Minimalis */}
            <div className="border-t border-stone-200 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <h3 className="font-bold text-stone-900 text-lg">100% Biji Lokal</h3>
                <p className="text-stone-600 text-sm leading-relaxed">Mendukung penuh petani lokal Indonesia untuk menghasilkan cita rasa terbaik.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-stone-900 text-lg">Dibuat Segar</h3>
                <p className="text-stone-600 text-sm leading-relaxed">Setiap cangkir baru akan digiling dan diseduh setelah pesanan Anda masuk.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-stone-900 text-lg">Harga Bersahabat</h3>
                <p className="text-stone-600 text-sm leading-relaxed">Menikmati kopi kualitas premium tanpa perlu merogoh kocek terlalu dalam.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENU YANG TERSEDIA */}
        {activeTab === 'menu' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2 max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-stone-900">Menu Pilihan</h2>
              <p className="text-stone-500 text-sm">Temukan perpaduan rasa yang pas untuk menemani produktivitas atau waktu santai Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              {menus.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-amber-700/30 hover:shadow-md transition-all">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-stone-900 text-base">{item.name}</h4>
                      <span className="text-amber-800 font-semibold text-sm whitespace-nowrap bg-amber-50 px-2.5 py-1 rounded-md">{item.price}</span>
                    </div>
                    <p className="text-stone-600 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-4 mt-auto">
                    <button 
                      onClick={() => setActiveTab('member')}
                      className="text-xs text-amber-900 font-semibold hover:text-amber-700 underline underline-offset-4"
                    >
                      Beli dengan harga member?
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MEMBER BENEFITS & CTA */}
        {activeTab === 'member' && (
          <div className="space-y-12 max-w-2xl mx-auto animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-800">Exclusive Circle</span>
              <h2 className="text-3xl font-bold text-stone-900">Kenapa Harus Jadi Member?</h2>
              <p className="text-stone-500 text-sm">Dapatkan berbagai keuntungan langsung sejak cangkir pertama Anda.</p>
            </div>

            {/* List Alasan / Keuntungan */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex gap-4 items-start">
                <div className="bg-amber-100 text-amber-900 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 text-sm">1</div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">Diskon Langsung 10% Setiap Pembelian</h4>
                  <p className="text-stone-600 text-xs sm:text-sm mt-0.5">Potongan harga otomatis berlaku untuk seluruh menu minuman tanpa syarat minimum transaksi.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start border-t border-stone-100 pt-6">
                <div className="bg-amber-100 text-amber-900 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 text-sm">2</div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">Kumpulkan Poin Rewards</h4>
                  <p className="text-stone-600 text-xs sm:text-sm mt-0.5">Tukarkan akumulasi poin belanja Anda dengan produk gratis pilihan atau merchandise eksklusif.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start border-t border-stone-100 pt-6">
                <div className="bg-amber-100 text-amber-900 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 text-sm">3</div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">Akses Awal Menu Baru & Promo Spesial</h4>
                  <p className="text-stone-600 text-xs sm:text-sm mt-0.5">Jadilah yang pertama mencoba produk varian musiman (seasonal) kami sebelum dirilis ke publik.</p>
                </div>
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="text-center p-8 bg-amber-950 text-stone-100 rounded-2xl shadow-lg space-y-4">
              <h3 className="text-xl font-bold">Siap Bergabung Bersama Kami?</h3>
              <p className="text-amber-200/80 text-xs sm:text-sm max-w-sm mx-auto">Proses pendaftaran hanya memakan waktu 1 menit untuk menikmati semua keuntungannya.</p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-amber-950 font-semibold px-8 py-3 rounded-lg text-sm hover:bg-stone-100 transition-all shadow-md active:scale-95"
                >
                  Daftar Menjadi Member Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER MINIMALIS */}
      <footer className="border-t border-stone-200 mt-20 py-8 bg-white text-center text-xs text-stone-400">
        <p>&copy; {new Date().getFullYear()} Kopi Kelompok 9. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;