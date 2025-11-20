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
            <header className="app-header text-center" style={{ marginBottom: '1.5rem' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h1 className="app-title">Velcuri.io</h1>
                </Link>
            </header>

            {/* Top Ad - First1 */}
            <AdUnit slot="3242297546" />

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

            <div className="match-layout">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
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
                                        sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
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

                    {/* Ad Below Player - 300x280 (Responsive) */}
                    <AdUnit slot="8693123672" style={{ display: 'inline-block', width: '100%', minHeight: '280px' }} />

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

                {/* Bottom Ad - 2nd Ads */}
                <AdUnit slot="3714292026" />
            </div>

            {/* Related News */}
            <NewsSection query={event.title} />
        </div>
    );
};

export default Match;
