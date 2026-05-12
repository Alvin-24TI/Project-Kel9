import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";

import Layout from "./pages/Layout";
import AuthLayout from "./layouts/AuthLayout";


const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const Fintech = React.lazy(() => import("./pages/Fintech"));
const Customer = React.lazy(() => import("./pages/Customer"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Invoices = React.lazy(() => import("./pages/Invoice"));
const Shop = React.lazy(() => import("./pages/Shop"));
const MyAccount = React.lazy(() => import("./pages/myAccount"));
const MyNotification = React.lazy(() => import("./pages/myNotification"));
const Feedback = React.lazy(() => import("./pages/Feedback"));
const Inbox = React.lazy(() => import("./pages/Inbox"));
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
        <Route path="fintech" element={<Fintech />} />
        <Route path="customer" element={<Customer />} />
        <Route path="orders" element={<Orders />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="shop" element={<Shop />} />
        <Route path="my-account" element={<MyAccount />} />
        <Route path="my-notification" element={<MyNotification />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="inbox" element={<Inbox />} />
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
