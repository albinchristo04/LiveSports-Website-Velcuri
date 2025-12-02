import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Server, Code, Shield } from 'lucide-react';

const BloggerGenerator = () => {
    const [server, setServer] = useState('server1');
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [generatedCode, setGeneratedCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [includePopupBlocker, setIncludePopupBlocker] = useState(true);

    // Mock API call - replace with your actual API
    const fetchEvents = async (serverName) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        league: 'LaLiga',
                        title: 'Barcelona vs Real Madrid',
                        startTime: new Date().toISOString(),
                        isLive: true,
                        streams: [
                            { name: 'Spanish - Link 1', url: 'https://example.com/stream1' },
                            { name: 'Spanish - Link 2', url: 'https://example.com/stream2' },
                        ]
                    },
                    {
                        id: 2,
                        league: 'Premier League',
                        title: 'Manchester United vs Liverpool',
                        startTime: new Date().toISOString(),
                        isLive: false,
                        streams: [
                            { name: 'English - Link 1', url: 'https://example.com/stream3' },
                        ]
                    }
                ]);
            }, 500);
        });
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

    const popupBlockerScript = `
<!-- Popup Blocker & Ad Protection -->
<script>
(function() {
    'use strict';
    
    // Block popup windows
    var originalOpen = window.open;
    var popupCount = 0;
    var lastPopupTime = 0;
    
    window.open = function() {
        var now = Date.now();
        // Allow first popup or popups after 3 seconds
        if (popupCount === 0 || (now - lastPopupTime) > 3000) {
            popupCount++;
            lastPopupTime = now;
            return originalOpen.apply(this, arguments);
        }
        console.log('Popup blocked');
        return null;
    };
    
    // Block redirect attempts
    var originalAssign = window.location.assign;
    var originalReplace = window.location.replace;
    var userInitiated = false;
    
    document.addEventListener('click', function() {
        userInitiated = true;
        setTimeout(function() { userInitiated = false; }, 100);
    }, true);
    
    window.location.assign = function(url) {
        if (!userInitiated && url !== window.location.href) {
            console.log('Redirect blocked:', url);
            return;
        }
        return originalAssign.call(window.location, url);
    };
    
    window.location.replace = function(url) {
        if (!userInitiated && url !== window.location.href) {
            console.log('Redirect blocked:', url);
            return;
        }
        return originalReplace.call(window.location, url);
    };
    
    // Prevent automatic redirects
    var originalSetTimeout = window.setTimeout;
    var originalSetInterval = window.setInterval;
    
    window.setTimeout = function(callback, delay) {
        if (typeof callback === 'string' && callback.includes('location')) {
            console.log('Suspicious setTimeout blocked');
            return;
        }
        return originalSetTimeout.apply(this, arguments);
    };
    
    window.setInterval = function(callback, delay) {
        if (typeof callback === 'string' && callback.includes('location')) {
            console.log('Suspicious setInterval blocked');
            return;
        }
        return originalSetInterval.apply(this, arguments);
    };
    
    // Block beforeunload popups (except user-initiated)
    window.addEventListener('beforeunload', function(e) {
        if (!userInitiated) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });
    
    // Prevent overlay ads
    var checkOverlays = setInterval(function() {
        var overlays = document.querySelectorAll('div[style*="position: fixed"], div[style*="position:fixed"]');
        overlays.forEach(function(overlay) {
            var style = window.getComputedStyle(overlay);
            var zIndex = parseInt(style.zIndex);
            if (zIndex > 9999 && !overlay.classList.contains('video-container')) {
                overlay.style.display = 'none';
                console.log('Overlay blocked');
            }
        });
    }, 1000);
    
    // Clean up after 30 seconds
    setTimeout(function() { clearInterval(checkOverlays); }, 30000);
    
    console.log('Popup blocker activated');
})();
</script>`;

    const generateCode = (match) => {
        const streams = match.streams || [];
        const streamButtons = streams.map((stream, index) => {
            return `<button class="stream-btn ${index === 0 ? 'active' : ''}" onclick="changeStream('${stream.url}', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                ${stream.name || `Server ${index + 1}`}
            </button>`;
        }).join('\n');

        const firstStreamUrl = streams.length > 0 ? streams[0].url : '';

        const code = `
<!-- Match Content Start -->
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

    <!-- Ad Unit 1 -->
    <div class="ad-container">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7025462814384100" crossorigin="anonymous"></script>
        <!-- bxads53 -->
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

        <!-- Ad Unit 2 (Above Player) -->
        <div class="ad-container">
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7025462814384100" crossorigin="anonymous"></script>
            <!-- bxads4 -->
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
            <iframe id="main-player" src="${firstStreamUrl}" frameborder="0" allowfullscreen allow="autoplay; encrypted-media" scrolling="no"></iframe>
        </div>
        
        <!-- Ad Unit 3 (Below Player) -->
        <div class="ad-container">
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7025462814384100" crossorigin="anonymous"></script>
            <!-- bxads3 -->
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

    <!-- Ad Unit 4 -->
    <div class="ad-container">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7025462814384100" crossorigin="anonymous"></script>
        <!-- bxads -->
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
</div>

<script>
function changeStream(url, btn) {
    document.getElementById('main-player').src = url;
    document.querySelectorAll('.stream-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}
</script>
${includePopupBlocker ? popupBlockerScript : ''}
<!-- Match Content End -->
`;
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
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Code size={32} color="var(--accent-blue)" />
                    Blogger Post Generator
                </h1>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>1. Select Server</h3>
                    <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                        {['server1', 'server2', 'server3'].map(s => (
                            <button
                                key={s}
                                onClick={() => setServer(s)}
                                className="btn btn-glass"
                                style={{
                                    borderColor: server === s ? 'var(--accent-blue)' : 'var(--glass-border)',
                                    background: server === s ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                                }}
                            >
                                <Server size={18} />
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid var(--accent-blue)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                        <input 
                            type="checkbox" 
                            checked={includePopupBlocker}
                            onChange={(e) => setIncludePopupBlocker(e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <Shield size={20} color="var(--accent-blue)" />
                        <span style={{ fontWeight: '600' }}>Include Popup Blocker & Ad Protection</span>
                    </label>
                    <p style={{ marginTop: '0.5rem', marginLeft: '2.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Blocks unwanted popups, redirects, and overlay ads for better user experience
                    </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                        <h3>2. Select Match</h3>
                        <button onClick={loadMatches} className="btn btn-glass" title="Refresh Matches">
                            <RefreshCw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center" style={{ padding: '2rem' }}>Loading matches...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {matches.map(match => (
                                <div
                                    key={match.id}
                                    onClick={() => generateCode(match)}
                                    className="glass-panel"
                                    style={{
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        border: selectedMatch?.id === match.id ? '2px solid var(--accent-blue)' : '1px solid var(--glass-border)',
                                        background: selectedMatch?.id === match.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', marginBottom: '0.25rem', fontWeight: '700' }}>
                                        {match.league}
                                    </div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1rem' }}>
                                        {match.title}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {new Date(match.startTime).toLocaleString()}
                                    </div>
                                    {match.isLive && (
                                        <span className="badge badge-live" style={{ marginTop: '0.5rem' }}>LIVE</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {generatedCode && (
                    <div>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h3>3. Generated HTML Code</h3>
                            <button
                                onClick={copyToClipboard}
                                className="btn btn-primary"
                                style={{ 
                                    background: copied ? '#10b981' : 'var(--accent-blue)',
                                    boxShadow: copied ? '0 0 20px rgba(16, 185, 129, 0.5)' : '0 0 20px var(--glow-blue)'
                                }}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                            </button>
                        </div>
                        <textarea
                            value={generatedCode}
                            readOnly
                            style={{
                                width: '100%',
                                height: '300px',
                                background: '#0f172a',
                                color: '#f8fafc',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                resize: 'vertical',
                                lineHeight: '1.5'
                            }}
                        />
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
