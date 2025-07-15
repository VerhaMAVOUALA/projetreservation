
import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon: Icon, change, changeType = 'positive', color = 'blue' }) => {
  return (
    <div className={`stats-card ${color}`}>
      <div className="stats-content">
        <div className="stats-header">
          <div className="stats-info">
            <p className="stats-title">{title}</p>
            <p className="stats-value">{value}</p>
          </div>
          <div className="stats-icon">
            <Icon />
          </div>
        </div>
        
        {change && (
          <div className="stats-change">
            <span className={`change-indicator ${changeType}`}>
              {changeType === 'positive' ? '+' : ''}{change}
            </span>
            <span className="change-period">depuis le mois dernier</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
