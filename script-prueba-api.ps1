# script-prueba-api.ps1 - Prueba rápida de la API en PowerShell

Write-Host "🔍 Probando conexión a la API de Easy Reservas" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://127.0.0.1:8000/api"

Write-Host "📡 Testing API: $API_URL" -ForegroundColor Yellow
Write-Host ""

# Test 1: Verificar que el servidor está activo
Write-Host "1️⃣  Verificando si el servidor está corriendo..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$API_URL/login" -Method OPTIONS -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ El servidor está respondiendo" -ForegroundColor Green
} catch {
    Write-Host "❌ El servidor NO está respondiendo" -ForegroundColor Red
    Write-Host "   Asegúrate de que: php artisan serve --port=8000 está ejecutándose" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 2: Intentar login con credenciales inválidas
Write-Host "2️⃣  Probando endpoint de login..." -ForegroundColor Cyan
try {
    $body = @{
        email = "test@test.com"
        password = "wrong"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$API_URL/login" -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body -TimeoutSec 5 -ErrorAction Stop
    
    Write-Host "✅ Login endpoint está funcionando" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode.Value -eq 401) {
        Write-Host "✅ Login endpoint está funcionando (retornó 401 como se esperaba)" -ForegroundColor Green
    } else {
        Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Asegúrate de que el servidor está corriendo en http://localhost:8000" -ForegroundColor Yellow
        exit 1
    }
}
Write-Host ""

# Test 3: Login con credenciales correctas
Write-Host "3️⃣  Probando login con credenciales correctas..." -ForegroundColor Cyan
try {
    $body = @{
        email = "admin@uni.com"
        password = "admin123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$API_URL/login" -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body -TimeoutSec 5 -ErrorAction Stop
    
    $jsonData = $response.Content | ConvertFrom-Json
    
    if ($jsonData.access_token) {
        Write-Host "✅ ¡Login exitoso!" -ForegroundColor Green
        Write-Host "   Email: admin@uni.com" -ForegroundColor Green
        Write-Host "   Token: $($jsonData.access_token.Substring(0, 20))..." -ForegroundColor Green
        Write-Host "   Usuario: $($jsonData.user.name)" -ForegroundColor Green
        Write-Host "   Rol: $($jsonData.user.role.nombre)" -ForegroundColor Green
    } else {
        Write-Host "❌ Login falló" -ForegroundColor Red
        Write-Host "   Response: $($response.Content)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Login falló: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Asegúrate de:" -ForegroundColor Yellow
    Write-Host "   1. La base de datos está poblada: php artisan db:seed" -ForegroundColor Yellow
    Write-Host "   2. Las credenciales son correctas: admin@uni.com / admin123" -ForegroundColor Yellow
    Write-Host "   3. El servidor está corriendo: php artisan serve --port=8000" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "✨ Prueba de API completada!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Si sigue habiendo problemas:" -ForegroundColor Yellow
Write-Host "   - Verifica que APIs están respondiendo con: curl http://localhost:8000/api/login" -ForegroundColor Yellow
Write-Host "   - Reinicia el servidor: php artisan serve --port=8000" -ForegroundColor Yellow
Write-Host "   - Limpia caché: php artisan config:clear && php artisan cache:clear" -ForegroundColor Yellow
