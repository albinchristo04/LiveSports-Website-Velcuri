import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import ServerSelector from '../components/ServerSelector';
import CategoryFilter from '../components/CategoryFilter';
import EventCard from '../components/EventCard';
import AdUnit from '../components/AdUnit';
import { Loader2 } from 'lucide-react';
import AdUnit from '../components/AdUnit';
import Navbar from '../components/Navbar';

const Home = () => {
    const [server, setServer] = useState('server1');
    const [events, setEvents] = useState([]);
    selectedCategory = { category }
    onSelect = { setCategory }
        />
            )}

{
    loading ? (
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
    )
}
        </div >
    );
};

export default Home;
