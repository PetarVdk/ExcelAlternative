@echo off
echo Building ProfitTracker Pro...
echo.

echo Cleaning previous builds...
if exist "out" rmdir /s /q "out"
if exist "dist" rmdir /s /q "dist"

echo.
echo Installing dependencies...
call npm install

echo.
echo Building application...
call npm run make:win

echo.
echo Build complete! Check the 'out' folder for the installer.
echo.
pause
