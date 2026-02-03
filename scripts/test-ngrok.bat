@echo off
echo Testing ngrok tunnel and Shopify webhook connectivity...
echo =====================================================
echo.

REM Check if ngrok is running
tasklist /fi "imagename eq ngrok.exe" | find "ngrok.exe" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: ngrok is not running
    echo Start ngrok first: ngrok-manager.bat start
    pause
    exit /b 1
)

echo ngrok is running
echo.

REM Get ngrok URL
echo Getting ngrok public URL...
for /f "tokens=*" %%i in ('curl -s http://localhost:4040/api/tunnels ^| findstr "https://.*.ngrok.io"') do (
    set NGROK_URL=%%i
)

if "%NGROK_URL%"=="" (
    echo ERROR: Could not retrieve ngrok URL
    echo Check ngrok status: ngrok-manager.bat status
    pause
    exit /b 1
)

REM Clean up the URL (remove quotes and "public_url": )
set NGROK_URL=%NGROK_URL:*https=%
set NGROK_URL=%NGROK_URL:*http=%
set NGROK_URL=%NGROK_URL:*":=%
set NGROK_URL=%NGROK_URL:*,=%
set NGROK_URL=%NGROK_URL:"=%

echo ngrok URL: https://%NGROK_URL%
echo.

REM Test application health
echo Testing application health...
set PORT=3000
for /f "tokens=2 delims==" %%i in ('findstr "^PORT=" .env 2^>nul') do set PORT=%%i
if "%PORT%"=="" set PORT=3000

curl -s http://localhost:%PORT%/ >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Application is responding on port %PORT%
) else (
    echo ❌ Application is not responding on port %PORT%
    echo Start the application first: start.bat
    pause
    exit /b 1
)

REM Test ngrok tunnel
echo Testing ngrok tunnel...
curl -s https://%NGROK_URL%/ >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ ngrok tunnel is working
) else (
    echo ❌ ngrok tunnel is not responding
    echo Check ngrok status: ngrok-manager.bat status
    pause
    exit /b 1
)

REM Test webhook endpoint
echo Testing webhook endpoint...
curl -s https://%NGROK_URL%/webhooks/burdens/orders-create -X POST -H "Content-Type: application/json" -d '{}' >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Webhook endpoint is accessible
) else (
    echo ⚠️  Webhook endpoint test failed (may be expected without proper webhook)
)

echo.
echo 🎉 Tunnel test completed successfully!
echo.
echo Shopify Webhook Configuration:
echo =============================
echo Webhook URL: https://%NGROK_URL%/webhooks/{store}/orders-create
echo.
echo Replace {store} with:
echo   - burdens
echo   - bathroomhq  
echo   - plumbershq
echo.
echo Example: https://%NGROK_URL%/webhooks/burdens/orders-create
echo.
echo Webhook Secret: Use SHOPIFY_WEBHOOK_SECRET from your .env file
echo.

pause
