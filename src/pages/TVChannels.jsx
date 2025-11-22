import React, { useState, useEffect } from 'react';
import { fetchTVChannels } from '../services/api';
import Navbar from '../components/Navbar';
import { Search, Tv, Loader2, Play } from 'lucide-react';
import AdUnit from '../components/AdUnit';

const TVChannels = () => {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeChannel, setActiveChannel] = useState(null);

    useEffect(() => {
        const loadChannels = async () => {
            setLoading(true);
            const data = await fetchTVChannels();
            setChannels(data);
            setLoading(false);
        };
        loadChannels();
    }, []);

    // Categorization Logic
    const getCategory = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('sport') || lowerName.includes('espn') || lowerName.includes('fox') || lowerName.includes('nfl') || lowerName.includes('nba')) return 'Sports';
        if (lowerName.includes('news') || lowerName.includes('cnn') || lowerName.includes('bbc') || lowerName.includes('msnbc')) return 'News';
        if (lowerName.includes('kid') || lowerName.includes('cartoon') || lowerName.includes('disney') || lowerName.includes('nick')) return 'Kids';
        if (lowerName.includes('movie') || lowerName.includes('cinema') || lowerName.includes('hbo') || lowerName.includes('starz')) return 'Movies';
        return 'Entertainment';
    };

    const categories = ['All', 'Sports', 'News', 'Entertainment', 'Movies', 'Kids'];

    const filteredChannels = channels.filter(channel => {
        const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || getCategory(channel.name) === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container">
            <Navbar />

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Live TV Channels
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Watch your favorite TV channels live. Choose from a wide variety of sports, news, and entertainment channels.
                </p>
            </div>

            {/* Top Ad */}
            <div id="ua-placement-1"></div>

            {/* Search and Filter */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="search-bar" style={{ position: 'relative' }}>
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search channels..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="category-filters" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`glass-button ${selectedCategory === cat ? 'active' : ''}`}
                                style={{
                                    whiteSpace: 'nowrap',
                                    borderColor: selectedCategory === cat ? 'var(--accent-color)' : 'var(--glass-border)',
                                    background: selectedCategory === cat ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Channel Player */}
            {activeChannel && (
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', scrollMarginTop: '100px' }} id="player-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>{activeChannel.name}</h3>
                        <button
                            className="glass-button"
                            onClick={() => setActiveChannel(null)}
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                        >
                            Close Player
                        </button>
                    </div>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'black', borderRadius: '12px', overflow: 'hidden' }}>
                        <iframe
                            src={activeChannel.url}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; encrypted-media"
                            sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-popups allow-popups-to-escape-sandbox"
                            title={activeChannel.name}
                        ></iframe>
                    </div>
                    {/* Ad Below Player */}
                    <div id="ua-placement-2"></div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center" style={{ height: '300px' }}>
                    <Loader2 className="loading-spinner" size={48} color="#3b82f6" />
                </div>
            ) : (
                <div className="event-grid">
                    {filteredChannels.map((channel, idx) => (
                        <div
                            key={idx}
                            className="glass-panel event-card"
                            onClick={() => {
                                setActiveChannel(channel);
                                document.getElementById('player-section')?.scrollIntoView({ behavior: 'smooth' });
                                window.scrollTo({ top: 0, behavior: 'smooth' }); // Fallback if player not yet rendered
                            }}
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        >
                            <div style={{
                                height: '120px',
                                background: 'rgba(0,0,0,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <Tv size={48} color="var(--text-secondary)" style={{ opacity: 0.5 }} />
                                <div className="play-overlay">
                                    <Play size={32} fill="white" />
                                </div>
                            </div>
                            <div className="event-info">
                                <span className="league-tag" style={{ fontSize: '0.7rem' }}>{getCategory(channel.name)}</span>
                                <h3 className="event-title" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>{channel.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Ad */}
            <div style={{ marginTop: '2rem' }}>
                <div id="ua-placement-3"></div>
            </div>
        </div>
    );
};

export default TVChannels;
