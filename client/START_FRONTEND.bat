@echo off
echo ========================================
echo   AI Chef - Frontend Startup
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js found

echo.
echo [2/3] Installing dependencies (if needed)...
if not exist "node_modules\" (
    echo Installing packages...
    call npm install
) else (
    echo ✓ Dependencies already installed
)

echo.
echo [3/3] Starting frontend server...
echo.
echo ========================================
echo   Frontend running on http://localhost:5173
echo   Press Ctrl+C to stop
echo ========================================
echo.

npm run dev
