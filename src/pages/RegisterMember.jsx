import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import emailjs from '@emailjs/browser';

function RegisterMember() {
  // 1. Deklarasi State Form & Notifikasi Layar
  const [formData, setFormData] = useState({ nama: '', email: '', username: '', password: '', telepon: '' });
  const [loading, setLoading] = useState(false);
  const [uiMessage, setUiMessage] = useState(null); 
  
  // State tambahan untuk menampilkan history pendaftaran lokal di bawah form agar layout tidak kosong
  const [recentMembers, setRecentMembers] = useState([]);

  // Ambil data member terbaru dari Supabase saat halaman di-load agar tabel bawah terisi
  useEffect(() => {
    fetchRecentMembers();
  }, []);

  const fetchRecentMembers = async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('id', { ascending: false })
      .limit(5); // Ambil 5 member paling baru didaftarkan

    if (!error && data) {
      setRecentMembers(data);
    }
  };

  // Handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUiMessage(null);

    const dataKeSupabase = {
      name: formData.nama,      
      phone: formData.telepon,   
      email: formData.email,     
      username: formData.username, 
      password: formData.password, 
      points: 0                  
    };

    // 1. Simpan ke Supabase
    const { data: insertedData, error } = await supabase
      .from('members')
      .insert([dataKeSupabase])
      .select(); 

    if (error) {
      setUiMessage({ type: 'error', text: "Gagal mendaftarkan member: " + error.message });
      setLoading(false);
      return;
    }

    // Ambil ID member yang baru saja dibuat oleh Supabase
    const newMemberId = insertedData[0]?.id;

    // 2. Buat Link QR Code BARU menggunakan format Query Parameters
    const targetUrl = `https://kopikel9.com/member-detail?id=${newMemberId}&name=${encodeURIComponent(formData.nama)}&points=0&phone=${formData.telepon}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(targetUrl)}`;

    // 3. Siapkan parameter template untuk dikirim ke EmailJS
    const templateParams = {
      to_name: formData.nama,
      to_email: formData.email,
      username: formData.username,
      password: formData.password,
      qr_code_link: qrCodeUrl
    };

    // 4. Kirim email secara real-time
    emailjs.send(
      'service_zmqs5y2',
      'template_sftfc4d',
      templateParams,
      '732UV6Q_JQdHmoFZ9'
    )
      .then((response) => {
        setUiMessage({ type: 'success', text: `Member ${formData.nama} berhasil didaftarkan & info akun telah dikirim ke email!` });
        setFormData({ nama: '', email: '', username: '', password: '', telepon: '' });
        setLoading(false);
        fetchRecentMembers(); // Refresh data tabel bawah setelah berhasil tambah data
      }, (err) => {
        setUiMessage({ type: 'error', text: "Member terdaftar di database, tapi gagal mengirim email notifikasi." });
        console.log('FAILED...', err);
        setLoading(false);
        fetchRecentMembers();
      });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full transition-all space-y-8">
      
      {/* ---------------- BLOCK FORM ATAS ---------------- */}
      <div>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold tracking-tight">
            Registrasi Member Baru
          </h1>
        </div>

        <div className="w-full max-w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700/60">
          {uiMessage && (
            <div className={`mb-6 p-4 text-sm rounded-lg shadow-inner ${uiMessage.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
              {uiMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
                  placeholder="Masukkan nama lengkap member"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Email Aktif
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
                  placeholder="contoh@gmail.com"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: 081234567890"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Username Akun
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
                  placeholder="username123"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Password Awal
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
                  placeholder="******"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all text-sm disabled:bg-gray-500 shadow-sm"
              >
                {loading ? 'Sedang memproses pendaftaran...' : 'Daftarkan Member & Kirim Email'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ---------------- BLOCK TABEL BAWAH (MENGISI RUANG KOSONG) ---------------- */}
      <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700/60 overflow-hidden">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 text-base">
            Log Pendaftaran: 5 Member Terbaru
          </h2>
        </header>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-gray-300">
              <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="p-3 whitespace-nowrap"><div className="font-semibold text-left">ID</div></th>
                  <th className="p-3 whitespace-nowrap"><div className="font-semibold text-left">Nama Member</div></th>
                  <th className="p-3 whitespace-nowrap"><div className="font-semibold text-left">Email</div></th>
                  <th className="p-3 whitespace-nowrap"><div className="font-semibold text-left">No. Telepon</div></th>
                  <th className="p-3 whitespace-nowrap"><div className="font-semibold text-left">Username</div></th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                {recentMembers.length > 0 ? (
                  recentMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="p-3 whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400">#{member.id}</td>
                      <td className="p-3 whitespace-nowrap font-medium text-gray-800 dark:text-gray-100">{member.name}</td>
                      <td className="p-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{member.email}</td>
                      <td className="p-3 whitespace-nowrap text-gray-600 dark:text-gray-300">{member.phone || '-'}</td>
                      <td className="p-3 whitespace-nowrap"><span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md font-mono">{member.username}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-400 dark:text-gray-500">Belum ada riwayat pendaftaran member baru hari ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default RegisterMember;