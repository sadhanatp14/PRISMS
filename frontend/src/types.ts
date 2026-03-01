export interface UserActivity {
  type: 'click' | 'scroll' | 'keypress' | 'mouse_move' | 'page_focus' | 'form_interaction';
  timestamp: string;
  details?: any;
}

export interface ActivityMetrics {
  totalClicks: number;
  totalScrollEvents: number;
  totalKeyPresses: number;
  totalMouseMoves: number;
  timeOnPage: number; // in seconds
  lastActivityTime: string;
  isActiveNow: boolean;
  riskScore: number; // Based on activity patterns
}

export interface ActionResponse {
  success: boolean;
  updated_risk_score: number;
  explanation: string;
  predicted_consequence: string;
  safer_alternative: string;
  risk_points_added: number;
}

export interface ActionHistoryItem {
  action_type: string;
  timestamp: string;
  risk_points: number;
  explanation: string;
}

export interface StateResponse {
  risk_score: number;
  action_history: ActionHistoryItem[];
  total_actions: number;
}

export type ActionType = 'suspicious_link' | 'weak_password' | 'public_wifi' | 'excessive_permissions';

export interface LastAction {
  explanation: string;
  predicted_consequence: string;
  safer_alternative: string;
  action_type: string;
}
