export const groupEvents = (events1, events2, events3) => {
    const allEvents = [
        ...events1.map(e => ({ ...e, source: 'Server 1' })),
        ...events2.map(e => ({ ...e, source: 'Server 2' })),
        ...events3.map(e => ({ ...e, source: 'Server 3' }))
    ];

    const groups = [];
    const processedIds = new Set();

    allEvents.forEach(event => {
        if (processedIds.has(event.id)) return;

        const currentGroup = {
            title: event.title,
            startTime: event.startTime,
            league: event.league,
            streams: [...event.streams.map(s => ({ ...s, source: event.source }))],
            ids: [event.id]
        };
        processedIds.add(event.id);

        // Find matches in the remaining events
        allEvents.forEach(otherEvent => {
            if (processedIds.has(otherEvent.id)) return;

            // Check if same day (ignore time diffs for now, just day match)
            const sameDay = isSameDay(new Date(event.startTime), new Date(otherEvent.startTime));
            if (!sameDay) return;

            const similarity = calculateSimilarity(event.title, otherEvent.title);
            if (similarity > 0.4) { // Threshold
                currentGroup.streams.push(...otherEvent.streams.map(s => ({ ...s, source: otherEvent.source })));
                currentGroup.ids.push(otherEvent.id);
                processedIds.add(otherEvent.id);
            }
        });

        groups.push(currentGroup);
    });

    return groups.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
};

const calculateSimilarity = (str1, str2) => {
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const tokens1 = new Set(normalize(str1));
    const tokens2 = new Set(normalize(str2));

    const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);

    if (union.size === 0) return 0;
    return intersection.size / union.size;
};

const isSameDay = (d1, d2) => {
    return d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();
};
