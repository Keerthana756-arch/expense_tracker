@echo off
title Expense Tracker Backend
echo ========================================================
echo   Starting Expense Tracker Spring Boot Backend
echo   URL: http://localhost:8080
echo ========================================================

cd /d "%~dp0"

if exist "backend\target\app.jar" (
    echo Starting from packaged JAR (app.jar)...
    java -jar "backend\target\app.jar"
) else if exist "backend\target\expense-tracker-backend-1.0.0.jar" (
    echo Starting from packaged JAR (expense-tracker-backend-1.0.0.jar)...
    java -jar "backend\target\expense-tracker-backend-1.0.0.jar"
) else (
    echo Starting with Maven...
    cd backend
    ..\tools\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run
)

pause
