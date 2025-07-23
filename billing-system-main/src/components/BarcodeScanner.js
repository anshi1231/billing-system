import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const BarcodeScanner = () => {
  const fetchSareeByCode = async (code) => {
    const sareeRef = collection(db, 'sarees');
    const q = query(sareeRef, where("item_code", "==", code));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        alert(`Found: ${doc.data().brand}, ₹${doc.data().price}`);
      });
    } else {
      alert('No item found with this item code');
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    });

    scanner.render(
      async (decodedText) => {
        await fetchSareeByCode(decodedText);
        scanner.clear(); // stop after one scan
      },
      (error) => {
        console.warn(error);
      }
    );
  }, []);

  return (
    <div>
      <h3>Scan Item Barcode</h3>
      <div id="reader" style={{ width: "300px", marginTop: "20px" }}></div>
    </div>
  );
};

export default BarcodeScanner;
