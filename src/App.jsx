import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Match from './pages/Match';
import TVChannels from './pages/TVChannels';
import Privacy from './pages/Privacy';
import DMCA from './pages/DMCA';
import TelegramTool from './pages/TelegramTool';
import FloatingSocial from './components/FloatingSocial';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tv-channels" element={<TVChannels />} />
            <Route path="/match/:id" element={<Match />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/telegram-tool" element={<TelegramTool />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <FloatingSocial />
    </Router>
  );
}

export default App;
