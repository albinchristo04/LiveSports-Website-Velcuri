import { startOfDay, isAfter } from 'date-fns';

const SOURCE_1_URL = 'https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/events_with_m3u8.json';
const SOURCE_2_URL = 'https://raw.githubusercontent.com/albinchristo04/mayiru/refs/heads/main/ovogoaal_events.json';
const SOURCE_3_URL = 'https://raw.githubusercontent.com/albinchristo04/mayiru/refs/heads/main/sports_events.json';
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
  const matches = data.matches || [];

  return matches.map((match, index) => {
    const streams = (match.stream_urls || []).map((url, i) => ({
      name: `Stream ${i + 1}`,
      type: 'iframe',
      url: url,
      headers: {}
    }));

    const startTime = getDateFromTime(match.time);

    return {
      id: `s2-${index}`,
      title: match.title,
      startTime: startTime,
      league: match.category || 'Sports',
      thumbnail: '',
      streams: streams,
      isLive: isLive(startTime)
    };
  });
};

const normalizeSource3 = (data) => {
  const events = [];
  const eventsByDay = data.events || {};

  Object.entries(eventsByDay).forEach(([dayName, dayEvents]) => {
    dayEvents.forEach((event, index) => {
      const streams = (event.streams || []).map((streamUrl, i) => ({
        name: `Link ${i + 1}`,
        type: 'iframe',
        url: streamUrl,
        headers: {
          'Referer': 'https://sportzonline.top/'
        }
      }));

      const startTime = getDateFromDayTime(dayName, event.time);

      events.push({
        id: `s3-${dayName}-${index}`,
        title: event.event,
        startTime: startTime,
        league: 'Sports', // API doesn't provide league, default to Sports
        thumbnail: '',
        streams: streams,
        isLive: isLive(startTime)
      });
    });
  });

  return events.sort((a, b) => a.startTime - b.startTime);
};

const getDateFromDayTime = (dayName, timeString) => {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const targetDayIndex = days.indexOf(dayName.toUpperCase());

  if (targetDayIndex === -1) return new Date(); // Fallback

  const now = new Date();
  const currentDayIndex = now.getDay();

  let dayDiff = targetDayIndex - currentDayIndex;
  if (dayDiff < 0) dayDiff += 7; // Target day is next week

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + dayDiff);

  const [hours, minutes] = timeString.split(':').map(Number);
  targetDate.setHours(hours, minutes, 0, 0);

  return targetDate;
};

const getDateFromTime = (timeString) => {
  if (!timeString) return new Date();

  const now = new Date();
  const targetDate = new Date(now);

  const [hours, minutes] = timeString.split(':').map(Number);
  targetDate.setHours(hours, minutes, 0, 0);

  return targetDate;
};

const isLive = (date) => {
  const now = new Date();
  const diff = (now - date) / 1000 / 60;
  return diff > -15 && diff < 180;
};
