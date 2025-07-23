import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';

const BillingPage = () => {
  const [billItems, setBillItems] = useState([]);
  const [manualCode, setManualCode] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const billRef = useRef();
  const scannerRef = useRef(null);

  const fetchItem = async (code) => {
    const sareeRef = collection(db, 'sarees');
    const q = query(sareeRef, where("item_code", "==", code));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        const item = doc.data();
        addItemToBill(item);
      });
    } else {
      alert("No item found for: " + code);
    }
  };

  const addItemToBill = (item) => {
    setBillItems(prev => {
      const existing = prev.find(i => i.item_code === item.item_code);
      if (existing) {
        return prev.map(i => i.item_code === item.item_code ? { ...i } : i);
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (code) => {
    setBillItems(prev => prev.filter(i => i.item_code !== code));
  };

  const updateQuantity = (code, quantity) => {
    setBillItems(prev =>
      prev.map(i =>
        i.item_code === code
          ? { ...i, quantity: parseInt(quantity) || 1 }
          : i
      )
    );
  };

  const getTotal = () =>
    billItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      await fetchItem(manualCode.trim());
      setManualCode('');
    }
  };

  const saveBill = async () => {
    if (!customer.name || !customer.phone || billItems.length === 0) {
      alert("Fill customer info and add items to bill.");
      return;
    }

    const bill = {
      customer_name: customer.name,
      customer_phone: customer.phone,
      items: billItems,
      total: getTotal(),
      created_at: Timestamp.now()
    };

    try {
      await addDoc(collection(db, "bills"), bill);
      alert("Bill saved successfully!");
    } catch (err) {
      alert("Error saving bill: " + err.message);
    }
  };

  const printBill = () => {
    const printContents = billRef.current.innerHTML;
    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join('');
        } catch (e) {
          return '';
        }
      })
      .join('');

    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>${styles}</style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner("billing-scanner", {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      });

      scannerRef.current.render(
        async (decodedText) => {
          await fetchItem(decodedText.trim());
        },
        (err) => console.warn(err)
      );
    }
  }, []);

  return (
    <div>
      <h2>Billing System</h2>

      <div id="billing-scanner" style={{ width: 300, marginTop: 10, marginBottom: 20 }}></div>

      <form onSubmit={handleManualSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Enter item code manually"
        />
        <button type="submit">Add Item</button>
      </form>

      <div ref={billRef}>
        <h3>Bill Items</h3>

        <div>
          <input
            type="text"
            placeholder="Customer Name"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          />
        </div>

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Type</th>
              <th>Item Code</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, index) => (
              <tr key={index}>
                <td>{item.brand}</td>
                <td>{item.type}</td>
                <td>{item.item_code}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item.item_code, e.target.value)}
                    style={{ width: '50px' }}
                  />
                </td>
                <td>{item.price}</td>
                <td>{item.price * item.quantity}</td>
                <td>
                  <button onClick={() => removeItem(item.item_code)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Total: ₹{getTotal()}</h3>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={saveBill}>Save Bill</button>
        <button onClick={printBill} style={{ marginLeft: 10 }}>Print Bill</button>
      </div>

      {/* Optional: Add print-specific styles here */}
      <style>
        {`
          @media print {
            #billing-scanner, form, button {
              display: none !important;
            }
            input {
              border: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BillingPage;
