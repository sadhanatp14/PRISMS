import { useState, useEffect } from 'react';
import { RotateCcw, BarChart3, ActivitySquare, Activity } from 'lucide-react';
import RiskMeter from './components/RiskMeter';
import ActionButtons from './components/ActionButtons';
import Timeline from './components/Timeline';
import ExplainabilityPanel from './components/ExplainabilityPanel';
import ActivityMetricsDisplay from './components/ActivityMetrics';
import HygieneScore from './components/HygieneScore';
import { api, HygieneScoreResponse } from './api';
import { ActionType, ActionHistoryItem, LastAction, ActivityMetrics } from './types';
import activityTracker from './activityTracker';
import './App.css';

type PageType = 'dashboard' | 'hygiene' | 'activity';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [riskScore, setRiskScore] = useState(0);
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>([]);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [activityMetrics, setActivityMetrics] = useState<ActivityMetrics>(
    activityTracker.getMetrics()
  );
  const [hygieneScore, setHygieneScore] = useState<HygieneScoreResponse | null>(null);

  // Load initial state
  useEffect(() => {
    loadState();
    loadHygieneScore();
  }, []);

  // Update activity metrics in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityMetrics(activityTracker.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadState = async () => {
    try {
      const state = await api.getState();
      setRiskScore(state.risk_score);
      setActionHistory(state.action_history);
    } catch (error) {
      console.error('Failed to load state:', error);
    }
  };

  const loadHygieneScore = async () => {
    try {
      const score = await api.getHygieneScore();
      setHygieneScore(score);
    } catch (error) {
      console.error('Failed to load hygiene score:', error);
    }
  };

  const handleAction = async (actionType: ActionType) => {
    setLoading(true);
    try {
      const response = await api.performAction(actionType);
      
      if (response.success) {
        setRiskScore(response.updated_risk_score);
        setLastAction({
          explanation: response.explanation,
          predicted_consequence: response.predicted_consequence,
          safer_alternative: response.safer_alternative,
          action_type: actionType
        });
        
        // Reload state to get updated history
        await loadState();
        await loadHygieneScore();
      }
    } catch (error) {
      console.error('Failed to perform action:', error);
      alert('Failed to connect to the backend. Make sure the FastAPI server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset your risk score and history?')) {
      try {
        await api.resetState();
        setRiskScore(0);
        setActionHistory([]);
        setLastAction(null);
        activityTracker.resetTracker();
        setActivityMetrics(activityTracker.getMetrics());
        await loadHygieneScore();
      } catch (error) {
        console.error('Failed to reset state:', error);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">CyberMirror</h1>
          <p className="subtitle">Real-Time Cybersecurity & Privacy Risk Awareness</p>
        </div>
        
        <nav className="header-nav">
          <button 
            className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <ActivitySquare size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-button ${currentPage === 'activity' ? 'active' : ''}`}
            onClick={() => setCurrentPage('activity')}
          >
            <Activity size={18} />
            <span>Activity Tracking</span>
          </button>
          <button 
            className={`nav-button ${currentPage === 'hygiene' ? 'active' : ''}`}
            onClick={() => setCurrentPage('hygiene')}
          >
            <BarChart3 size={18} />
            <span>Digital Hygiene Score</span>
          </button>
        </nav>

        <button className="reset-button" onClick={handleReset}>
          <RotateCcw size={18} />
          Reset Session
        </button>
      </header>

      {currentPage === 'dashboard' ? (
        <>
          <div className="app-container">
            <div className="left-column">
              <RiskMeter riskScore={riskScore} />
              <ActionButtons onAction={handleAction} disabled={loading} currentRiskScore={riskScore} />
            </div>

            <div className="right-column">
              <ExplainabilityPanel lastAction={lastAction} />
              <Timeline history={actionHistory} />
            </div>
          </div>

          <footer className="app-footer">
            <p>Educational Platform | Real-Time Risk Analysis Demo</p>
          </footer>
        </>
      ) : currentPage === 'activity' ? (
        <>
          <div className="activity-page">
            <div className="activity-page-content">
              <ActivityMetricsDisplay metrics={activityMetrics} />
            </div>
          </div>

          <footer className="app-footer">
            <p>Educational Platform | Real-Time Risk Analysis Demo</p>
          </footer>
        </>
      ) : (
        <>
          <div className="hygiene-page">
            <div className="hygiene-page-content">
              {hygieneScore && (
                <HygieneScore
                  score={hygieneScore.hygiene_score}
                  grade={hygieneScore.grade}
                  message={hygieneScore.message}
                  recommendation={hygieneScore.recommendation}
                  totalActions={hygieneScore.total_actions}
                />
              )}
            </div>
          </div>

          <footer className="app-footer">
            <p>Educational Platform | Real-Time Risk Analysis Demo</p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
