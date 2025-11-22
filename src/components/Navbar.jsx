import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Tv, Home, Shield, FileText, Send, Link as LinkIcon } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'TV Channels', path: '/tv-channels', icon: <Tv size={18} /> },
        { name: 'Telegram Tool', path: '/telegram-tool', icon: <Send size={18} /> },
        { name: 'Link Aggregator', path: '/link-aggregator', icon: <LinkIcon size={18} /> },
        { name: 'Privacy', path: '/privacy', icon: <Shield size={18} /> },
        { name: 'DMCA', path: '/dmca', icon: <FileText size={18} /> },
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="glass-panel" style={{
            marginBottom: '1.5rem',
            padding: '0.75rem 1.5rem',
            position: 'sticky',
            top: '1rem',
            zIndex: 50,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 className="app-title" style={{ fontSize: '1.5rem', margin: 0 }}>Velcuri.io</h1>
            </Link>

            {/* Desktop Menu */}
            <div className="desktop-menu" style={{ display: 'flex', gap: '1rem' }}>
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: isActive(link.path) ? 'var(--accent-color)' : 'var(--text-secondary)',
                            background: isActive(link.path) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {link.icon}
                        <span>{link.name}</span>
                    </Link>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <button
                className="mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="mobile-menu-overlay" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '1rem',
                    borderBottomLeftRadius: '12px',
                    borderBottomRightRadius: '12px',
                    border: '1px solid var(--glass-border)',
                    borderTop: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                color: isActive(link.path) ? 'var(--accent-color)' : 'var(--text-primary)',
                                background: isActive(link.path) ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                            }}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .desktop-menu { display: none !important; }
                    .mobile-menu-btn { display: block !important; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
