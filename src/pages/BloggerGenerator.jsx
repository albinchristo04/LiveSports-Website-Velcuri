import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import { Copy, Check, RefreshCw, Server, Code, Smartphone } from 'lucide-react';

const BloggerGenerator = () => {
    const [server, setServer] = useState('server1');
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [generatedCode, setGeneratedCode] = useState('');
    const [copied, setCopied] = useState(false);

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
            const embedUrl = `${window.location.origin}/embed/${match.id}/${index}`;
            return `<button class="stream-btn ${index === 0 ? 'active' : ''}" onclick="changeStream('${embedUrl}', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                ${stream.name || `Server ${index + 1}`}
            </button>`;
        }).join('\n                ');

        const firstStreamUrl = streams.length > 0 ? `${window.location.origin}/embed/${match.id}/0` : '';

        const code = `<!-- Match Content Start - Mobile Optimized -->
<style>
/* Mobile-specific overrides for this post */
@media (max-width: 768px) {
    .match-container {
        padding: 0 !important;
    }
    
    .match-header.glass-panel,
    .player-section.glass-panel {
        border-radius: 0 !important;
        border-left: none !important;
        border-right: none !important;
        padding: 1rem !important;
    }
    
    .video-container {
        margin-left: -1rem !important;
        margin-right: -1rem !important;
        width: calc(100% + 2rem) !important;
        border-radius: 0 !important;
        border-left: none !important;
        border-right: none !important;
        padding: 0 !important;
    }
    
    .stream-buttons {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.5rem !important;
    }
    
    .stream-btn {
        width: 100% !important;
        justify-content: flex-start !important;
        padding: 1rem !important;
    }
    
    .ad-container {
        margin-left: 0 !important;
        margin-right: 0 !important;
        border-radius: 0 !important;
    }
    
    .match-meta {
        flex-direction: column !important;
        gap: 0.5rem !important;
        align-items: flex-start !important;
    }
}
</style>

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



    <div class="player-section glass-panel">
        <div class="server-list">
            <h3>Select Server</h3>
            <div class="stream-buttons">
                ${streamButtons}
            </div>
        </div>



        <div class="video-container">
            <iframe id="main-player" src="${firstStreamUrl}" frameborder="0" allowfullscreen allow="autoplay; encrypted-media" sandbox="allow-same-origin allow-scripts allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox" scrolling="no"></iframe>
        </div>
        

    </div>


</div>

<script>
function changeStream(url, btn) {
    document.getElementById('main-player').src = url;
    document.querySelectorAll('.stream-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}
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
                    fontSize: '2rem',
                    flexWrap: 'wrap'
                }}>
                    <Code size={32} />
                    Blogger Post Generator
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        background: 'rgba(34, 197, 94, 0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        border: '1px solid rgba(34, 197, 94, 0.4)'
                    }}>
                        <Smartphone size={16} />
                        Mobile Optimized
                    </span>
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
                            marginBottom: '1rem',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <h3 style={{ fontSize: '1.2rem' }}>3. Generated HTML Code</h3>
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
                            <p style={{ margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Smartphone size={16} />
                                <strong>Mobile Optimized:</strong> Full-width player, responsive buttons, optimized spacing
                            </p>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                                ✅ 6 Ad Units Included • 📱 Works perfectly on all devices
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