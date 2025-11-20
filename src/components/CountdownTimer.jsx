import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && interval === 'days' && timeLeft[interval] === 0) return;

        timerComponents.push(
            <div key={interval} className="timer-segment">
                <span className="timer-value">{timeLeft[interval]}</span>
                <span className="timer-label">{interval}</span>
            </div>
        );
    });

    if (timerComponents.length === 0) {
        return null; // Timer finished
    }

    return (
        <div className="countdown-container glass-panel">
            <h3>Match Starts In</h3>
            <div className="timer-display">
                {timerComponents}
            </div>
            <style>{`
        .countdown-container {
            text-align: center;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            background: rgba(0, 0, 0, 0.3);
        }
        .countdown-container h3 {
            margin-bottom: 1rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            font-size: 0.9rem;
            letter-spacing: 1px;
        }
        .timer-display {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
        }
        .timer-segment {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .timer-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--accent-color);
            line-height: 1;
        }
        .timer-label {
            font-size: 0.75rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            margin-top: 0.25rem;
        }
      `}</style>
        </div>
    );
};

export default CountdownTimer;
