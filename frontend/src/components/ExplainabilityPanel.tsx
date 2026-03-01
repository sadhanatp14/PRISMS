import React from 'react';
import { LastAction } from '../types';
import './ExplainabilityPanel.css';

interface ExplainabilityPanelProps {
  lastAction: LastAction | null;
}

const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({ lastAction }) => {
  const formatActionType = (actionType: string) => {
    return actionType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!lastAction) {
    return (
      <div className="explainability-panel">
        <h2>🛡️ Risk Explanation</h2>
        <div className="explainability-empty">
          Perform a risky action to see detailed explanations and safer alternatives.
        </div>
      </div>
    );
  }

  return (
    <div className="explainability-panel">
      <h2>🛡️ Risk Explanation</h2>
      <div className="explanation-action-title">
        Last Action: <span>{formatActionType(lastAction.action_type)}</span>
      </div>
      
      <div className="explanation-section">
        <div className="explanation-label">
          <span className="explanation-icon">❓</span>
          Why is this risky?
        </div>
        <div className="explanation-text">
          {lastAction.explanation}
        </div>
      </div>

      <div className="explanation-section">
        <div className="explanation-label">
          <span className="explanation-icon">⚠️</span>
          What could happen?
        </div>
        <div className="explanation-text consequence">
          {lastAction.predicted_consequence}
        </div>
      </div>

      <div className="explanation-section">
        <div className="explanation-label">
          <span className="explanation-icon">✅</span>
          Safer alternative
        </div>
        <div className="explanation-text alternative">
          {lastAction.safer_alternative}
        </div>
      </div>
    </div>
  );
};

export default ExplainabilityPanel;
