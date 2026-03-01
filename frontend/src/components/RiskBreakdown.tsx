import React from 'react';
import { PieChart, AlertTriangle, Lock, Wifi } from 'lucide-react';
import './RiskBreakdown.css';

interface RiskCategory {
  risk_points: number;
  percentage: number;
}

interface RiskBreakdownResponse {
  breakdown: {
    [key: string]: RiskCategory;
  };
  total_risk: number;
  weakest_area: string | null;
}

interface RiskBreakdownProps {
  data: RiskBreakdownResponse;
}

const RiskBreakdown: React.FC<RiskBreakdownProps> = ({ data }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Account Security':
        return <Lock size={20} />;
      case 'Network Security':
        return <Wifi size={20} />;
      case 'Privacy':
        return <AlertTriangle size={20} />;
      default:
        return <PieChart size={20} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Account Security':
        return '#ef4444'; // Red
      case 'Network Security':
        return '#f59e0b'; // Amber
      case 'Privacy':
        return '#3b82f6'; // Blue
      default:
        return '#6b7280'; // Gray
    }
  };

  const getCategoryRecommendation = (category: string) => {
    switch (category) {
      case 'Account Security':
        return 'Use strong, unique passwords and be careful with phishing links';
      case 'Network Security':
        return 'Use VPN on public Wi-Fi and avoid unsecured networks';
      case 'Privacy':
        return 'Review app permissions and only grant necessary access';
      default:
        return 'Improve your digital security practices';
    }
  };

  const totalRisk = data.total_risk;
  const categories = Object.entries(data.breakdown);

  return (
    <div className="risk-breakdown-card">
      <div className="breakdown-header">
        <PieChart size={24} className="breakdown-icon" />
        <h2>Risk Breakdown by Category</h2>
      </div>

      {totalRisk === 0 ? (
        <div className="breakdown-empty">
          <p>No risky actions yet. Keep up your safe digital habits!</p>
        </div>
      ) : (
        <>
          <div className="breakdown-visual">
            <svg viewBox="0 0 100 100" className="pie-chart">
              {(() => {
                let currentAngle = 0;
                return categories.map(([category, data]) => {
                  const percentage = data.percentage;
                  const angle = (percentage / 100) * 360;
                  const sliceColor = getCategoryColor(category);
                  
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + angle;
                  
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = 50 + 40 * Math.cos(startRad);
                  const y1 = 50 + 40 * Math.sin(startRad);
                  const x2 = 50 + 40 * Math.cos(endRad);
                  const y2 = 50 + 40 * Math.sin(endRad);
                  
                  const largeArc = angle > 180 ? 1 : 0;
                  
                  const pathData = [
                    `M 50 50`,
                    `L ${x1} ${y1}`,
                    `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
                    'Z'
                  ].join(' ');
                  
                  const result = (
                    <path
                      key={category}
                      d={pathData}
                      fill={sliceColor}
                      className="pie-slice"
                    />
                  );
                  
                  currentAngle = endAngle;
                  return result;
                });
              })()}
            </svg>
          </div>

          <div className="breakdown-details">
            {categories.map(([category, categoryData]) => (
              <div key={category} className="category-item">
                <div className="category-header">
                  <div className="category-icon" style={{ color: getCategoryColor(category) }}>
                    {getCategoryIcon(category)}
                  </div>
                  <div className="category-info">
                    <span className="category-name">{category}</span>
                    <span className="category-points">{categoryData.risk_points} points</span>
                  </div>
                  <div className="category-percentage">{categoryData.percentage.toFixed(1)}%</div>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-progress"
                    style={{ 
                      width: `${categoryData.percentage}%`,
                      backgroundColor: getCategoryColor(category)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {data.weakest_area && (
            <div className="weakest-area-section">
              <div className="weakest-header">
                <AlertTriangle size={18} className="weakest-icon" />
                <span>Your Weakest Area</span>
              </div>
              <div className="weakest-content">
                <h3>{data.weakest_area}</h3>
                <p>{getCategoryRecommendation(data.weakest_area)}</p>
              </div>
            </div>
          )}

          <div className="total-risk-display">
            <span className="total-label">Total Risk Points</span>
            <span className="total-value">{totalRisk}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default RiskBreakdown;
