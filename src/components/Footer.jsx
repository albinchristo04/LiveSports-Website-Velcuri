import React from 'react';
import { Link } from 'react-router-dom';
import AdUnit from './AdUnit';

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
            {/* Footer Ad - Prominent placement for maximum visibility */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto 2rem auto',
                padding: '0 1rem'
            }}>
                <AdUnit placementId="4" style={{
                    minHeight: '280px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--glass-border)'
                }} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <a
                    href="https://albinchristo04.github.io/livesportsapi.github.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button"
                    style={{
                        background: 'linear-gradient(45deg, var(--accent-color), #8b5cf6)',
                        border: 'none',
                        padding: '0.75rem 2rem',
                        fontWeight: 'bold',
                        textDecoration: 'none'
                    }}
                >
                    Buy the script
                </a>
            </div>
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
