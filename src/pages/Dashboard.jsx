import React from 'react';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';
import DashboardCard11 from '../partials/dashboard/DashboardCard11';
import DashboardCard12 from '../partials/dashboard/DashboardCard12';
import DashboardCard13 from '../partials/dashboard/DashboardCard13';
import DashboardCardMember from '../partials/dashboard/DashboardCardMember';


function Dashboard() {
  return (
    // min-h-screen ensures the background/container fills the vertical space
    <div className="flex flex-col flex-1 p-4 md:p-6 lg:p-8 w-full max-w-9xl mx-auto min-h-screen">

      {/* Dashboard header actions */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Dashboard
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <FilterButton align="right" />
          <Datepicker align="right" />
          <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white flex items-center">
            <svg className="fill-current shrink-0 w-4 h-4" viewBox="0 0 16 16">
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
            </svg>
            <span className="ml-2 hidden xs:block">Add View</span>
          </button>
        </div>
      </div>

      {/* Cards Grid: Managed via col-span to fill 12 columns evenly */}
      <div className="grid grid-cols-12 gap-6">

        {/* KARTU MEMBER BARU */}
        <DashboardCardMember />

        {/* Large Featured Card (Line Chart) */}
        <div className="col-span-full xl:col-span-8">
          <DashboardCard01 />
        </div>

        {/* Smaller Card (Doughnut) */}
        <div className="col-span-full sm:col-span-6 xl:col-span-4">
          <DashboardCard06 />
        </div>

        {/* Medium Cards Group */}
        <div className="col-span-full sm:col-span-6 xl:col-span-4">
          <DashboardCard04 />
        </div>
        <div className="col-span-full sm:col-span-6 xl:col-span-4">
          <DashboardCard05 />
        </div>
        <div className="col-span-full sm:col-span-6 xl:col-span-4">
          <DashboardCard08 />
        </div>

        {/* Table & Lists */}
        <div className="col-span-full xl:col-span-7">
          <DashboardCard07 />
        </div>
        <div className="col-span-full xl:col-span-5">
          <DashboardCard10 />
        </div>

        {/* Bottom Row */}
        <div className="col-span-full sm:col-span-6 xl:col-span-4">
          <DashboardCard11 />
        </div>
        <div className="col-span-full sm:col-span-6 xl:col-span-4">
          <DashboardCard12 />
        </div>
        <div className="col-span-full sm:col-span-6 xl:col-span-4">
          <DashboardCard13 />
        </div>

      </div>

     
    </div>
  );
}

export default Dashboard;