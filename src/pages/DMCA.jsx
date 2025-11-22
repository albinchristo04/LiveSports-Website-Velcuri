import React from 'react';
import Navbar from '../components/Navbar';

const DMCA = () => {
    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px' }}>
            <Navbar />
            <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
                <h1 style={{ marginBottom: '1.5rem' }}>DMCA Policy</h1>

                <p><strong>Digital Millennium Copyright Act Notice</strong></p>

                <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Content Disclaimer</h2>
                <p>Velcuri.io is an online service provider as defined in the Digital Millennium Copyright Act. We provide links to third-party content. We do not host, upload, or control any video content. All streams are hosted on external servers (such as p2p networks or third-party hosting sites) which are not under our control.</p>

                <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Copyright Infringement</h2>
                <p>We respect the intellectual property rights of others. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on this site, please notify our copyright agent.</p>

                <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Takedown Notice</h2>
                <p>To file a DMCA takedown notice, please provide the following information:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li>Identification of the copyrighted work claimed to have been infringed.</li>
                    <li>Identification of the material that is claimed to be infringing (URL).</li>
                    <li>Your contact information (address, telephone number, and email).</li>
                    <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner.</li>
                    <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</li>
                </ul>

                <p style={{ marginTop: '1rem' }}>Please send DMCA notices to: <strong>dmca@velcuri.io</strong> (Replace with actual email if available)</p>
            </div>
        </div>
    );
};

export default DMCA;
