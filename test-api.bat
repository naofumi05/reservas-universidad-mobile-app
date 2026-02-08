@echo off
REM script-test-api.bat - Test rápido de API en Windows

echo.
echo ====================================================
echo    TESTER DE API - Easy Reservas
echo ====================================================
echo.

set API_URL=http://127.0.0.1:8000/api

echo API URL: %API_URL%
echo.

echo 1. Probando ping...
curl -s "%API_URL%/ping"
echo.
echo.

echo 2. Probando login fallido (deberia dar 401)...
curl -s -X POST "%API_URL%/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"wrong\"}"
echo.
echo.

echo 3. Probando login exitoso...
curl -s -X POST "%API_URL%/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@uni.com\",\"password\":\"admin123\"}"
echo.
echo.

echo ====================================================
echo    FIN DEL TEST
echo ====================================================
echo.
pause
