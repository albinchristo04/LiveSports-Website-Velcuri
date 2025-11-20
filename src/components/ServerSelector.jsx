import React from 'react';
import { Server } from 'lucide-react';

const ServerSelector = ({ selectedServer, onSelect }) => {
  return (
    <div className="server-selector">
      <button
        onClick={() => onSelect('server1')}
        className={`glass-button server-btn ${selectedServer === 'server1' ? 'active' : ''}`}
      >
        <Server size={24} />
        <span>Server 1</span>
      </button>

      <button
        onClick={() => onSelect('server2')}
        className={`glass-button server-btn ${selectedServer === 'server2' ? 'active' : ''}`}
      >
        <Server size={24} />
        <span>Server 2</span>
      </button>
    </div>
  );
};

export default ServerSelector;
