# CyberMirror - Quick Start Guide

## Option 1: Automated Setup (Recommended)

### On macOS/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

Then follow the instructions to start the servers.

## Option 2: Manual Setup

### Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API Docs**: http://localhost:8000/docs

## Testing

1. Click the simulation buttons to perform risky actions
2. Watch the risk score change in real-time
3. Read the explanations and safer alternatives
4. Check the timeline for your action history

For full documentation, see [README.md](README.md)
