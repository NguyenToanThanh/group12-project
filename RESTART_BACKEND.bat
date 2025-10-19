@echo off
echo ========================================
echo  RESTART BACKEND - PORT 5000
echo ========================================
echo.

echo [INFO] Stopping any process on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a 2>nul

echo [INFO] Starting backend server...
cd backend
start "Backend Server - Port 5000" cmd /k "node index.js"

echo.
echo ========================================
echo  Backend starting on PORT 5000
echo ========================================
echo.
echo  Check the new terminal window!
echo  Should show: http://127.0.0.1:5000
echo.
pause
