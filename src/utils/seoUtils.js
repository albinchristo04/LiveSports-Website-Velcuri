/**
 * SEO Utilities for v1.velcuri.io
 */

/**
 * Generates a URL-friendly slug from a string
 */
export const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Normalize special characters
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-'); // Replace multiple - with single -
};

/**
 * Generates English and Spanish slugs for a match
 */
export const getMatchSlugs = (event) => {
    const baseSlug = generateSlug(event.title);
    return {
        en: `${baseSlug}-live-stream`,
        es: `${baseSlug}-en-vivo`
    };
};

/**
 * Formats match title for Bing CTR optimization
 */
export const getOptimizedTitle = (event, lang = 'en') => {
    const isLive = event.isLive;
    if (lang === 'es') {
        return `${event.title} EN VIVO Gratis | v1.velcuri.io`;
    }
    return `Watch ${event.title} Live Stream Free${isLive ? ' 🔴 LIVE' : ''} | v1.velcuri.io`;
};

/**
 * Generates a freshness signal for Bing
 */
export const getFreshnessSignal = () => {
    const minutes = Math.floor(Math.random() * 15) + 1;
    return `Actualizado hace ${minutes} minutos`;
};

/**
 * Formats meta description for Bing CTR optimization
 */
export const getOptimizedDescription = (event, lang = 'en') => {
    const time = event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (lang === 'es') {
        return `Mira ${event.title} en vivo hoy a las ${time}. Transmisión HD sin registro, gratis y sin cortes. ¡No te pierdas el partido!`;
    }
    return `Watch ${event.title} live stream today at ${time}. HD streaming, no registration required, free and stable. Don't miss the action!`;
};

/**
 * FAQ Data for matches
 */
export const getMatchFAQs = (event, lang = 'en') => {
    if (lang === 'es') {
        return [
            {
                q: `¿Dónde ver ${event.title} en vivo?`,
                a: `Puedes ver ${event.title} en vivo y en directo a través de v1.velcuri.io. Ofrecemos múltiples servidores de alta calidad para que disfrutes del partido sin interrupciones.`
            },
            {
                q: `¿Es gratis ver ${event.title}?`,
                a: `Sí, en v1.velcuri.io puedes ver ${event.title} de forma totalmente gratuita. No requerimos registro ni suscripciones para acceder a nuestras transmisiones.`
            },
            {
                q: `¿A qué hora empieza el partido?`,
                a: `El partido ${event.title} está programado para comenzar a las ${event.startTime.toLocaleTimeString()}. Te recomendamos conectarte 15 minutos antes para asegurar tu lugar.`
            }
        ];
    }
    return [
        {
            q: `Where to watch ${event.title} live?`,
            a: `You can watch ${event.title} live on v1.velcuri.io. We provide multiple high-quality streaming links so you can enjoy the match without any interruptions.`
        },
        {
            q: `Is it free to watch ${event.title}?`,
            a: `Yes, watching ${event.title} on v1.velcuri.io is completely free. We do not require any registration or subscription to access our live streams.`
        },
        {
            q: `What time does the match start?`,
            a: `The match ${event.title} is scheduled to start at ${event.startTime.toLocaleTimeString()}. We recommend joining 15 minutes early to check the available streams.`
        }
    ];
};
