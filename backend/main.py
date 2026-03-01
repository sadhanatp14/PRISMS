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

# Risk scoring rules with categories
RISK_RULES = {
    "suspicious_link": {
        "risk_points": 30,
        "category": "Account Security",
        "explanation": "Clicking suspicious links can lead to phishing attacks where attackers steal your credentials or install malware on your device.",
        "predicted_consequence": "Your personal data, passwords, or financial information could be stolen. Malware could be installed on your device.",
        "safer_alternative": "Hover over links to check the URL before clicking. Use a link checker tool. Only click links from trusted sources."
    },
    "weak_password": {
        "risk_points": 25,
        "category": "Account Security",
        "explanation": "Weak passwords are easy for attackers to guess or crack using automated tools, giving them access to your accounts.",
        "predicted_consequence": "Your accounts could be hacked, leading to identity theft, data breaches, or unauthorized access to your personal information.",
        "safer_alternative": "Use strong passwords with 12+ characters including uppercase, lowercase, numbers, and symbols. Use a password manager to generate and store unique passwords."
    },
    "public_wifi": {
        "risk_points": 20,
        "category": "Network Security",
        "explanation": "Public Wi-Fi networks are often unsecured, allowing attackers to intercept your data and monitor your online activities.",
        "predicted_consequence": "Attackers can steal your passwords, banking details, and personal messages. They could perform man-in-the-middle attacks.",
        "safer_alternative": "Use a VPN when connecting to public Wi-Fi. Avoid accessing sensitive accounts. Use your mobile hotspot instead."
    },
    "excessive_permissions": {
        "risk_points": 15,
        "category": "Privacy",
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
        self.risk_breakdown = {
            "Account Security": 0,
            "Network Security": 0,
            "Privacy": 0
        }
    
    def add_action(self, action_type: str):
        if action_type in RISK_RULES:
            rule = RISK_RULES[action_type]
            
            # Update risk score (cap at 100)
            self.risk_score = min(100, self.risk_score + rule["risk_points"])
            
            # Update risk breakdown
            category = rule.get("category", "Other")
            if category in self.risk_breakdown:
                self.risk_breakdown[category] += rule["risk_points"]
            
            # Add to history
            action_entry = {
                "action_type": action_type,
                "timestamp": datetime.now().isoformat(),
                "risk_points": rule["risk_points"],
                "category": category,
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
    
    def generate_personalized_tips(self) -> List[Dict]:
        """Generate personalized safety tips based on behavior patterns"""
        tips = []
        
        if not self.action_history:
            return [{
                "tip": "Great start! Keep learning about digital safety.",
                "category": "General",
                "urgency": "low"
            }]
        
        # Count action occurrences
        action_counts = {}
        for action in self.action_history:
            action_type = action["action_type"]
            action_counts[action_type] = action_counts.get(action_type, 0) + 1
        
        # Personalized tips based on repeated patterns
        tip_templates = {
            "suspicious_link": {
                "single": {
                    "tip": "Always hover over links to preview the URL before clicking.",
                    "category": "Account Security",
                    "urgency": "medium"
                },
                "multiple": {
                    "tip": "You often click suspicious links. Consider enabling link previews or using a URL checker like VirusTotal.",
                    "category": "Account Security",
                    "urgency": "high"
                }
            },
            "weak_password": {
                "single": {
                    "tip": "Strong passwords should have 12+ characters with mixed cases, numbers, and symbols.",
                    "category": "Account Security",
                    "urgency": "medium"
                },
                "multiple": {
                    "tip": "You repeatedly use weak passwords. Install a password manager like Bitwarden or 1Password to generate and store secure passwords.",
                    "category": "Account Security",
                    "urgency": "high"
                }
            },
            "public_wifi": {
                "single": {
                    "tip": "Public Wi-Fi is risky. Use a VPN to encrypt your connection.",
                    "category": "Network Security",
                    "urgency": "medium"
                },
                "multiple": {
                    "tip": "You frequently connect to public Wi-Fi. Install a VPN like ProtonVPN or Mullvad, and avoid accessing sensitive accounts on public networks.",
                    "category": "Network Security",
                    "urgency": "high"
                }
            },
            "excessive_permissions": {
                "single": {
                    "tip": "Review app permissions and only grant what's necessary for the app to function.",
                    "category": "Privacy",
                    "urgency": "medium"
                },
                "multiple": {
                    "tip": "You often grant excessive permissions. Go to Settings → Privacy and review all app permissions. Revoke unnecessary access.",
                    "category": "Privacy",
                    "urgency": "high"
                }
            }
        }
        
        # Generate tips based on patterns
        for action_type, count in action_counts.items():
            if action_type in tip_templates:
                template = tip_templates[action_type]
                if count >= 3:
                    tips.append(template["multiple"])
                elif count >= 1:
                    tips.append(template["single"])
        
        # Add category-specific tips if user is weak in an area
        max_category_risk = max(self.risk_breakdown.values()) if self.risk_breakdown else 0
        if max_category_risk > 40:
            weakest_category = max(self.risk_breakdown, key=self.risk_breakdown.get)
            category_tips = {
                "Account Security": {
                    "tip": "Enable two-factor authentication (2FA) on all important accounts for extra security.",
                    "category": "Account Security",
                    "urgency": "high"
                },
                "Network Security": {
                    "tip": "Create a mobile hotspot instead of using public Wi-Fi when possible.",
                    "category": "Network Security",
                    "urgency": "high"
                },
                "Privacy": {
                    "tip": "Use privacy-focused browsers like Brave or Firefox with privacy extensions.",
                    "category": "Privacy",
                    "urgency": "high"
                }
            }
            if weakest_category in category_tips:
                tips.append(category_tips[weakest_category])
        
        # If no specific tips, give general advice
        if not tips:
            tips.append({
                "tip": "Stay vigilant! Always think before clicking links or sharing personal information.",
                "category": "General",
                "urgency": "low"
            })
        
        return tips

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

@app.get("/risk-breakdown")
async def get_risk_breakdown():
    """Get the breakdown of risk by category"""
    total_risk = sum(state.risk_breakdown.values())
    breakdown_percentages = {}
    
    for category, risk_points in state.risk_breakdown.items():
        if total_risk > 0:
            percentage = (risk_points / total_risk) * 100
        else:
            percentage = 0
        
        breakdown_percentages[category] = {
            "risk_points": risk_points,
            "percentage": round(percentage, 1)
        }
    
    # Determine weakest area
    weakest_area = max(state.risk_breakdown, key=state.risk_breakdown.get) if state.risk_breakdown else None
    
    return {
        "breakdown": breakdown_percentages,
        "total_risk": total_risk,
        "weakest_area": weakest_area
    }

@app.get("/personalized-tips")
async def get_personalized_tips():
    """Get personalized safety tips based on behavior patterns"""
    return {
        "tips": state.generate_personalized_tips()
    }

@app.post("/reset")
async def reset_state():
    """Reset the risk score and action history"""
    state.risk_score = 0
    state.action_history = []
    state.session_start_time = datetime.now()
    state.risk_breakdown = {
        "Account Security": 0,
        "Network Security": 0,
        "Privacy": 0
    }
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
