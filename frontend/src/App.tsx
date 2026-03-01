import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import RiskMeter from './components/RiskMeter';
import ActionButtons from './components/ActionButtons';
import Timeline from './components/Timeline';
import ExplainabilityPanel from './components/ExplainabilityPanel';
import ActivityMetricsDisplay from './components/ActivityMetrics';
import { api } from './api';
import { ActionType, ActionHistoryItem, LastAction, ActivityMetrics } from './types';
import activityTracker from './activityTracker';
import './App.css';

function App() {
  const [riskScore, setRiskScore] = useState(0);
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>([]);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [activityMetrics, setActivityMetrics] = useState<ActivityMetrics>(
    activityTracker.getMetrics()
  );

  // Load initial state
  useEffect(() => {
    loadState();
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
        <button className="reset-button" onClick={handleReset}>
          <RotateCcw size={18} />
          Reset Session
        </button>
      </header>

      <div className="app-container">
        <div className="left-column">
          <RiskMeter riskScore={riskScore} />
          <ActionButtons onAction={handleAction} disabled={loading} />
          <ActivityMetricsDisplay metrics={activityMetrics} />
        </div>

        <div className="right-column">
          <ExplainabilityPanel lastAction={lastAction} />
          <Timeline history={actionHistory} />
        </div>
      </div>

      <footer className="app-footer">
        <p>Educational Platform | Real-Time Risk Analysis Demo</p>
      </footer>
    </div>
  );
}

export default App;
