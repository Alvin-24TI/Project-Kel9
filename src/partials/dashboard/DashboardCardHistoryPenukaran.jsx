import React from 'react';
import { Link } from 'react-router-dom';

function DashboardCardHistoryPenukaran({ items = [], className = '' }) {
  return (
    <div className={`flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 ${className}`.trim()}>
      <div className="p-5">
        <header className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">History Penukaran Poin</h2>
          <Link to="/promo-membership" className="text-sm text-sky-600 hover:underline">Lihat semua</Link>
        </header>

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-sm text-slate-400 py-8 text-center">Belum ada penukaran poin terbaru.</div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="flex justify-between items-center gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-slate-700 dark:text-slate-200 truncate">{it.promo_name || it.reward || `Penukaran #${it.id}`}</div>
                  {it.member_name ? <div className="text-xs text-slate-400">{it.member_name}</div> : null}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">{it.points_spent ?? it.points_used ?? it.jumlah_poin ?? '-'} Pts</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardCardHistoryPenukaran;
