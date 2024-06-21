import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { getDatabase, ref, onValue } from 'firebase/database';

const Chatbox = ({ isOpen, toggleChatbox }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messagesRef = ref(getDatabase(), 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.values(data);
        setMessages(messagesArray);
      }
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  return (
    <motion.div
      className={`chatbox ${isOpen ? 'open' : ''}`}
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? '0%' : '100%' }}
      transition={{ duration: 0.3 }}
    >
      <div className="chatbox-header">
        <h3>Chatbox</h3>
        <button className="close-btn" onClick={toggleChatbox}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="chatbox-messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <p>{message.text}</p>
          </div>
        )).reverse()}
        <div ref={messagesEndRef} />
      </div>
    </motion.div>
  );
};

export default Chatbox;
