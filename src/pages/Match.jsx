import React, { useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { ArrowLeft, Share2, AlertTriangle, RefreshCw } from 'lucide-react';

const Match = () => {
    const { state } = useLocation();
    const { id } = useParams();
    const event = state?.event;
    const [activeStream, setActiveStream] = useState(event?.streams[0]);

    if (!event) {
        return (
            <div className="container flex flex-col items-center justify-center" style={{ minHeight: '80vh' }}>
                <h2>Event not found</h2>
                <Link to="/" style={{ color: 'var(--accent-color)' }}>Go back home</Link>
            </div>
        );
    }

    return (
        <div className="container">
            <Link to="/" className="back-link">
                <ArrowLeft size={20} />
                Back to Events
            </Link>

            <div className="match-layout">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Player Section */}
                    <div className="glass-panel player-wrapper">
                        {activeStream ? (
                            <VideoPlayer src={activeStream.url} headers={activeStream.headers} />
                        ) : (
                            <div style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black', borderRadius: '12px' }}>
                                <p>No stream available</p>
                            </div>
                        )}
                    </div>

                    {/* Match Info */}
                    <div className="glass-panel match-header">
                        <div className="match-title-row">
                            <div>
                                <span className="league-tag">{event.league}</span>
                                <h1 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>{event.title}</h1>
                            </div>
                            {event.isLive && (
                                <span className="live-badge" style={{ position: 'static' }}>LIVE</span>
                            )}
                        </div>

                        <div className="action-buttons">
                            <button className="glass-button gap-2">
                                <Share2 size={18} />
                                Share
                            </button>
                            <button className="glass-button gap-2" onClick={() => window.location.reload()}>
                                <RefreshCw size={18} />
                                Refresh
                            </button>
                            <button className="glass-button gap-2" style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}>
                                <AlertTriangle size={18} />
                                Report Issue
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Stream List */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3>Available Streams</h3>
                        <div className="stream-list">
                            {event.streams.map((stream, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveStream(stream)}
                                    className={`stream-btn ${activeStream === stream ? 'active' : ''}`}
                                >
                                    <div style={{ fontWeight: 500 }}>{stream.name || `Stream ${idx + 1}`}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>Server {idx + 1} • 1080p</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Related Matches Placeholder */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3>Related Matches</h3>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            No related matches found at this time.
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Match;
