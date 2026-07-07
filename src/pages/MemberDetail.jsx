import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// 1. IMPORT LIBRARY QRCODE YANG SUDAH TERINSTALL
import { QRCodeSVG } from 'qrcode.react'; 

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

  // Membuat teks enkripsi/konten data yang sama dengan QR Code awal
  // Menggunakan URL dinamis saat ini agar jika di-scan ulang tetap mengarah ke sini
  const qrValue = window.location.href;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mx-auto">
        <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-500 mb-6 text-center">
          ✦ Profil Member Terverifikasi
        </h2>

        {/* 2. TEMPAT MENAMPILKAN GAMBAR QR CODE */}
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <QRCodeSVG 
              value={qrValue} 
              size={180} // Ukuran QR Code diperbesar agar mudah di-scan
              bgColor={"#ffffff"}
              fgColor={"#451a03"} // Warna cokelat gelap senada tema kopi (amber-950)
              level={"H"}
              includeMargin={false}
            />
          </div>
          <p className="text-xs text-gray-400 mt-3 font-mono">
            Scan QR Code di atas untuk verifikasi cepat
          </p>
        </div>
        
        <div className="space-y-5 border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-8 text-gray-700 dark:text-gray-300">
          <p className="text-base">
            <strong className="block text-gray-400 text-xs uppercase tracking-wider mb-1">ID Member:</strong> 
            <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2.5 py-1 rounded text-sm font-semibold">{memberId}</span>
          </p>
          <p>
            <strong className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Nama Lengkap:</strong> 
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{memberName}</span>
          </p>
          <p>
            <strong className="block text-gray-400 text-xs uppercase tracking-wider mb-1">No. Telepon:</strong> 
            <span className="text-base">{memberPhone}</span>
          </p>
          <p>
            <strong className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Total Koleksi Poin:</strong> 
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{memberPoints} Poin</span>
          </p>
        </div>

        {/* TOMBOL UNTUK KASIR MENGINPUT TRANSAKSI BARU */}
        <button
          onClick={() => navigate('/management/input-transaksi-member', { 
            state: { idMember: memberId, namaMember: memberName } 
          })}
          className="w-full bg-amber-900 hover:bg-amber-800 text-white py-3 rounded-lg font-semibold transition-colors text-base shadow-sm"
        >
          Proses Transaksi Kopi Member
        </button>
      </div>
    </div>
  );
}

export default MemberDetail;