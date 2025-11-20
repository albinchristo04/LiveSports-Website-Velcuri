import React, { useEffect } from 'react';

const SEO = ({ title, description, schema }) => {
    useEffect(() => {
        // Update Title
        if (title) {
            document.title = title;
        }

        // Update Description
        if (description) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.name = 'description';
                document.head.appendChild(metaDescription);
            }
            metaDescription.content = description;
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
    }, [title, description, schema]);

    return null;
};

export default SEO;
