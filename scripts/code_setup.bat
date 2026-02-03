@echo off
echo ========================================
echo Shopify Connector - Code Setup
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Node.js is installed

:: Install dependencies
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)

echo [✓] Dependencies installed successfully

:: Check if .env file exists
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env >nul 2>&1
    echo [⚠]  Please edit .env file with your credentials
    echo     - Shopify tokens
    echo     - Frameworks API credentials
    echo.
) else (
    echo [✓] .env file already exists
)

:: Create logs directory
if not exist logs (
    mkdir logs
    echo [✓] Created logs directory
)

echo.
echo ========================================
echo Code setup completed!
echo ========================================
echo.
if not exist .env.example (
    echo [⚠]  Please configure your .env file before running
)
echo Next steps:
echo 1. Edit .env file with your credentials
echo 2. Run scripts\setup.bat for complete setup
echo.
pause
