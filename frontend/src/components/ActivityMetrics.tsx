import React, { useState, useEffect } from 'react';
import { Mouse, BarChart3, Keyboard, Clock, Activity, Lightbulb } from 'lucide-react';
import { ActivityMetrics } from '../types';
import './ActivityMetrics.css';

interface ActivityMetricsProps {
  metrics: ActivityMetrics;
}

const ActivityMetricsDisplay: React.FC<ActivityMetricsProps> = ({ metrics }) => {
  const [displayTime, setDisplayTime] = useState('00:00');

  useEffect(() => {
    const minutes = Math.floor(metrics.timeOnPage / 60);
    const seconds = metrics.timeOnPage % 60;
    setDisplayTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
  }, [metrics.timeOnPage]);

  const getActivityRiskColor = () => {
    if (metrics.riskScore < 10) return 'low';
    if (metrics.riskScore < 20) return 'medium';
    return 'high';
  };

  return (
    <div className="activity-metrics">
      <h2><BarChart3 size={24} /> Real-Time Activity Tracking</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Mouse size={28} />
          </div>
          <div className="metric-label">Clicks</div>
          <div className="metric-value">{metrics.totalClicks}</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <BarChart3 size={28} />
          </div>
          <div className="metric-label">Scrolls</div>
          <div className="metric-value">{metrics.totalScrollEvents}</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Keyboard size={28} />
          </div>
          <div className="metric-label">Key Presses</div>
          <div className="metric-value">{metrics.totalKeyPresses}</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Clock size={28} />
          </div>
          <div className="metric-label">Time on Page</div>
          <div className="metric-value">{displayTime}</div>
        </div>
      </div>

      <div className="activity-status">
        <div className={`status-indicator ${metrics.isActiveNow ? 'active' : 'inactive'}`}>
          <Activity size={16} />
          {metrics.isActiveNow ? 'Active' : 'Inactive'}
        </div>
        <div className="last-activity">
          Last activity: {new Date(metrics.lastActivityTime).toLocaleTimeString()}
        </div>
      </div>

      <div className={`activity-risk-box ${getActivityRiskColor()}`}>
        <span className="activity-risk-label">Activity Risk Score</span>
        <span className="activity-risk-value">{metrics.riskScore}/30</span>
        <div className="activity-risk<Lightbulb size={18} />ar">
          <div 
            className="activity-risk-fill"
            style={{ width: `${(metrics.riskScore / 30) * 100}%` }}
          />
        </div>
      </div>

      <div className="activity-explanation">
        <p className="insight-title">💡 Real-Time Insights</p>
        <ul className="insight-list">
          <li>Your activity patterns are being monitored in real-time</li>
          <li>Rapid clicking can indicate careless behavior</li>
          <li>Frequent typing might indicate password reuse</li>
          <li>Inactivity followed by sudden activity may signal risky decisions</li>
        </ul>
      </div>
    </div>
  );
};

export default ActivityMetricsDisplay;
