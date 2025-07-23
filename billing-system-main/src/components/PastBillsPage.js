// src/components/PastBillsPage.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const PastBillsPage = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      const snapshot = await getDocs(collection(db, "bills"));
      const data = snapshot.docs.map(doc => doc.data());
      setBills(data);
    };
    fetchBills();
  }, []);

  return (
    <div>
      <h2>Past Bills</h2>
      {bills.map((bill, idx) => (
        <div key={idx} style={{ border: '1px solid black', padding: 10, marginBottom: 20 }}>
          <p><strong>Customer:</strong> {bill.customer_name} ({bill.customer_phone})</p>
          <p><strong>Total:</strong> ₹{bill.total}</p>
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Type</th>
                <th>Item Code</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, j) => (
                <tr key={j}>
                  <td>{item.brand}</td>
                  <td>{item.type}</td>
                  <td>{item.item_code}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default PastBillsPage;
