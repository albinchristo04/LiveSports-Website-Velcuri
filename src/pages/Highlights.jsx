import React, { useState, useEffect } from 'react';
import { Loader2, Play, Calendar, ExternalLink, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import AdUnit from '../components/AdUnit';
import SEO from '../components/SEO';

const Highlights = () => {
    const [highlights, setHighlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHighlights = async () => {
        setLoading(true);
        setError(null);
        try {
            // Using the user-provided token
            const token = 'MjU2NTIyXzE3NjQxNjk4MjdfMWY4NWQ5MWM4NjFhOTFjNGI0NmEyNjQ2MDg3ZjIxOWFhZTBkMzAxYw==';
            const response = await fetch(`https://www.scorebat.com/video-api/v3/feed/?token=${token}`);

            if (!response.ok) {
                // Fallback to free-feed if the main feed fails
                console.warn("Main feed failed, trying free feed...");
                const freeResponse = await fetch(`https://www.scorebat.com/video-api/v3/free-feed/?token=${token}`);
                if (!freeResponse.ok) {
                    throw new Error(`API Error: ${freeResponse.status}`);
                }
                const data = await freeResponse.json();
                setHighlights(data.response || []);
                return;
            }

            const data = await response.json();
            setHighlights(data.response || []);
        } catch (err) {
            console.error("Error fetching highlights:", err);
            setError(
                <div style={{ textAlign: 'center' }}>
                    <p>Failed to load highlights.</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Please check your internet connection or try again later.
                    </p>
                </div>
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHighlights();
    }, []);

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <SEO
                title="Football Highlights - Latest Goals & Match Replays | ROJADIRECTA"
                description="Watch the latest football highlights, goals, and match replays from top leagues including Premier League, La Liga, and Champions League."
            />
            <Navbar />

            <div className="content-wrapper" style={{ padding: '0 1.5rem', maxWidth: '1200px', margin: '0 auto', flex: 1, width: '100%' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(to right, #3b82f6, #10b981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Football Highlights
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Latest goals and match highlights from around the world
                    </p>
                </div>

                <AdUnit placementId="highlights-top" />

                {loading ? (
                    <div className="flex justify-center items-center" style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Loader2 className="loading-spinner" size={48} color="#3b82f6" />
                    </div>
                ) : error ? (
                    <div className="text-center" style={{ padding: '3rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        {error}
                        <button
                            onClick={fetchHighlights}
                            className="glass-button"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                        >
                            <RefreshCw size={16} /> Retry
                        </button>
                    </div>
                ) : highlights.length === 0 ? (
                    <div className="text-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
                        <p>No highlights found at the moment.</p>
                        <button
                            onClick={fetchHighlights}
                            className="glass-button"
                            style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                        >
                            <RefreshCw size={16} /> Refresh
                        </button>
                    </div>
                ) : (
                    <div className="highlights-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginTop: '2rem'
                    }}>
                        {highlights.map((item, index) => (
                            <div key={index} className="highlight-card glass-panel" style={{
                                overflow: 'hidden',
                                borderRadius: '12px',
                                transition: 'transform 0.2s ease',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div className="video-container" style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            opacity: 0.8
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        background: 'rgba(0,0,0,0.6)',
                                        borderRadius: '50%',
                                        padding: '1rem',
                                        cursor: 'pointer'
                                    }} onClick={() => window.open(item.matchviewUrl, '_blank')}>
                                        <Play size={32} fill="white" color="white" />
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--accent-color)',
                                        fontWeight: '600',
                                        marginBottom: '0.5rem',
                                        textTransform: 'uppercase'
                                    }}>
                                        {item.competition}
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        marginBottom: '1rem',
                                        lineHeight: '1.4'
                                    }}>
                                        {item.title}
                                    </h3>

                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Calendar size={14} />
                                            <span>{new Date(item.date).toLocaleDateString()}</span>
                                        </div>
                                        <a
                                            href={item.matchviewUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                color: 'var(--text-primary)',
                                                textDecoration: 'none',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Watch <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: '3rem' }}>
                    <AdUnit placementId="highlights-bottom" />
                </div>
            </div>
        </div>
    );
};

export default Highlights;
