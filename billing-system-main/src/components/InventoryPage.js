// src/components/InventoryPage.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const InventoryPage = () => {
  const [sarees, setSarees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "sarees"));
      const data = snapshot.docs.map(doc => doc.data());
      setSarees(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Inventory</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Type</th>
            <th>Item Code</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {sarees.map((item, idx) => (
            <tr key={idx}>
              <td>{item.brand}</td>
              <td>{item.type}</td>
              <td>{item.item_code}</td>
              <td>₹{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
