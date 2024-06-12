

import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import './guestbook.css';

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

const Guestbook = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [message, setMessage] = useState('');
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const chatContainerRef = useRef(null);

  // Initialize a secondary Firebase app
  const secondaryApp = initializeApp(firebaseConfig, 'secondary');
  const analytics = getAnalytics(secondaryApp);
  const db = getDatabase(secondaryApp);

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  useEffect(() => {
    // Scroll to the bottom of the chat container when the component mounts
    scrollToBottom();

    // Fetch guestbook entries from Firebase when the component mounts
    const entriesRef = ref(db, 'guestbookEntries');
    onValue(entriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          const entries = Object.values(data).reverse(); // Reverse the order of entries
          setGuestbookEntries(entries);
          scrollToBottom(); // Scroll to the bottom after setting chat entries
        }
      }
    });
  }, [db]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Push the new entry to the Firebase Realtime Database
    const entriesRef = ref(db, 'guestbookEntries');
    const now = new Date();
    const formattedDateAndTime = now.toISOString(); // Use toISOString to format date and time

    push(entriesRef, {
      name: username, // Use the username in the entry
      message,
      dateAndTime: formattedDateAndTime, // Include date and time in the entry
    });

    // Save the username to local storage
    localStorage.setItem('username', username);

    // Clear the input fields
    setMessage('');
    scrollToBottom(); // Scroll to the bottom after submitting a new message
  };

  return (
    <div className="chatbox">
      <div className="messages" style={{ marginBottom: '1%' }} ref={chatContainerRef}>
        <br></br>
        <h2 className="chat-title" style={{ textAlign: 'center', color: 'aliceblue', textDecoration: 'underline', marginBottom: '5%' }}>Chatbox:</h2>
        <ul className="message-list">
          {guestbookEntries.map((entry, index) => (
            <div key={index} className="message">
              <strong className="username" style={{ color: "red" }}>{entry.name}:</strong> <strong style={{ color: "aliceblue" }}>{entry.message}</strong>
              <div className="date-time" style={{ color: "grey", fontSize:'10px' }}>wysłano :  {new Date(entry.dateAndTime).toLocaleString()}</div>
            </div>
          )).reverse() // Reverse the order when mapping to display newest messages at the top
        }
        </ul>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="username-input"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};


export default Guestbook;

