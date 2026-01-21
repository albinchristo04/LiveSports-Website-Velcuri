import React, { useEffect, useRef } from 'react';

/**
 * AdUnit component supporting AdSense and new Ad codes
 */
const AdUnit = ({
    placementId = '1',
    style,
    className = '',
    type = 'display' // 'display' or 'anchor'
}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (placementId === '1') {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.warn('AdSense push error:', e);
            }
            return;
        }

        // For other placements, inject the new ad codes
        const container = containerRef.current;
        if (!container) return;

        // Clear previous content
        container.innerHTML = '';

        if (placementId === '2' || placementId === 'highlights-bottom' || placementId === '4') {
            // 300x250 Iframe Ad
            const script1 = document.createElement('script');
            script1.innerHTML = `
                atOptions = {
                    'key' : 'ce3f21e18814632d95fc9d6c33f8e7ed',
                    'format' : 'iframe',
                    'height' : 250,
                    'width' : 300,
                    'params' : {}
                };
            `;
            const script2 = document.createElement('script');
            script2.src = "https://www.highperformanceformat.com/ce3f21e18814632d95fc9d6c33f8e7ed/invoke.js";

            container.appendChild(script1);
            container.appendChild(script2);
        } else if (placementId === '3' || placementId === 'highlights-top') {
            // 320x50 Iframe Ad
            const script1 = document.createElement('script');
            script1.innerHTML = `
                atOptions = {
                    'key' : '2c2f4669d50ce38bc53968f8f16e3494',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                };
            `;
            const script2 = document.createElement('script');
            script2.src = "https://www.highperformanceformat.com/2c2f4669d50ce38bc53968f8f16e3494/invoke.js";

            container.appendChild(script1);
            container.appendChild(script2);
        } else if (type === 'anchor' || placementId === 'container') {
            // Container Ad
            const script = document.createElement('script');
            script.async = true;
            script.setAttribute('data-cfasync', 'false');
            script.src = "https://pl28221775.effectivegatecpm.com/109e5b336e522aab42d32897f53e6f7a/invoke.js";

            const div = document.createElement('div');
            div.id = "container-109e5b336e522aab42d32897f53e6f7a";

            container.appendChild(script);
            container.appendChild(div);
        }
    }, [placementId, type]);

    if (placementId === '1') {
        return (
            <div
                className={`ad-container ${className}`}
                style={{
                    margin: '1.5rem 0',
                    textAlign: 'center',
                    minHeight: '280px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    width: '100%',
                    overflow: 'hidden',
                    ...style
                }}
            >
                <ins className="adsbygoogle"
                    style={{ display: 'block', width: '100%' }}
                    data-ad-client="ca-pub-9635539719400885"
                    data-ad-slot="8985770044"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`ad-container ${className}`}
            style={{
                margin: '1.5rem 0',
                textAlign: 'center',
                minHeight: placementId === '3' ? '60px' : '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                overflow: 'hidden',
                ...style
            }}
        />
    );
};

export default AdUnit;
