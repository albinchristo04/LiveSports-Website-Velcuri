import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import { Copy, Check } from 'lucide-react';

const TelegramTool = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            const data = await fetchEvents('server1'); // Fetch from main server

            // Filter for today's events
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            const todaysEvents = data.filter(e => {
                const eventDate = e.startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                return eventDate === today;
            });

            setEvents(todaysEvents);
            setLoading(false);
        };
        loadEvents();
    }, []);

    const generateTelegramText = () => {
        const header = `🔥 **TODAY'S MATCHES** 🔥\n\n`;
        const eventList = events.map(e => {
            const time = e.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const link = `${window.location.origin}/match/${e.id}`;
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
            <h1>Telegram Post Generator</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Generate a list of today's matches formatted for Telegram.</p>

            {loading ? (
                <p>Loading events...</p>
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
