import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { ArrowLeft, Share2, AlertTriangle, RefreshCw, Loader2, MonitorPlay } from 'lucide-react';
import { getEventById, getRelatedEvents } from '../services/api';
import AdUnit from '../components/AdUnit';
import EventCard from '../components/EventCard';
import SEO from '../components/SEO';
import CountdownTimer from '../components/CountdownTimer';
import ShareButtons from '../components/ShareButtons';
import NewsSection from '../components/NewsSection';
import MatchStats from '../components/MatchStats';
import Navbar from '../components/Navbar';

const Match = () => {
    const { state } = useLocation();
    const { id } = useParams();
    const [event, setEvent] = useState(state?.event || null);
    const [activeStream, setActiveStream] = useState(state?.event?.streams[0] || null);
    const [loading, setLoading] = useState(!state?.event);
    const [relatedEvents, setRelatedEvents] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            let currentEvent = event;

            if (!currentEvent && id) {
                setLoading(true);
                currentEvent = await getEventById(id);
                if (currentEvent) {
                    setEvent(currentEvent);
                    setActiveStream(currentEvent.streams[0]);
                }
                setLoading(false);
            }

            if (currentEvent) {
                const related = await getRelatedEvents(currentEvent.id, currentEvent.league);
                setRelatedEvents(related);
            }
        };

        loadData();
    }, [id, event]);

    if (loading) {
        return (
            <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
                <Loader2 className="loading-spinner" size={48} color="#3b82f6" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container flex flex-col items-center justify-center" style={{ minHeight: '80vh' }}>
                <h2>Event not found</h2>
                <Link to="/" style={{ color: 'var(--accent-color)' }}>Go back home</Link>
            </div>
        );
    }

    const isUpcoming = new Date() < event.startTime;

    return (
        <div className="container">
            {/* SEO & Schema */}
            <SEO
                title={`${event.title} - Live Stream | ROJADIRECTA`}
                description={`Watch ${event.title} live stream online for free. ${event.league} match coverage.`}
                schema={{
                    "@context": "https://schema.org",
                    "@type": "BroadcastEvent",
                    "name": event.title,
                    "startDate": event.startTime.toISOString(),
                    "location": {
                        "@type": "Place",
                        "name": "Online"
                    },
                    "description": `Live coverage of ${event.title} in ${event.league}`,
                    "broadcastOfEvent": {
                        "@type": "SportsEvent",
                        "name": event.title,
                        "competitor": [
                            {
                                "@type": "SportsTeam",
                                "name": event.title.split(' vs ')[0] || "Team A"
                            },
                            {
                                "@type": "SportsTeam",
                                "name": event.title.split(' vs ')[1] || "Team B"
                            }
                        ]
                    }
                }}
            />

            {/* Site Header */}
            <Navbar />

            {/* Top Ad - Placement 1 */}
            <AdUnit placementId="1" />

            <Link to="/" className="back-link">
                <ArrowLeft size={20} />
                Back to Events
            </Link>

            {/* Match Header */}
            <div className="glass-panel match-header" style={{ marginBottom: '1.5rem' }}>
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
                    <button className="glass-button gap-2" onClick={() => window.location.reload()}>
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                    <button className="glass-button gap-2" style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}>
                        <AlertTriangle size={18} />
                        Report Issue
                    </button>
                </div>

                {/* Social Share Buttons */}
                <ShareButtons title={event.title} />
            </div>

            {/* Countdown Timer (if upcoming) */}
            {isUpcoming && (
                <CountdownTimer targetDate={event.startTime} />
            )}

            {/* Available Streams */}
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Select Server</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {event.streams.map((stream, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveStream(stream)}
                            className={`glass-button gap-2 ${activeStream === stream ? 'active' : ''}`}
                            style={{
                                borderColor: activeStream === stream ? 'var(--accent-color)' : 'var(--glass-border)',
                                background: activeStream === stream ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            <MonitorPlay size={18} />
                            <div style={{ fontWeight: 500 }}>{stream.name || `Server ${idx + 1}`}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Pre-Player Ad - Placement 2 */}
            <div style={{ marginBottom: '1.5rem' }}>
                <AdUnit placementId="2" style={{ minHeight: '300px' }} />
            </div>

            <div className="match-layout">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                    {/* Ads Above Player - Placement 3 */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <AdUnit placementId="3" />
                    </div>

                    {/* Discord Button */}
                    <a
                        href="https://discord.gg/5QgbhJV4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-button"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: '#5865F2',
                            color: 'white',
                            border: 'none',
                            marginBottom: '1rem',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(88, 101, 242, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.317 4.36981C18.798 3.66981 17.168 3.16981 15.447 3.04981C15.417 3.04981 15.387 3.06981 15.367 3.09981C15.157 3.47981 14.927 3.99981 14.767 4.37981C12.947 4.10981 11.137 4.10981 9.33696 4.37981C9.17696 3.99981 8.93696 3.47981 8.72696 3.09981C8.70696 3.06981 8.67696 3.04981 8.64696 3.04981C6.92696 3.16981 5.29696 3.66981 3.77696 4.36981C3.76696 4.37981 3.75696 4.38981 3.74696 4.39981C0.666963 9.02981 -0.183037 13.5498 0.226963 18.0198C0.226963 18.0498 0.246963 18.0798 0.266963 18.0998C2.27696 19.5798 4.21696 20.4798 6.12696 21.0698C6.15696 21.0798 6.18696 21.0698 6.20696 21.0498C6.65696 20.4398 7.05696 19.7998 7.39696 19.1298C7.42696 19.0698 7.39696 18.9998 7.32696 18.9798C6.68696 18.7398 6.07696 18.4598 5.48696 18.1398C5.43696 18.1098 5.42696 18.0398 5.47696 17.9998C5.60696 17.9098 5.73696 17.8098 5.85696 17.7098C5.87696 17.6898 5.90696 17.6898 5.93696 17.6898C9.84696 19.4898 14.267 19.4898 18.147 17.6898C18.177 17.6898 18.207 17.6898 18.227 17.7098C18.357 17.8098 18.477 17.9098 18.607 17.9998C18.657 18.0398 18.647 18.1098 18.597 18.1398C18.007 18.4598 17.397 18.7398 16.757 18.9798C16.687 18.9998 16.657 19.0698 16.687 19.1298C17.027 19.7998 17.427 20.4398 17.877 21.0498C17.897 21.0698 17.927 21.0798 17.957 21.0698C19.877 20.4798 21.817 19.5798 23.817 18.0998C23.837 18.0798 23.857 18.0498 23.857 18.0198C24.367 12.7598 23.027 8.28981 20.337 4.39981C20.327 4.38981 20.317 4.37981 20.317 4.36981ZM8.01696 15.3298C6.83696 15.3298 5.87696 14.2498 5.87696 12.9298C5.87696 11.6098 6.81696 10.5298 8.01696 10.5298C9.22696 10.5298 10.187 11.6198 10.167 12.9298C10.167 14.2498 9.21696 15.3298 8.01696 15.3298ZM16.067 15.3298C14.887 15.3298 13.927 14.2498 13.927 12.9298C13.927 11.6098 14.867 10.5298 16.067 10.5298C17.277 10.5298 18.237 11.6198 18.217 12.9298C18.217 14.2498 17.267 15.3298 16.067 15.3298Z" fill="white" />
                        </svg>
                        Join Discord for Match Alerts
                    </a>

                    {/* Player Section */}
                    <div className="glass-panel player-wrapper">
                        {activeStream ? (
                            activeStream.type === 'iframe' ? (
                                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'black', borderRadius: '12px', overflow: 'hidden' }}>
                                    <iframe
                                        src={activeStream.url}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        allowFullScreen
                                        allow="autoplay; encrypted-media"
                                        sandbox={`allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation ${activeStream.name === 'Server 3' ? 'allow-popups allow-popups-to-escape-sandbox' : ''}`}
                                        title="Live Stream"
                                    ></iframe>
                                </div>
                            ) : (
                                <VideoPlayer src={activeStream.url} headers={activeStream.headers} />
                            )
                        ) : (
                            <div style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black', borderRadius: '12px' }}>
                                <p>No stream available</p>
                            </div>
                        )}
                    </div>

                    {/* Ad Below Player - Placement 4 */}
                    <AdUnit placementId="4" style={{ minHeight: '300px' }} />

                </div>
            </div>

            {/* Match Stats */}
            <MatchStats query={event.title} />

            {/* Related Matches */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                <h3>Related Matches</h3>
                {relatedEvents.length > 0 ? (
                    <div className="event-grid" style={{ marginTop: '1rem' }}>
                        {relatedEvents.map(related => (
                            <EventCard key={related.id} event={related} />
                        ))}
                    </div>
                ) : (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        No related matches found at this time.
                    </div>
                )}
            </div>

            {/* Related News */}
            <NewsSection query={event.title} />

            {/* Anchor AD */}
            <AdUnit type="anchor" />
        </div>
    );
};

export default Match;
