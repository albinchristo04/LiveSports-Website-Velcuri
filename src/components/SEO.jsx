import React, { useEffect } from 'react';

const SEO = ({ title, description, schema, image, noCanonical }) => {
    useEffect(() => {
        // Update Title
        if (title) {
            document.title = title;
        }

        // Helper to update or create meta tag
        const updateMeta = (name, content, attribute = 'name') => {
            if (!content) return;
            let element = document.querySelector(`meta[${attribute}="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, name);
                document.head.appendChild(element);
            }
            element.content = content;
        };

        // Update Description
        updateMeta('description', description);

        // Update Open Graph / Twitter Image
        if (image) {
            updateMeta('og:image', image, 'property');
            updateMeta('twitter:image', image);
            updateMeta('twitter:card', 'summary_large_image');
        }

        // Update Canonical Link
        const existingCanonical = document.querySelector('link[rel="canonical"]');
        if (noCanonical) {
            if (existingCanonical) existingCanonical.remove();
        } else {
            if (existingCanonical) {
                existingCanonical.setAttribute('href', window.location.href);
            } else {
                const link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                link.setAttribute('href', window.location.href);
                document.head.appendChild(link);
            }
        }

        // Inject Schema.org JSON-LD
        if (schema) {
            let script = document.querySelector('#seo-schema');
            if (!script) {
                script = document.createElement('script');
                script.id = 'seo-schema';
                script.type = 'application/ld+json';
                document.head.appendChild(script);
            }
            script.text = JSON.stringify(schema);
        }

        return () => {
            // Cleanup schema on unmount if needed, but usually fine to leave until next update
        };
    }, [title, description, schema, image]);

    return null;
};

export default SEO;
