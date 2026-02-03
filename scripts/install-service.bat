@echo off
echo Installing Shopify-to-Frameworks Connector as Windows Service...
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: This script must be run as Administrator
    echo Right-click the script and select "Run as administrator"
    pause
    exit /b 1
)

REM Get the current directory
set SERVICE_DIR=%~dp0
set SERVICE_DIR=%SERVICE_DIR:~0,-1%

REM Service configuration
set SERVICE_NAME=ShopifyFrameworksConnector
set SERVICE_DISPLAY_NAME="Shopify to Frameworks Connector"
set SERVICE_DESCRIPTION="Receives Shopify webhooks and forwards to Frameworks ERP"

echo Service Directory: %SERVICE_DIR%
echo Service Name: %SERVICE_NAME%
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node-windows is installed
npm list node-windows >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing node-windows...
    npm install node-windows --save-dev
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install node-windows
        pause
        exit /b 1
    )
)

REM Create service wrapper script
echo Creating service wrapper...
(
echo const Service = require('node-windows'^).Service;
echo const path = require('path'^);
echo.
echo // Create a new service object
echo const svc = new Service({
echo   name: '%SERVICE_NAME%',
echo   description: '%SERVICE_DESCRIPTION%',
echo   script: '%SERVICE_DIR%\\src\\index.js',
echo   nodeOptions: [
echo     '--max-old-space-size=4096'
echo   ],
echo   env: [{
echo     name: 'NODE_ENV',
echo     value: 'production'
echo   }],
echo   workingDirectory: '%SERVICE_DIR%',
echo   logPath: '%SERVICE_DIR%\\logs',
echo   logName: '%SERVICE_NAME%',
echo   maxRetries: 3,
echo   retryInterval: 10000
echo ^};
echo.
echo // Listen for the 'install' event
echo svc.on('install', function(^) {
echo   console.log('Service installed successfully'^);
echo   console.log('Starting service...'^);
echo   svc.start(^);
echo ^};
echo.
echo // Listen for the 'start' event
echo svc.on('start', function(^) {
echo   console.log('Service started successfully'^);
echo   console.log('Service is running at: http://localhost:' + (process.env.PORT || 3000^)^);
echo ^};
echo.
echo // Listen for the 'alreadyinstalled' event
echo svc.on('alreadyinstalled', function(^) {
echo   console.log('Service is already installed'^);
echo   console.log('Uninstalling existing service...'^);
echo   svc.uninstall(^);
echo ^};
echo.
echo // Listen for the 'uninstall' event
echo svc.on('uninstall', function(^) {
echo   console.log('Service uninstalled successfully'^);
echo   console.log('Installing new service...'^);
echo   svc.install(^);
echo ^};
echo.
echo // Install the service
echo svc.install(^);
) > "%SERVICE_DIR%\service-install.js"

REM Run the service installation
echo Installing Windows Service...
node "%SERVICE_DIR%\service-install.js"

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS: Service installed and started!
    echo.
    echo Service Management:
    echo - Start: net start %SERVICE_NAME%
    echo - Stop: net stop %SERVICE_NAME%
    echo - Status: sc query %SERVICE_NAME%
    echo - Uninstall: node "%SERVICE_DIR%\service-uninstall.js"
    echo.
    echo The service will start automatically when Windows boots.
    echo Logs are stored in: %SERVICE_DIR%\logs
) else (
    echo ERROR: Failed to install service
    echo Check the error message above for details
)

pause
