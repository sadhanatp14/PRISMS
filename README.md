# CyberMirror - Real-Time Digital Risk Mirror for Students

An interactive web-based MVP platform that helps students understand cybersecurity and privacy risks through real-time risk assessment, plain-English explanations, behavioral analysis, and personalized coaching.

## Core Features

1. Live Risk Score Meter (0-100)
   - Green (0-29): Low Risk
   - Yellow (30-60): Medium Risk
   - Red (61-100): High Risk

2. Explainability Engine
   - Why it's risky (plain English explanation)
   - What could happen (predicted consequences)
   - Safer alternatives (best practices)

3. Action Timeline / Risk History
   - Complete chronological history of all actions
   - Dedicated page view for behavior review
   - Timestamp and risk points for each action

4. Plain-English Security Education
   - Context-appropriate educational content
   - Understandable threat explanations
   - Real-world consequences in simple terms

5. What-If Prediction Mode
   - Hover over buttons to preview consequences
   - See predicted risk score before acting
   - No actual risk score change from predictions

6. Weekly Digital Hygiene Score
   - A-F letter grade assessment
   - Personalized motivational messages
   - Breakdown of risky actions
   - Progress tracking and recommendations

7. Risk Breakdown by Category
   - Account Security, Network Security, Privacy
   - SVG pie chart visualization
   - Category-specific risk points and percentages
   - Identification of weakest security areas

8. Personalized Safety Tips
   - AI-powered coaching based on patterns
   - Detects repeated risky behaviors (3+ occurrences)
   - Urgency-based prioritization
   - Updates dynamically as you perform actions

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (fast build tool)
- Axios for HTTP requests
- Lucide React icons (v0.263.1)
- CSS3 with animations and responsive design

### Backend
- FastAPI (Python)
- Pydantic for data validation
- Rule-based risk engine with categorical tracking
- Real-time state management
- Pattern detection for personalized coaching

## Navigation System

- Dashboard: Live risk meter, action buttons, explanations, tips, risk breakdown
- Activity Tracking: Real-time activity metrics
- Digital Hygiene Score: Weekly gamified assessment
- Action History: Complete timeline of actions and consequences

## Project Structure

