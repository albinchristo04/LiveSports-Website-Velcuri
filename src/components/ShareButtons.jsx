import React from 'react';
import { Share2, MessageCircle, Twitter, Send } from 'lucide-react';

const ShareButtons = ({ title }) => {
    const url = window.location.href;
    const text = `Watch ${title} Live Stream Free on RojaDirecta!`;

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: <MessageCircle size={20} />,
            url: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
            color: '#25D366',
            bg: 'rgba(37, 211, 102, 0.1)'
        },
        {
            name: 'Twitter',
            icon: <Twitter size={20} />,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            color: '#1DA1F2',
            bg: 'rgba(29, 161, 242, 0.1)'
        },
        {
            name: 'Telegram',
            icon: <Send size={20} />,
            url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            color: '#0088cc',
            bg: 'rgba(0, 136, 204, 0.1)'
        }
    ];

    return (
        <div className="share-buttons-container" style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button"
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        color: link.color,
                        backgroundColor: link.bg,
                        borderColor: link.color,
                        textDecoration: 'none',
                        fontSize: '0.9rem'
                    }}
                >
                    {link.icon}
                    <span style={{ marginLeft: '0.5rem' }}>{link.name}</span>
                </a>
            ))}
        </div>
    );
};

export default ShareButtons;
