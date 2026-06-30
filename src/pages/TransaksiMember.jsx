import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function TransaksiMember() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        // Mengambil riwayat transaksi sekalian join dengan tabel members untuk mendapatkan kolom nama
        const { data, error: fetchError } = await supabase
          .from('transactions')
          .select(`
            id,
            amount,
            points_earned,
            created_at,
            members ( name )
          `)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setTransactions(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Riwayat Transaksi Membership</h1>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Log Aktivitas Kasir ({transactions.length})</h2>
        </header>
        <div className="p-3 overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="p-2 whitespace-nowrap text-left">ID Transaksi</th>
                <th className="p-2 whitespace-nowrap text-left">Nama Member</th>
                <th className="p-2 whitespace-nowrap text-left">Total Belanja</th>
                <th className="p-2 whitespace-nowrap text-left">Poin Masuk</th>
                <th className="p-2 whitespace-nowrap text-left">Waktu</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-400">Memuat log dari cloud...</td></tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="p-2 font-mono text-xs">{tx.id}</td>
                    <td className="p-2 font-medium">{tx.members?.name || 'Member Terhapus'}</td>
                    <td className="p-2 text-emerald-600 dark:text-emerald-400 font-medium">
                      Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-2 font-bold text-yellow-500">+{tx.points_earned} Pts</td>
                    <td className="p-2 text-gray-500">
                      {new Date(tx.created_at).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="p-4 text-center text-gray-400">Belum ada riwayat transaksi masuk.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransaksiMember;