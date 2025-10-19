@echo off
echo ========================================
echo  Starting Group 12 Project
echo  Hoat Dong 6 - Redux Protected Routes
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node index.js"
timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend React App...
start "Frontend React" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo  Servers are starting...
echo ========================================
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo.
echo  Press any key to open test page...
pause > nul

start test-redux-state.html

echo.
echo Done! Both servers are running in separate windows.
echo Close those windows to stop the servers.
pause
