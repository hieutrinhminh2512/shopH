@echo off
chcp 65001 >nul
title shopH - San Mua Sam Online Phong Cach Shopee

echo ====================================================================
echo               DANG MO SHOP H (PHONG CACH SHOPEE)
echo ====================================================================
echo.

cd /d "c:\Users\linh\Desktop\wep"

start "" "http://localhost:3000"

netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] May chu shopH da san sang tai http://localhost:3000
    echo [OK] Trinh duyet web da duoc mo len.
    timeout /t 3 >nul 2>&1
    exit /b 0
)

echo [OK] Dang khoi dong may chu shopH...
echo Hay giu cua so nay de website hoat dong nhe!
echo.

cmd /c "npm run dev"
