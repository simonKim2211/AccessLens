#!/bin/bash

# AODA Accessibility Checker - Development Setup Script

echo "🇨🇦 Setting up AODA Accessibility Checker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "✅ Please edit .env file with your API keys"
fi

# Start backend in development mode
echo "🚀 Starting backend server..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend in development mode
echo "🎨 Starting frontend..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "✅ Development environment started!"
echo "📍 Backend API: http://localhost:3001"
echo "🌐 Frontend: http://localhost:3000"
echo "📋 API Docs: http://localhost:3001"

# Function to cleanup on exit
cleanup() {
    echo "🧹 Cleaning up..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap cleanup on script exit
trap cleanup EXIT INT TERM

# Wait for processes
wait
