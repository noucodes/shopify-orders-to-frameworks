@echo off
echo ========================================
echo Shopify Connector - Run Application
echo ========================================
echo.

:: Check if .env file exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo Please run scripts\code_setup.bat first
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist node_modules (
    echo [ERROR] Dependencies not installed!
    echo Please run scripts\code_setup.bat first
    pause
    exit /b 1
)

:: Get PORT from .env or use default
set PORT=3000
for /f "tokens=2 delims==" %%a in ('findstr "^PORT=" .env 2^>nul') do set PORT=%%a

echo Starting Shopify Connector on port %PORT%...
echo Press Ctrl+C to stop the application
echo.

:: Start the application
npm start

echo.
echo Application stopped.
pause
