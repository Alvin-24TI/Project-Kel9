import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function MemberDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  // Membaca Query Parameters dari URL browser (?id=...&name=...)
  const queryParams = new URLSearchParams(location.search);
  
  const memberId = queryParams.get('id');
  const memberName = queryParams.get('name');
  const memberPoints = queryParams.get('points') || 0;
  const memberPhone = queryParams.get('phone');

  // Jika URL diakses kosongan tanpa data parameter
  if (!memberId) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Error: QR Code atau Parameter Data Member Tidak Valid!
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mx-auto">
        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-500 mb-4 text-center">
          ✦ Profil Member Terverifikasi
        </h2>
        
        <div className="space-y-3 border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6 text-gray-700 dark:text-gray-300">
          <p className="text-sm">
            <strong className="block text-gray-400 text-xs uppercase">ID Member:</strong> 
            <span className="font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded text-xs">{memberId}</span>
          </p>
          <p>
            <strong className="block text-gray-400 text-xs uppercase">Nama Lengkap:</strong> 
            <span className="text-base font-semibold">{memberName}</span>
          </p>
          <p>
            <strong className="block text-gray-400 text-xs uppercase">No. Telepon:</strong> 
            <span>{memberPhone}</span>
          </p>
          <p>
            <strong className="block text-gray-400 text-xs uppercase">Total Koleksi Poin:</strong> 
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{memberPoints} Poin</span>
          </p>
        </div>

        {/* TOMBOL UNTUK KASIR MENGINPUT TRANSAKSI BARU */}
        <button
          onClick={() => navigate('/management/input-transaksi-member', { 
            state: { idMember: memberId, namaMember: memberName } 
          })}
          className="w-full bg-amber-900 hover:bg-amber-800 text-white py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm"
        >
          Proses Transaksi Kopi Member
        </button>
      </div>
    </div>
  );
}

export default MemberDetail;