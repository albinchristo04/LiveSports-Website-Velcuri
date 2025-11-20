import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            marginTop: '3rem',
            padding: '2rem 1rem',
            borderTop: '1px solid var(--glass-border)',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
        }}>
            <div style={{ marginBottom: '1rem' }}>
                <Link to="/" style={{ margin: '0 0.5rem', color: 'inherit', textDecoration: 'none' }}>Home</Link>
                <span style={{ opacity: 0.3 }}>|</span>
                <Link to="/privacy" style={{ margin: '0 0.5rem', color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
                <span style={{ opacity: 0.3 }}>|</span>
                <Link to="/dmca" style={{ margin: '0 0.5rem', color: 'inherit', textDecoration: 'none' }}>DMCA</Link>
            </div>
            <div>
                &copy; {new Date().getFullYear()} Velcuri.io. All rights reserved.
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.7 }}>
                Disclaimer: This site does not host any content. All streams are found on external sites.
            </div>
        </footer>
    );
};

export default Footer;
