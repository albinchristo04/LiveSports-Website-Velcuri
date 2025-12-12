// Helper component for isolating ad scripts
const IframeAdWrapper = ({ children, width = '300px', height = '250px' }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe) {
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html>
                <head><style>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;background:transparent;}</style></head>
                <body>${children}</body>
                </html>
            `);
            doc.close();
        }
    }, [children]);

    return (
        <iframe
            ref={iframeRef}
            style={{ border: 'none', width, height, overflow: 'hidden' }}
            title="Ad"
        />
    );
};

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

    // Special handling for Placement 3 (Above Player) - Replace AdSense with new ad codes
    if (placementId === '3') {
        return (
            <div
                className={`ad-container ${className}`}
                style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '1.5rem 0',
                    width: '100%',
                    ...style
                }}
            >
                {/* Ad 1: HighPerformanceFormat */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', padding: '0.5rem' }}>
                    <IframeAdWrapper width="300px" height="250px">
                        {`
                            <script type="text/javascript">
                                atOptions = {
                                    'key' : 'ce3f21e18814632d95fc9d6c33f8e7ed',
                                    'format' : 'iframe',
                                    'height' : 250,
                                    'width' : 300,
                                    'params' : {}
                                };
                            </script>
                            <script type="text/javascript" src="https://www.highperformanceformat.com/ce3f21e18814632d95fc9d6c33f8e7ed/invoke.js"></script>
                        `}
                    </IframeAdWrapper>
                </div>

                {/* Ad 2: EffectiveGateCPM - Container */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', padding: '0.5rem' }}>
                    <IframeAdWrapper width="300px" height="250px">
                        {`
                           <script async="async" data-cfasync="false" src="https://pl28221775.effectivegatecpm.com/109e5b336e522aab42d32897f53e6f7a/invoke.js"></script>
                           <div id="container-109e5b336e522aab42d32897f53e6f7a"></div>
                        `}
                    </IframeAdWrapper>
                </div>
            </div>
        );
    }

    // Default AdSense rendering for other placements
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
