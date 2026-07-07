import React, { useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/home';

import "./css/style.css";
import "./charts/ChartjsConfig";

import Layout from "./pages/Layout";
import AuthLayout from "./layouts/AuthLayout";
import RegisterMember from './pages/RegisterMember';
import MemberDetail from './pages/MemberDetail';
import MemberList from './pages/MemberList';
import PromoMembership from './pages/PromoMembership';
import InputTransaksiMember from './pages/InputTransaksiMember';
import TransaksiMember from './pages/TransaksiMember';
import NotificationManagement from './pages/NotificationManagement'; // 1. Import komponen Notifikasi Anda

// Lazy loading components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#1c1917] text-white">
          <div className="text-center space-y-2">
            <div className="animate-spin text-4xl">☕</div>
            <p className="text-sm tracking-wider text-red-200">Memuat halaman...</p>
          </div>
        </div>
      }
    >
      <Routes>
        {/* Halaman Landing Page Utama */}
        <Route path="/" element={<Home />} />

        {/* Kelompok Halaman dengan Layout Main/Dashboard */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="member-list" element={<MemberList />} />
          <Route path="register-member" element={<RegisterMember />} />
          <Route path="member-detail" element={<MemberDetail />} />
          <Route path="promo-membership" element={<PromoMembership />} />
          
          {/* 2. Jalur Rute Baru untuk Halaman Manajemen Notifikasi Anda */}
          <Route path="notification-management" element={<NotificationManagement />} />
          
          <Route path="memberlist/:nama" element={<MemberDetail />} />
          <Route path="input-transaksi-member" element={<InputTransaksiMember />} />
          <Route path="transaksi-member" element={<TransaksiMember />} />
        </Route>
        
        {/* Kelompok Halaman Autentikasi */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot" element={<Forgot />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;