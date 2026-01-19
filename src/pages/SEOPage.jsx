import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import AdUnit from '../components/AdUnit';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import { getFreshnessSignal } from '../utils/seoUtils';

const SEOPage = () => {
    const location = useLocation();
    const path = location.pathname.replace(/\//g, '');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [freshness, setFreshness] = useState(getFreshnessSignal());

    useEffect(() => {
        const loadEvents = async () => {
            const data = await fetchEvents('server1');
            setEvents(data.slice(0, 12));
            setLoading(false);
        };
        loadEvents();
    }, []);

    // Bing-Specific Exact Match Hubs
    const bingHubs = {
        'rojadirecta-tv': {
            keyword: 'rojadirecta tv',
            content: `Rojadirecta TV es la plataforma líder para ver fútbol en vivo gratis. En v1.velcuri.io, ofrecemos acceso directo a rojadirecta tv con la mejor calidad HD. Si buscas rojadirecta tv para ver los partidos de hoy, estás en el lugar correcto. Nuestra cobertura de rojadirecta tv incluye LaLiga, Champions League y Premier League sin interrupciones.`
        },
        'rojadirecta-en-vivo': {
            keyword: 'rojadirecta en vivo',
            content: `Ver rojadirecta en vivo es la mejor forma de disfrutar del fútbol online. v1.velcuri.io te trae rojadirecta en vivo con enlaces actualizados cada minuto. Disfruta de rojadirecta en vivo para seguir a tu equipo favorito en directo y con la máxima estabilidad que solo rojadirecta en vivo puede ofrecer.`
        },
        'rojadirecta-tv-en-vivo': {
            keyword: 'rojadirecta tv en vivo',
            content: `La mejor experiencia de rojadirecta tv en vivo la encuentras aquí. Transmitimos rojadirecta tv en vivo para todos los dispositivos móviles y tablets. Con rojadirecta tv en vivo no te perderás ningún gol, ya que rojadirecta tv en vivo es sinónimo de rapidez y calidad en streaming deportivo.`
        },
        'tarjeta-roja-tv': {
            keyword: 'tarjeta roja tv',
            content: `Tarjeta roja tv es la alternativa perfecta para los fanáticos del deporte. En v1.velcuri.io, tarjeta roja tv se actualiza constantemente para ofrecerte los mejores eventos. Mira tarjeta roja tv gratis y sin registro. La programación de tarjeta roja tv incluye fútbol, baloncesto y mucho más en alta definición.`
        },
        'tarjeta-roja-directa': {
            keyword: 'tarjeta roja directa',
            content: `Tarjeta roja directa es el sitio preferido para ver fútbol online. Accede a tarjeta roja directa a través de v1.velcuri.io para una experiencia sin cortes. Tarjeta roja directa te permite ver todos los partidos de la jornada. Con tarjeta roja directa, el fútbol en vivo está a solo un clic de distancia.`
        },
        'tarjeta-roja-futbol-en-vivo': {
            keyword: 'tarjeta roja futbol en vivo',
            content: `Disfruta de tarjeta roja futbol en vivo con la mejor tecnología de streaming. Tarjeta roja futbol en vivo ofrece transmisiones estables para los partidos más importantes. En v1.velcuri.io, tarjeta roja futbol en vivo es nuestra prioridad para que vivas la pasión del deporte rey con tarjeta roja futbol en vivo.`
        },
        'pirlo-tv-futbol-en-vivo-gratis': {
            keyword: 'pirlo tv futbol en vivo gratis',
            content: `Pirlo tv futbol en vivo gratis es la solución ideal para ver deportes sin pagar. v1.velcuri.io integra pirlo tv futbol en vivo gratis para que disfrutes de una amplia variedad de canales. Con pirlo tv futbol en vivo gratis, tienes acceso a la mejor programación deportiva mundial de forma gratuita.`
        }
    };

    const isBingHub = !!bingHubs[path];
    const pageData = isBingHub ? {
        title: `${bingHubs[path].keyword} | v1.velcuri.io`,
        h1: bingHubs[path].keyword,
        description: `Mira ${bingHubs[path].keyword} en vivo y gratis. La mejor calidad HD para ver fútbol online en ${bingHubs[path].keyword} a través de v1.velcuri.io.`,
        content: bingHubs[path].content,
        isSpanish: true
    } : {
        // Fallback for existing hubs
        'velcuri': { title: 'v1.velcuri.io - Live Sports', h1: 'v1.velcuri.io Sports', description: 'Live sports streaming.', content: 'v1.velcuri.io is your home for sports.', isSpanish: false },
        'velcuri-io': { title: 'v1.velcuri.io - Official', h1: 'v1.velcuri.io Official', description: 'Official v1.velcuri.io site.', content: 'Welcome to v1.velcuri.io.', isSpanish: false }
    }[path] || {
        title: `${path.replace(/-/g, ' ')} | v1.velcuri.io`,
        h1: path.replace(/-/g, ' ').toUpperCase(),
        description: `Watch live sports on ${path.replace(/-/g, ' ')} via v1.velcuri.io.`,
        content: `Looking for ${path.replace(/-/g, ' ')}? v1.velcuri.io provides the best links.`,
        isSpanish: false
    };

    return (
        <div className="container">
            <SEO
                title={pageData.title}
                description={pageData.description}
                noCanonical={isBingHub} // Bing prefers separation, no canonical consolidation
            />
            <Navbar />

            <div className="glass-panel" style={{ padding: '2.5rem', margin: '2rem 0' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(to right, #60a5fa, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.5rem',
                    textAlign: 'center',
                    textTransform: isBingHub ? 'lowercase' : 'none'
                }}>
                    {pageData.h1}
                </h1>

                <p style={{ textAlign: 'center', color: 'var(--accent-color)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    {freshness}
                </p>

                <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '900px', margin: '0 auto' }}>
                    <p>{pageData.content}</p>
                    <p style={{ marginTop: '1rem' }}>
                        {pageData.isSpanish ?
                            `En v1.velcuri.io nos esforzamos por ofrecer la mejor calidad de transmisión para ${pageData.h1}. Nuestros servidores se actualizan cada hora para garantizar que siempre tengas acceso a los partidos en vivo de ${pageData.h1}.` :
                            `At v1.velcuri.io, we strive to provide the best streaming quality for ${pageData.h1}. Our servers are updated hourly to ensure you always have access to live matches.`
                        }
                    </p>
                </div>
            </div>

            <AdUnit placementId="1" />

            <div style={{ margin: '3rem 0' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    {pageData.isSpanish ? 'Partidos en Vivo Ahora' : 'Live Matches Now'}
                </h2>
                <div className="event-grid">
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginTop: '3rem' }}>
                <h3>{pageData.isSpanish ? 'Preguntas Frecuentes (FAQ)' : 'Frequently Asked Questions'}</h3>
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {isBingHub ? (
                        <>
                            <div>
                                <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>¿Dónde ver {pageData.h1} en vivo?</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>Puedes ver {pageData.h1} en vivo a través de v1.velcuri.io. Ofrecemos los mejores enlaces actualizados para que no te pierdas nada de {pageData.h1}.</p>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>¿Es gratis {pageData.h1}?</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>Sí, el acceso a {pageData.h1} en nuestra plataforma es totalmente gratuito y no requiere suscripción.</p>
                            </div>
                        </>
                    ) : (
                        <div>
                            <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>Is it safe to use v1.velcuri.io?</h4>
                            <p style={{ color: 'var(--text-secondary)' }}>Yes, v1.velcuri.io is a safe platform for streaming sports events.</p>
                        </div>
                    )}
                </div>
            </div>

            <AdUnit placementId="4" />
        </div>
    );
};

export default SEOPage;
