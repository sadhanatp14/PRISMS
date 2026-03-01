import React from 'react';
import './RiskMeter.css';

interface RiskMeterProps {
  riskScore: number;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ riskScore }) => {
  const getRiskLevel = () => {
    if (riskScore < 30) return 'low';
    if (riskScore <= 60) return 'medium';
    return 'high';
  };

  const getRiskLevelText = () => {
    if (riskScore < 30) return 'Low Risk';
    if (riskScore <= 60) return 'Medium Risk';
    return 'High Risk';
  };

  const riskLevel = getRiskLevel();

  return (
    <div className="risk-meter">
      <h2>Current Risk Level</h2>
      <div className="meter-container">
        <div className={`meter-circle ${riskLevel}`}>
          <div className="meter-score">{riskScore}</div>
          <div className="meter-max">/ 100</div>
        </div>
      </div>
      <div className={`risk-label ${riskLevel}`}>
        {getRiskLevelText()}
      </div>
      <div className="risk-bar-container">
        <div 
          className={`risk-bar ${riskLevel}`}
          style={{ width: `${riskScore}%` }}
        />
      </div>
    </div>
  );
};

export default RiskMeter;
