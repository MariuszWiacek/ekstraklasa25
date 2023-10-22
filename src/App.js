import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './compartments/navbar';
import Table from './compartments/table';
import Games from './compartments/games';
import Footer from './compartments/footer';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/table" element={<Table />} />
            <Route path="/games" element={<Games />} />
          </Routes>
        </div>
        
      </div><div>
      <Footer /></div>
    </Router>
  );
}

export default App;
