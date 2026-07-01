import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import logoSobremesa from '../assets/Sobremesa.jpg';

function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  // State untuk autentikasi member di halaman home
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [currentMember, setCurrentMember] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Data Menu dengan properti image langsung ke folder assets
  const menus = [
    { 
      id: 1, 
      name: 'Kopi Kenangan Mantan', 
      price: 'Rp 18.000', 
      desc: 'Perpaduan espresso berkualitas dengan susu segar dan gula aren asli.',
      image: '/src/assets/hero.png' // <-- Silakan ganti nama file gambar sesuai keinginan Anda
    },
    { 
      id: 2, 
      name: 'Dual Shot Iced Shaken', 
      price: 'Rp 22.000', 
      desc: 'Double shot espresso yang dikocok hingga menghasilkan tekstur foam yang lembut.',
      image: '/src/assets/hero.png' 
    },
    { 
      id: 3, 
      name: 'Milo Dinosaur Coffee', 
      price: 'Rp 24.000', 
      desc: 'Sensasi manisnya cokelat Milo berpadu dengan espresso shot yang mantap.',
      image: '/src/assets/hero.png' 
    },
    { 
      id: 4, 
      name: 'Caramel Macchiato', 
      price: 'Rp 26.000', 
      desc: 'Espresso dengan susu hangat, sirup vanilla, dan siraman saus caramel di atasnya.',
      image: '/src/assets/hero.png' 
    },
  ];

  // Handler input login member
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi pengecekan akun member ke Supabase
  const handleMemberLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

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

    setCurrentMember(data);
    setLoading(false);
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
          <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between">
            
            {/* BAGIAN LOGO & TULISAN */}
            <div 
              className="flex items-center space-x-3 cursor-pointer select-none" 
              onClick={() => setActiveTab('home')}
            >
              <img 
                src={logoSobremesa} 
                alt="Logo Sobremesa" 
                className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-md"
              />
              <div className="text-xl font-bold tracking-tight text-white">
                Sobremessa
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Tab Navigation Buttons */}
              <div className="flex space-x-1 sm:space-x-2">
                {['home', 'menu', 'member'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium capitalize transition-all duration-200 rounded-full ${
                      activeTab === tab
                        ? 'bg-white text-red-950 shadow-md font-bold'
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
                className="border border-white/30 text-red-100 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                Portal Staf
              </button>
            </div>
          </div>
        </nav>

        {/* AREA KONTEN UTAMA */}
        <main className="w-full h-auto min-h-[calc(100vh-8rem)] px-6 md:px-12 py-12 bg-amber-950/75 backdrop-blur-sm">
            
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-16 animate-fadeIn w-full">
              <div className="flex flex-col lg:flex-row items-center gap-12 py-4">
                <div className="flex-1 space-y-6">
                  <span className="text-red-400 font-semibold tracking-wider text-sm uppercase">Welcome to Our Brew</span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                    Dari Hati, <br />
                    Untuk Pecinta Kopi.
                  </h1>
                  <p className="text-red-100/90 leading-relaxed text-base md:text-lg max-w-2xl">
                    Kami percaya bahwa segelas kopi berkualitas tidak harus mahal. Menggunakan biji kopi pilihan nusantara yang dipanggang dengan presisi, kami menghadirkan cita rasa otentik ke setiap cangkir Anda setiap hari.
                  </p>
                  <div className="pt-2">
                    <button 
                      onClick={() => setActiveTab('menu')}
                      className="bg-white text-red-950 font-bold px-8 py-3.5 rounded-lg text-sm shadow-lg hover:bg-red-100 transition-colors"
                    >
                      Lihat Menu Kami
                    </button>
                  </div>
                </div>
                <div className="flex-1 w-full max-w-md aspect-square bg-gradient-to-tr from-red-600/80 to-red-500/80 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="text-center space-y-2 z-10">
                    <span className="text-7xl block">☕</span>
                    <p className="font-serif italic text-2xl">"Freshly brewed memories."</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MENU */}
          {activeTab === 'menu' && (
            <div className="space-y-8 animate-fadeIn w-full">
              <div className="text-center space-y-2 max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-white">Produk Unggulan</h2>
                <p className="text-red-200 text-sm">Temukan perpaduan rasa yang pas untuk menemani produktivitas atau waktu santai Anda.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
                {menus.map((item) => (
                  <div key={item.id} className="bg-red-950/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg flex flex-col justify-between overflow-hidden hover:border-white/30 hover:shadow-xl transition-all">
                    
                    {/* AREA TEMPAT GAMBAR PRODUK */}
                    <div className="w-full aspect-[4/3] bg-black/40 relative overflow-hidden border-b border-white/5">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Pengaman otomatis jika jalurnya salah/tidak ada gambar, diganti icon kopi
                          e.target.onerror = null; 
                          e.target.style.display = 'none';
                        }}
                      />
                      {/* Badge Harga Mengambang di Atas Kanan Gambar */}
                      <span className="absolute top-3 right-3 text-red-950 font-bold text-xs bg-white px-2.5 py-1 rounded-md shadow-md z-10">
                        {item.price}
                      </span>
                    </div>

                    {/* KONTEN TEKS NAMA MENU DI BAWAH GAMBAR */}
                    <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-white text-base leading-snug">{item.name}</h4>
                        <p className="text-red-200/80 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                      </div>
                      
                      <div className="pt-2">
                        <button 
                          onClick={() => setActiveTab('member')}
                          className="text-xs text-red-300 font-semibold hover:text-white underline underline-offset-4"
                        >
                          Beli dengan harga member?
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MEMBER (CEK DATA & POIN MEMBER) */}
          {activeTab === 'member' && (
            <div className="w-full animate-fadeIn">
              <div className="max-w-md mx-auto">
                
                {/* KONDISI A: JIKA MEMBER BELUM LOGIN */}
                {!currentMember ? (
                  <div className="bg-red-950/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
                    <div className="text-center space-y-1">
                      <h2 className="text-2xl font-bold text-white">Area Informasi Member</h2>
                      <p className="text-red-200 text-xs sm:text-sm">Silakan masukkan username & password untuk melihat koleksi poin Anda.</p>
                    </div>

                    {loginError && (
                      <div className="p-3 text-xs bg-white text-red-700 border border-red-300 rounded-lg text-center font-bold">
                        {loginError}
                      </div>
                    )}

                    <form onSubmit={handleMemberLogin} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-red-200 mb-1">Username Member</label>
                        <input 
                          type="text" 
                          name="username"
                          value={loginData.username}
                          onChange={handleLoginChange}
                          placeholder="Masukkan username Anda"
                          className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white bg-black/40 text-white placeholder-white/30"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-red-200 mb-1">Password</label>
                        <input 
                          type="password" 
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          placeholder="******"
                          className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white bg-black/40 text-white placeholder-white/30"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-red-950 font-bold py-2.5 rounded-lg text-sm hover:bg-red-100 transition-colors shadow disabled:bg-red-800 disabled:text-red-300"
                      >
                        {loading ? 'Memproses...' : 'Lihat Poin Saya'}
                      </button>
                    </form>
                  </div>
                ) : (
                  
                  /* KONDISI B: JIKA LOGIN MEMBER SUKSES */
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-red-700 to-red-900 text-white rounded-2xl p-6 shadow-2xl border border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 text-3xl opacity-20">☕</div>
                      
                      <span className="text-xs font-bold tracking-widest text-red-200 uppercase block mb-6">Kartu Member Digital</span>
                      
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] text-red-200 uppercase tracking-wider block">Nama Lengkap</span>
                          <h3 className="text-xl font-bold tracking-wide">{currentMember.name}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] text-red-200 uppercase tracking-wider block">No. Telepon</span>
                            <p className="text-sm font-medium">{currentMember.phone || '-'}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-red-200 uppercase tracking-wider block">Total Akumulasi Poin</span>
                            <p className="text-lg font-extrabold text-yellow-300">{currentMember.points || 0} Poin</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center justify-center space-y-3">
                        <div className="bg-white p-2.5 rounded-xl shadow-inner w-fit">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://kopikel9.com/member-detail?id=${currentMember.id}&name=${encodeURIComponent(currentMember.name)}&points=${currentMember.points}&phone=${currentMember.phone}`)}`} 
                            alt="QR Code Member"
                            className="w-36 h-36"
                          />
                        </div>
                        <p className="text-[11px] text-red-100 text-center max-w-xs">
                          Tunjukkan QR Code ini ke kasir untuk memproses diskon dan menambahkan poin belanja Anda.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleMemberLogout}
                      className="w-full border border-white/20 text-red-200 hover:text-white bg-black/30 py-2 rounded-lg text-xs font-medium transition-all shadow-sm"
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

      {/* FOOTER MINIMALIS - SUDAH DIUBAH MENJADI SOBREMESSA */}
      <footer className="border-t border-white/10 py-6 bg-amber-950/90 text-center text-xs text-red-200 w-full backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} Sobremessa. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;