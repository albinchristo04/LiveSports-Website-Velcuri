import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import ServerSelector from '../components/ServerSelector';
import Navbar from '../components/Navbar';
import { Copy, Check } from 'lucide-react';
import { getMatchSlugs } from '../utils/seoUtils';

const TelegramTool = () => {
    const [server, setServer] = useState('server1');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchEvents(server);

                if (!data || !Array.isArray(data)) {
                    throw new Error('Invalid data received from server');
                }

                // Filter for selected date's events
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
                setError("Failed to load events. Please try another server.");
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, [server, selectedDate]);

    const generateTelegramText = () => {
        const dateObj = new Date(selectedDate);
        const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        const header = `🔥 **${dateStr.toUpperCase()} MATCHES** 🔥\n\n`;
        const eventList = events.map(e => {
            const time = e.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const slugs = getMatchSlugs(e);
            const link = `${window.location.origin}/football/${slugs.en}`;
            return `⚽ **${e.title}**\n🏆 ${e.league}\n⏰ ${time}\n📺 Watch: ${link}\n`;
        }).join('\n');
        const footer = `\n📢 Join us: https://t.me/+brOxYHl33qljZTQ1`;

        return header + eventList + footer;
    };

    const handleCopy = () => {
        const text = generateTelegramText();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px' }}>
            <Navbar />
            <h1>Telegram Post Generator</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Generate a list of matches formatted for Telegram.</p>

            <div style={{ marginBottom: '2rem' }}>
                <ServerSelector selectedServer={server} onSelect={setServer} />
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Select Date:
                </label>
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
                        borderRadius: '8px',
                        fontSize: '1rem'
                    }}
                />
            </div>

            {loading ? (
                <p>Loading events...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Preview</h3>
                        <button className="glass-button gap-2" onClick={handleCopy}>
                            {copied ? <Check size={18} color="#4ade80" /> : <Copy size={18} />}
                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                    </div>

                    <textarea
                        readOnly
                        value={generateTelegramText()}
                        style={{
                            width: '100%',
                            height: '400px',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            padding: '1rem',
                            fontFamily: 'monospace',
                            resize: 'vertical'
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default TelegramTool;