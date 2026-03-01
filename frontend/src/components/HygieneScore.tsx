import React from 'react';
import { Award, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import './HygieneScore.css';

interface HygieneScoreProps {
  score: number;
  grade: string;
  message: string;
  recommendation: string;
  totalActions: number;
}

const HygieneScore: React.FC<HygieneScoreProps> = ({
  score,
  grade,
  message,
  recommendation,
  totalActions
}) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return '#10b981'; // Green
      case 'B':
        return '#3b82f6'; // Blue
      case 'C':
        return '#f59e0b'; // Amber
      case 'D':
        return '#ef8d63'; // Orange
      case 'F':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  const getGradeLabel = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'Excellent';
      case 'B':
        return 'Good';
      case 'C':
        return 'Fair';
      case 'D':
        return 'Poor';
      case 'F':
        return 'Needs Improvement';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="hygiene-score-card">
      <div className="hygiene-header">
        <Award size={24} className="hygiene-icon" />
        <h2>Digital Hygiene Score</h2>
      </div>

      <div className="score-display">
        <div className="score-circle" style={{ borderColor: getGradeColor(grade) }}>
          <div className="score-value">{score.toFixed(1)}</div>
          <div className="score-max">/100</div>
        </div>

        <div className="grade-badge" style={{ backgroundColor: getGradeColor(grade) }}>
          <div className="grade-letter">{grade}</div>
          <div className="grade-label">{getGradeLabel(grade)}</div>
        </div>
      </div>

      <div className="message-section">
        <div className="message-text">{message}</div>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <AlertCircle size={18} className="stat-icon" />
          <span className="stat-label">Risky Actions</span>
          <span className="stat-value">{totalActions}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <TrendingUp size={18} className="stat-icon" />
          <span className="stat-label">Safety Trend</span>
          <span className="stat-value">{score >= 80 ? '↑ Improving' : score >= 50 ? '→ Stable' : '↓ Declining'}</span>
        </div>
      </div>

      <div className="recommendation-section">
        <div className="recommendation-header">
          <CheckCircle2 size={18} />
          <span>Next Steps</span>
        </div>
        <div className="recommendation-text">{recommendation}</div>
      </div>

      <div className="motivation-bar">
        <div className="progress-fill" style={{ width: `${score}%`, backgroundColor: getGradeColor(grade) }}></div>
      </div>
      <div className="progress-text">Keep going! Improve your score for a safer digital life.</div>
    </div>
  );
};

export default HygieneScore;
