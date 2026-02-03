@echo off
echo ngrok Management for Shopify-to-Frameworks Connector
echo ==================================================
echo.

if "%1"=="" goto :menu
if /i "%1"=="start" goto :start
if /i "%1"=="stop" goto :stop
if /i "%1"=="status" goto :status
if /i "%1"=="url" goto :url
if /i "%1"=="logs" goto :logs
if /i "%1"=="web" goto :web
goto :menu

:menu
echo Available commands:
echo   start     - Start ngrok tunnel
echo   stop      - Stop ngrok processes
echo   status    - Check ngrok status
echo   url       - Get current ngrok URL
echo   logs      - Show ngrok logs
echo   web       - Open ngrok web interface
echo.
echo Usage: %ngrok-manager.bat [command]
echo.
goto :end

:start
echo Starting ngrok tunnel...
set PORT=3000
for /f "tokens=2 delims==" %%i in ('findstr "^PORT=" .env 2^>nul') do set PORT=%%i
if "%PORT%"=="" set PORT=3000

echo Tunneling port %PORT%...
start "ngrok" cmd /c "ngrok http %PORT% --log=stdout"
timeout /t 2 /nobreak >nul
echo ngrok started!
echo Web interface: http://localhost:4040
goto :end

:stop
echo Stopping ngrok processes...
taskkill /f /im ngrok.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ngrok processes stopped
) else (
    echo No ngrok processes found running
)
goto :end

:status
echo Checking ngrok status...
tasklist /fi "imagename eq ngrok.exe" | find "ngrok.exe" >nul 2>&1
if %errorlevel% equ 0 (
    echo ngrok is RUNNING
    echo Web interface: http://localhost:4040
) else (
    echo ngrok is NOT running
)
goto :end

:url
echo Getting ngrok URL...
curl -s http://localhost:4040/api/tunnels >nul 2>&1
if %errorlevel% equ 0 (
    echo Current ngrok tunnels:
    curl -s http://localhost:4040/api/tunnels | findstr "public_url"
) else (
    echo ngrok is not running or API not available
    echo Open http://localhost:4040 to see tunnels
)
goto :end

:logs
echo Showing ngrok logs...
echo Note: This shows recent ngrok activity
echo.
powershell "Get-Content -Path '~\AppData\Local\ngrok\ngrok.log' -Tail 20 -ErrorAction SilentlyContinue"
if %errorlevel% neq 0 (
    echo No ngrok log file found
    echo Make sure ngrok has been run at least once
)
goto :end

:web
echo Opening ngrok web interface...
start http://localhost:4040
goto :end

:end
echo.
pause
