@echo off
echo ========================================
echo Shopify Connector - Complete Setup
echo ========================================
echo.

:: Check if running as Administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Not running as Administrator
    echo Some features may require Administrator privileges
    echo.
)

:: Step 1: Code Setup
echo [1/5] Setting up code...
call scripts\code_setup.bat
if %errorlevel% neq 0 (
    echo [ERROR] Code setup failed!
    pause
    exit /b 1
)

:: Step 2: Install Windows Service
echo.
echo [2/5] Installing Windows Service...
call scripts\install-service.bat
if %errorlevel% neq 0 (
    echo [WARNING] Service installation failed!
    echo You can still run the application manually
) else (
    echo [✓] Windows Service installed
)

:: Step 3: Setup ngrok
echo.
echo [3/5] Setting up ngrok...
call scripts\setup-ngrok.bat
if %errorlevel% neq 0 (
    echo [WARNING] ngrok setup failed!
    echo You can still run without ngrok
) else (
    echo [✓] ngrok configured
)

:: Step 4: Start ngrok tunnel
echo.
echo [4/5] Starting ngrok tunnel...
call scripts\ngrok-manager.bat start
if %errorlevel% neq 0 (
    echo [WARNING] Failed to start ngrok tunnel!
    echo You can start it manually later
) else (
    echo [✓] ngrok tunnel started
)

:: Step 5: Get webhook URL
echo.
echo [5/5] Getting webhook URL...
call scripts\ngrok-manager.bat url
if %errorlevel% neq 0 (
    echo [WARNING] Could not get ngrok URL
    echo Open http://localhost:4040 to get your webhook URL
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your Shopify Connector is now ready!
echo.
echo Webhook URL Format:
echo https://[NGROK_URL]/webhooks/{store}/orders-create
echo.
echo Replace {store} with: burdens, bathroomhq, or plumbershq
echo.
echo Management Commands:
echo - Start/Stop Service: scripts\service-manager.bat
echo - ngrok Control: scripts\ngrok-manager.bat
echo - Run Manually: scripts\code_run.bat
echo.
pause
