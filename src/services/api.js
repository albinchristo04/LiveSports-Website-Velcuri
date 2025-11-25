import { startOfDay, isAfter } from 'date-fns';

const SOURCE_1_URL = 'https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/events_with_m3u8.json';
const SOURCE_2_URL = 'https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/reyevents.json';
const SOURCE_3_URL = 'https://raw.githubusercontent.com/albinchristo04/mayiru/refs/heads/main/sports_events.json';
const TV_CHANNELS_URL = 'https://raw.githubusercontent.com/albinchristo04/mayiru/refs/heads/main/mins.json';

// HD Channel Language Mapping for Server 3
const HD_CHANNEL_LANGUAGE_MAP = {
  'hd1': 'English',
  'hd2': 'English',
  'hd3': 'German',
  'hd4': 'French',
  'hd5': 'English',
  'hd6': 'Spanish',
  'hd7': 'Italian',
  'hd8': 'Italian',
  'hd9': 'German',
  'hd10': 'Arabic',
  'hd11': 'English'
};

const LANGUAGE_MAP = {
  'pt': 'Portuguese',
  'es': 'Spanish',
  'fr': 'French',
  'it': 'Italian',
  'de': 'German',
  'tr': 'Turkish',
  'gb': 'English',
  'en': 'English',
  'nl': 'Dutch',
  'ru': 'Russian',
  'ar': 'Arabic',
  'pl': 'Polish',
  'ro': 'Romanian',
  'hu': 'Hungarian',
  'cz': 'Czech',
  'sk': 'Slovak',
  'bg': 'Bulgarian',
  'ua': 'Ukrainian',
  'hr': 'Croatian',
  'sr': 'Serbian',
  'gr': 'Greek'
};

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
  const events = Array.isArray(data) ? data : [];

  return events.map((event, index) => {
    const streams = [];
    const iframes = event.iframes || [];
    const channels = event.channels || [];

    iframes.forEach((iframe, idx) => {
      // Try to find language from channels array matching the index
      // Assuming iframes and channels arrays are parallel
      let langCode = 'en'; // Default
      if (channels[idx] && channels[idx][1]) {
        langCode = channels[idx][1];
      }

      const langName = LANGUAGE_MAP[langCode] || langCode.toUpperCase();

      // Each iframe object might have multiple players (player1, player2, etc.)
      Object.keys(iframe).forEach(key => {
        if (key.startsWith('player')) {
          const playerNum = key.replace('player', '');
          streams.push({
            name: `${langName} - Link ${playerNum}`,
            type: 'iframe',
            url: iframe[key],
            headers: {
              'Referer': 'https://bolaloca.my/' // Assuming this is the referer based on player URLs
            }
          });
        }
      });
    });

    // Parse date and time (DD-MM-YYYY HH:mm)
    // Assuming API time is UTC+1 based on analysis
    const [day, month, year] = event.date.split('-');
    const [hours, minutes] = event.time.split(':');
    const startTimeStr = `${year}-${month}-${day}T${hours}:${minutes}:00+01:00`;
    const startTime = new Date(startTimeStr);

    return {
      id: `s2-${index}`,
      title: `${event.team1} vs ${event.team2}`,
      startTime: startTime,
      league: event.league,
      thumbnail: '',
      streams: streams,
      isLive: isLive(startTime)
    };
  });
};

const normalizeSource3 = (data) => {
  const events = [];
  const eventsByDay = data.events || {};

  // Helper function to extract HD channel identifier from URL
  const getHDChannelFromUrl = (url) => {
    const match = url.match(/\/hd\/(hd\d+)\.php/);
    return match ? match[1] : null;
  };

  // Helper function to parse time and create date object
  const parseEventTime = (timeStr, dayOfWeek) => {
    const [hours, minutes] = timeStr.split(':');
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Map day names to day numbers
    const dayMap = {
      'SUNDAY': 0, 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3,
      'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6
    };

    const targetDay = dayMap[dayOfWeek.toUpperCase()];
    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget < 0) daysUntilTarget += 7;

    const eventDate = new Date(now);
    eventDate.setDate(now.getDate() + daysUntilTarget);
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return eventDate;
  };

  Object.entries(eventsByDay).forEach(([dayOfWeek, dayEvents]) => {
    dayEvents.forEach((event, index) => {
      const streams = (event.streams || []).map((streamUrl, i) => {
        const hdChannel = getHDChannelFromUrl(streamUrl);
        const language = hdChannel ? HD_CHANNEL_LANGUAGE_MAP[hdChannel] : null;

        return {
          name: language ? `${language} - ${hdChannel.toUpperCase()}` : `Link ${i + 1}`,
          type: 'iframe',
          url: streamUrl,
          headers: {
            'Referer': 'https://sportzonline.top/'
          }
        };
      });

      const startTime = parseEventTime(event.time, dayOfWeek);

      events.push({
        id: `s3-${dayOfWeek}-${event.time}-${index}`,
        title: event.event,
        startTime: startTime,
        league: event.event.includes(':') ? event.event.split(':')[0] : 'Sports',
        thumbnail: '',
        streams: streams,
        isLive: isLive(startTime)
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
