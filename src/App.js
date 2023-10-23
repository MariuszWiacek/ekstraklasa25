import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './compartments/navbar';
import Table from './compartments/table';
import Games from './compartments/games';
import Footer from './compartments/footer';
import Guestbook from './compartments/chatbox';
import InfoBar from './compartments/infobar'; // Import the InfoBar component

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <InfoBar /> {/* Add the InfoBar component */}
        <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/table" element={<Table />} />
            <Route path="/games" element={<Games />} />
            <Route path="/guestbook" element={<Guestbook />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
