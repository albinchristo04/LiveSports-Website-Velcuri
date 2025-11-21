export const reloadAdScript = () => {
    // Remove existing script if present
    const existingScript = document.querySelector('script[src="https://cdn.jsdelivr.net/gh/Tipblogg/nasrev-cdn/universal-ads.min.js"]');
    if (existingScript) {
        existingScript.remove();
    }

    // Create and append new script
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/Tipblogg/nasrev-cdn/universal-ads.min.js";
    script.async = true;
    document.head.appendChild(script);
};
