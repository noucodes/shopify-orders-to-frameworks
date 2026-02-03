@echo off
echo Setting up ngrok for Shopify-to-Frameworks Connector...
echo.

REM Check if ngrok is installed
ngrok version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: ngrok is not installed or not in PATH
    echo.
    echo To install ngrok:
    echo 1. Download from https://ngrok.com/download
    echo 2. Extract ngrok.exe
    echo 3. Place ngrok.exe in this folder or add to PATH
    echo.
    pause
    exit /b 1
)

echo ngrok is installed: 
ngrok version
echo.

REM Get port from .env or use default
set PORT=3000
for /f "tokens=2 delims==" %%i in ('findstr "^PORT=" .env 2^>nul') do set PORT=%%i
if "%PORT%"=="" set PORT=3000

echo Configuration:
echo - Application Port: %PORT%
echo - ngrok Tunnel: http -> localhost:%PORT%
echo.

REM Create ngrok configuration file
echo Creating ngrok configuration...
(
echo web_addr: localhost:4040
echo tunnels:
echo   shopify:
echo     proto: http
echo     addr: %PORT%
echo     bind_tls: true
echo     inspect: true
echo     log: stdout
echo     log_level: info
echo     web_addr: localhost:4040
echo     host_header: rewrite
echo     auth: "your-ngrok-auth-token"
) > ngrok.yml

echo ngrok configuration created: ngrok.yml
echo.

REM Test ngrok tunnel
echo Testing ngrok tunnel...
start "ngrok test" cmd /c "ngrok http %PORT% --log=stdout --log-level=info"
timeout /t 5 /nobreak >nul

REM Get the ngrok URL
echo.
echo To get your ngrok URL:
echo 1. Open http://localhost:4040 in your browser
echo 2. Look for the "Forwarding" URL (https://xxxxx.ngrok.io)
echo 3. Use this URL in your Shopify webhook configuration
echo.

REM Instructions for Shopify webhook setup
echo Shopify Webhook Setup:
echo =====================
echo 1. Start the connector: start-with-ngrok.bat
echo 2. Get your ngrok URL from http://localhost:4040
echo 3. In Shopify Admin, create webhook with:
echo    - URL: https://xxxxx.ngrok.io/webhooks/{store}/orders-create
echo    - Format: JSON
echo    - Webhook secret: Use your SHOPIFY_WEBHOOK_SECRET from .env
echo.

REM Ask if user wants to start now
set /p startnow="Start ngrok tunnel now? (y/N): "
if /i "%startnow%"=="y" (
    echo.
    echo Starting ngrok tunnel...
    echo Press Ctrl+C to stop
    echo.
    ngrok http %PORT% --log=stdout
)

pause
