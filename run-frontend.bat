@echo off
title Expense Tracker Frontend
echo ========================================================
echo   Starting Expense Tracker React Frontend (Vite)
echo   URL: http://localhost:5173
echo   Proxy: Requests to /api are forwarded to http://localhost:8080
echo ========================================================

cd /d "%~dp0\frontend"
npm run dev

pause
