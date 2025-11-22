import { startOfDay, isAfter } from 'date-fns';

const SOURCE_1_URL = 'https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/events_with_m3u8.json';
const SOURCE_2_URL = 'https://raw.githubusercontent.com/albinchristo04/arda/refs/heads/main/streambtw_data.json';
const SOURCE_3_URL = 'https://topembed.pw/api.php?format=json';
const TV_CHANNELS_URL = 'https://raw.githubusercontent.com/albinchristo04/mayiru/refs/heads/main/mins.json';

export const fetchEvents = async (server) => {
  try {
    let url;
    if (server === 'server1') url = SOURCE_1_URL;
    else if (server === 'server2') url = SOURCE_2_URL;
    else url = SOURCE_3_URL;

    const response = await fetch(url);
    const data = await response.json();

    if (server === 'server1') {
      return normalizeSource1(data);
    } else if (server === 'server2') {
      return normalizeSource2(data);
    } else {
      return normalizeSource3(data);
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const fetchTVChannels = async () => {
  try {
    const response = await fetch(TV_CHANNELS_URL);
    const data = await response.json();
    return data.channels || [];
  } catch (error) {
    console.error('Error fetching TV channels:', error);
    return [];
  }
};

export const getEventById = async (id) => {
  if (!id) return null;

  let server = 'server3';
  if (id.startsWith('s1-')) server = 'server1';
  else if (id.startsWith('s2-')) server = 'server2';

  const events = await fetchEvents(server);
  return events.find(e => e.id === id);
};

export const getRelatedEvents = async (currentEventId, league) => {
  if (!currentEventId || !league) return [];
  // Default to server1 for related events for now, or could be dynamic
  const events = await fetchEvents('server1');
  return events
    .filter(e => e.league === league && e.id !== currentEventId)
    .slice(0, 6);
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
            name: 'Server 1 (Embed)',
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

    return {
      id: `s2-${index}`,
      title: item.title,
      startTime: new Date(),
      league: item.sport,
      thumbnail: item.thumbnail,
      streams: [
        {
          name: 'Server 1 (Embed)',
          type: 'iframe',
          url: playable.iframe_url,
          headers: {}
        }
      ],
      isLive: true
    };
  });
};

const normalizeSource3 = (data) => {
  const events = [];
  const eventsByDate = data.events || {};

  Object.values(eventsByDate).forEach(dateEvents => {
    dateEvents.forEach((event, index) => {
      const streams = (event.channels || []).map((channel, i) => ({
        name: `Link ${i + 1}`,
        type: 'iframe',
        url: channel,
        headers: {
          'Referer': 'https://topembed.pw/'
        }
      }));

      events.push({
        id: `s3-${event.unix_timestamp}-${index}`, // Generate a unique ID
        title: event.match,
        startTime: new Date(event.unix_timestamp * 1000),
        league: `${event.sport} - ${event.tournament}`,
        thumbnail: '', // No thumbnail provided in this API
        streams: streams,
        isLive: isLive(new Date(event.unix_timestamp * 1000))
      });
    });
  });

  return events.sort((a, b) => a.startTime - b.startTime);
};

const isLive = (date) => {
  const now = new Date();
  const diff = (now - date) / 1000 / 60;
  return diff > -15 && diff < 180;
};
