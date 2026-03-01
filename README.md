# � CyberMirror - Real-Time Risk Awareness Platform

An interactive web-based MVP that simulates real-time cybersecurity and privacy risk awareness for students. CyberMirror helps students understand the consequences of risky digital behaviors through live risk scoring, plain-English explanations, and safer alternatives.

## 🎯 Features

- **Live Risk Score Meter (0-100)** with color-coded risk levels:
  - 🟢 Green (0-29): Low Risk
  - 🟡 Yellow (30-60): Medium Risk
  - 🔴 Red (61-100): High Risk

- **Interactive Simulation Buttons**:
  - Click Suspicious Link (+30 risk)
  - Use Weak Password (+25 risk)
  - Connect to Public Wi-Fi (+20 risk)
  - Grant Excessive App Permissions (+15 risk)

- **Timeline/Action History**: Track all risky actions with timestamps

- **Explainability Panel**: For each action, see:
  - Why it's risky (plain English explanation)
  - What could happen (predicted consequences)
  - Safer alternatives (best practices)

- **Smooth Animations**: Risk meter animations and color transitions

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (fast build tool)
- Axios for API calls
- CSS3 with animations

### Backend
- FastAPI (Python)
- Pydantic for data validation
- Simple rule-based risk engine
- CORS enabled for local development

## 📁 Project Structure

```
PRISMS/
├── backend/
│   ├── main.py              # FastAPI server with risk engine
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RiskMeter.tsx           # Risk score display
│   │   │   ├── RiskMeter.css
│   │   │   ├── ActionButtons.tsx       # Simulation buttons
│   │   │   ├── ActionButtons.css
│   │   │   ├── Timeline.tsx            # Action history
│   │   │   ├── Timeline.css
│   │   │   ├── ExplainabilityPanel.tsx # Risk explanations
│   │   │   └── ExplainabilityPanel.css
│   │   ├── App.tsx          # Main app component
│   │   ├── App.css
│   │   ├── main.tsx         # React entry point
│   │   ├── types.ts         # TypeScript interfaces
│   │   └── api.ts           # API service
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** and npm (for frontend)

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

The backend API will be available at `http://localhost:8000`

You can view the auto-generated API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

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

The frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

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
  "explanation": "Clicking suspicious links can lead to phishing attacks where attackers steal your credentials or install malware on your device.",
  "predicted_consequence": "Your personal data, passwords, or financial information could be stolen. Malware could be installed on your device.",
  "safer_alternative": "Hover over links to check the URL before clicking. Use a link checker tool. Only click links from trusted sources.",
  "risk_points_added": 30
}
```

**Supported action types:**
- `suspicious_link` (+30 risk points)
- `weak_password` (+25 risk points)
- `public_wifi` (+20 risk points)
- `excessive_permissions` (+15 risk points)

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
      "explanation": "Clicking suspicious links can lead to phishing attacks..."
    },
    {
      "action_type": "weak_password",
      "timestamp": "2026-02-26T14:32:10.654321",
      "risk_points": 25,
      "explanation": "Weak passwords are easy for attackers to guess..."
    }
  ]
}
```

### POST `/reset`

Reset the risk score and action history to zero.

**Response:**
```json
{
  "success": true,
  "message": "State reset successfully",
  "risk_score": 0
}
```

### GET `/`

Health check endpoint.

**Response:**
```json
{
  "message": "Digital Risk Mirror API",
  "version": "1.0.0",
  "status": "running"
}
```

## 🎨 UI Features

### Color-Coded Risk Levels
- **Green (0-29)**: Low risk - Safe practices
- **Yellow (30-60)**: Medium risk - Some concerning behaviors
- **Red (61-100)**: High risk - Multiple dangerous actions

### Animations
- Risk meter pulses when at medium/high risk levels
- Smooth transitions for score changes
- Slide-in animations for new timeline entries
- Hover effects on interactive elements

## 🧪 Testing the Application

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Click any of the action buttons to simulate risky behavior
4. Watch the risk score update in real-time
5. Read the explanation panel to understand the risks
6. Check the timeline to see your action history
7. Click "Reset All" to start over

## 🔧 Development

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```
The built files will be in `frontend/dist/`

**Backend:**
For production deployment, use a production ASGI server:
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🎓 Educational Use

This MVP is designed for **educational purposes** to help students:
- Understand common cybersecurity risks
- Learn safe digital practices
- Visualize the cumulative impact of risky behaviors
- Remember safer alternatives through interactive learning

## 🚧 Future Enhancements (Beyond MVP)

- User authentication and persistent storage
- More sophisticated risk scoring algorithms
- Real-time notifications and alerts
- Integration with actual security tools
- Multi-language support
- Mobile app version
- Gamification elements (badges, achievements)
- Social sharing of safety tips

## 📝 License

This is an MVP demo for educational purposes.

## 👥 Contributing

This is a hackathon-friendly project. Feel free to fork and enhance!

## 🐛 Troubleshooting

**Backend won't start:**
- Make sure Python 3.8+ is installed
- Check if port 8000 is available
- Verify all dependencies are installed

**Frontend won't start:**
- Make sure Node.js 16+ is installed
- Delete `node_modules` and run `npm install` again
- Check if port 5173 is available

**CORS errors:**
- Make sure the backend is running on port 8000
- Check that CORS middleware is properly configured in `backend/main.py`

**API connection errors:**
- Verify the backend is running
- Check that the API URL in `frontend/src/api.ts` matches your backend URL

## 📞 Support

For issues or questions, please check the console logs in both the browser (frontend) and terminal (backend) for detailed error messages.

---

**Built with ❤️ for student cybersecurity awareness**