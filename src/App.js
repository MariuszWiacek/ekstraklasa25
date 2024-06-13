import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarLoader } from 'react-spinners';

import Home from './compartments/home';
import Navbar from './compartments/navbar';
import Table from './compartments/table';
import Games from './compartments/admin';
import Footer from './compartments/footer';
import Guestbook from './compartments/chatbox';
import Games2 from './compartments/results2';
import Bets from './compartments/bets';
import Rules from './compartments/rules';

import footballLogo from './images/icon.png'; // Replace with your logo URL
import logo from './images/logo.jpg'; // Adjust logo import as necessary

function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'url("../src/images/pitch.png") no-repeat center center fixed', // Adjust background image URL
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <img src={footballLogo} alt="Football Logo" style={{ width: '400px', height: '300px', marginBottom: '20px' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <h1 style={{ color: '#F5F5DC', margin: 0 }}>SUPERLIGA 2024</h1>
        </motion.div>
        <BarLoader height="3px" width="100%" size="70px" color="red" />
      </div>
    </motion.div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simulating a 3-second loading period
  }, []);

  return (
    <Router>
      <AnimatePresence>
        {isLoading ? (
          <Loading key="loading" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '15%', paddingTop: '5%' }}>
              <Routes>
                <Route path="/" element={<Home />} /> 
                <Route path="/rules" element={<Rules />} />
                <Route path="/table" element={<Table />} />
                <Route path="/games" element={<Games />} />
                <Route path="/games2" element={<Games2 />} />
                <Route path="/guestbook" element={<Guestbook />} />
                <Route path="/bets" element={<Bets />} />
              </Routes>
            </div>
            <Footer />
          </div>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;
