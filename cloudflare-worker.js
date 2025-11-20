// Cloudflare Worker for M3U8 Proxy
// Deploy this to Cloudflare Workers at: https://workers.cloudflare.com/

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': '*',
            }
        })
    }

    const url = new URL(request.url)
    const targetUrl = url.searchParams.get('url')
    const referer = url.searchParams.get('referer') || 'https://ppv.to/'
    const origin = url.searchParams.get('origin') || 'https://ppv.to'

    if (!targetUrl) {
        return new Response('Error: No URL provided', {
            status: 400,
            headers: { 'Content-Type': 'text/plain' }
        })
    }

    try {
        // Fetch the target URL with custom headers
        const response = await fetch(targetUrl, {
            headers: {
                'Origin': origin,
                'Referer': referer,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        })

        let body = await response.text()
        let contentType = response.headers.get('content-type') || 'application/octet-stream'

        // Check if it's an M3U8 playlist
        const isM3U8 = contentType.includes('mpegurl') ||
            contentType.includes('m3u8') ||
            targetUrl.includes('.m3u8') ||
            body.startsWith('#EXTM3U')

        if (isM3U8) {
            // Parse base URL
            const targetUrlObj = new URL(targetUrl)
            const baseUrl = targetUrlObj.origin + targetUrlObj.pathname.substring(0, targetUrlObj.pathname.lastIndexOf('/') + 1)

            // Process M3U8 content
            const lines = body.split('\n')
            const modifiedLines = lines.map(line => {
                line = line.trim()

                // Keep comments and empty lines
                if (!line || line.startsWith('#')) {
                    return line
                }

                // Resolve URL
                let fullUrl = ''
                if (line.startsWith('http://') || line.startsWith('https://')) {
                    fullUrl = line
                } else if (line.startsWith('//')) {
                    fullUrl = targetUrlObj.protocol + line
                } else {
                    fullUrl = baseUrl + line
                }

                // Create proxied URL
                const workerUrl = new URL(request.url)
                const proxyUrl = `${workerUrl.origin}${workerUrl.pathname}?url=${encodeURIComponent(fullUrl)}&referer=${encodeURIComponent(referer)}&origin=${encodeURIComponent(origin)}`

                return proxyUrl
            })

            body = modifiedLines.join('\n')
            contentType = 'application/vnd.apple.mpegurl'
        }

        // Return response with CORS headers
        return new Response(body, {
            status: response.status,
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        })

    } catch (error) {
        return new Response(`Proxy Error: ${error.message}`, {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            }
        })
    }
}
