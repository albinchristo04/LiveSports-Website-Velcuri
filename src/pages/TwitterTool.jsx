import React, { useState, useEffect, useRef } from 'react';
import { fetchEvents } from '../services/api';
import ServerSelector from '../components/ServerSelector';
import Navbar from '../components/Navbar';
import { Twitter, RefreshCw, Copy, Check, Loader2, Download, Image as ImageIcon } from 'lucide-react';

const TwitterTool = () => {
    const [server, setServer] = useState('server1');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [trendingKeywords, setTrendingKeywords] = useState({});
    const [loadingKeywords, setLoadingKeywords] = useState({});
    const canvasRef = useRef(null);

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

        // Format Date: January 3, 2023
        const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = event.startTime.toLocaleDateString('en-US', dateOptions);

        // Format Time: 7:45 PM, UK
        // Assuming event.startTime is already a Date object in local time, we convert to UK time string
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Europe/London' };
        const formattedTime = event.startTime.toLocaleTimeString('en-US', timeOptions);

        return `${event.title} live stream, TV channel, Start time and how to watch online.\n\nMatch details⤵️\n\n🆚 ${event.title}\n🗓️ ${formattedDate}\n⏰ ${formattedTime}, UK\n🏆 ${event.league}\n\n📺 Watch Here ➡️ ${link}\n\n${hashtags}`;
    };

    const downloadImage = (event) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = 1200;
        canvas.height = 675;

        // Background
        const gradient = ctx.createLinearGradient(0, 0, 1200, 675);
        gradient.addColorStop(0, '#1e293b');
        gradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 675);

        // Decorative elements
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.arc(1000, 100, 300, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(200, 600, 200, 0, Math.PI * 2);
        ctx.fill();

        // Text Styles
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';

        // League
        ctx.font = 'bold 40px Inter, sans-serif';
        ctx.fillStyle = '#3b82f6'; // Accent color
        ctx.fillText(event.league.toUpperCase(), 600, 150);

        // VS
        ctx.font = 'bold 80px Inter, sans-serif';
        ctx.fillStyle = '#ffffff';
        const teams = event.title.split(' vs ');
        if (teams.length === 2) {
            ctx.fillText(teams[0], 600, 280);
            ctx.font = 'italic 40px Inter, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('VS', 600, 340);
            ctx.font = 'bold 80px Inter, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(teams[1], 600, 420);
        } else {
            ctx.fillText(event.title, 600, 337);
        }

        // Date & Time
        const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Europe/London' };
        const dateStr = event.startTime.toLocaleDateString('en-US', dateOptions);
        const timeStr = event.startTime.toLocaleTimeString('en-US', timeOptions) + ' UK';

        ctx.font = '500 36px Inter, sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(`${dateStr} • ${timeStr}`, 600, 550);

        // Footer / Domain
        ctx.font = 'bold 30px Inter, sans-serif';
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('v1.velcuri.io', 600, 620);

        // Download
        const link = document.createElement('a');
        link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_match_card.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
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

            {/* Hidden Canvas for Image Generation */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

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

                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button
                                    className="glass-button"
                                    onClick={() => downloadImage(event)}
                                    title="Download Match Card"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <ImageIcon size={18} />
                                    <span className="hidden-mobile">Image</span>
                                </button>
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
