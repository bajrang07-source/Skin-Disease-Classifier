@echo off
echo ========================================
echo Starting Skin Health Hub - ML Backend
echo ========================================
echo.

cd /d "%~dp0"

echo Activating Python virtual environment...
call .venv\Scripts\activate.bat

echo.
echo Starting Flask server on port 5000...
echo.
python app.py

pause
