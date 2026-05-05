import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';
import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Fintech from './pages/Fintech';
import Customer from './pages/Customer';
import Orders from './pages/Orders';
import Invoices from './pages/Invoice';
import Shop from './pages/Shop';
import MyAccount from './pages/myAccount';
import MyNotification from './pages/myNotification';
import Feedback from './pages/Feedback';
import Inbox from './pages/Inbox';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/fintech" element={<Fintech />} />
      <Route path="/customer" element={<Customer />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/my-account" element={<MyAccount />} />
      <Route path="/my-notification" element={<MyNotification />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/inbox" element={<Inbox />} />
    </Routes>
  );
}

export default App;