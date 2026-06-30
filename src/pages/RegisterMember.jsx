import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function RegisterMember() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      setMessage({ type: 'error', text: 'Nama dan Nomor Telepon wajib diisi!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Input data ke tabel members Supabase
      const { data, error } = await supabase
        .from('members')
        .insert([{ name: name, phone: phone, points: 0 }]);

      if (error) throw error;

      setMessage({ type: 'success', text: `Member "${name}" berhasil didaftarkan secara live!` });
      setName('');
      setPhone('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Pendaftaran gagal: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Registrasi Member Baru</h1>
      </div>

      <div className="max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {message && (
          <div className={`mb-4 p-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
              placeholder="Masukkan nama member"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">No. Telepon / WhatsApp</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
              placeholder="Contoh: 081234567890"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm disabled:bg-gray-400"
          >
            {loading ? 'Memproses...' : 'Daftarkan Member'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterMember;