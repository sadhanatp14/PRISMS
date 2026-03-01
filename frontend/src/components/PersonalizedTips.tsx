import React from 'react';
import { Lightbulb, Shield, Lock, Wifi, AlertCircle } from 'lucide-react';
import { PersonalizedTip } from '../api';
import './PersonalizedTips.css';

interface PersonalizedTipsProps {
  tips: PersonalizedTip[];
}

const PersonalizedTips: React.FC<PersonalizedTipsProps> = ({ tips }) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'account security':
        return <Lock className="tip-icon" />;
      case 'network security':
        return <Wifi className="tip-icon" />;
      case 'privacy':
        return <Shield className="tip-icon" />;
      default:
        return <Lightbulb className="tip-icon" />;
    }
  };

  const getUrgencyClass = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return 'urgency-high';
      case 'medium':
        return 'urgency-medium';
      case 'low':
        return 'urgency-low';
      default:
        return 'urgency-low';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    return urgency.charAt(0).toUpperCase() + urgency.slice(1) + ' Priority';
  };

  if (tips.length === 0) {
    return (
      <div className="personalized-tips empty">
        <div className="empty-state">
          <Lightbulb className="empty-icon" />
          <p>Great job! No specific concerns right now.</p>
          <p className="empty-subtitle">Keep up the good security practices!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="personalized-tips">
      <div className="tips-header">
        <Lightbulb className="header-icon" />
        <h3>Your Personal Security Coach</h3>
        <p className="tips-subtitle">Based on your recent behavior patterns</p>
      </div>

      <div className="tips-list">
        {tips.map((tip, index) => (
          <div key={index} className={`tip-card ${getUrgencyClass(tip.urgency)}`}>
            <div className="tip-header-row">
              <div className="tip-category">
                {getCategoryIcon(tip.category)}
                <span>{tip.category}</span>
              </div>
              <div className={`tip-urgency ${getUrgencyClass(tip.urgency)}`}>
                <AlertCircle className="urgency-icon" />
                <span>{getUrgencyLabel(tip.urgency)}</span>
              </div>
            </div>
            <div className="tip-content">
              <p>{tip.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalizedTips;
