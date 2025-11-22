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
import AdUnit from '../components/AdUnit';
import Navbar from '../components/Navbar';


const Match = () => {
    const { state } = useLocation();
    const { id } = useParams();
    const [event, setEvent] = useState(state?.event || null);
    <iframe
        src={activeStream.url}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; encrypted-media"
        sandbox={`allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation ${activeStream.name === 'Server 3' ? 'allow-popups allow-popups-to-escape-sandbox' : ''}`}
        title="Live Stream"
    ></iframe>
                                </div >
                            ) : (
    <VideoPlayer src={activeStream.url} headers={activeStream.headers} />
)
                        ) : (
    <div style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black', borderRadius: '12px' }}>
        <p>No stream available</p>
    </div>
)}
                    </div >

    {/* Ad Below Player - 300x280 (Responsive) */ }
{/* Ad Below Player - 300x280 (Responsive) */ }
<div id="ua-placement-2"></div>

                </div >
            </div >

    {/* Match Stats */ }
    < MatchStats query = { event.title } />



        {/* Related Matches */ }
        < div className = "glass-panel" style = {{ padding: '1.5rem', marginTop: '1.5rem' }}>
            <h3>Related Matches</h3>
{
    relatedEvents.length > 0 ? (
        <div className="event-grid" style={{ marginTop: '1rem' }}>
            {relatedEvents.map(related => (
                <EventCard key={related.id} event={related} />
            ))}
        </div>
    ) : (
    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        No related matches found at this time.
    </div>
)
}


            </div >

    {/* Related News */ }
    < NewsSection query = { event.title } />

        {/* Anchor AD */ }
        < div id = "ua-anchor" ></div >
        </div >
    );
};

export default Match;
