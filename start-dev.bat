@echo off
echo Starting Medical Diagnosis Assistant Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python main.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Development servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this launcher...
pause > nul 