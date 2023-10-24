import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './compartments/navbar';
import Table from './compartments/table';
import Games from './compartments/results';
import Footer from './compartments/footer';
import Guestbook from './compartments/chatbox';
import InfoBar from './compartments/infobar';
import Home from './compartments/home';
import Bets from './compartments/bets';

function App() {
  const isHomePage = window.location.pathname === '/';

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <InfoBar />
        <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop:"3%" }}>
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
    </Router>
  );
}

export default App;
