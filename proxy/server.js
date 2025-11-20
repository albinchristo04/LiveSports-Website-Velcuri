const express = require('express');
const request = require('request'); // We'll use 'request' or 'axios' or native 'fetch'. Native fetch in Node 18+ is good.
// Let's use native fetch for simplicity and no deps if possible, but express needs deps.
// We'll use 'cors' and 'express'.

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.get('/', async (req, res) => {
    const targetUrl = req.query.url;
    const referer = req.query.referer || 'https://ppv.to/';
    const origin = req.query.origin || 'https://ppv.to';

    if (!targetUrl) {
        return res.send('Node.js Proxy is Running. Usage: /?url=TARGET_URL');
    }

    try {
        // console.log(`Proxying: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            headers: {
                'Origin': origin,
                'Referer': referer,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        if (!response.ok) {
            return res.status(response.status).send(`Proxy Error: Target returned ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        let body = await response.text();

        // Handle M3U8 rewriting
        if (contentType.includes('mpegurl') || targetUrl.includes('.m3u8') || body.startsWith('#EXTM3U')) {
            const targetUrlObj = new URL(targetUrl);
            const baseUrl = targetUrlObj.origin + targetUrlObj.pathname.substring(0, targetUrlObj.pathname.lastIndexOf('/') + 1);
            const protocol = req.protocol;
            const host = req.get('host');
            const localProxyBase = `${protocol}://${host}/`;

            const lines = body.split('\n');
            const modifiedLines = lines.map(line => {
                line = line.trim();
                if (!line || line.startsWith('#')) return line;

                let fullUrl = '';
                if (line.startsWith('http')) {
                    fullUrl = line;
                } else if (line.startsWith('//')) {
                    fullUrl = targetUrlObj.protocol + line;
                } else {
                    fullUrl = baseUrl + line;
                }

                return `${localProxyBase}?url=${encodeURIComponent(fullUrl)}&referer=${encodeURIComponent(referer)}&origin=${encodeURIComponent(origin)}`;
            });

            body = modifiedLines.join('\n');
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        } else {
            res.setHeader('Content-Type', contentType);
        }

        res.send(body);

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).send(`Proxy Error: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
