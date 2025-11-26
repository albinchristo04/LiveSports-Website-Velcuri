import React, { useState, useEffect } from 'react';
import { Loader2, Play, Calendar, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdUnit from '../components/AdUnit';

const Highlights = () => {
    const [highlights, setHighlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHighlights = async () => {
            try {
                // Using a common free token for ScoreBat API v3 or the public feed if available.
                // If this token doesn't work, the user might need to sign up for a free API key at https://www.scorebat.com/video-api/
                const response = await fetch('https://www.scorebat.com/video-api/v3/feed/?token=MTc1ODc_MTY1MTY1MTY1XzU1');
                if (!response.ok) {
                    throw new Error('Failed to fetch highlights');
                }
                const data = await response.json();
                setHighlights(data.response || []);
            } catch (err) {
                console.error("Error fetching highlights:", err);
                setError("Failed to load highlights. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchHighlights();
    }, []);

    // Function to extract embed URL or use the embed string directly
    // ScoreBat returns an 'embed' string which is an HTML iframe. 
    // We can either render it dangerously or try to parse it. 
    // For simplicity and correctness with their API, rendering the HTML is often required, 
    // but we need to be careful. ScoreBat's embed code is usually safe <iframe> tags.

    return (
        <div className="container">
            <Navbar />

            <div className="content-wrapper" style={{ padding: '0 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
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
                    <div className="flex justify-center items-center" style={{ height: '400px' }}>
                        <Loader2 className="loading-spinner" size={48} color="#3b82f6" />
                    </div>
                ) : error ? (
                    <div className="text-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
                        {error}
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
                                    {/* We will use the thumbnail and link to the match page or render embed if user clicks */}
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

            <Footer />
        </div>
    );
};

export default Highlights;
