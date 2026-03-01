import axios from 'axios';
import { ActionType, ActionResponse, StateResponse } from './types';

const API_BASE_URL = 'http://localhost:8000';

export interface HygieneScoreResponse {
  hygiene_score: number;
  total_actions: number;
  risky_actions: number;
  grade: string;
  message: string;
  recommendation: string;
  total_risk_accumulated: number;
}

export interface RiskBreakdownResponse {
  breakdown: {
    [key: string]: {
      risk_points: number;
      percentage: number;
    };
  };
  total_risk: number;
  weakest_area: string | null;
}

export interface PersonalizedTip {
  tip: string;
  category: string;
  urgency: string;
}

export interface PersonalizedTipsResponse {
  tips: PersonalizedTip[];
}

export const api = {
  async performAction(actionType: ActionType): Promise<ActionResponse> {
    const response = await axios.post<ActionResponse>(`${API_BASE_URL}/action`, {
      action_type: actionType
    });
    return response.data;
  },

  async getState(): Promise<StateResponse> {
    const response = await axios.get<StateResponse>(`${API_BASE_URL}/state`);
    return response.data;
  },

  async getHygieneScore(): Promise<HygieneScoreResponse> {
    const response = await axios.get<HygieneScoreResponse>(`${API_BASE_URL}/hygiene-score`);
    return response.data;
  },

  async getRiskBreakdown(): Promise<RiskBreakdownResponse> {
    const response = await axios.get<RiskBreakdownResponse>(`${API_BASE_URL}/risk-breakdown`);
    return response.data;
  },

  async getPersonalizedTips(): Promise<PersonalizedTipsResponse> {
    const response = await axios.get<PersonalizedTipsResponse>(`${API_BASE_URL}/personalized-tips`);
    return response.data;
  },

  async resetState(): Promise<void> {
    await axios.post(`${API_BASE_URL}/reset`);
  }
};
