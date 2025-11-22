import fetch from 'node-fetch';

const url = 'https://raw.githubusercontent.com/albinchristo04/mayiru/refs/heads/main/ovogoaal_events.json';

async function inspect() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Is Array:', Array.isArray(data));
        if (Array.isArray(data)) {
            console.log('Data is array. Length:', data.length);
            if (data.length > 0) console.log('First Item:', JSON.stringify(data[0], null, 2));
        } else {
            console.log('Data is object. Keys:', Object.keys(data));
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

inspect();
