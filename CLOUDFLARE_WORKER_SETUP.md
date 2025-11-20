# Cloudflare Worker Deployment Guide

## Overview
This Cloudflare Worker acts as a CORS proxy for M3U8 streams, allowing your static site to bypass CORS restrictions.

## Deployment Steps

### 1. Create a Cloudflare Account
- Go to https://dash.cloudflare.com/sign-up
- Sign up for a free account

### 2. Create a Worker
1. Go to **Workers & Pages** in the Cloudflare dashboard
2. Click **Create Application**
3. Select **Create Worker**
4. Give it a name like `m3u8-proxy`
5. Click **Deploy**

### 3. Edit the Worker Code
1. After deployment, click **Edit Code**
2. Delete the default code
3. Copy and paste the entire contents of `cloudflare-worker.js`
4. Click **Save and Deploy**

### 4. Get Your Worker URL
- Your worker will be available at: `https://m3u8-proxy.YOUR-SUBDOMAIN.workers.dev`
- Copy this URL

### 5. Update Your Application
1. Open `src/services/api.js`
2. Find the `getProxiedUrl` function
3. Replace the proxy URL with your Cloudflare Worker URL:

```javascript
const getProxiedUrl = (url, referer, origin) => {
  if (!url) return '';
  const proxyBase = 'https://m3u8-proxy.YOUR-SUBDOMAIN.workers.dev';
  return `${proxyBase}?url=${encodeURIComponent(url)}&referer=${encodeURIComponent(referer)}&origin=${encodeURIComponent(origin)}`;
};
```

### 6. Rebuild and Deploy
```bash
npm run build
git add .
git commit -m "Update proxy URL"
git push
```

## Testing
1. Open your deployed site
2. Try playing a stream
3. Check browser console for errors
4. If streams don't play, check the Cloudflare Worker logs

## Troubleshooting

### Worker Logs
- Go to your Worker in Cloudflare dashboard
- Click on **Logs** tab to see real-time requests

### Common Issues
1. **Worker URL incorrect**: Make sure you copied the exact URL
2. **CORS still blocked**: Clear browser cache and try again
3. **Streams not loading**: Check if the original M3U8 URL is accessible

## Free Tier Limits
- Cloudflare Workers free tier: 100,000 requests/day
- Should be sufficient for moderate traffic

## Alternative: Use a Public Proxy (Not Recommended for Production)
If you don't want to deploy your own worker, you can use:
```javascript
const proxyBase = 'https://corsproxy.io/?';
```
But this is less reliable and has rate limits.
