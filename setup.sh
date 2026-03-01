#!/bin/bash

echo "CyberMirror - Quick Start Script"
echo "=============================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "SUCCESS: Python $(python3 --version) found"
echo "SUCCESS: Node.js $(node --version) found"
echo ""

# Setup backend
echo " Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "SUCCESS: Backend setup complete!"
echo ""

# Setup frontend
echo "Setting up frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo "Node modules already installed"
fi

echo ""
echo "SUCCESS: Frontend setup complete!"
echo ""

# Instructions
echo "Setup Complete! To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload --port 8000"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser to:"
echo "   http://localhost:5173"
echo ""
echo "API Documentation available at:"
echo "   http://localhost:8000/docs"
echo ""
echo "Happy learning!"
