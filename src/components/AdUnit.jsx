import React, { useEffect } from 'react';

const AdUnit = ({ style, className = '' }) => {
    useEffect(() => {
        // Universal ads will auto-initialize
        if (window.universalAds) {
            window.universalAds.init();
        }
    }, []);

    return (
        <div
            className={`ad-container ${className}`}
            style={{
                margin: '1.5rem 0',
                textAlign: 'center',
                minHeight: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                padding: '1rem',
                ...style
            }}
        >
            <div
                className="universal-ad"
                style={{
                    width: '100%',
                    minHeight: '250px',
                    display: 'block'
                }}
            ></div>
        </div>
    );
};

export default AdUnit;
