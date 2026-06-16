import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionList() {
  // State Utama
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // useEffect untuk simulasi fetch data dari DummyJSON (memanfaatkan data carts/posts sebagai dummy transaksi)
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Menggunakan data posts dummyjson untuk disimulasikan sebagai riwayat produk transaksi
      axios
        .get(`https://dummyjson.com/posts/search?q=${searchTerm}`)
        .then((response) => {
          const formattedTransactions = response.data.posts.map((post, index) => {
            // Membuat variasi ID & Data berdasar indeks data dummy
            const dummyIdNum = post.id + 120;
            const dummyMemberNum = (post.userId * 3) + 10;
            
            return {
              id: `TX-${dummyIdNum}0${index}`,
              memberId: `MEM-${dummyMemberNum}0${post.userId + 20}`,
              // Menggunakan potongan title post sebagai nama produk & nama member tiruan
              memberName: post.id % 2 === 0 ? 'Poki Ganteng' : `User Dummy ${post.userId}`,
              productName: post.title.split(' ').slice(0, 3).join(' '), // Mengambil 3 kata pertama
              transactionDate: `1${post.id % 9}/06/2026`, // Simulasi tanggal di tahun 2026
            };
          });

          setFilteredTransactions(formattedTransactions);
        })
        .catch((err) => {
          setError(err.message);
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Riwayat Transaksi Member</h1>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Search Form */}
      <div className="mb-5 max-w-md">
        <input
          type="text"
          placeholder="Cari transaksi berdasarkan nama, ID, atau produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:outline-emerald-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Semua Transaksi ({filteredTransactions.length})</h2>
        </header>
        <div className="p-3">
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-gray-300">
              <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">ID Transaksi</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">ID Member</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Nama Member</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Produk</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Tanggal Transaksi</div></th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="p-2 whitespace-nowrap">
                        <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{tx.id}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="font-mono font-medium text-gray-800 dark:text-gray-100">{tx.memberId}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="font-medium text-gray-800 dark:text-gray-100">{tx.memberName}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium text-gray-700 dark:text-gray-300">{tx.productName}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left text-gray-500 dark:text-gray-400">{tx.transactionDate}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-400 dark:text-gray-500">
                      Tidak ada data transaksi ditemukan.
                    </td>
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

export default TransactionList;