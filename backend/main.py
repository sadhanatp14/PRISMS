from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime, timedelta

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Risk scoring rules
RISK_RULES = {
    "suspicious_link": {
        "risk_points": 30,
        "explanation": "Clicking suspicious links can lead to phishing attacks where attackers steal your credentials or install malware on your device.",
        "predicted_consequence": "Your personal data, passwords, or financial information could be stolen. Malware could be installed on your device.",
        "safer_alternative": "Hover over links to check the URL before clicking. Use a link checker tool. Only click links from trusted sources."
    },
    "weak_password": {
        "risk_points": 25,
        "explanation": "Weak passwords are easy for attackers to guess or crack using automated tools, giving them access to your accounts.",
        "predicted_consequence": "Your accounts could be hacked, leading to identity theft, data breaches, or unauthorized access to your personal information.",
        "safer_alternative": "Use strong passwords with 12+ characters including uppercase, lowercase, numbers, and symbols. Use a password manager to generate and store unique passwords."
    },
    "public_wifi": {
        "risk_points": 20,
        "explanation": "Public Wi-Fi networks are often unsecured, allowing attackers to intercept your data and monitor your online activities.",
        "predicted_consequence": "Attackers can steal your passwords, banking details, and personal messages. They could perform man-in-the-middle attacks.",
        "safer_alternative": "Use a VPN when connecting to public Wi-Fi. Avoid accessing sensitive accounts. Use your mobile hotspot instead."
    },
    "excessive_permissions": {
        "risk_points": 15,
        "explanation": "Granting excessive app permissions gives apps access to your personal data, location, contacts, and other sensitive information they don't need.",
        "predicted_consequence": "Apps could misuse your data, sell it to third parties, or expose it in a data breach. Your privacy is compromised.",
        "safer_alternative": "Only grant permissions that are essential for the app's core functionality. Review and revoke unnecessary permissions regularly in your device settings."
    }
}

# Global state (in production, use a database)
class AppState:
    def __init__(self):
        self.risk_score = 0
        self.action_history: List[Dict] = []
        self.session_start_time = datetime.now()
    
    def add_action(self, action_type: str):
        if action_type in RISK_RULES:
            rule = RISK_RULES[action_type]
            
            # Update risk score (cap at 100)
            self.risk_score = min(100, self.risk_score + rule["risk_points"])
            
            # Add to history
            action_entry = {
                "action_type": action_type,
                "timestamp": datetime.now().isoformat(),
                "risk_points": rule["risk_points"],
                "explanation": rule["explanation"]
            }
            self.action_history.append(action_entry)
            
            return {
                "updated_risk_score": self.risk_score,
                "explanation": rule["explanation"],
                "predicted_consequence": rule["predicted_consequence"],
                "safer_alternative": rule["safer_alternative"],
                "risk_points_added": rule["risk_points"]
            }
        return None
    
    def calculate_hygiene_score(self) -> Dict:
        """Calculate weekly digital hygiene score (0-100)"""
        if not self.action_history:
            return {
                "hygiene_score": 100,
                "total_actions": 0,
                "risky_actions": 0,
                "grade": "A",
                "message": "No risky actions detected! Keep up your safe digital habits.",
                "recommendation": "Continue practicing good cybersecurity habits."
            }
        
        total_actions = len(self.action_history)
        total_risk_accumulated = sum(action["risk_points"] for action in self.action_history)
        
        # Hygiene score = 100 - (accumulated risk / max possible risk * 100)
        # Max possible risk if user did all risky actions: 30+25+20+15 = 90 per cycle
        max_cycle_risk = 90
        risk_percentage = min(100, (total_risk_accumulated / (max_cycle_risk * 4)) * 100)  # Normalize
        hygiene_score = max(0, 100 - risk_percentage)
        
        # Determine grade
        if hygiene_score >= 90:
            grade = "A"
            message = "Excellent! You're making very safe digital choices!"
        elif hygiene_score >= 80:
            grade = "B"
            message = "Good job! You're being mindful of your digital security."
        elif hygiene_score >= 70:
            grade = "C"
            message = "Not bad, but there's room for improvement."
        elif hygiene_score >= 60:
            grade = "D"
            message = "You need to be more careful with your digital habits."
        else:
            grade = "F"
            message = "Significant risk detected. Focus on safer practices."
        
        # Recommendation based on most common risky action
        action_counts = {}
        for action in self.action_history:
            action_type = action["action_type"]
            action_counts[action_type] = action_counts.get(action_type, 0) + 1
        
        if action_counts:
            most_common_action = max(action_counts, key=action_counts.get)
            recommendation = f"Avoid {most_common_action.replace('_', ' ')} and remember: {RISK_RULES[most_common_action]['safer_alternative'].split('.')[0]}."
        else:
            recommendation = "Keep maintaining your good digital hygiene!"
        
        return {
            "hygiene_score": round(hygiene_score, 1),
            "total_actions": total_actions,
            "risky_actions": total_actions,
            "grade": grade,
            "message": message,
            "recommendation": recommendation,
            "total_risk_accumulated": total_risk_accumulated
        }

state = AppState()

# Request models
class ActionRequest(BaseModel):
    action_type: str

# API Endpoints
@app.post("/action")
async def process_action(request: ActionRequest):
    """Process a risky action and return updated risk score with explanations"""
    result = state.add_action(request.action_type)
    
    if result:
        return {
            "success": True,
            "updated_risk_score": result["updated_risk_score"],
            "explanation": result["explanation"],
            "predicted_consequence": result["predicted_consequence"],
            "safer_alternative": result["safer_alternative"],
            "risk_points_added": result["risk_points_added"]
        }
    else:
        return {
            "success": False,
            "message": "Unknown action type"
        }

@app.get("/state")
async def get_state():
    """Get current risk score and action history"""
    return {
        "risk_score": state.risk_score,
        "action_history": state.action_history,
        "total_actions": len(state.action_history)
    }

@app.get("/hygiene-score")
async def get_hygiene_score():
    """Calculate and return the weekly digital hygiene score"""
    return state.calculate_hygiene_score()

@app.post("/reset")
async def reset_state():
    """Reset the risk score and action history"""
    state.risk_score = 0
    state.action_history = []
    state.session_start_time = datetime.now()
    return {
        "success": True,
        "message": "State reset successfully",
        "risk_score": 0
    }

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Digital Risk Mirror API",
        "version": "1.0.0",
        "status": "running"
    }
