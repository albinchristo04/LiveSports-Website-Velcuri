import fetch from 'node-fetch';

const url = 'https://raw.githubusercontent.com/albinchristo04/mayiru/refs/heads/main/mins.json';

async function inspect() {
    try {
        const response = await fetch(url);
        const text = await response.text();
        console.log('First 100 chars:', text.substring(0, 100));

        try {
            const data = JSON.parse(text);
            console.log('Is Array:', Array.isArray(data));
            console.log('Length:', data.length);
            if (Array.isArray(data) && data.length > 0) {
                console.log('First Item:', JSON.stringify(data[0], null, 2));
                // Check for unique categories
                const categories = [...new Set(data.map(item => item.category))];
                console.log('Categories:', categories);
            }
        } catch (e) {
            console.log('Not valid JSON:', e.message);
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

inspect();
