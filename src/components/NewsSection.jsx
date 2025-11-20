import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

const NewsSection = ({ query }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            if (!query) return;

            try {
                // Use Google News RSS feed converted to JSON
                // Search for the specific match query (e.g., "Real Madrid vs Barcelona")
                const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' sport')}&hl=en-US&gl=US&ceid=US:en`;
                const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.status === 'ok') {
                    setNews(data.items.slice(0, 4)); // Take top 4 news items
                }
            } catch (error) {
                console.error("Failed to fetch news", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [query]);

    if (loading) return null;
    if (news.length === 0) return null;

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Newspaper size={20} color="var(--accent-color)" />
                <h3>Latest News</h3>
            </div>

            <div className="news-grid">
                {news.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="news-card"
                    >
                        <h4 className="news-title">{item.title}</h4>
                        <div className="news-meta">
                            <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                            <ExternalLink size={12} />
                        </div>
                    </a>
                ))}
            </div>

            <style>{`
        .news-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        .news-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 1rem;
            text-decoration: none;
            color: inherit;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        }
        .news-card:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: var(--accent-color);
            transform: translateY(-2px);
        }
        .news-title {
            font-size: 0.95rem;
            margin-bottom: 0.75rem;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .news-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.75rem;
            color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
};

export default NewsSection;
