/**
 * SEO Utilities for Velcuri.io
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
 * Formats match title for CTR optimization
 */
export const getOptimizedTitle = (event, lang = 'en') => {
    const isLive = event.isLive;
    if (lang === 'es') {
        return `Ver ${event.title} EN VIVO Gratis Hoy${isLive ? ' 🔴 LIVE' : ''} | Velcuri`;
    }
    return `Watch ${event.title} Live Stream Free${isLive ? ' 🔴 LIVE' : ''} | Velcuri`;
};

/**
 * Formats meta description for CTR optimization
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
                a: `Puedes ver ${event.title} en vivo y en directo a través de Velcuri.io. Ofrecemos múltiples servidores de alta calidad para que disfrutes del partido sin interrupciones.`
            },
            {
                q: `¿Es gratis ver ${event.title}?`,
                a: `Sí, en Velcuri.io puedes ver ${event.title} de forma totalmente gratuita. No requerimos registro ni suscripciones para acceder a nuestras transmisiones.`
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
            a: `You can watch ${event.title} live on Velcuri.io. We provide multiple high-quality streaming links so you can enjoy the match without any interruptions.`
        },
        {
            q: `Is it free to watch ${event.title}?`,
            a: `Yes, watching ${event.title} on Velcuri.io is completely free. We do not require any registration or subscription to access our live streams.`
        },
        {
            q: `What time does the match start?`,
            a: `The match ${event.title} is scheduled to start at ${event.startTime.toLocaleTimeString()}. We recommend joining 15 minutes early to check the available streams.`
        }
    ];
};
