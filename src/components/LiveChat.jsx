import React from 'react';
import { MessageSquare } from 'lucide-react';

const LiveChat = () => {
    // NOTE: To make this chat fully functional for YOUR site, you should sign up at https://www.cbox.ws/
    // and replace the 'boxId' and 'boxtag' below with your own.
    // Currently using a demo/test ID or you can leave it as is if it works for testing.
    const boxId = "3543466"; // Example ID
    const boxTag = "4qk8l";  // Example Tag

    // If you don't have an ID yet, we can render a placeholder or a generic iframe.
    // For now, I'll render a Cbox iframe which is very common for sports sites.

    const chatUrl = `https://www5.cbox.ws/box/?boxid=${boxId}&boxtag=${boxTag}`;

    return (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', marginTop: '1.5rem', height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)' }}>
                <MessageSquare size={20} color="var(--accent-color)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Live Chat</h3>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                <iframe
                    src={chatUrl}
                    width="100%"
                    height="100%"
                    allowTransparency="yes"
                    allow="autoplay"
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                    scrolling="auto"
                    title="Live Chat"
                ></iframe>
            </div>

            <div style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)' }}>
                Be respectful. No spamming.
            </div>
        </div>
    );
};

export default LiveChat;
