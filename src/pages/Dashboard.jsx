import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import LineChart02 from '../charts/LineChart02';
import DoughnutChart from '../charts/DoughnutChart';
import DashboardCardHistoryTransaksi from '../partials/dashboard/DashboardCardHistoryTransaksi';
import DashboardCardHistoryPenukaran from '../partials/dashboard/DashboardCardHistoryPenukaran';

const chartColors = {
  indigo: '#6366f1',
  amber: '#f59e0b',
  sky: '#0ea5e9',
  emerald: '#10b981',
  slate: '#64748b',
};

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [topMember, setTopMember] = useState({ name: '-', points: 0 });
  const [error, setError] = useState(null);
  const [transactionChartData, setTransactionChartData] = useState({ labels: [], datasets: [] });
  const [memberChartData, setMemberChartData] = useState({ labels: [], datasets: [] });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentRedemptions, setRecentRedemptions] = useState([]);
  const [repeatOrderStats, setRepeatOrderStats] = useState({ menuCount: 0, repeatedOrderCount: 0, repeatRate: 0 });
  const [favoriteMenus, setFavoriteMenus] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        const { data: transactions, error: txError } = await supabase
          .from('transactions')
          .select('id, amount, created_at, product_name, points_earned')
          .order('created_at', { ascending: false });

        if (txError) throw txError;

        const normalizedTransactions = (transactions || []).map((tx) => ({
          id: tx.id,
          amount: Number(tx.amount || 0),
          created_at: tx.created_at,
          description: tx.product_name || `Transaksi #${tx.id}`,
          points_earned: Number(tx.points_earned || 0),
        }));

        setRecentTransactions(normalizedTransactions.slice(0, 5));

        const chartTransactions = [...normalizedTransactions].reverse();
        let revenueSum = 0;
        const dailyRevenueData = {};
        const dailyTransactionCountData = {};
        const menuFrequency = {};

        chartTransactions.forEach((tx) => {
          const amount = Number(tx.amount || 0);
          revenueSum += amount;
          const dateLabel = new Date(tx.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          if (!dailyRevenueData[dateLabel]) dailyRevenueData[dateLabel] = 0;
          dailyRevenueData[dateLabel] += amount;

          if (!dailyTransactionCountData[dateLabel]) dailyTransactionCountData[dateLabel] = 0;
          dailyTransactionCountData[dateLabel] += 1;

          const menuName = tx.description || 'Menu Tidak Diketahui';
          if (!menuFrequency[menuName]) menuFrequency[menuName] = 0;
          menuFrequency[menuName] += 1;
        });

        const repeatedMenus = Object.entries(menuFrequency)
          .filter(([, count]) => count > 1)
          .sort((a, b) => b[1] - a[1]);
        const repeatedOrderCount = repeatedMenus.reduce((sum, [, count]) => sum + count, 0);
        const repeatRate = chartTransactions.length > 0
          ? Math.round((repeatedOrderCount / chartTransactions.length) * 100)
          : 0;

        setRepeatOrderStats({
          menuCount: repeatedMenus.length,
          repeatedOrderCount,
          repeatRate,
        });
        setFavoriteMenus(
          Object.entries(menuFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }))
        );

        setTotalTransactions(chartTransactions.length);
        setTotalRevenue(revenueSum);
        setTransactionChartData({
          labels: Object.keys(dailyTransactionCountData),
          datasets: [
            {
              label: 'Transaksi',
              data: Object.values(dailyTransactionCountData),
              borderColor: chartColors.sky,
              fill: true,
              backgroundColor: 'rgba(14, 165, 233, 0.12)',
              borderWidth: 2,
              tension: 0.25,
            },
          ],
        });

        const { data: members, error: memError } = await supabase
          .from('members')
          .select('name, points')
          .order('points', { ascending: false })
          .limit(5);

        if (memError) throw memError;

        const { data: redemptions, error: redemptionError } = await supabase
          .from('promo_redemptions')
          .select('id, points_spent, redeemed_at, note')
          .order('redeemed_at', { ascending: false })
          .limit(5);

        if (redemptionError) throw redemptionError;

        setRecentRedemptions((redemptions || []).map((item) => ({
          id: item.id,
          points_spent: Number(item.points_spent || 0),
          redeemed_at: item.redeemed_at,
          note: item.note,
          reward: item.note || `Penukaran #${item.id}`,
        })));

        if (members && members.length > 0) {
          setTopMember({
            name: members[0].name || members[0].nama || '-',
            points: Number(members[0].points ?? members[0].total_poin ?? 0),
          });

          const memberLabels = members.map((m) => m.name || m.nama || 'Unknown');
          const memberPoints = members.map((m) => Number(m.points ?? m.total_poin ?? 0));

          setMemberChartData({
            labels: memberLabels,
            datasets: [
              {
                label: 'Points',
                data: memberPoints,
                backgroundColor: [
                  chartColors.amber,
                  chartColors.sky,
                  chartColors.indigo,
                  chartColors.emerald,
                  chartColors.slate,
                ],
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Ringkasan performa toko dan aktivitas member.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700">
          <div className="text-slate-500 animate-pulse text-lg font-medium">Memuat ringkasan dashboard...</div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-xl text-red-700 dark:text-red-200">
          <h2 className="font-semibold mb-2">Dashboard Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 xl:col-span-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-5 pt-5">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Grafik Transaksi</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Jumlah transaksi harian dari aktivitas terbaru.</p>
              </div>
              <div className="h-80">
                {transactionChartData.labels?.length > 0 ? (
                  <LineChart02 data={transactionChartData} width={640} height={320} />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">Belum ada data transaksi.</div>
                )}
              </div>
            </div>

            <div className="col-span-12 xl:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <p className="text-xs font-semibold uppercase text-slate-400">Pendapatan</p>
                <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">Rp {totalRevenue.toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <p className="text-xs font-semibold uppercase text-slate-400">Transaksi Selesai</p>
                <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">{totalTransactions} order</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <p className="text-xs font-semibold uppercase text-slate-400">Top Member</p>
                <p className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">{topMember.name}</p>
                <p className="text-sm text-slate-500">{topMember.points} poin</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 mt-6">
            <div className="col-span-12 lg:col-span-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-5 pt-5">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Poin Member</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Distribusi poin member teratas dalam bentuk lingkaran.</p>
              </div>
              <div className="h-72">
                {memberChartData.labels?.length > 0 ? (
                  <DoughnutChart data={memberChartData} width={320} height={280} />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">Belum ada data member.</div>
                )}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Statistik Repeat Order Menu</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Persentase transaksi yang berulang pada menu favorit.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-3">
                    <p className="text-xs uppercase text-slate-400">Repeat Rate</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{repeatOrderStats.repeatRate}%</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-3">
                    <p className="text-xs uppercase text-slate-400">Menu Berulang</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{repeatOrderStats.menuCount}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-3">
                    <p className="text-xs uppercase text-slate-400">Transaksi Ulang</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{repeatOrderStats.repeatedOrderCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Menu Favorite</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Menu yang paling sering dipesan.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {favoriteMenus.length > 0 ? favoriteMenus.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-semibold text-sm">{index + 1}</span>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.count} pesanan</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">#{index + 1}</span>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400">Belum ada data menu favorit.</p>
                  )}
                </div>
              </div>

              <DashboardCardHistoryTransaksi items={recentTransactions} className="w-full" />
              <DashboardCardHistoryPenukaran items={recentRedemptions} className="w-full" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
