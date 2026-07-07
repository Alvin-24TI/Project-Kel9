import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

import Datepicker from '../components/Datepicker';
import LineChart02 from '../charts/LineChart02';
import BarChart01 from '../charts/BarChart01';

const chartColors = {
  indigo: '#6366f1',
  amber: '#f59e0b',
  sky: '#0ea5e9',
  emerald: '#10b981',
  slate: '#64748b',
};

function Analytics() {
  const [loading, setLoading] = useState(true);
  
  // Dynamic metrics state
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [topMember, setTopMember] = useState({ name: '-', points: 0 });
  const [error, setError] = useState(null);

  // Chart data states
  const [transactionChartData, setTransactionChartData] = useState({ labels: [], datasets: [] });
  const [memberChartData, setMemberChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        setLoading(true);

        // 1. Fetch Transactions Data
        const { data: transactions, error: txError } = await supabase
          .from('transactions')
          .select('id, amount, created_at')
          .order('created_at', { ascending: true });

        if (txError) throw txError;

        // 2. Fetch Members Data for Leaderboard
        const { data: members, error: memError } = await supabase
          .from('members')
          .select('name, points')
          .order('points', { ascending: false })
          .limit(5);

        if (memError) throw memError;

        // --- PROCESS TRANSACTIONS (Revenue & Volume Over Time) ---
        let revenueSum = 0;
        const dailyData = {};

        if (transactions && transactions.length > 0) {
          transactions.forEach((tx) => {
            const amount = Number(tx.total_harga || tx.nominal || tx.amount || 0);
            revenueSum += amount;

            const dateLabel = new Date(tx.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            if (!dailyData[dateLabel]) {
              dailyData[dateLabel] = 0;
            }
            dailyData[dateLabel] += amount;
          });

          setTotalTransactions(transactions.length);
          setTotalRevenue(revenueSum);
        }

        const txLabels = Object.keys(dailyData);
        const txValues = Object.values(dailyData);

        setTransactionChartData({
          labels: txLabels,
          datasets: [
            {
              label: 'Daily Revenue',
              data: txValues,
              borderColor: chartColors.indigo,
              fill: true,
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderWidth: 2,
              tension: 0.2,
            },
          ],
        });

        // --- PROCESS MEMBERS (Points Leaderboard) ---
        if (members && members.length > 0) {
          setTopMember({
            name: members[0].name || members[0].nama || '-',
            points: Number(members[0].points ?? members[0].total_poin ?? 0),
          });

          const memberLabels = members.map(m => m.name || m.nama || 'Unknown');
          const memberPoints = members.map(m => Number(m.points ?? m.total_poin ?? 0));

          setMemberChartData({
            labels: memberLabels,
            datasets: [
              {
                label: 'Total Points Gained',
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
        console.error('Error compiling analytics data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyticsData();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      
      {/* Dashboard Actions */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Store Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time insight on member actions and revenue logs.
          </p>
        </div>
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <Datepicker align="right" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500 animate-pulse text-lg font-medium">
            Analyzing database records...
          </div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-xl text-red-700 dark:text-red-200">
          <h2 className="font-semibold mb-2">Analytics Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Real-time Summary Cards */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            <div className="flex flex-col col-span-12 sm:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Total Revenue Gained</div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="flex flex-col col-span-12 sm:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Completed Purchases</div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalTransactions} Orders</div>
            </div>
            <div className="flex flex-col col-span-12 sm:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">👑 Highest Ranking Member</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 truncate">
                {topMember.name} <span className="text-sm font-normal text-slate-400">({topMember.points} Pts)</span>
              </div>
            </div>
          </div>

          {/* Analytical Charts Grid */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Transaction Trend Line Chart */}
            <div className="flex flex-col col-span-12 lgl:col-span-7 xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-5">
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Transaction Revenue Trends</h2>
              {transactionChartData.labels.length > 0 ? (
                <LineChart02 data={transactionChartData} width={800} height={300} />
              ) : (
                <div className="text-sm text-slate-400 my-auto text-center py-12">No transactions recorded yet.</div>
              )}
            </div>

            {/* Top Members Points Bar Chart */}
            <div className="flex flex-col col-span-12 lgl:col-span-5 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-5">
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Top 5 Member Leaderboard (Points)</h2>
              {memberChartData.labels.length > 0 ? (
                <BarChart01 data={memberChartData} width={350} height={300} />
              ) : (
                <div className="text-sm text-slate-400 my-auto text-center py-12">No member points data found.</div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;