import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import ServerSelector from '../components/ServerSelector';
import CategoryFilter from '../components/CategoryFilter';
import EventCard from '../components/EventCard';
import AdUnit from '../components/AdUnit';
import { Loader2 } from 'lucide-react';
import { reloadAdScript } from '../utils/adUtils';

const Home = () => {
    const [server, setServer] = useState('server1');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            const data = await fetchEvents(server);
            setEvents(data);
            setLoading(false);
        };
        loadEvents();
        reloadAdScript();
    }, [server]);

    const categories = ['All', ...new Set(events.map(e => e.league))];

    const filteredEvents = category === 'All'
        ? events
        : events.filter(e => e.league === category);

    // Group events by date
    const groupedEvents = filteredEvents.reduce((groups, event) => {
        const date = event.startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        if (!groups[date]) groups[date] = [];
        groups[date].push(event);
        return groups;
    }, {});

    return (
        <div className="container">
            <header className="app-header text-center">
                <h1 className="app-title">Velcuri.io</h1>
                <p>ROJADIRECTA TV - Ver fútbol en vivo gratis por internet</p>
            </header>

            {/* Top Ad - First1 */}
            {/* Top Ad - First1 */}
            <div id="ua-placement-1"></div>

            <ServerSelector selectedServer={server} onSelect={setServer} />

            {!loading && events.length > 0 && (
                <CategoryFilter
                    categories={categories.filter(c => c !== 'All')}
                    selectedCategory={category}
                    onSelect={setCategory}
                />
            )}

            {loading ? (
                <div className="flex justify-center items-center" style={{ height: '300px' }}>
                    <Loader2 className="loading-spinner" size={48} color="#3b82f6" />
                </div>
            ) : (
                <>
                    <div className="events-container">
                        {Object.entries(groupedEvents).map(([date, dateEvents], groupIndex) => (
                            <div key={date} style={{ marginBottom: '2rem' }}>
                                <h3 style={{
                                    color: 'var(--text-secondary)',
                                    borderBottom: '1px solid var(--glass-border)',
                                    paddingBottom: '0.5rem',
                                    marginBottom: '1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: '600'
                                }}>
                                    {date === new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) ? 'Today' : date}
                                </h3>
                                <div className="event-grid">
                                    {dateEvents.map((event) => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>

                                {/* Ad interleaved between groups or after specific count */}
                                {(groupIndex + 1) % 2 === 0 && (
                                    <div style={{ marginTop: '2rem' }}>
                                        <div id="ua-placement-3"></div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredEvents.length === 0 && (
                            <div className="text-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
                                No events found for this category.
                            </div>
                        )}
                    </div>

                    {/* Bottom Ad - Autorelaxed */}
                    <div style={{ marginTop: '2rem' }}>
                        <div id="ua-placement-4"></div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
