import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Conditionally injects AdSense and Analytics scripts based on the route.
 * Prevents ad bloat on /embed pages as requested.
 */
const AdScripts = () => {
    const location = useLocation();
    const isEmbed = location.pathname.startsWith('/embed');

    useEffect(() => {
        if (!isEmbed) {
            // 1. Google Analytics
            const gaScript = document.createElement('script');
            gaScript.async = true;
            gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-FFS7KE4D3H";
            gaScript.id = 'ga-main';
            document.head.appendChild(gaScript);

            const gaInline = document.createElement('script');
            gaInline.id = 'ga-inline';
            gaInline.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', 'G-FFS7KE4D3H');
            `;
            document.head.appendChild(gaInline);

            // 2. Google AdSense
            const adSenseScript = document.createElement('script');
            adSenseScript.async = true;
            adSenseScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9635539719400885";
            adSenseScript.id = 'adsense-main';
            adSenseScript.crossOrigin = "anonymous";
            document.head.appendChild(adSenseScript);

            return () => {
                // Cleanup when navigating away (though usually GA/AdSense tags stay)
                document.getElementById('ga-main')?.remove();
                document.getElementById('ga-inline')?.remove();
                document.getElementById('adsense-main')?.remove();
            };
        }
    }, [isEmbed]);

    return null;
};

export default AdScripts;
