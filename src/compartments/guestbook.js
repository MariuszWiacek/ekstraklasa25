import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const Guestbook = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [guestbookEntries, setGuestbookEntries] = useState([]);

  // Your Firebase configuration here
  const firebaseConfig = {
    apiKey: "AIzaSyCGD41f7YT-UQyGZ7d1GzzB19B9wDNbg58",
    authDomain: "guestbook-73dfc.firebaseapp.com",
    databaseURL: "https://guestbook-73dfc-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "guestbook-73dfc",
    storageBucket: "guestbook-73dfc.appspot.com",
    messagingSenderId: "674344514507",
    appId: "1:674344514507:web:fc587317fa516369a3bc4e",
    measurementId: "G-1TZ4B0BK9D"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const db = getDatabase();

  useEffect(() => {
    // Fetch guestbook entries from Firebase when the component mounts
    const entriesRef = ref(db, 'guestbookEntries');
    onValue(entriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          const entries = Object.values(data);
          setGuestbookEntries(entries);
        }
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Push the new entry to the Firebase Realtime Database
    const entriesRef = ref(db, 'guestbookEntries');
    push(entriesRef, {
      name,
      message,
    });

    // Clear the input fields
    setName('');
    setMessage('');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '30%' }}>
        <h2>Chatbox</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{color:"white"}}>Name:</label>
            <input
              type="text"
              style={{ width: '100%' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{color:"white"}}>Message:</label>
            <textarea
              style={{ width: '100%', height: '100%' }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div style={{ width: '65%', border: '1px solid #ccc', padding: '1rem', overflowY: 'scroll', maxHeight: '400px' }}>
        <h3 style={{color:"white"}}>Entries:</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {guestbookEntries.map((entry, index) => (
            <li key={index} style={{color:"red", fontSize: '14px', marginBottom: '0.5rem' }}>
              <strong style={{color:"white"}}>{entry.name}:</strong > {entry.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Guestbook;
