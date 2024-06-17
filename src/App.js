import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/home';
import Navbar from './compartments/navbar';
import Table from './pages/table';
import Games from './compartments/admin';
import Footer from './compartments/footer';
import Guestbook from './pages/chatbox';
import Games2 from './pages/results';
import Bets from './compartments/bets';
import Rules from './pages/rules';
import Loading from './compartments/loading'; // Import the Loading component

import pitch from './images/pitch.png'; // Ensure this is the correct path to your image

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleImageLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000); // Ensure the loading screen is shown for at least 3 seconds
    };

    const img = new Image();
    img.src = pitch;
    img.onload = handleImageLoad;

    return () => {
      img.onload = null; // Cleanup in case the component unmounts
    };
  }, []);

  return (
    <Router>
      <AnimatePresence>
        {isLoading ? (
          <Loading onLoaded={() => setIsLoading(false)} key="loading" />
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
