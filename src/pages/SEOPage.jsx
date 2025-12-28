import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import AdUnit from '../components/AdUnit';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';

const SEOPage = () => {
    const location = useLocation();
    const path = location.pathname.replace(/\//g, '');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            const data = await fetchEvents('server1');
            setEvents(data.slice(0, 12));
            setLoading(false);
        };
        loadEvents();
    }, []);

    // Configuration for different paths
    const config = {
        'velcuri': {
            title: 'Velcuri - Live Sports Streaming & Football TV',
            h1: 'Velcuri: The Best Live Sports Streaming Platform',
            description: 'Velcuri is your #1 destination for live sports streaming. Watch football, basketball, and more for free in HD.',
            content: `Velcuri (velcuri.io) is a leading platform for sports enthusiasts. We provide high-quality links to watch your favorite matches live. Whether it's the Premier League, La Liga, or Champions League, Velcuri has you covered.`
        },
        'velcuri-io': {
            title: 'Velcuri.io - Official Site for Free Sports Streams',
            h1: 'Velcuri.io: Official Free Sports Streaming',
            description: 'Access the official Velcuri.io site for the best free sports streams online. No registration required.',
            content: `Welcome to Velcuri.io, the official home of free sports streaming. Our platform is designed to give you the best viewing experience with minimal ads and maximum stability.`
        },
        'rojadirecta-tv': {
            title: 'RojaDirecta TV - Ver Fútbol En Vivo Gratis',
            h1: 'RojaDirecta TV: Fútbol en Vivo y en Directo',
            description: 'Mira RojaDirecta TV para ver fútbol en vivo gratis. La mejor alternativa para ver LaLiga, Champions League y más.',
            content: `RojaDirecta TV es el sitio líder para ver fútbol online gratis. En Velcuri ofrecemos la mejor experiencia de Roja Directa con enlaces actualizados y calidad HD para todos los partidos de hoy.`
        },
        'pirlotv-futbol-en-vivo': {
            title: 'PirloTV - Fútbol En Vivo Gratis y Directo',
            h1: 'PirloTV: Ver Fútbol Online Gratis',
            description: 'PirloTV transmite fútbol en vivo gratis. Disfruta de los mejores partidos de hoy sin cortes en Pirlo TV.',
            content: `PirloTV es famoso por su estabilidad y variedad de canales. En Velcuri integramos lo mejor de Pirlo TV para que no te pierdas ningún gol de tu equipo favorito.`
        }
    };

    const pageData = config[path] || {
        title: `${path.replace(/-/g, ' ')} | Velcuri`,
        h1: path.replace(/-/g, ' ').toUpperCase(),
        description: `Watch live sports on ${path.replace(/-/g, ' ')} via Velcuri.io. Free HD streams for all matches.`,
        content: `Looking for ${path.replace(/-/g, ' ')}? Velcuri provides the best links and coverage for all sports events. Join us for a premium streaming experience.`
    };

    return (
        <div className="container">
            <SEO
                title={pageData.title}
                description={pageData.description}
            />
            <Navbar />

            <div className="glass-panel" style={{ padding: '2.5rem', margin: '2rem 0' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(to right, #60a5fa, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                }}>
                    {pageData.h1}
                </h1>

                <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '900px', margin: '0 auto' }}>
                    <p>{pageData.content}</p>
                    <p style={{ marginTop: '1rem' }}>
                        En Velcuri nos esforzamos por ofrecer la mejor calidad de transmisión.
                        Nuestros servidores se actualizan cada hora para garantizar que siempre tengas acceso a los partidos en vivo.
                    </p>
                </div>
            </div>

            <AdUnit placementId="1" />

            <div style={{ margin: '3rem 0' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Partidos en Vivo Ahora</h2>
                <div className="event-grid">
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginTop: '3rem' }}>
                <h3>Preguntas Frecuentes (FAQ)</h3>
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>¿Es seguro usar Velcuri para ver fútbol?</h4>
                        <p style={{ color: 'var(--text-secondary)' }}>Sí, Velcuri es una plataforma segura que no requiere descargas ni instalaciones sospechosas. Recomendamos usar un bloqueador de anuncios para una mejor experiencia.</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>¿Puedo ver los partidos en mi móvil?</h4>
                        <p style={{ color: 'var(--text-secondary)' }}>¡Absolutamente! Velcuri está optimizado para dispositivos móviles, tablets y computadoras. Puedes ver fútbol en vivo en cualquier lugar.</p>
                    </div>
                </div>
            </div>

            <AdUnit placementId="4" />
        </div>
    );
};

export default SEOPage;
