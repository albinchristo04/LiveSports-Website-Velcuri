import React from 'react';
import { Send } from 'lucide-react';

const FloatingSocial = () => {
    return (
        <a
            href="https://t.me/+brOxYHl33qljZTQ1"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#0088cc',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 136, 204, 0.4)',
                zIndex: 1000,
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <Send size={28} />
        </a>
    );
};

export default FloatingSocial;
