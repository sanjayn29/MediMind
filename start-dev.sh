#!/bin/bash

echo "Starting Medical Diagnosis Assistant Development Environment..."
echo

echo "Starting Backend Server..."
cd backend && python main.py &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo
echo "Development servers are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers..."

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 