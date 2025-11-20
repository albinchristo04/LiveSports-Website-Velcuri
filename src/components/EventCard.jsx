import React, { useState, useEffect } from 'react';
import { Play, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const EventCard = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const start = new Date(event.startTime);
      if (start > now) {
        setTimeLeft(formatDistanceToNow(start, { addSuffix: true }));
      } else {
        setTimeLeft('Live Now');
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [event.startTime]);

  return (
    <Link to={`/match/${event.id}`} state={{ event }} className="glass-panel event-card">
      <div className="card-image">
        <img
          src={event.thumbnail}
          alt={event.title}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/640x360?text=No+Thumbnail' }}
        />
        {event.isLive ? (
          <span className="live-badge">LIVE</span>
        ) : (
          <span className="upcoming-badge">UPCOMING</span>
        )}
        <div className="play-overlay">
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%', backdropFilter: 'blur(4px)' }}>
            <Play fill="white" color="white" size={32} />
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="card-meta">
          <span className="league-tag">{event.league}</span>
          <div className="time-tag">
            <Clock size={12} />
            <span>{timeLeft}</span>
          </div>
        </div>

        <h3 className="card-title">{event.title}</h3>

        <div className="card-date">
          <Calendar size={14} />
          <span>{new Date(event.startTime).toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
