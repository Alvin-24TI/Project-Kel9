import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import logoSobremesa from '../assets/Sobremesa.jpg';
import produk1 from '../assets/ProdukUnggulan1.jpeg';
import produk2 from '../assets/ProdukUnggulan2.jpeg';
import produk3 from '../assets/ProdukUnggulan3.png';
import produk4 from '../assets/ProdukUnggulan4.png';

function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  // State untuk autentikasi member di halaman home
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [currentMember, setCurrentMember] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Data Menu tanpa deskripsi
  const menus = [
    { 
      id: 1, 
      name: 'Mont Blanc', 
      price: 'Rp 18.000', 
      image: produk1 
    },
    { 
      id: 2, 
      name: 'Sourdough Mozzarella Pepperoni', 
      price: 'Rp 22.000', 
      image: produk2 
    },
    { 
      id: 3, 
      name: 'Citrus Berry', 
      price: 'Rp 24.000', 
      image: produk3 
    },
    { 
      id: 4, 
      name: 'Matilda Chocolate Cake', 
      price: 'Rp 26.000', 
      image: produk4 
    },
  ];

  // Handler input login member
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi pengecekan akun member ke Supabase (SUDAH DIPERBAIKI)
  const handleMemberLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('username', loginData.username)
        .eq('password', loginData.password)
        .single();

      if (error || !data) {
        setLoginError('Username atau Password member salah!');
        setLoading(false);
        return;
      }

      // MENGGUNAKAN FUNGSI SETTER YANG BENAR AGAR TIDAK CRASH
      setCurrentMember(data); 
    } catch (err) {
      console.error(err);
      setLoginError('Terjadi kesalahan jaringan ke database!');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk keluar/logout dari tampilan kartu member di home
  const handleMemberLogout = () => {
    setCurrentMember(null);
    setLoginData({ username: '', password: '' });
    setLoginError('');
  };

  return (
    <div 
      className="w-full min-h-screen text-white font-sans antialiased selection:bg-white selection:text-red-950 bg-cover bg-center bg-no-repeat bg-fixed flex flex-col justify-between"
      style={{ 
        backgroundColor: '#1c1917', // Fallback warna gelap pengaman scroll bolong
        backgroundImage: `url('/src/assets/Sobremessa2.png')`
      }}
    >
      <div>
        {/* HEADER / NAVIGATION BAR - FULL SCREEN */}
        <nav className="sticky top-0 bg-red-950/60 backdrop-blur-md border-b border-white/10 z-50 w-full">
          <div className="w-full px-6 md:px-16 h-20 flex items-center justify-between">
            
            {/* BAGIAN LOGO & TULISAN */}
            <div 
              className="flex items-center space-x-3 cursor-pointer select-none" 
              onClick={() => setActiveTab('home')}
            >
              <img 
                src={logoSobremesa} 
                alt="Logo Sobremesa" 
                className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-md"
              />
              <div className="text-2xl font-black tracking-tight text-white">
                Sobremesa
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Tab Navigation Buttons */}
              <div className="flex space-x-2">
                {['home', 'menu', 'member'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 text-sm font-bold capitalize transition-all duration-200 rounded-full ${
                      activeTab === tab
                        ? 'bg-white text-red-950 shadow-md'
                        : 'text-red-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab === 'home' ? 'Beranda' : tab === 'member' ? 'Cek Poin' : tab}
                  </button>
                ))}
              </div>
                
              {/* Portal Masuk Khusus Staf / Kasir */}
              <button
                onClick={() => navigate('/login')}
                className="border border-white/30 text-red-100 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                Portal Staf
              </button>
            </div>
          </div>
        </nav>

        {/* AREA KONTEN UTAMA */}
        <main className="w-full h-auto min-h-[calc(100vh-9rem)] px-6 md:px-16 py-16 bg-amber-950/75 backdrop-blur-sm flex items-center justify-center">
            
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="animate-fadeIn w-full max-w-[1600px] mx-auto py-6">
              <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                
                {/* BLOK TEKS SEBELAH KIRI */}
                <div className="space-y-8 text-left lg:flex-[1.2]">
                  <span className="text-red-400 font-bold tracking-widest text-base uppercase bg-red-950/40 border border-red-500/20 px-4 py-1.5 rounded-full w-fit block">
                    Welcome to Our Brew
                  </span>
                  
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] drop-shadow-md">
                    Dari Hati, <br />
                    Untuk Pecinta <br />
                    Kopi dan roti.
                  </h1>
                  
                  <p className="text-lg font-medium leading-relaxed antialiased text-red-100/95 md:text-xl max-w-3xl">
                    "Kami percaya bahwa kebahagiaan sejati dimulai dari aroma kopi yang segar dan kehangatan roti yang baru matang. Memadukan biji kopi pilihan nusantara dengan panggangan pastry otentik buatan tangan, kami menghadirkan perpaduan rasa sempurna untuk melengkapi setiap cerita hari Anda."
                  </p>
                  
                  <div className="pt-4">
                    <button 
                      onClick={() => setActiveTab('menu')}
                      className="bg-white text-red-950 font-black px-10 py-4 rounded-xl text-base shadow-2xl hover:bg-red-100 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                      Look Menu Us
                    </button>
                  </div>
                </div>

                {/* BLOK VISUAL SEBELAH KANAN */}
                <div 
                  className="w-full max-w-xl aspect-square bg-cover bg-center border-2 border-white/20 rounded-3xl flex items-center justify-center p-12 text-white shadow-2xl relative overflow-hidden group transition-all duration-300 lg:flex-1"
                  style={{ 
                    backgroundImage: `linear-gradient(to top, rgba(127, 29, 29, 0.95), rgba(0, 0, 0, 0.25)), url(${produk2})` 
                  }}
                >
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
                  
                  <div className="text-center space-y-4 z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.7)]">
                    <span className="text-8xl md:text-9xl block transform group-hover:scale-110 transition-transform duration-500 select-none animate-pulse">
                      🥐
                    </span>
                    <p className="font-serif italic text-3xl md:text-4xl font-black tracking-wide">
                      "Freshly baked memories."
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: MENU */}
          {activeTab === 'menu' && (
            <div className="space-y-10 animate-fadeIn w-full max-w-7xl mx-auto px-2">
              <div className="text-center space-y-3 max-w-xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Produk Unggulan</h2>
                <p className="text-red-200 text-sm md:text-base opacity-90">
                  Temukan perpaduan rasa yang pas untuk menemani produktivitas atau waktu santai Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 pt-6">
                {menus.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-red-950/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden hover:border-white/30 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-full aspect-[16/10] bg-black/40 relative overflow-hidden border-b border-white/5">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="absolute top-4 right-4 text-red-950 font-black text-sm bg-white px-3.5 py-1.5 rounded-lg shadow-xl z-10 tracking-wide">
                        {item.price}
                      </span>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col justify-between flex-1 space-y-6">
                      <div>
                        <h4 className="font-black text-white text-2xl md:text-3xl tracking-tight leading-tight drop-shadow-sm">
                          {item.name}
                        </h4>
                      </div>
                      
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <button 
                          onClick={() => setActiveTab('member')}
                          className="text-sm text-red-300 font-bold hover:text-white underline underline-offset-4 transition-colors"
                        >
                          Beli dengan harga member?
                        </button>
                        <span className="text-xl opacity-40">🥐</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MEMBER (CEK DATA & POIN MEMBER) */}
          {activeTab === 'member' && (
            <div className="w-full animate-fadeIn flex justify-center py-4">
              <div className="w-full max-w-xl mx-auto">
                
                {!currentMember ? (
                  <div className="bg-red-950/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 sm:p-10 shadow-2xl space-y-8">
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl font-extrabold text-white tracking-tight">Area Informasi Member</h2>
                      <p className="text-red-200 text-sm">Silakan masukkan username & password untuk melihat koleksi poin Anda.</p>
                    </div>

                    {loginError && (
                      <div className="p-3.5 text-sm bg-white text-red-700 border border-red-300 rounded-lg text-center font-bold shadow-sm">
                        {loginError}
                      </div>
                    )}

                    <form onSubmit={handleMemberLogin} className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-red-200 mb-1.5">Username Member</label>
                        <input 
                          type="text" 
                          name="username"
                          value={loginData.username}
                          onChange={handleLoginChange}
                          placeholder="Masukkan username Anda"
                          className="w-full border border-white/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-white bg-black/40 text-white placeholder-white/30 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-red-200 mb-1.5">Password</label>
                        <input 
                          type="password" 
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          placeholder="******"
                          className="w-full border border-white/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-white bg-black/40 text-white placeholder-white/30 transition-all"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-red-950 font-extrabold py-3.5 rounded-xl text-base hover:bg-red-100 transition-all shadow-xl disabled:bg-red-800 disabled:text-red-300"
                      >
                        {loading ? 'Memproses...' : 'Lihat Poin Saya'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-red-800 via-red-900 to-amber-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/15 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 text-5xl opacity-15 select-none">☕</div>
                      
                      <span className="text-xs font-extrabold tracking-widest text-yellow-400 uppercase block mb-8 border-b border-white/10 pb-2 w-fit">
                        Kartu Member Digital
                      </span>
                      
                      <div className="space-y-6">
                        <div>
                          <span className="text-[11px] text-red-200 uppercase tracking-widest block mb-1">Nama Lengkap</span>
                          {/* SUDAH DIUBAH KE .nama SESUAI STRUKTUR DATABASE */}
                          <h3 className="text-2xl font-black tracking-wide text-white">{currentMember.nama}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6 bg-black/20 p-4 rounded-xl border border-white/5">
                          <div>
                            <span className="text-[10px] text-red-200 uppercase tracking-widest block mb-0.5">No. Telepon</span>
                            {/* SUDAH DIUBAH KE .no_telepon SESUAI STRUKTUR DATABASE */}
                            <p className="text-base font-semibold tracking-medium text-red-50">{currentMember.no_telepon || '-'}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-red-200 uppercase tracking-widest block mb-0.5">Akumulasi Poin</span>
                            {/* SUDAH DIUBAH KE .total_poin SESUAI STRUKTUR DATABASE */}
                            <p className="text-2xl font-black text-yellow-300">{currentMember.total_poin || 0} Poin</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 pt-8 border-t border-white/10 flex flex-col items-center justify-center space-y-4">
                        <div className="bg-white p-4 rounded-2xl shadow-2xl border-2 border-amber-900/10">
                          <img 
                            /* LINK QR DIBERI PARAMETER YANG BENAR SESUAI VARIABEL DATABASE BARU */
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`https://kopikel9.com/member-detail?id=${currentMember.id}&name=${encodeURIComponent(currentMember.nama)}&points=${currentMember.total_poin}&phone=${currentMember.no_telepon}`)}`} 
                            alt="QR Code Member"
                            className="w-44 h-44"
                          />
                        </div>
                        <p className="text-xs text-red-100 text-center max-w-sm leading-relaxed">
                          Tunjukkan QR Code ini ke kasir untuk memproses diskon dan menambahkan poin belanja Anda.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleMemberLogout}
                      className="w-full border border-white/20 text-red-200 hover:text-white bg-black/40 hover:bg-black/60 py-3 rounded-xl text-sm font-semibold transition-all shadow-md"
                    >
                      Keluar dari Mode Cek Poin
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}
        </main>
      </div>

      {/* FOOTER MINIMALIS */}
      <footer className="border-t border-white/10 py-6 bg-amber-950/90 text-center text-xs text-red-200 w-full backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} Sobremesa. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;