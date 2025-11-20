import React, { useState, useEffect } from 'react';
import { Trophy, MapPin, Calendar } from 'lucide-react';

const MatchStats = ({ query }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!query) return;

            try {
                // Use TheSportsDB free test API key '3'
                const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=${encodeURIComponent(query)}`);
                const data = await response.json();

                if (data && data.event && data.event.length > 0) {
                    // Get the most recent or relevant match. 
                    // The API returns a list, usually sorted or we can pick the first one.
                    // For better relevance, we might want to filter by date if we had the date, 
                    // but for now, taking the first one is a reasonable approximation for "stats about this matchup".
                    setStats(data.event[0]);
                }
            } catch (error) {
                console.error("Failed to fetch match stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [query]);

    if (loading) return null;
    if (!stats) return null;

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Trophy size={20} color="var(--accent-color)" />
                <h3>Match Stats & Info</h3>
            </div>

            <div className="stats-container">
                <div className="stat-row">
                    <div className="stat-item">
                        <span className="stat-label">League</span>
                        <span className="stat-value">{stats.strLeague}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Season</span>
                        <span className="stat-value">{stats.strSeason}</span>
                    </div>
                </div>

                <div className="score-board" style={{ margin: '1.5rem 0', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="team-score" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.strHomeTeam}</div>
                        {stats.intHomeScore !== null && <div style={{ fontSize: '2rem', color: 'var(--accent-color)' }}>{stats.intHomeScore}</div>}
                    </div>
                    <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>VS</div>
                    <div className="team-score" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.strAwayTeam}</div>
                        {stats.intAwayScore !== null && <div style={{ fontSize: '2rem', color: 'var(--accent-color)' }}>{stats.intAwayScore}</div>}
                    </div>
                </div>

                <div className="stat-row">
                    <div className="stat-item">
                        <MapPin size={16} style={{ marginRight: '0.5rem', color: 'var(--text-secondary)' }} />
                        <span>{stats.strVenue}</span>
                    </div>
                    <div className="stat-item">
                        <Calendar size={16} style={{ marginRight: '0.5rem', color: 'var(--text-secondary)' }} />
                        <span>{stats.dateEvent}</span>
                    </div>
                </div>

                {stats.strDescriptionEN && (
                    <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {stats.strDescriptionEN}
                    </div>
                )}
            </div>

            <style>{`
        .stat-row {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .stat-item {
            display: flex;
            align-items: center;
        }
        .stat-label {
            color: var(--text-secondary);
            margin-right: 0.5rem;
            font-size: 0.9rem;
        }
        .stat-value {
            font-weight: 500;
        }
      `}</style>
        </div>
    );
};

export default MatchStats;
