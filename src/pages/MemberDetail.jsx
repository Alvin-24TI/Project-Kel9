import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

function MemberDetail() {
  const [searchParams] = useSearchParams();
  
  // Mengambil data dummy dari URL hasil scan QR
  const memberId = searchParams.get('id') || 'MEM-000000';
  const memberName = searchParams.get('name') || 'Tidak Diketahui';
  const memberPhone = searchParams.get('phone') || '-';
  const initialPoints = parseInt(searchParams.get('points')) || 0;

  // State untuk manipulasi poin dummy
  const [points, setPoints] = useState(initialPoints);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Simulasi Tambah Poin (misal: setiap kelipatan Rp 10.000 dapat 1 poin)
  const handleAddPoints = (e) => {
    e.preventDefault();
    const amount = parseFloat(transactionAmount);
    if (!amount || amount <= 0) return;

    const gainedPoints = Math.floor(amount / 10000);
    setPoints(prev => prev + gainedPoints);
    setSuccessMessage(`Berhasil menambahkan ${gainedPoints} poin dari transaksi Rp ${amount.toLocaleString('id-ID')}`);
    setTransactionAmount('');
  };

  // Simulasi Tukar Poin (Potongan harga)
  const handleRedeemPoints = (ptsToRedeem) => {
    if (points < ptsToRedeem) {
      alert('Poin tidak mencukupi!');
      return;
    }
    setPoints(prev => prev - ptsToRedeem);
    setSuccessMessage(`Berhasil menukarkan ${ptsToRedeem} poin!`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to="/register-member" className="text-sm font-medium text-violet-500 hover:text-violet-600 flex items-center">
          <svg className="w-4 h-4 fill-current mr-2" viewBox="0 0 16 16">
            <path d="M11.7 14.3L5.4 8l6.3-6.3L10.3.3 2.6 8l7.7 7.7 1.4-1.4z" />
          </svg>
          Kembali ke Pendaftaran
        </Link>
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mt-2">Hasil Scan: Profil Member</h1>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Kartu Informasi Member */}
        <div className="col-span-full lg:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-6">
          <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-violet-100 dark:bg-violet-500/20 text-violet-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-3">
              {memberName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{memberName}</h2>
            <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md text-gray-600 dark:text-gray-400 inline-block mt-1">
              {memberId}
            </span>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">No. Telepon:</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">{memberPhone}</span>
            </div>
            <div className="flex justify-between items-center bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
              <span className="text-yellow-700 dark:text-yellow-500 font-medium">Total Sisa Poin:</span>
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{points} Pts</span>
            </div>
          </div>
        </div>

        {/* Panel Aksi Kasir / Admin */}
        <div className="col-span-full lg:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Aksi Transaksi Kasir</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Form Tambah Poin */}
            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">✦ Tambah Poin Belanja</h4>
              <p className="text-xs text-gray-400 mb-3">Dapatkan 1 Poin setiap pembelanjaan Rp 10.000</p>
              <form onSubmit={handleAddPoints} className="space-y-3">
                <input 
                  type="number" placeholder="Total Belanja (Rp)" required
                  value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)}
                  className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 text-sm"
                />
                <button type="submit" className="w-full btn bg-violet-600 hover:bg-violet-700 text-white text-sm py-2 rounded-lg font-medium">
                  Proses & Beri Poin
                </button>
              </form>
            </div>

            {/* Klaim / Tukar Hadiah */}
            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">🎁 Tukar Poin / Reward</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => handleRedeemPoints(10)} disabled={points < 10}
                  className="w-full flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium disabled:opacity-50 text-gray-700 dark:text-gray-300"
                >
                  <span>Diskon Rp 5.000</span>
                  <span className="bg-yellow-500/20 text-yellow-600 px-2 py-0.5 rounded">10 Pts</span>
                </button>
                <button 
                  onClick={() => handleRedeemPoints(50)} disabled={points < 50}
                  className="w-full flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium disabled:opacity-50 text-gray-700 dark:text-gray-300"
                >
                  <span>Minuman Gratis</span>
                  <span className="bg-yellow-500/20 text-yellow-600 px-2 py-0.5 rounded">50 Pts</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDetail;