import React, { useState } from 'react';
import { Link, Lock, Wifi, Shield, AlertCircle, Zap } from 'lucide-react';
import { ActionType } from '../types';
import './ActionButtons.css';

interface ActionButtonsProps {
  onAction: (actionType: ActionType) => void;
  disabled: boolean;
  currentRiskScore: number;
}

const RISK_POINTS: Record<string, number> = {
  'suspicious_link': 30,
  'weak_password': 25,
  'public_wifi': 20,
  'excessive_permissions': 15
};

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAction, disabled, currentRiskScore }) => {
  const [hoveredAction, setHoveredAction] = useState<ActionType | null>(null);
  
  const actions = [
    {
      type: 'suspicious_link' as ActionType,
      label: 'Click Suspicious Link',
      icon: Link,
      description: 'Simulate clicking on a phishing link'
    },
    {
      type: 'weak_password' as ActionType,
      label: 'Use Weak Password',
      icon: Lock,
      description: 'Set an easy-to-guess password'
    },
    {
      type: 'public_wifi' as ActionType,
      label: 'Connect to Public Wi-Fi',
      icon: Wifi,
      description: 'Connect to unsecured network'
    },
    {
      type: 'excessive_permissions' as ActionType,
      label: 'Grant Excessive Permissions',
      icon: Shield,
      description: 'Allow unnecessary app access'
    }
  ];

  const getNewRiskScore = (actionType: ActionType): number => {
    const riskPoints = RISK_POINTS[actionType] || 0;
    return Math.min(100, currentRiskScore + riskPoints);
  };

  return (
    <div className="action-buttons">
      <h2><AlertCircle size={24} /> Simulate Risky Actions</h2>
      <div className="buttons-grid">
        {actions.map((action) => {
          const isHovered = hoveredAction === action.type;
          const riskPoints = RISK_POINTS[action.type];
          const newRiskScore = getNewRiskScore(action.type);
          
          return (
            <div key={action.type} className="action-button-wrapper">
              <button
                className="action-button"
                onClick={() => onAction(action.type)}
                disabled={disabled}
                onMouseEnter={() => setHoveredAction(action.type)}
                onMouseLeave={() => setHoveredAction(null)}
              >
                <div className="action-icon">
                  <action.icon size={28} />
                </div>
                <div className="action-label">{action.label}</div>
                <div className="action-description">{action.description}</div>
                <div className="risk-badge">+{riskPoints} risk</div>
              </button>
              
              {isHovered && !disabled && (
                <div className="prediction-tooltip">
                  <div className="prediction-header">
                    <Zap size={16} /> What if you do this?
                  </div>
                  <div className="prediction-content">
                    <div className="prediction-item">
                      <span className="prediction-label">Risk increase:</span>
                      <span className="prediction-value">+{riskPoints} points</span>
                    </div>
                    <div className="prediction-item">
                      <span className="prediction-label">New score:</span>
                      <span className="prediction-value">{newRiskScore}/100</span>
                    </div>
                    {newRiskScore >= 75 && (
                      <div className="prediction-warning">
                        ⚠️ Very risky! Consider a safer alternative.
                      </div>
                    )}
                    {newRiskScore >= 50 && newRiskScore < 75 && (
                      <div className="prediction-caution">
                        ⚡ This action increases your risk significantly.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionButtons;
