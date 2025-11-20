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

const normalizeSource1 = (data) => {
  // Source 1: events.streams -> array of categories, each has streams array
  const events = [];
  const categories = data.events?.streams || [];

  categories.forEach(category => {
    const categoryName = category.category;
    const categoryEvents = category.streams || [];

    categoryEvents.forEach(event => {
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
              // Source 1 headers might be implicit or fixed. 
              // Based on user context, we might need specific headers.
              // For now, we'll use a default set if not provided in JSON.
              // The JSON chunk didn't show headers, so we assume standard or ppv.to
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
    // Source 2 doesn't seem to have a start time in the chunk I saw, 
    // but maybe it's live now? Or I need to check if there's a time field.
    // The chunk showed "extracted_at". I'll use current time or look for time.
    // Actually, let's assume they are live or upcoming. 
    // If no time, we might default to now or "Live".
    // Wait, I see "last_updated" in root.

    const playable = item.playable_link || {};

    return {
      id: `s2-${index}`, // Source 2 items didn't show an ID in the chunk
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
      isLive: true // Assuming source 2 (streambtw) lists currently available streams
    };
  });
};

const isLive = (date) => {
  const now = new Date();
  // Simple logic: if started within last 3 hours and not ended
  // For now, just check if it's close to now.
  const diff = (now - date) / 1000 / 60; // minutes
  return diff > -15 && diff < 180; // Started 15 mins ago or less, up to 3 hours
};
