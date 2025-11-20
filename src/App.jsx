import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Match from './pages/Match';
import FloatingSocial from './components/FloatingSocial';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match/:id" element={<Match />} />
      </Routes>
      <FloatingSocial />
    </Router>
  );
}

export default App;