```
PRISMS/
├── backend/
│   ├── main.py                      # FastAPI server, risk engine, endpoints
│   └── requirements.txt             # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RiskMeter.tsx              # Live risk score display
│   │   │   ├── ActionButtons.tsx          # Simulation buttons with What-If
│   │   │   ├── Timeline.tsx               # Action history timeline
│   │   │   ├── ExplainabilityPanel.tsx    # Risk explanations
│   │   │   ├── ActivityMetrics.tsx        # Activity tracking
│   │   │   ├── HygieneScore.tsx           # Weekly gamification
│   │   │   ├── RiskBreakdown.tsx          # Categorical risk visualization
│   │   │   └── PersonalizedTips.tsx       # Behavior-based coaching
│   │   ├── App.tsx                  # Main app with multi-page navigation
│   │   ├── types.ts                 # TypeScript interfaces
│   │   ├── api.ts                   # API service layer
│   │   ├── activityTracker.ts       # Activity metrics tracking
│   │   └── main.tsx                 # React entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ and npm (for frontend)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

The backend API will be available at http://localhost:8000

API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## API Endpoints

### POST `/action`

Process a risky action and return updated risk score with explanations.

**Request Body:**
```json
{
  "action_type": "suspicious_link"
}
```

**Response:**
```json
{
  "success": true,
  "updated_risk_score": 30,
  "explanation": "Clicking suspicious links can lead to phishing attacks where attackers steal your credentials or install malware.",
  "predicted_consequence": "Your personal data, passwords, or financial information could be stolen. Malware could be installed.",
  "safer_alternative": "Hover over links to check the URL. Use a link checker tool. Only click from trusted sources.",
  "risk_points_added": 30
}
```

**Supported action types:**
- suspicious_link (Account Security, +30 risk)
- weak_password (Account Security, +25 risk)
- public_wifi (Network Security, +20 risk)
- excessive_permissions (Privacy, +15 risk)

### GET `/state`

Get current risk score and action history.

**Response:**
```json
{
  "risk_score": 55,
  "total_actions": 2,
  "action_history": [
    {
      "action_type": "suspicious_link",
      "timestamp": "2026-02-26T14:30:45.123456",
      "risk_points": 30,
      "explanation": "Clicking suspicious links..."
    }
  ]
}
```

### GET `/hygiene-score`

Get weekly digital hygiene assessment.

**Response:**
```json
{
  "hygiene_score": 75,
  "grade": "B",
  "message": "Good job! You're making safe choices.",
  "recommendation": "Try to avoid public WiFi when possible.",
  "total_actions": 2,
  "risky_actions": 2,
  "total_risk_accumulated": 30
}
```

### GET `/risk-breakdown`

Get risk breakdown by category.

**Response:**
```json
{
  "breakdown": {
    "Account Security": {"risk_points": 20, "percentage": 66.7},
    "Network Security": {"risk_points": 10, "percentage": 33.3},
    "Privacy": {"risk_points": 0, "percentage": 0}
  },
  "total_risk": 30,
  "weakest_area": "Account Security"
}
```

### GET `/personalized-tips`

Get personalized safety tips based on behavior patterns.

**Response:**
```json
{
  "tips": [
    {
      "tip": "You often click suspicious links. Use a URL checker like VirusTotal.",
      "category": "Account Security",
      "urgency": "high"
    }
  ]
}
```

### POST `/reset`

Reset risk score and action history.

**Response:**
```json
{
  "success": true,
  "message": "State reset successfully",
  "risk_score": 0
}
```

## Risk Scoring

Actions add risk to specific categories:

Account Security:
- Suspicious links: +30 points
- Weak passwords: +25 points

Network Security:
- Public WiFi: +20 points

Privacy:
- Excessive permissions: +15 points

Hygiene Grade Scale:
- 90-100: A (Excellent)
- 80-89: B (Good)
- 70-79: C (Fair)
- 60-69: D (Poor)
- Below 60: F (Critical)

## UI Features

### Color Coding
- Red: High risk, Account Security, High urgency
- Amber: Medium risk, Network Security, Medium urgency
- Blue: Low risk, Privacy, Low urgency
- Green: Good hygiene grades

### Animations
- Smooth risk meter transitions
- Slide-in timeline entries
- Fade animations for tips
- Hover effects on interactive elements
- Mobile responsive animations

### Responsive Design
- Desktop (1024px+)
- Tablet (768px+)
- Mobile friendly
- Touch-optimized buttons
- Readable fonts across all devices

## Testing

1. Start backend: uvicorn main:app --reload --port 8000
2. Start frontend: npm run dev
3. Open http://localhost:5173
4. Click action buttons to simulate risky behaviors
5. Observe real-time risk score updates
6. Navigate to different pages
7. Review action history
8. Check digital hygiene score
9. See personalized tips after repeated actions
10. Use What-If mode to predict consequences
11. Click Reset Session to start over

## Educational Value

This platform helps students:
- Understand cybersecurity in simple language
- See real consequences of risky behaviors
- Learn safer practices
- Build digital safety awareness
- Make informed decisions
- Understand categorical security concerns

## Production Build

### Frontend:
```bash
cd frontend
npm run build
```

### Backend:
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Troubleshooting

**Backend won't start:**
- Ensure Python 3.8+ is installed
- Check if port 8000 is available
- Verify dependencies installed

**Frontend won't start:**
- Ensure Node.js 16+ is installed
- Delete node_modules and run npm install
- Check if port 5173 is available

**CORS errors:**
- Verify backend is running on port 8000
- Check CORS middleware in backend/main.py

**API connection errors:**
- Verify backend is running
- Check API URL in frontend/src/api.ts

**Tips not showing:**
- Perform at least 3 of the same action type
- Wait for page to load after actions

## Future Enhancements

- User authentication and persistent storage
- More sophisticated risk algorithms
- Real-time security alerts
- Integration with security tools
- Multi-language support
- Mobile application
- Achievement badges
- Community tips

## License

Educational MVP for cybersecurity awareness.

## Support

Check console logs in browser and terminal for debugging information.

Built for student cybersecurity awareness
