import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import emailjs from '@emailjs/browser';

function RegisterMember() {
  // 1. Deklarasi State Form & Notifikasi Layar
  const [formData, setFormData] = useState({ nama: '', email: '', username: '', password: '', telepon: '' });
  const [loading, setLoading] = useState(false);
  const [uiMessage, setUiMessage] = useState(null); // Menggunakan uiMessage agar tidak bentrok dengan logika email

  // ======= FUNGSI YANG HILANG DAN SUDAH DITAMBAHKAN KEMBALI =======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // ==============================================================

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

    // 1. Simpan ke Supabase dan minta Supabase mengembalikan data yang baru masuk (.select())
    const { data: insertedData, error } = await supabase
      .from('members')
      .insert([dataKeSupabase])
      .select(); // PENTING: Agar kita bisa mendapatkan ID otomatis dari database

    if (error) {
      setUiMessage({ type: 'error', text: "Gagal mendaftarkan member: " + error.message });
      setLoading(false);
      return;
    }

    // Ambil ID member yang baru saja dibuat oleh Supabase
    const newMemberId = insertedData[0]?.id;

    // 2. Buat Link QR Code BARU menggunakan format Query Parameters
    // Menggunakan encodeURIComponent agar spasi pada nama (seperti %20) aman dibaca URL
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
      }, (err) => {
        setUiMessage({ type: 'error', text: "Member terdaftar di database, tapi gagal mengirim email notifikasi." });
        console.log('FAILED...', err);
        setLoading(false);
      });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Registrasi Member Baru</h1>
      </div>

      <div className="max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">

        {/* Notifikasi Status di Layar */}
        {uiMessage && (
          <div className={`mb-4 p-4 text-sm rounded-lg ${uiMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {uiMessage.text}
          </div>
        )}

        {/* Form mengarah ke handleSubmit */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
              placeholder="Masukkan nama member"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Aktif</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
              placeholder="contoh@gmail.com"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">No. Telepon / WhatsApp</label>
            <input
              type="text"
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
              className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
              placeholder="Contoh: 081234567890"
              disabled={loading}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username Akun</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
                placeholder="username123"
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password Awal</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
                placeholder="******"
                disabled={loading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm disabled:bg-gray-400"
          >
            {loading ? 'Memproses...' : 'Daftarkan Member & Kirim Email'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterMember;