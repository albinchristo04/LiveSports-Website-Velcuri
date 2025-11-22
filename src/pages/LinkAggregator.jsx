import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import { groupEvents } from '../utils/matchingUtils';
import Navbar from '../components/Navbar';
import { Copy, Check, Loader2, Link as LinkIcon } from 'lucide-react';

const LinkAggregator = () => {
    const [groupedEvents, setGroupedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loadAllEvents = async () => {
            setLoading(true);
            try {
                const [data1, data2, data3] = await Promise.all([
                    fetchEvents('server1'),
                    fetchEvents('server2'),
                    fetchEvents('server3')
                ]);

                // Filter for today's events (optional, but good for relevance)
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                const filterToday = (events) => events.filter(e => {
                    if (!e.startTime) return false;
                    return e.startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) === today;
                });

                const groups = groupEvents(filterToday(data1), filterToday(data2), filterToday(data3));
                setGroupedEvents(groups);
            } catch (err) {
                console.error("Error aggregating events:", err);
            } finally {
                setLoading(false);
            }
        };
        loadAllEvents();
    }, []);

    const generateTelegramText = () => {
        const header = `🔥 **TODAY'S MATCHES (ALL LINKS)** 🔥\n\n`;
        const eventList = groupedEvents.map(group => {
            const time = new Date(group.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            // Generate links for each stream in the group
            // Since we can't deep link to specific streams easily without a complex ID system, 
            // we'll just link to the match page of the FIRST ID in the group, 
            // OR ideally, we'd have a way to show all links.
            // For now, let's just list the main match link.
            // Wait, the user wants "combine all three servers links".
            // If I link to /match/:id, that page only plays ONE stream.
            // So I should probably list the links directly if they are external, OR
            // create a "Hub" page for the match?
            // For simplicity, I'll list the match page for the FIRST ID, and maybe mention "Multiple Sources Available".

            // Actually, the user might want the raw links? No, they probably want the website links.
            // Let's generate a link for EACH source found.

            const links = group.ids.map(id => {
                let serverName = 'Server 1';
                if (id.startsWith('s2')) serverName = 'Server 2';
                if (id.startsWith('s3')) serverName = 'Server 3';
                return `📺 ${serverName}: ${window.location.origin}/match/${id}`;
            }).join('\n');

            return `⚽ **${group.title}**\n🏆 ${group.league}\n⏰ ${time}\n${links}\n`;
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
            <h1>Link Aggregator</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Automatically groups events from all servers.
            </p>

            {loading ? (
                <div className="flex justify-center items-center" style={{ height: '300px' }}>
                    <Loader2 className="loading-spinner" size={48} color="#3b82f6" />
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Combined List Preview</h3>
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
                            height: '500px',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            padding: '1rem',
                            fontFamily: 'monospace',
                            resize: 'vertical'
                        }}
                    />

                    <div style={{ marginTop: '2rem' }}>
                        <h3>Grouped Events ({groupedEvents.length})</h3>
                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                            {groupedEvents.map((group, idx) => (
                                <div key={idx} className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong>{group.title}</strong>
                                        <span style={{ color: 'var(--text-secondary)' }}>
                                            {new Date(group.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                        Found in: {group.streams.map(s => s.source).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkAggregator;
