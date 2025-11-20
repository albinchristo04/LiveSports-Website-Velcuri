import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px' }}>
            <Link to="/" className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
                <ArrowLeft size={20} />
                Back to Home
            </Link>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '1.5rem' }}>Privacy Policy</h1>

                <p><strong>Last updated: November 20, 2025</strong></p>

                <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Introduction</h2>
                <p>Welcome to Velcuri.io ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>

                <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Information We Collect</h2>
                <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li><strong>Log Data:</strong> Information such as your IP address, browser type, operating system, referring URLs, and pages visited.</li>
                    <li><strong>Cookies:</strong> We use cookies to enhance your experience, serve personalized ads (via Google AdSense), and analyze traffic (via Google Analytics).</li>
                </ul>

                <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Use of Information</h2>
                <p>We use the information we collect to:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li>Operate and maintain the website.</li>
                    <li>Improve user experience and analyze usage trends.</li>
                    <li>Serve relevant advertisements.</li>
                </ul>

                <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. Third-Party Services</h2>
                <p>We use third-party services such as Google Analytics and Google AdSense. These third parties may access your data to perform tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
                <p>Google AdSense uses cookies to serve ads based on a user's prior visits to your website or other websites. Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>Google Ads Settings</a>.</p>

                <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>5. Contact Us</h2>
                <p>If you have questions about this Privacy Policy, please contact us.</p>
            </div>
        </div>
    );
};

export default Privacy;
