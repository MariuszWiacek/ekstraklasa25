import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import './guestbook.css'; // Import the CSS

const Guestbook = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || ''); // Load username from local storage
  const [message, setMessage] = useState('');
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const chatContainerRef = useRef(null);

  // Replace with your Firebase configuration
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

  const db = getDatabase(); // Define the Firebase database instance

  useEffect(() => {
    // Fetch guestbook entries from Firebase when the component mounts
    const entriesRef = ref(db, 'guestbookEntries');
    onValue(entriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          const entries = Object.values(data);
          setGuestbookEntries(entries);

          // Scroll to the bottom of the chat container
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }
    });
  }, [chatContainerRef, db]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Push the new entry to the Firebase Realtime Database
    const entriesRef = ref(db, 'guestbookEntries');
    push(entriesRef, {
      name: username, // Use the username in the entry
      message,
    });

    // Save the username to local storage
    localStorage.setItem('username', username);

    // Clear the input fields
    setMessage('');

    // Scroll to the bottom of the chat container
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  return (
    <div className="chatbox">
      <div className="messages" ref={chatContainerRef}>
        <br></br><h3 className="chat-title">Pierdolnik:</h3>
        <ul className="message-list">
          {guestbookEntries.map((entry, index) => (
            <li key={index} className="message">
              <strong className="username" style={{ color: "red" }}>{entry.name}:</strong> {entry.message}
            </li>
          ))}
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
