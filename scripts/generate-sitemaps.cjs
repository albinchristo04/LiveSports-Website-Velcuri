const fs = require('fs');
const path = require('path');
const https = require('https');

const SOURCE_1_URL = 'https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/events_with_m3u8.json';

const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function generateSitemaps() {
    const baseUrl = 'https://velcuri.io';
    const publicDir = path.join('c:/Users/albin/Velcuri.io/LiveSports-Website-Velcuri', 'public');

    const hubs = [
        'velcuri', 'velcuri-io', 'velcuri-streaming',
        'rojadirecta-tv', 'rojadirectatv', 'roja-directa', 'roja-tv',
        'pirlotv-futbol-en-vivo', 'futbol-en-vivo-gratis', 'ver-futbol-online'
    ];

    // 1. Generate Hubs Sitemap
    let hubsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>hourly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/tv-channels</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${baseUrl}/highlights</loc>
        <changefreq>hourly</changefreq>
        <priority>0.8</priority>
    </url>`;

    hubs.forEach(hub => {
        hubsXml += `
    <url>
        <loc>${baseUrl}/${hub}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>`;
    });

    hubsXml += '\n</urlset>';
    fs.writeFileSync(path.join(publicDir, 'sitemap-hubs.xml'), hubsXml);

    // 2. Generate Matches Sitemap
    try {
        const data = await fetchData(SOURCE_1_URL);
        const events = [];

        if (data.events && data.events.streams) {
            data.events.streams.forEach(cat => {
                if (cat.streams) {
                    cat.streams.forEach(s => {
                        if (!s.always_live) events.push(s.name);
                    });
                }
            });
        }

        let matchesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        events.forEach(title => {
            const baseSlug = generateSlug(title);
            matchesXml += `
    <url>
        <loc>${baseUrl}/football/${baseSlug}-live-stream</loc>
        <changefreq>hourly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${baseUrl}/futbol/${baseSlug}-en-vivo</loc>
        <changefreq>hourly</changefreq>
        <priority>0.9</priority>
    </url>`;
        });

        matchesXml += '\n</urlset>';
        fs.writeFileSync(path.join(publicDir, 'sitemap-matches.xml'), matchesXml);
    } catch (err) {
        console.error('Error fetching events for sitemap:', err);
    }

    // 3. Generate Sitemap Index
    const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${baseUrl}/sitemap-hubs.xml</loc>
    </sitemap>
    <sitemap>
        <loc>${baseUrl}/sitemap-matches.xml</loc>
    </sitemap>
</sitemapindex>`;
    fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), indexXml);

    console.log('Sitemaps generated successfully!');
}

generateSitemaps();
