import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { QRCodeCanvas } from 'qrcode.react';

const AddSareeForm = () => {
  const [form, setForm] = useState({
    brand: '',
    type: '',
    item_code: '',
    price: ''
  });

  const [savedCode, setSavedCode] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "sarees"), {
        brand: form.brand,
        type: form.type,
        item_code: form.item_code,
        price: parseInt(form.price)
      });
      setSavedCode(form.item_code); // to show QR after save
      alert("Item added!");
      setForm({ brand: '', type: '', item_code: '', price: '' });
    } catch (error) {
      alert("Error adding item: " + error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand Name" required />
        <input name="type" value={form.type} onChange={handleChange} placeholder="Type" required />
        <input name="item_code" value={form.item_code} onChange={handleChange} placeholder="Item Code" required />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required />
        <button type="submit">Add Item</button>
      </form>

      {savedCode && (
        <div style={{ marginTop: '20px' }}>
          <h4>QR Code for Item Code: {savedCode}</h4>
          <QRCodeCanvas value={savedCode} size={200} />
        </div>
      )}
    </div>
  );
};

export default AddSareeForm;
