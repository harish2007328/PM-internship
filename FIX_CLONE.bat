@echo off
echo 🚀 PM Internship Portal - One-Click Setup
echo ------------------------------------------

echo 📦 1/3 Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed. Make sure Node.js is installed.
    pause
    exit /b %errorlevel%
)

echo.
echo 🐍 2/3 Setting up Python Backend...
cd ../backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ pip install failed. Make sure Python is installed.
    pause
    exit /b %errorlevel%
)

echo.
echo ✅ 3/3 Setup Complete!
echo You can now run the project.
echo Frontend: cd frontend ^&^& npm run dev
echo Backend: cd backend ^&^& python main.py
echo.
pause
