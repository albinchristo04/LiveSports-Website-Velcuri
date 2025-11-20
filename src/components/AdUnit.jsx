import React, { useEffect, useRef } from 'react';

const AdUnit = ({ slot, style, format = 'auto', responsive = 'true', layoutKey }) => {
    const adRef = useRef(null);

    useEffect(() => {
        try {
            if (window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    return (
        <div className="ad-container" style={{ margin: '1rem 0', textAlign: 'center', overflow: 'hidden' }}>
            <ins
                className="adsbygoogle"
                style={style || { display: 'block' }}
                data-ad-client="ca-pub-9635539719400885"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
                data-ad-layout-key={layoutKey}
            ></ins>
        </div>
    );
};

export default AdUnit;
