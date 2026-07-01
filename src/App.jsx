import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';

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


const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const memberDetail = React.lazy(() => import("./pages/MemberDetail"));
const inputTransaksiMember = React.lazy(() => import("./pages/InputTransaksiMember"));
const transaksiMember = React.lazy(() => import("./pages/TransaksiMember"));

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/" element={<Layout />}>
       <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="/member-list" element={<MemberList />} />
        <Route path="/register-member" element={<RegisterMember />} />
        <Route path="/member-detail" element={<MemberDetail />} />
        <Route path="/promo-membership" element={<PromoMembership />} />
        <Route path="/memberlist/:nama" element={<MemberDetail />} />
        <Route path="/input-transaksi-member" element={<InputTransaksiMember />} />
        <Route path="/transaksi-member" element={<TransaksiMember />} />
      </Route>
      
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot" element={<Forgot />} />
      </Route>
    </Routes>


  );
}

export default App;
