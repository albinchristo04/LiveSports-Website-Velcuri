import { startOfDay, isAfter } from 'date-fns';

const SOURCE_1_URL = 'https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/events_with_m3u8.json';
const SOURCE_2_URL = 'https://raw.githubusercontent.com/albinchristo04/arda/refs/heads/main/streambtw_data.json';

export const fetchEvents = async (server) => {
  try {
    const url = server === 'server1' ? SOURCE_1_URL : SOURCE_2_URL;
    const response = await fetch(url);
    const data = await response.json();

    if (server === 'server1') {
      return normalizeSource1(data);
    } else {
      return normalizeSource2(data);
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const getEventById = async (id) => {
  if (!id) return null;

  const isServer1 = id.startsWith('s1-');
  const events = await fetchEvents(isServer1 ? 'server1' : 'server2');
  return events.find(e => e.id === id);
};

export const getRelatedEvents = async (currentEventId, league) => {
  if (!currentEventId || !league) return [];
  const events = await fetchEvents('server1');
  return events
    .filter(e => e.league === league && e.id !== currentEventId)
    .slice(0, 6);
};

const getProxiedUrl = (url, referer, origin) => {
  if (!url) return '';
  // TODO: Replace with your Cloudflare Worker URL after deployment
  // See CLOUDFLARE_WORKER_SETUP.md for instructions
  const proxyBase = 'https://m3u8-proxy.priyankaamalraj2.workers.dev/';
  return `${proxyBase}?url=${encodeURIComponent(url)}&referer=${encodeURIComponent(referer)}&origin=${encodeURIComponent(origin)}`;
};

const normalizeSource1 = (data) => {
  const events = [];
  const categories = data.events?.streams || [];

  categories.forEach(category => {
    const categoryName = category.category;
    const categoryEvents = category.streams || [];

    categoryEvents.forEach(event => {
      if (event.always_live) return;

      events.push({
        id: `s1-${event.id}`,
        title: event.name,
        startTime: new Date(event.starts_at * 1000),
        league: categoryName,
        thumbnail: event.poster,
        streams: [
          {
            name: 'Server 1 (HLS)',
            type: 'hls',
            // Route through proxy
            url: getProxiedUrl(event.m3u8_url, 'https://ppv.to/', 'https://ppv.to'),
            headers: {} // Headers are handled by the proxy now
          },
          {
            name: 'Server 2 (Embed)',
            type: 'iframe',
            url: event.iframe,
            headers: {}
          }
        ],
        isLive: isLive(new Date(event.starts_at * 1000))
      });
    });
  });

  return events.sort((a, b) => a.startTime - b.startTime);
};

const normalizeSource2 = (data) => {
  const items = data.items || [];

  return items.map((item, index) => {
    const playable = item.playable_link || {};
    const headers = playable.headers || {};
    const referer = headers['Referer'] || 'https://streambtw.live/';
    const origin = headers['Origin'] || 'https://streambtw.live';

    return {
      id: `s2-${index}`,
      title: item.title,
      startTime: new Date(),
      league: item.sport,
      thumbnail: item.thumbnail,
      streams: [
        {
          name: 'Server 1 (HLS)',
          type: 'hls',
          // Route through proxy with dynamic headers from source
          url: getProxiedUrl(playable.m3u8_url, referer, origin),
          headers: {}
        },
        {
          name: 'Server 2 (Embed)',
          type: 'iframe',
          url: playable.iframe_url,
          headers: {}
        }
      ],
      isLive: true
    };
  });
};

const isLive = (date) => {
  const now = new Date();
  const diff = (now - date) / 1000 / 60;
  return diff > -15 && diff < 180;
};
