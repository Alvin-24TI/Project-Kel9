import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function InputTransaksiMember() {
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleTransaction = async (e) => {
    e.preventDefault();
    if (!memberId || !amount) {
      setMessage({ type: 'error', text: 'Semua bidang input wajib diisi!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1. Cek apakah member terdaftar
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('points, name')
        .eq('id', memberId)
        .single();

      if (memberError || !member) {
        throw new Error('ID Member tidak ditemukan di sistem!');
      }

      // 2. Hitung poin baru (Contoh Rumus: Rp 10.000 = 10 Poin)
      const nominalBelanja = parseFloat(amount);
      const poinDiperoleh = Math.floor(nominalBelanja / 10000) * 10;
      const totalPoinBaru = member.points + poinDiperoleh;

      // 3. Catat riwayat ke tabel transactions
      const { error: txError } = await supabase
        .from('transactions')
        .insert([{ member_id: memberId, amount: nominalBelanja, points_earned: poinDiperoleh }]);

      if (txError) throw txError;

      // 4. Update total poin member bersangkutan
      const { error: updateError } = await supabase
        .from('members')
        .update({ points: totalPoinBaru })
        .eq('id', memberId);

      if (updateError) throw updateError;

      setMessage({
        type: 'success',
        text: `Transaksi sukses! ${member.name} mendapatkan +${poinDiperoleh} Pts. Total poin sekarang: ${totalPoinBaru} Pts.`
      });
      setMemberId('');
      setAmount('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Input Transaksi Kasir</h1>
      </div>

      <div className="max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {message && (
          <div className={`mb-4 p-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleTransaction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">ID Member (Ketik / Hasil Scan)</label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-100"
              placeholder="Masukkan UUID Member"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Total Belanja (Rupiah)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
              placeholder="Contoh: 50000"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm disabled:bg-gray-400"
          >
            {loading ? 'Menyimpan...' : 'Proses Transaksi Poin'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InputTransaksiMember;