import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import { Loader2 } from 'lucide-react';

const Embed = () => {
    const { id, index } = useParams();
    const [stream, setStream] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadStream = async () => {
            try {
                const event = await getEventById(id);
                const streamIndex = parseInt(index);
                if (event && event.streams && event.streams[streamIndex]) {
                    setStream(event.streams[streamIndex]);
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error("Error loading embed:", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadStream();
    }, [id, index]);


    if (loading) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
                color: '#fff'
            }}>
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (error || !stream) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
                color: '#fff'
            }}>
                Stream Not Found
            </div>
        );
    }

    return (
        <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', background: '#000' }}>
            {stream.type === 'iframe' ? (
                <iframe
                    src={stream.url}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                    sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-popups allow-popups-to-escape-sandbox"
                    title="Embed Stream"
                ></iframe>
            ) : (
                <VideoPlayer src={stream.url} headers={stream.headers} />
            )}
        </div>
    );
};

export default Embed;
