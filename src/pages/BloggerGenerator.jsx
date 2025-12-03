import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Server, Code } from 'lucide-react';

const BloggerGenerator = () => {
    const [server, setServer] = useState('server1');
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [generatedCode, setGeneratedCode] = useState('');
    const [copied, setCopied] = useState(false);

    // Mock fetchEvents function - replace with your actual API
    const fetchEvents = async (serverName) => {
        // Simulated API response
        return [
            {
                id: 1,
                league: 'La Liga',
                title: 'Barcelona vs Atlético Madrid',
                startTime: new Date('2025-12-09T20:00:00'),
                isLive: true,
                streams: [
                    { name: 'English - HD2', url: 'https://sportzonline.top/channels/hd/hd2.php' },
                    { name: 'Spanish - HD6', url: 'https://sportzonline.top/channels/hd/hd6.php' },
                    { name: 'German - HD9', url: 'https://sportzonline.top/channels/hd/hd9.php' },
                    { name: 'Link 4', url: 'https://sportzonline.top/channels/pt/eleven1.php' },
                    { name: 'Link 5', url: 'https://sportzonline.top/channels/bra/br2.php' }
                ]
            },
            {
                id: 2,
                league: 'Premier League',
                title: 'Manchester United vs Liverpool',
                startTime: new Date('2025-12-10T18:30:00'),
                isLive: false,
                streams: [
                    { name: 'English - HD1', url: 'https://sportzonline.top/channels/hd/hd1.php' },
                    { name: 'English - HD2', url: 'https://sportzonline.top/channels/hd/hd2.php' }
                ]
            }
        ];
    };

    useEffect(() => {
        loadMatches();
    }, [server]);

    const loadMatches = async () => {
        setLoading(true);
        const data = await fetchEvents(server);
        setMatches(data);
        setLoading(false);
        setSelectedMatch(null);
        setGeneratedCode('');
    };

    const generateCode = (match) => {
        const streams = match.streams || [];
        const streamButtons = streams.map((stream, index) => {
            return `<button class="stream-btn ${index === 0 ? 'active' : ''}" onclick="changeStream('${stream.url}', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                ${stream.name || `Server ${index + 1}`}
            </button>`;
        }).join('\n');

        const firstStreamUrl = streams.length > 0 ? streams[0].url : '';

        const code = `<!-- Match Content Start -->
<div class="match-container">
    <div class="match-header glass-panel">
        <div class="match-info">
            <span class="league-tag">${match.league}</span>
            <h1>${match.title}</h1>
            <div class="match-meta">
                <span class="time-tag">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    ${new Date(match.startTime).toLocaleString()}
                </span>
                ${match.isLive ? '<span class="live-badge">LIVE</span>' : ''}
            </div>
        </div>
    </div>

    <!-- Ad Unit 1 - Top -->
    <div class="ad-container">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7025462814384100" crossorigin="anonymous"></script>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-7025462814384100"
             data-ad-slot="2965148688"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    </div>

    <div class="player-section glass-panel">
        <div class="server-list">
            <h3>Select Server</h3>
            <div class="stream-buttons">
                ${streamButtons}
            </div>
        </div>

        <!-- Ad Unit 2 - Above Player -->
        <div class="ad-container">
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7025462814384100" crossorigin="anonymous"></script>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-7025462814384100"
                 data-ad-slot="9462166476"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        </div>

        <div class="video-container">
            <iframe id="main-player" src="${firstStreamUrl}" frameborder="0" allowfullscreen allow="autoplay; encrypted-media" sandbox="allow-same-origin allow-scripts allow-presentation allow-forms" scrolling="no"></iframe>
        </div>
        
        <!-- Ad Unit 3 - Below Player -->
        <div class="ad-container">
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7025462814384100" crossorigin="anonymous"></script>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-7025462814384100"
                 data-ad-slot="3088329811"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        </div>
    </div>

    <!-- Ad Unit 4 - Mid Content -->
    <div class="ad-container">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7025462814384100" crossorigin="anonymous"></script>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-7025462814384100"
             data-ad-slot="2965148688"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    </div>

    <div class="social-links">
        <a href="https://discord.gg/5QgbhJV4" target="_blank" class="discord-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.36981C18.798 3.66981 17.168 3.16981 15.447 3.04981C15.417 3.04981 15.387 3.06981 15.367 3.09981C15.157 3.47981 14.927 3.99981 14.767 4.37981C12.947 4.10981 11.137 4.10981 9.33696 4.37981C9.17696 3.99981 8.93696 3.47981 8.72696 3.09981C8.70696 3.06981 8.67696 3.04981 8.64696 3.04981C6.92696 3.16981 5.29696 3.66981 3.77696 4.36981C3.76696 4.37981 3.75696 4.38981 3.74696 4.39981C0.666963 9.02981 -0.183037 13.5498 0.226963 18.0198C0.226963 18.0498 0.246963 18.0798 0.266963 18.0998C2.27696 19.5798 4.21696 20.4798 6.12696 21.0698C6.15696 21.0798 6.18696 21.0698 6.20696 21.0498C6.65696 20.4398 7.05696 19.7998 7.39696 19.1298C7.42696 19.0698 7.39696 18.9998 7.32696 18.9798C6.68696 18.7398 6.07696 18.4598 5.48696 18.1398C5.43696 18.1098 5.42696 18.0398 5.47696 17.9998C5.60696 17.9098 5.73696 17.8098 5.85696 17.7098C5.87696 17.6898 5.90696 17.6898 5.93696 17.6898C9.84696 19.4898 14.267 19.4898 18.147 17.6898C18.177 17.6898 18.207 17.6898 18.227 17.7098C18.357 17.8098 18.477 17.9098 18.607 17.9998C18.657 18.0398 18.647 18.1098 18.597 18.1398C18.007 18.4598 17.397 18.7398 16.757 18.9798C16.687 18.9998 16.657 19.0698 16.687 19.1298C17.027 19.7998 17.427 20.4398 17.877 21.0498C17.897 21.0698 17.927 21.0798 17.957 21.0698C19.877 20.4798 21.817 19.5798 23.817 18.0998C23.837 18.0798 23.857 18.0498 23.857 18.0198C24.367 12.7598 23.027 8.28981 20.337 4.39981C20.327 4.38981 20.317 4.37981 20.317 4.36981ZM8.01696 15.3298C6.83696 15.3298 5.87696 14.2498 5.87696 12.9298C5.87696 11.6098 6.81696 10.5298 8.01696 10.5298C9.22696 10.5298 10.187 11.6198 10.167 12.9298C10.167 14.2498 9.21696 15.3298 8.01696 15.3298ZM16.067 15.3298C14.887 15.3298 13.927 14.2498 13.927 12.9298C13.927 11.6098 14.867 10.5298 16.067 10.5298C17.277 10.5298 18.237 11.6198 18.217 12.9298C18.217 14.2498 17.267 15.3298 16.067 15.3298Z" fill="white" />
            </svg>
            Join Discord
        </a>
        <a href="https://t.me/your_channel" target="_blank" class="telegram-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            Join Telegram
        </a>
    </div>

    <!-- Ad Unit 5 - Before Footer -->
    <div class="ad-container">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7025462814384100" crossorigin="anonymous"></script>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-7025462814384100"
             data-ad-slot="3910456892"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    </div>

    <!-- Ad Unit 6 - Bottom -->
    <div class="ad-container">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7025462814384100" crossorigin="anonymous"></script>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-7025462814384100"
             data-ad-slot="9462166476"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    </div>
</div>

<script>
function changeStream(url, btn) {
    document.getElementById('main-player').src = url;
    document.querySelectorAll('.stream-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Force AdSense ads to load
window.addEventListener('load', function() {
    (adsbygoogle = window.adsbygoogle || []).push({});
});
</script>
<!-- Match Content End -->`;

        setGeneratedCode(code);
        setSelectedMatch(match);
        setCopied(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '2rem 1rem', 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh'
        }}>
            <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: 'white'
            }}>
                <h1 style={{ 
                    marginBottom: '1.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    fontSize: '2rem'
                }}>
                    <Code size={32} />
                    Blogger Post Generator
                </h1>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>1. Select Server</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {['server1', 'server2', 'server3'].map(s => (
                            <button
                                key={s}
                                onClick={() => setServer(s)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    background: server === s ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                    border: `2px solid ${server === s ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)'}`,
                                    borderRadius: '10px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontWeight: '600'
                                }}
                            >
                                <Server size={18} />
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '1rem'
                    }}>
                        <h3 style={{ fontSize: '1.2rem' }}>2. Select Match</h3>
                        <button 
                            onClick={loadMatches} 
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            title="Refresh Matches"
                        >
                            <RefreshCw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading matches...</div>
                    ) : (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                            gap: '1rem', 
                            maxHeight: '400px', 
                            overflowY: 'auto',
                            paddingRight: '0.5rem'
                        }}>
                            {matches.map(match => (
                                <div
                                    key={match.id}
                                    onClick={() => generateCode(match)}
                                    style={{
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        border: selectedMatch?.id === match.id ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.2)',
                                        background: selectedMatch?.id === match.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '10px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{ fontSize: '0.9rem', color: '#60a5fa', marginBottom: '0.25rem', fontWeight: '600' }}>
                                        {match.league}
                                    </div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                                        {match.title}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                                        {new Date(match.startTime).toLocaleString()}
                                    </div>
                                    {match.isLive && (
                                        <div style={{
                                            display: 'inline-block',
                                            marginTop: '0.5rem',
                                            padding: '0.25rem 0.75rem',
                                            background: '#dc2626',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}>
                                            LIVE
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {generatedCode && (
                    <div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <h3 style={{ fontSize: '1.2rem' }}>3. Generated HTML Code (6 Ad Units)</h3>
                            <button
                                onClick={copyToClipboard}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    background: copied ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied!' : 'Copy Code'}
                            </button>
                        </div>
                        <textarea
                            value={generatedCode}
                            readOnly
                            style={{
                                width: '100%',
                                height: '400px',
                                background: '#0f172a',
                                color: '#f8fafc',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                resize: 'vertical',
                                lineHeight: '1.5'
                            }}
                        />
                        <div style={{ 
                            marginTop: '1rem', 
                            padding: '1rem', 
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                ✅ <strong>6 Ad Units Included:</strong> Top Banner, Above Player, Below Player, Mid Content, Before Footer, Bottom Banner
                            </p>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                                📦 All ads are in contained boxes with proper styling for Blogger
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default BloggerGenerator;
