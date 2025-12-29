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

function submitToIndexNow(sitemapUrl) {
    const host = 'velcuri.io';
    const key = '19470b659da646f3ba501014cb7d9ff9';
    const indexNowUrl = `https://www.bing.com/IndexNow?url=${encodeURIComponent(sitemapUrl)}&key=${key}`;

    console.log(`Submitting to IndexNow: ${sitemapUrl}`);

    https.get(indexNowUrl, (res) => {
        console.log(`IndexNow Response: ${res.statusCode}`);
        process.exit(0); // Force exit to prevent build hanging
    }).on('error', (err) => {
        console.error('IndexNow Error:', err);
        process.exit(1);
    });

    // Fallback timeout to ensure build doesn't hang
    setTimeout(() => {
        console.log('IndexNow timeout reached, exiting...');
        process.exit(0);
    }, 10000);
}

async function generateSitemaps() {
    const baseUrl = 'https://velcuri.io';
    const outputDir = fs.existsSync(path.join(process.cwd(), 'dist'))
        ? path.join(process.cwd(), 'dist')
        : path.join(process.cwd(), 'public');

    const hubs = [
        'velcuri', 'velcuri-io', 'velcuri-streaming',
        'rojadirecta-tv', 'rojadirectatv', 'roja-directa', 'roja-tv',
        'pirlotv-futbol-en-vivo', 'futbol-en-vivo-gratis', 'ver-futbol-online'
    ];

    const bingHubs = [
        'rojadirecta-en-vivo', 'rojadirecta-tv-en-vivo', 'tarjeta-roja-tv',
        'tarjeta-roja-directa', 'tarjeta-roja-futbol-en-vivo', 'pirlo-tv-futbol-en-vivo-gratis'
    ];

    // 1. Generate Hubs Sitemap
    let hubsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>hourly</changefreq>
        <priority>1.0</priority>
    </url>`;

    [...hubs, ...bingHubs].forEach(hub => {
        hubsXml += `
    <url>
        <loc>${baseUrl}/${hub}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>`;
    });

    hubsXml += '\n</urlset>';
    fs.writeFileSync(path.join(outputDir, 'sitemap-hubs.xml'), hubsXml);

    // 2. Generate Rojadirecta Sitemap
    let rojaXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    ['rojadirecta-tv', 'rojadirecta-en-vivo', 'rojadirecta-tv-en-vivo'].forEach(hub => {
        rojaXml += `
    <url>
        <loc>${baseUrl}/${hub}</loc>
        <changefreq>hourly</changefreq>
        <priority>0.9</priority>
    </url>`;
    });
    rojaXml += '\n</urlset>';
    fs.writeFileSync(path.join(outputDir, 'sitemap-rojadirecta.xml'), rojaXml);

    // 3. Generate Tarjeta Roja Sitemap
    let tarjetaXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    ['tarjeta-roja-tv', 'tarjeta-roja-directa', 'tarjeta-roja-futbol-en-vivo'].forEach(hub => {
        tarjetaXml += `
    <url>
        <loc>${baseUrl}/${hub}</loc>
        <changefreq>hourly</changefreq>
        <priority>0.9</priority>
    </url>`;
    });
    tarjetaXml += '\n</urlset>';
    fs.writeFileSync(path.join(outputDir, 'sitemap-tarjeta-roja.xml'), tarjetaXml);

    // 4. Generate Matches Sitemap
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
        fs.writeFileSync(path.join(outputDir, 'sitemap-matches.xml'), matchesXml);
    } catch (err) {
        console.error('Error fetching events for sitemap:', err);
    }

    // 5. Generate Sitemap Index
    const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${baseUrl}/sitemap-hubs.xml</loc>
    </sitemap>
    <sitemap>
        <loc>${baseUrl}/sitemap-rojadirecta.xml</loc>
    </sitemap>
    <sitemap>
        <loc>${baseUrl}/sitemap-tarjeta-roja.xml</loc>
    </sitemap>
    <sitemap>
        <loc>${baseUrl}/sitemap-matches.xml</loc>
    </sitemap>
</sitemapindex>`;
    fs.writeFileSync(path.join(outputDir, 'sitemap-index.xml'), indexXml);

    console.log('Sitemaps generated successfully!');

    // Submit to IndexNow
    submitToIndexNow(`${baseUrl}/sitemap-index.xml`);
}

generateSitemaps();
