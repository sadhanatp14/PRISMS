import React from 'react';
import { Link, Lock, Wifi, Shield, AlertCircle } from 'lucide-react';
import { ActionType } from '../types';
import './ActionButtons.css';

interface ActionButtonsProps {
  onAction: (actionType: ActionType) => void;
  disabled: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAction, disabled }) => {
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

  return (
    <div className="action-buttons">
      <h2><AlertCircle size={24} /> Simulate Risky Actions</h2>
      <div className="buttons-grid">
        {actions.map((action) => (
          <button
            key={action.type}
            className="action-button"
            onClick={() => onAction(action.type)}
            disabled={disabled}
          >
            <div className="action-icon">
              <action.icon size={28} />
            </div>
            <div className="action-label">{action.label}</div>
            <div className="action-description">{action.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionButtons;
