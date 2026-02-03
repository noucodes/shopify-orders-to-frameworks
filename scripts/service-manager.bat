@echo off
echo Shopify-to-Frameworks Connector Service Management
echo ==============================================
echo.

set SERVICE_NAME=ShopifyFrameworksConnector

if "%1"=="" goto :menu
if /i "%1"=="start" goto :start
if /i "%1"=="stop" goto :stop
if /i "%1"=="status" goto :status
if /i "%1"=="restart" goto :restart
if /i "%1"=="uninstall" goto :uninstall
goto :menu

:menu
echo Available commands:
echo   start     - Start the service
echo   stop      - Stop the service
echo   status    - Check service status
echo   restart   - Restart the service
echo   uninstall - Uninstall the service
echo.
echo Usage: %SERVICE-MANAGER.bat [command]
echo.
goto :end

:start
echo Starting %SERVICE_NAME%...
net start %SERVICE_NAME%
if %errorlevel% equ 0 (
    echo Service started successfully
) else (
    echo Failed to start service
    echo Try running as Administrator
)
goto :end

:stop
echo Stopping %SERVICE_NAME%...
net stop %SERVICE_NAME%
if %errorlevel% equ 0 (
    echo Service stopped successfully
) else (
    echo Failed to stop service
    echo Try running as Administrator
)
goto :end

:status
echo Checking %SERVICE_NAME% status...
sc query %SERVICE_NAME%
goto :end

:restart
echo Restarting %SERVICE_NAME%...
net stop %SERVICE_NAME%
timeout /t 3 /nobreak >nul
net start %SERVICE_NAME%
if %errorlevel% equ 0 (
    echo Service restarted successfully
) else (
    echo Failed to restart service
    echo Try running as Administrator
)
goto :end

:uninstall
echo WARNING: This will uninstall the service permanently!
set /p confirm="Are you sure? (y/N): "
if /i not "%confirm%"=="y" (
    echo Operation cancelled
    goto :end
)
echo Uninstalling %SERVICE_NAME%...
node "%~dp0service-uninstall.js"
goto :end

:end
echo.
pause
