@echo off
title AEGIS - Digital Safety Intelligence Launcher
echo ========================================================
echo   Launching AEGIS - Digital Safety Intelligence Desk
echo ========================================================
echo.

echo [1/2] Starting AEGIS FastAPI Intelligence Backend...
start "AEGIS Backend (Port 8000)" cmd /k "cd /d %~dp0aegis-backend && python run.py"

echo [2/2] Starting AEGIS React Frontend...
start "AEGIS Frontend (Port 5173)" cmd /k "cd /d %~dp0aegis-frontend && npm run dev"

echo.
echo ========================================================
echo   AEGIS services are running!
echo   Frontend : http://localhost:5173
echo   Backend  : http://127.0.0.1:8000
echo   API Docs : http://127.0.0.1:8000/docs
echo ========================================================
echo.
timeout /t 3 >nul
start http://localhost:5173
