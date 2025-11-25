import React, { useEffect, useRef } from 'react';

const AdUnit = ({
    placementId = '1',
    style,
    className = '',
    priority = 'normal',
    type = 'display' // 'display', 'anchor', or 'video'
}) => {
    const adRef = useRef(null);

    useEffect(() => {
        // Ads will auto-initialize via the universal ads script
        // The script looks for elements with id="ua-placement-{id}" or id="ua-anchor"

        // Optional: Trigger manual refresh if needed
        if (window.universalAds && typeof window.universalAds.refresh === 'function') {
            try {
                window.universalAds.refresh();
            } catch (e) {
                console.warn('Universal ads refresh error:', e);
            }
        }
    }, [placementId]);

    // Generate the correct ID based on type
    const getAdId = () => {
        if (type === 'anchor') return 'ua-anchor';
        if (type === 'video') return ''; // Video ads use class instead
        return `ua-placement-${placementId}`;
    };

    // For video ads, use class instead of id
    if (type === 'video') {
        return (
            <div
                ref={adRef}
                className="nasvideo"
                style={{
                    margin: '1.5rem 0',
                    textAlign: 'center',
                    minHeight: '280px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    padding: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    ...style
                }}
            />
        );
    }

    return (
        <div
            className={`ad-container ${className}`}
            style={{
                margin: type === 'anchor' ? '0' : '1.5rem 0',
                textAlign: 'center',
                minHeight: type === 'anchor' ? 'auto' : '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                ...style
            }}
        >
            <div
                ref={adRef}
                id={getAdId()}
                style={{
                    width: '100%',
                    minHeight: type === 'anchor' ? 'auto' : '250px',
                    display: 'block'
                }}
            />
        </div>
    );
};

export default AdUnit;
