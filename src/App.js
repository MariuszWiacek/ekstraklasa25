import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence from framer-motion
import { BarLoader } from 'react-spinners'; // Import BarLoader from react-spinners
import Navbar from './compartments/navbar';
import Table from './compartments/table';
import Games from './compartments/results';
import Footer from './compartments/footer';
import Guestbook from './compartments/chatbox';
import Games2 from './compartments/results2';
import Bets from './compartments/bets';
import footballLogo from './images/icon.png'; // Import your logo
import Rules from './compartments/rules';

function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }} // Adjust the duration for the entire loading screen
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'url("../src/images/pitch.png") no-repeat center center fixed', // Replace with your background image URL
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
          transition={{ duration: 1, delay: 1 }} // Adjust the duration and delay for the logo
        >
          <img src={footballLogo} alt="Logo piłkarski" style={{ width: '400px', height: '300px', marginBottom: '20px' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }} // Adjust the duration and delay for the text
        >
          <h1 style={{ color: '#F5F5DC', margin: 0 }}>SUPERLIGA 2024</h1>
        </motion.div>
        <BarLoader height="3px" width="100%" size="70px" color="red" textAlign="center" />
      </div>
    </motion.div>
  );
}



function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  }, []);

  return (
    <Router>
      <AnimatePresence>
        {isLoading ? (
          <Loading key="loading" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar /> 
            <div className={`container ${isLoading ? 'hidden' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '15%' }}>
              
              <Routes>
                <Route path='/rules' element={<Rules />} />
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
