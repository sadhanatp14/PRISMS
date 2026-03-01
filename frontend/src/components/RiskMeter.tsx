import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
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

  const getRiskLevelIcon = () => {
    if (riskScore < 30) return <CheckCircle className="risk-icon" size={32} />;
    if (riskScore <= 60) return <AlertCircle className="risk-icon" size={32} />;
    return <AlertTriangle className="risk-icon" size={32} />;
  };
{getRiskLevelIcon()}
          
  return (
    <div className="risk-meter">
      <h2><TrendingUp size={24} /> Current Risk Level</h2>
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
