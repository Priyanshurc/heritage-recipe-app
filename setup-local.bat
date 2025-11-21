@echo off
REM Heritage Recipe App — Local Setup Script (Windows)
REM This script sets up the entire app locally with minimal user input

echo.
echo ===== Heritage Recipe App - Local Setup =====
echo.

REM Check prerequisites
echo Checking prerequisites...

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js not found. Please install from https://nodejs.org
  pause
  exit /b 1
)

where flutter >nul 2>nul
if errorlevel 1 (
  echo ERROR: Flutter not found. Please install from https://flutter.dev/docs/get-started/install
  pause
  exit /b 1
)

for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('npm --version 2^>nul') do set NPM_VER=%%i

echo OK Node.js %NODE_VER%
echo OK npm %NPM_VER%
echo OK Flutter found
echo.

REM Check if Docker is available
set HAS_DOCKER=false
where docker >nul 2>nul
if errorlevel 0 (
  set HAS_DOCKER=true
  echo OK Docker found
)
echo.

REM Step 1: Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install >nul 2>&1
cd ..
echo OK Backend dependencies installed
echo.

REM Step 2: Configure MongoDB and .env
echo Database Configuration
echo ======================
echo Choose your MongoDB setup:
echo 1) MongoDB Atlas (cloud, recommended, needs manual connection string)
echo 2) Local MongoDB (must be running on localhost:27017)
if "%HAS_DOCKER%"=="true" (
  echo 3) Docker (starts MongoDB automatically)
)
echo.

set /p db_choice="Enter choice (1-3): "

if "%db_choice%"=="1" (
  echo.
  echo Get your MongoDB Atlas connection string:
  echo   1. Go to https://www.mongodb.com/cloud/atlas
  echo   2. Create a free cluster
  echo   3. Click 'Connect' ^> 'Drivers' ^> 'Node.js'
  echo   4. Copy the connection string
  echo.
  set /p MONGODB_URI="Enter MongoDB Atlas connection string: "
) else if "%db_choice%"=="2" (
  echo Make sure MongoDB is running locally ^(mongod on port 27017^)
  set MONGODB_URI=mongodb://localhost:27017/heritage-recipe-db
) else if "%db_choice%"=="3" (
  if "%HAS_DOCKER%"=="true" (
    echo Starting MongoDB in Docker...
    call docker-compose up -d >nul 2>&1
    timeout /t 3 /nobreak
    set MONGODB_URI=mongodb://admin:password123@localhost:27017/heritage-recipe-db?authSource=admin
    echo OK MongoDB started in Docker
  ) else (
    echo Docker not available. Please choose option 1 or 2.
    pause
    exit /b 1
  )
) else (
  echo Invalid choice
  pause
  exit /b 1
)

REM Step 3: Create .env file
echo.
echo Creating backend\.env...
(
  echo MONGODB_URI=%MONGODB_URI%
  echo JWT_SECRET=your_super_secret_jwt_key_min_20_chars_here_%RANDOM%
  echo PORT=5000
  echo FRONTEND_URL=http://localhost:8000
) > backend\.env
echo OK .env created
echo.

REM Step 4: Install Flutter dependencies
echo Installing Flutter dependencies...
cd heritage_recipes_lite
call flutter pub get >nul 2>&1
cd ..
echo OK Flutter dependencies installed
echo.

REM Step 5: Build Flutter web
echo Building Flutter web app...
cd heritage_recipes_lite
call flutter build web --release >nul 2>&1
cd ..
echo OK Flutter web built
echo.

REM Done
echo Setup complete!
echo.
echo Next steps:
echo ===========
echo.
echo 1) Start the backend ^(Terminal 1^):
echo    cd backend ^&^& npm run dev
echo.
echo 2) Start the frontend web server ^(Terminal 2^):
echo    cd heritage_recipes_lite\build\web ^&^& py -3 -m http.server 8000
echo.
echo 3) Open your browser:
echo    http://localhost:8000
echo.
echo 4) Login with:
echo    Email: test@example.com
echo    Password: test1234
echo.
echo For detailed help, see: SETUP.md
echo.
pause
