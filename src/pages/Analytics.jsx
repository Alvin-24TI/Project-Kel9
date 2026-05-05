import React from "react";

function Analytics() {
  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Users</h2>
          <p className="text-2xl font-bold mt-2">1,245</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Orders</h2>
          <p className="text-2xl font-bold mt-2">532</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Revenue</h2>
          <p className="text-2xl font-bold mt-2">$12,430</p>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2">User</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <td className="py-2">John Doe</td>
              <td className="text-green-500">Completed</td>
              <td>2026-05-05</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <td className="py-2">Jane Smith</td>
              <td className="text-yellow-500">Pending</td>
              <td>2026-05-04</td>
            </tr>
            <tr>
              <td className="py-2">Michael</td>
              <td className="text-red-500">Failed</td>
              <td>2026-05-03</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Analytics;