import React from 'react';
import { Link } from 'react-router-dom';
import memberData from '../../data/membersData.json'; // Jalur data dummy JSON

function DashboardCardMember() {
  // Menghitung statistik dummy dari file JSON
  const totalMembers = memberData.length;
  const totalPointsDistributed = memberData.reduce((sum, member) => sum + member.points, 0);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-5 pt-5 flex-grow">
        <header className="flex justify-between items-start mb-2">
          {/* Icon Grup/Member */}
          <div className="w-10 h-10 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 flex items-center justify-center">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16">
              <path d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-4 4a4 4 0 0 1 8 0H4Z" />
            </svg>
          </div>
        </header>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Statistik Member</h2>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-4">Ringkasan Loyalitas</div>
        
        {/* Tampilan Angka Angka Utama */}
        <div className="flex flex-col space-y-4 mb-4">
          <div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{totalMembers}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Pelanggan Terdaftar</div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{totalPointsDistributed.toLocaleString('id-ID')} Pts</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Poin Aktif beredar</div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah Card: Tombol Akses Cepat */}
      <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20 rounded-b-xl">
        <Link 
          to="/member-list" 
          className="text-sm font-medium text-violet-500 hover:text-violet-600 flex items-center justify-between"
        >
          <span>Kelola Semua Member</span>
          <svg className="w-4 h-4 fill-current ml-2" viewBox="0 0 16 16">
            <path d="M6.7 13.7L5.3 12.3 9.6 8 5.3 3.7 6.7 2.3 12.4 8z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default DashboardCardMember;