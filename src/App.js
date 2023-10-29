import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BarLoader } from 'react-spinners'; // Import BarLoader from react-spinners
import Navbar from './compartments/navbar';
import Table from './compartments/table';
import Games from './compartments/results';
import Footer from './compartments/footer';
import Guestbook from './compartments/chatbox';
import Home from './compartments/home';
import Bets from './compartments/bets';

function Loading() {
  return (
    <div
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
      <BarLoader color="red" /> {/* Use BarLoader from react-spinners */}
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <Router>
      {isLoading ? (
        <Loading />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh',  }}>
          <Navbar />
          <div className={`container ${isLoading ? 'hidden' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '15%' }}>
            <Home />
            <Routes>
              <Route path="/table" element={<Table />} />
              <Route path="/games" element={<Games />} />
              <Route path="/guestbook" element={<Guestbook />} />
              <Route path="/bets" element={<Bets />} />
            </Routes>
          </div>
          <Footer />
        </div>
      )}
    </Router>
  );
}

export default App;
