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

const normalizeSource1 = (data) => {
  // Source 1: events.streams -> array of categories, each has streams array
  const events = [];
  const categories = data.events?.streams || [];

  categories.forEach(category => {
    const categoryName = category.category;
    const categoryEvents = category.streams || [];

    categoryEvents.forEach(event => {
      // Filter out 24/7 streams (always_live)
      if (event.always_live) return;

      events.push({
        id: `s1-${event.id}`,
        title: event.name,
        startTime: new Date(event.starts_at * 1000), // source 1 uses unix timestamp
        league: categoryName, // or event.category_name
        thumbnail: event.poster,
        streams: [
          {
            name: 'Primary Stream',
            url: event.m3u8_url,
            headers: {
              'Referer': 'https://ppv.to/',
              'Origin': 'https://ppv.to',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          }
        ],
        isLive: isLive(new Date(event.starts_at * 1000))
      });
    });
  });

  return events.sort((a, b) => a.startTime - b.startTime);
};

const normalizeSource2 = (data) => {
  // Source 2: items array
  const items = data.items || [];

  return items.map((item, index) => {
    const playable = item.playable_link || {};

    return {
      id: `s2-${index}`,
      title: item.title,
      startTime: new Date(), // Placeholder if no time provided
      league: item.sport,
      thumbnail: item.thumbnail,
      streams: [
        {
          name: 'Primary Stream',
          url: playable.m3u8_url,
          headers: playable.headers || {}
        }
      ],
      isLive: true
    };
  });
};

const isLive = (date) => {
  const now = new Date();
  const diff = (now - date) / 1000 / 60; // minutes
  return diff > -15 && diff < 180;
};
