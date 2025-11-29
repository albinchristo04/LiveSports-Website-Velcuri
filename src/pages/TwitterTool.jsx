import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import ServerSelector from '../components/ServerSelector';
import Navbar from '../components/Navbar';
import { Twitter, RefreshCw, Copy, Check, Loader2 } from 'lucide-react';

const TwitterTool = () => {
    const [server, setServer] = useState('server1');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [trendingKeywords, setTrendingKeywords] = useState({});
    const [loadingKeywords, setLoadingKeywords] = useState({});

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            try {
                const data = await fetchEvents(server);
                // Filter for selected date
                const selected = new Date(selectedDate);
                const selectedDateStr = selected.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

                const dateEvents = data.filter(e => {
                    if (!e.startTime) return false;
                    const eventDate = e.startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                    return eventDate === selectedDateStr;
                });

                setEvents(dateEvents);
            } catch (err) {
                console.error("Error loading events:", err);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, [server, selectedDate]);

    const fetchTrendingKeywords = async (event) => {
        if (trendingKeywords[event.id]) return; // Already fetched

        setLoadingKeywords(prev => ({ ...prev, [event.id]: true }));
        try {
            const query = `${event.title} ${event.league}`;
            const encodedQuery = encodeURIComponent(query);
            // Use allorigins to bypass CORS for Google News RSS
            const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`;
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;

            const response = await fetch(proxyUrl);
            const data = await response.json();

            if (data.contents) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.contents, "text/xml");
                const items = xmlDoc.querySelectorAll("item title");

                // Extract unique words from titles
                const words = new Set();
                items.forEach(item => {
                    const title = item.textContent;
                    // Simple extraction: split by space, remove common words/chars
                    title.split(/\s+/).forEach(word => {
                        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
                        if (cleanWord.length > 4 && !['video', 'watch', 'live', 'stream', 'highlight', 'goal'].includes(cleanWord.toLowerCase())) {
                            words.add(`#${cleanWord}`);
                        }
                    });
                });

                // Take top 5 random keywords to avoid spamming too much
                const keywords = Array.from(words).slice(0, 5).join(' ');
                setTrendingKeywords(prev => ({ ...prev, [event.id]: keywords }));
            }
        } catch (err) {
            console.error("Error fetching keywords:", err);
        } finally {
            setLoadingKeywords(prev => ({ ...prev, [event.id]: false }));
        }
    };

    const generateHashtags = (event) => {
        const cleanName = (name) => name.replace(/[^a-zA-Z0-9]/g, '');
        const teams = event.title.split(' vs ');

        let hashtags = [];

        // Team Hashtags
        if (teams.length === 2) {
            hashtags.push(`#${cleanName(teams[0])}`);
            hashtags.push(`#${cleanName(teams[1])}`);
            hashtags.push(`#${cleanName(teams[0])}vs${cleanName(teams[1])}`);
        } else {
            hashtags.push(`#${cleanName(event.title)}`);
        }

        // League Hashtag
        if (event.league) {
            const leagueTag = cleanName(event.league);
            hashtags.push(`#${leagueTag}`);

            // Specific overrides for popular leagues
            if (event.league.toLowerCase().includes('champions league')) hashtags.push('#UCL');
            if (event.league.toLowerCase().includes('premier league')) hashtags.push('#PL');
            if (event.league.toLowerCase().includes('nba')) hashtags.push('#NBA');
        }

        // Generic Trending Tags
        hashtags.push('#LiveMatch');
        hashtags.push('#LiveStream');
        hashtags.push('#Football');

        // Add dynamically fetched keywords
        if (trendingKeywords[event.id]) {
            hashtags.push(trendingKeywords[event.id]);
        }

        return hashtags.join(' ');
    };

    const generateTweet = (event) => {
        const link = `${window.location.origin}/match/${event.id}`;
        const hashtags = generateHashtags(event);

        return `🚨 LIVE NOW: ${event.title} \n\n🏆 ${event.league}\n📺 Watch Here ➡️ ${link}\n\n${hashtags}`;
    };

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1000px' }}>
            <Navbar />

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Twitter Promotion Tool
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Generate viral tweets for upcoming matches with one click.
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px'
                        }}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <ServerSelector selectedServer={server} onSelect={setServer} />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading events...</div>
            ) : events.length === 0 ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No events found for this date.
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {events.map(event => (
                        <div key={event.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '600', marginBottom: '0.25rem' }}>
                                    {event.league}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{event.title}</h3>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {!trendingKeywords[event.id] && !loadingKeywords[event.id] && (
                                    <button
                                        onClick={() => fetchTrendingKeywords(event)}
                                        style={{
                                            marginTop: '0.5rem',
                                            fontSize: '0.8rem',
                                            color: 'var(--accent-color)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Fetch Trending Tags
                                    </button>
                                )}
                                {loadingKeywords[event.id] && (
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Loader2 size={12} className="loading-spinner" /> Fetching tags...
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className="glass-button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(generateTweet(event));
                                    }}
                                    title="Copy Tweet Text"
                                >
                                    <Copy size={18} />
                                </button>
                                <a
                                    className="glass-button"
                                    style={{
                                        background: '#1DA1F2',
                                        borderColor: '#1DA1F2',
                                        color: 'white',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(generateTweet(event))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Twitter size={18} style={{ marginRight: '0.5rem' }} />
                                    Tweet Now
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TwitterTool;
