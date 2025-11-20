import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import ServerSelector from '../components/ServerSelector';
import CategoryFilter from '../components/CategoryFilter';
import EventCard from '../components/EventCard';
import AdUnit from '../components/AdUnit';
import { Loader2 } from 'lucide-react';

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
    }, [server]);

    const categories = ['All', ...new Set(events.map(e => e.league))];

    const filteredEvents = category === 'All'
        ? events
        : events.filter(e => e.league === category);

    return (
        <div className="container">
            <header className="app-header text-center">
                <h1 className="app-title">Velcuri.io</h1>
                <p>ROJADIRECTA TV - Ver fútbol en vivo gratis por internet</p>
            </header>

            {/* Top Ad - First1 */}
            <AdUnit slot="3242297546" />

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
                    <div className="event-grid">
                        {filteredEvents.map((event, index) => (
                            <React.Fragment key={event.id}>
                                <EventCard event={event} />
                                {/* Insert Ad every 6 items */}
                                {(index + 1) % 6 === 0 && (
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <AdUnit slot="3714292026" /> {/* 2nd Ads */}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}

                        {filteredEvents.length === 0 && (
                            <div className="text-center" style={{ gridColumn: '1 / -1', padding: '3rem', color: 'var(--text-secondary)' }}>
                                No events found for this category.
                            </div>
                        )}
                    </div>

                    {/* Bottom Ad - Autorelaxed */}
                    <div style={{ marginTop: '2rem' }}>
                        <AdUnit slot="2266605680" format="autorelaxed" />
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
