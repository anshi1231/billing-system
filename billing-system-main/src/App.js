import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddSareeForm from './components/AddSareeForm';
import BillingPage from './components/BillingPage';
import InventoryPage from './components/InventoryPage';
import PastBillsPage from './components/PastBillsPage';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ marginBottom: 20 }}>
          <Link to="/" style={{ marginRight: 15 }}>Billing</Link>
          <Link to="/add" style={{ marginRight: 15 }}>Add Item</Link>
          <Link to="/inventory" style={{ marginRight: 15 }}>Inventory</Link>
          <Link to="/bills">Past Bills</Link>
        </nav>

        <Routes>
          <Route path="/" element={<BillingPage />} />
          <Route path="/add" element={<AddSareeForm />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/bills" element={<PastBillsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
