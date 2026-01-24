import React, { useEffect } from 'react';

/**
 * AdUnit component for Google AdSense
 * Replaces previous Amazon and other ad implementations
 */
const AdUnit = ({
    placementId = '1',
    style,
    className = '',
    type = 'display' // 'display' or 'anchor'
}) => {
    // Map placement IDs to the new AdSense Slot IDs provided by the user
    const getAdSlotId = (pid) => {
        switch (pid) {
            case '1':
            case 'highlights-top':
                return '8985770044'; // ad1
            case '2':
            case 'highlights-bottom':
                return '5984202189'; // ad2
            case '3':
                return '2379999099'; // ad3
            case '4': // Footer
                return '8985770044'; // Reuse ad1
            case 'anchor':
                return '5984202189'; // Reuse ad2
            default:
                return '8985770044'; // Default to ad1
        }
    };

    const slotId = getAdSlotId(placementId);

    useEffect(() => {
        try {
            // Push the ad to AdSense
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.warn('AdSense push error:', e);
        }
    }, [slotId]);

    const isFooter = placementId === '4';
    const isAnchor = type === 'anchor';

    if (isAnchor) {
        return (
            <div
                className="adsense-anchor-wrapper"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 1000,
                    background: 'rgba(0,0,0,0.9)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <ins className="adsbygoogle"
                    style={{ display: 'block', width: '100%', maxWidth: '728px', height: '90px' }}
                    data-ad-client="ca-pub-9635539719400885"
                    data-ad-slot={slotId}
                    data-ad-format="horizontal"
                    data-full-width-responsive="true"></ins>
            </div>
        );
    }

    return (
        <div
            className={`ad-container ${className}`}
            style={{
                margin: '1.5rem 0',
                textAlign: 'center',
                minHeight: isFooter ? '90px' : '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                padding: isFooter ? '0.5rem' : '1rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                width: '100%',
                overflow: 'hidden',
                ...style
            }}
        >
            <ins className="adsbygoogle"
                style={{ display: 'block', width: '100%' }}
                data-ad-client="ca-pub-9635539719400885"
                data-ad-slot={slotId}
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    );
};

export default AdUnit;
