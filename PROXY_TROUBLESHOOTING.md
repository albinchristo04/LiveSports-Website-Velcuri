# Local Proxy Setup

Since Cloudflare Workers seems to be blocked by the target server (returning 404), we can run a local Node.js proxy to verify the fix.

## 1. Start the Proxy
Open a new terminal and run:
```bash
cd proxy
npm install
npm start
```
The proxy will run at `http://localhost:8080`.

## 2. Update api.js (Temporary)
Update `src/services/api.js` to use your local proxy:

```javascript
const getProxiedUrl = (url, referer, origin) => {
  if (!url) return '';
  // Local Proxy
  const proxyBase = 'http://localhost:8080/';
  return `${proxyBase}?url=${encodeURIComponent(url)}&referer=${encodeURIComponent(referer)}&origin=${encodeURIComponent(origin)}`;
};
```

## 3. Test
Run your React app (`npm run dev`) and try to play the stream.
If it works, you can deploy this `proxy` folder to a service like **Render**, **Railway**, or **Heroku** (free tiers available) and update `api.js` with the production URL.

## Why?
The target server `gg.poocloud.in` appears to block requests from Cloudflare Workers (returning 404), but allows requests from residential/standard IPs (like your computer). A standalone Node.js server avoids the Cloudflare Worker restrictions.
