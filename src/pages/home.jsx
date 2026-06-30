import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  // State untuk autentikasi member di halaman home
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [currentMember, setCurrentMember] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Data Menu Contoh ala Kopi Kenangan
  const menus = [
    { id: 1, name: 'Kopi Kenangan Mantan', price: 'Rp 18.000', desc: 'Perpaduan espresso berkualitas dengan susu segar dan gula aren asli.' },
    { id: 2, name: 'Dual Shot Iced Shaken', price: 'Rp 22.000', desc: 'Double shot espresso yang dikocok hingga menghasilkan tekstur foam yang lembut.' },
    { id: 3, name: 'Milo Dinosaur Coffee', price: 'Rp 24.000', desc: 'Sensasi manisnya cokelat Milo berpadu dengan espresso shot yang mantap.' },
    { id: 4, name: 'Caramel Macchiato', price: 'Rp 26.000', desc: 'Espresso dengan susu hangat, sirup vanilla, dan siraman saus caramel di atasnya.' },
  ];

  // Handler input login member
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi pengecekan akun member ke Supabase
 // Fungsi pengecekan akun member ke Supabase
  const handleMemberLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    // PERBAIKAN: Menambahkan .select() sebelum filter .eq()
    const { data, error } = await supabase
      .from('members')
      .select('*') // <-- BARIS INI WAJIB ADA SEBELUM FILTER
      .eq('username', loginData.username)
      .eq('password', loginData.password)
      .single();

    if (error || !data) {
      setLoginError('Username atau Password member salah!');
      setLoading(false);
      return;
    }

    // Jika berhasil, simpan data member ke state agar kartu muncul
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
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased selection:bg-amber-700 selection:text-white">
      {/* HEADER / NAVIGATION BAR */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-stone-200 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight text-amber-900 cursor-pointer" onClick={() => setActiveTab('home')}>
            ☕ Kopi Kelompok 9
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
                      ? 'bg-amber-900 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {tab === 'home' ? 'Beranda' : tab === 'member' ? 'Cek Poin' : tab}
                </button>
              ))}
            </div>

            {/* Portal Masuk Khusus Staf / Kasir */}
            <button
              onClick={() => navigate('/login')}
              className="border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Portal Staf
            </button>
          </div>
        </div>
      </nav>

      {/* RENDER KONTEN BERDASARKAN TAB YANG AKTIF */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fadeIn">
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
          </div>
        )}

        {/* TAB 2: MENU */}
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

        {/* TAB 3: MEMBER (CEK DATA & POIN MEMBER) */}
        {activeTab === 'member' && (
          <div className="max-w-md mx-auto animate-fadeIn">
            
            {/* KONDISI A: JKA MEMBER BELUM LOGIN (TAMPILKAN FORM LOGIN POIN) */}
            {!currentMember ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-bold text-stone-900">Area Informasi Member</h2>
                  <p className="text-stone-500 text-xs sm:text-sm">Silakan masukkan username & password untuk melihat koleksi poin Anda.</p>
                </div>

                {loginError && (
                  <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg text-center font-medium">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleMemberLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Username Member</label>
                    <input 
                      type="text" 
                      name="username"
                      value={loginData.username}
                      onChange={handleLoginChange}
                      placeholder="Masukkan username Anda"
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800 bg-stone-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Password</label>
                    <input 
                      type="password" 
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="******"
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800 bg-stone-50"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-950 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-amber-900 transition-colors shadow disabled:bg-stone-300"
                  >
                    {loading ? 'Memproses...' : 'Lihat Poin Saya'}
                  </button>
                </form>
              </div>
            ) : (
              
              /* KONDISI B: JIKA LOGIN MEMBER SUKSES (TAMPILKAN KARTU DIGITAL & QR) */
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-amber-950 to-stone-900 text-stone-100 rounded-2xl p-6 shadow-xl border border-amber-900/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-3xl opacity-20">☕</div>
                  
                  <span className="text-xs font-bold tracking-widest text-amber-400 uppercase block mb-6">Kartu Member Digital</span>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Nama Lengkap</span>
                      <h3 className="text-xl font-bold tracking-wide">{currentMember.name}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">No. Telepon</span>
                        <p className="text-sm font-medium">{currentMember.phone || '-'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Total Akumulasi Poin</span>
                        <p className="text-lg font-extrabold text-amber-400">{currentMember.points || 0} Poin</p>
                      </div>
                    </div>
                  </div>

                  {/* Tampilan Gambar QR Code menggunakan API Server */}
                  <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col items-center justify-center space-y-3">
                    <div className="bg-white p-2.5 rounded-xl shadow-inner w-fit">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://kopikel9.com/member-detail?id=${currentMember.id}&name=${encodeURIComponent(currentMember.name)}&points=${currentMember.points}&phone=${currentMember.phone}`)}`} 
                        alt="QR Code Member"
                        className="w-36 h-36"
                      />
                    </div>
                    <p className="text-[11px] text-stone-400 text-center max-w-xs">
                      Tunjukkan QR Code ini ke kasir untuk memproses diskon dan menambahkan poin belanja Anda.
                    </p>
                  </div>
                </div>

                {/* Tombol Keluar untuk membersihkan session pencarian */}
                <button
                  onClick={handleMemberLogout}
                  className="w-full border border-stone-300 text-stone-600 hover:text-stone-900 bg-white py-2 rounded-lg text-xs font-medium transition-all shadow-sm"
                >
                  Keluar dari Mode Cek Poin
                </button>
              </div>
            )}

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