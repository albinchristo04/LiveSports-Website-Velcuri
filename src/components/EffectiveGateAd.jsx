import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const EffectiveGateAd = () => {
    // This component uses useLocation to ensure the ad script can potentially react to route changes.
    // However, some invoker scripts are designed to run once and insert an iframe.
    // If the unexpected behavior occurs (ad not showing on nav), we might need to clear and re-add the script.

    const location = useLocation();

    useEffect(() => {
        const containerId = "container-109e5b336e522aab42d32897f53e6f7a";
        const container = document.getElementById(containerId);

        if (!container) return;

        // Clean previous script if any specific marker exists, but usually the script tag itself 
        // is what we want to manage.
        // We will select the script by src to avoid duplicates or to reload it.
        const scriptSrc = "//pl28221775.effectivegatecpm.com/109e5b336e522aab42d32897f53e6f7a/invoke.js";

        // Remove existing script if it exists to force reload
        const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
        if (existingScript) {
            existingScript.remove();
        }

        // Create and append new script
        const script = document.createElement('script');
        script.async = true;
        script.dataset.cfasync = "false";
        script.src = scriptSrc;

        // Append to body or container? 
        // Usually invoke scripts look for the id in the whole document.
        // Appending to body is safest.
        document.body.appendChild(script);

        return () => {
            // Cleanup on unmount or route change
            const currentScript = document.querySelector(`script[src="${scriptSrc}"]`);
            if (currentScript) {
                currentScript.remove();
            }
            // Optional: Clear container content if the ad fills it with an iframe
            if (container) {
                container.innerHTML = '';
            }
        };
    }, [location.pathname]); // Re-run on route change

    return (
        <div
            id="container-109e5b336e522aab42d32897f53e6f7a"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '1rem 0',
                minHeight: '90px' // Reserve some space to avoid layout shift
            }}
        ></div>
    );
};

export default EffectiveGateAd;
