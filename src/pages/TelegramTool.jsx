import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import ServerSelector from '../components/ServerSelector';
import Navbar from '../components/Navbar';
import { Copy, Check } from 'lucide-react';

const TelegramTool = () => {
    const [server, setServer] = useState('server1');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState(new Set());

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchEvents(server);

                if (!data || !Array.isArray(data)) {
                    throw new Error('Invalid data received from server');
                }

                // Filter for today's events
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                const todaysEvents = data.filter(e => {
                    if (!e.startTime) return false;
                    const eventDate = e.startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                    return eventDate === today;
                });

                setEvents(todaysEvents);
                // Select all by default
                setSelectedEvents(new Set(todaysEvents.map(e => e.id)));
            } catch (err) {
                console.error("Error loading events:", err);
                setError("Failed to load events. Please try another server.");
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, [server]);

    const toggleEvent = (id) => {
        const newSelected = new Set(selectedEvents);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedEvents(newSelected);
    };

    const selectAll = () => {
        setSelectedEvents(new Set(events.map(e => e.id)));
    };

    const deselectAll = () => {
        setSelectedEvents(new Set());
    };

    const generateTelegramText = () => {
        const header = `🔥 **TODAY'S MATCHES** 🔥\n\n`;
        const eventList = events
            .filter(e => selectedEvents.has(e.id))
            .map(e => {
                const time = e.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const link = `${window.location.origin}/match/${e.id}`;
                return `⚽ **${e.title}**\n🏆 ${e.league}\n⏰ ${time}\n📺 Watch: ${link}\n`;
            }).join('\n');
        const footer = `\n📢 Join us: https://t.me/+brOxYHl33qljZTQ1`;

        if (selectedEvents.size === 0) {
            return "Please select at least one event.";
        }

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
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Generate a list of today's matches formatted for Telegram.</p>

            <div style={{ marginBottom: '2rem' }}>
                <ServerSelector selectedServer={server} onSelect={setServer} />
            </div>

            {loading ? (
                <p>Loading events...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Select Events ({selectedEvents.size})</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={selectAll}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    All
                                </button>
                                <button
                                    onClick={deselectAll}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    None
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {events.map(event => (
                                <div
                                    key={event.id}
                                    onClick={() => toggleEvent(event.id)}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        background: selectedEvents.has(event.id) ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                        border: `1px solid ${selectedEvents.has(event.id) ? 'var(--accent-color)' : 'transparent'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '4px',
                                            border: '2px solid var(--text-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: selectedEvents.has(event.id) ? 'var(--accent-color)' : 'transparent',
                                            borderColor: selectedEvents.has(event.id) ? 'var(--accent-color)' : 'var(--text-secondary)'
                                        }}>
                                            {selectedEvents.has(event.id) && <Check size={12} color="white" />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{event.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {event.league} • {event.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Preview</h3>
                            <button className="glass-button gap-2" onClick={handleCopy} disabled={selectedEvents.size === 0}>
                                {copied ? <Check size={18} color="#4ade80" /> : <Copy size={18} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>

                        <textarea
                            readOnly
                            value={generateTelegramText()}
                            style={{
                                width: '100%',
                                height: '500px',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                padding: '1rem',
                                fontFamily: 'monospace',
                                resize: 'none'
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TelegramTool;
