import React from 'react';
import { ActionHistoryItem } from '../types';
import './Timeline.css';

interface TimelineProps {
  history: ActionHistoryItem[];
}

const Timeline: React.FC<TimelineProps> = ({ history }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatActionType = (actionType: string) => {
    return actionType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getActionIcon = (actionType: string) => {
    const icons: { [key: string]: string } = {
      suspicious_link: '🔗',
      weak_password: '🔓',
      public_wifi: '📶',
      excessive_permissions: '⚠️'
    };
    return icons[actionType] || '⚠️';
  };

  return (
    <div className="timeline">
      <h2>Action History</h2>
      {history.length === 0 ? (
        <div className="timeline-empty">
          No risky actions performed yet. Start by clicking one of the action buttons above.
        </div>
      ) : (
        <div className="timeline-list">
          {[...history].reverse().map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-icon">{getActionIcon(item.action_type)}</div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-action">{formatActionType(item.action_type)}</span>
                  <span className="timeline-risk">+{item.risk_points} risk</span>
                </div>
                <div className="timeline-time">{formatTime(item.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;
