import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";

import Layout from "./pages/Layout";
import AuthLayout from "./layouts/AuthLayout";
import RegisterMember from './pages/RegisterMember';
import MemberDetail from './pages/MemberDetail';
import MemberList from './pages/MemberList';
import PromoMembership from './pages/PromoMembership';


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
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="/member-list" element={<MemberList />} />
        <Route path="/register-member" element={<RegisterMember />} />
        <Route path="/member-detail" element={<MemberDetail />} />
        <Route path="/promo-membership" element={<PromoMembership />} />
        
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
