import React, { useEffect, useRef } from 'react';

const AdUnit = ({
    placementId = '1',
    style,
    className = '',
    priority = 'normal',
    type = 'display' // 'display', 'anchor', or 'video'
}) => {
    const adRef = useRef(null);
    const initialized = useRef(false);

    // Map placement IDs to AdSense Slot IDs
    const getAdSlotId = (pid) => {
        switch (pid) {
            case 'highlights-top':
                return '3242297546'; // First1
            case 'highlights-bottom':
                return '3714292026'; // 2nd ads
            case '4': // Footer
                return '9931386408'; // Footer ad
            default:
                return '3242297546'; // Default to First1
        }
    };

    const slotId = getAdSlotId(placementId);

    useEffect(() => {
        // Ensure the AdSense script is loaded
        const loadScript = () => {
            if (document.querySelector('script[src*="adsbygoogle.js"]')) return;

            const script = document.createElement('script');
            script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9635539719400885";
            script.async = true;
            script.crossOrigin = "anonymous";
            document.head.appendChild(script);
        };

        loadScript();

        // Push the ad
        try {
            if (window.adsbygoogle) {
                // Check if this specific ad unit is already populated to avoid duplicates/errors
                if (adRef.current && !adRef.current.querySelector('iframe') && !initialized.current) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    initialized.current = true;
                }
            }
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, [placementId]);

    // Special handling for footer to ensure mobile sizing
    const isFooter = placementId === '4';
    const footerStyle = isFooter ? {
        display: 'block',
        width: '100%',
        textAlign: 'center',
        overflow: 'hidden'
    } : {};

    return (
        <div
            className={`ad-container ${className}`}
            style={{
                margin: '1.5rem 0',
                textAlign: 'center',
                minHeight: isFooter ? '50px' : '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: isFooter ? '0.5rem' : '1rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                ...style,
                ...footerStyle
            }}
        >
            <ins className="adsbygoogle"
                ref={adRef}
                style={{
                    display: isFooter ? 'inline-block' : 'block',
                    width: isFooter ? '300px' : 'auto',
                    height: isFooter ? '50px' : 'auto',
                    ...((!isFooter) && { minWidth: '300px', minHeight: '250px' })
                }}
                data-ad-client="ca-pub-9635539719400885"
                data-ad-slot={slotId}
                data-ad-format={isFooter ? undefined : "auto"}
                data-full-width-responsive={isFooter ? "false" : "true"}></ins>
        </div>
    );
};

export default AdUnit;
