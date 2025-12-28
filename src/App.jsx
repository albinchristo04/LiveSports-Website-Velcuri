import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Match from './pages/Match';
import TVChannels from './pages/TVChannels';
import Privacy from './pages/Privacy';
import DMCA from './pages/DMCA';
import TelegramTool from './pages/TelegramTool';
import LinkAggregator from './pages/LinkAggregator';
import Highlights from './pages/Highlights';
import TwitterTool from './pages/TwitterTool';
import BloggerGenerator from './pages/BloggerGenerator';
import FloatingSocial from './components/FloatingSocial';
import Footer from './components/Footer';
import Embed from './pages/Embed';

import SEOPage from './pages/SEOPage';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tv-channels" element={<TVChannels />} />
            <Route path="/match/:id" element={<Match />} />

            {/* Programmatic Match Routes */}
            <Route path="/football/:slug" element={<Match />} />
            <Route path="/futbol/:slug" element={<Match />} />

            {/* Brand & Entity Pages */}
            <Route path="/velcuri" element={<SEOPage />} />
            <Route path="/velcuri-io" element={<SEOPage />} />
            <Route path="/velcuri-streaming" element={<SEOPage />} />

            {/* Spanish Keyword Hubs */}
            <Route path="/rojadirecta-tv" element={<SEOPage />} />
            <Route path="/rojadirectatv" element={<SEOPage />} />
            <Route path="/roja-directa" element={<SEOPage />} />
            <Route path="/roja-tv" element={<SEOPage />} />
            <Route path="/pirlotv-futbol-en-vivo" element={<SEOPage />} />
            <Route path="/futbol-en-vivo-gratis" element={<SEOPage />} />
            <Route path="/ver-futbol-online" element={<SEOPage />} />

            <Route path="/embed/:id/:index" element={<Embed />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/telegram-tool" element={<TelegramTool />} />
            <Route path="/link-aggregator" element={<LinkAggregator />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/twitter-tool" element={<TwitterTool />} />
            <Route path="/blogger-generator" element={<BloggerGenerator />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <FloatingSocial />
    </Router>
  );
}

export default App;
