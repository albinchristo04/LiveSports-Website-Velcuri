import fetch from 'node-fetch';

const S1_URL = 'https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/events_with_m3u8.json';
const S2_URL = 'https://raw.githubusercontent.com/albinchristo04/mayiru/refs/heads/main/ovogoaal_events.json';
const S3_URL = 'https://raw.githubusercontent.com/albinchristo04/mayiru/refs/heads/main/sports_events.json';

async function fetchData() {
    const [r1, r2, r3] = await Promise.all([fetch(S1_URL), fetch(S2_URL), fetch(S3_URL)]);
    const d1 = await r1.json();
    const d2 = await r2.json();
    const d3 = await r3.json();

    const titles1 = [];
    d1.events?.streams?.forEach(c => c.streams?.forEach(e => titles1.push(e.name)));

    const titles2 = d2.matches?.map(m => m.title) || [];

    const titles3 = [];
    Object.values(d3.events || {}).forEach(day => day.forEach(e => titles3.push(e.event)));

    console.log('--- Server 1 Titles (Sample) ---');
    console.log(titles1.slice(0, 5));
    console.log('\n--- Server 2 Titles (Sample) ---');
    console.log(titles2.slice(0, 5));
    console.log('\n--- Server 3 Titles (Sample) ---');
    console.log(titles3.slice(0, 5));

    // Simple fuzzy match test
    console.log('\n--- Potential Matches ---');
    titles1.forEach(t1 => {
        const match2 = titles2.find(t2 => normalize(t2).includes(normalize(t1)) || normalize(t1).includes(normalize(t2)));
        const match3 = titles3.find(t3 => normalize(t3).includes(normalize(t1)) || normalize(t1).includes(normalize(t3)));

        if (match2 || match3) {
            console.log(`S1: "${t1}" matches:`);
            if (match2) console.log(`  - S2: "${match2}"`);
            if (match3) console.log(`  - S3: "${match3}"`);
        }
    });
}

function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

fetchData();
