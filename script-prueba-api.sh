#!/bin/bash
# script-prueba-api.sh - Prueba la conexión a la API

echo "🔍 Probando conexión a la API de Easy Reservas"
echo "================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL de la API
API_URL="http://localhost:8000/api"

echo "📡 Testing API: $API_URL"
echo ""

# Test 1: Verificar que el servidor está activo
echo "1️⃣  Checking if server is running..."
if curl -s "$API_URL/login" -X OPTIONS > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server is responding${NC}"
else
    echo -e "${RED}❌ Server is NOT responding${NC}"
    echo "   Make sure: php artisan serve --port=8000 is running"
    exit 1
fi
echo ""

# Test 2: Intentar login con credenciales inválidas (deberia retornar error 401, no Network Error)
echo "2️⃣  Testing login endpoint..."
RESPONSE=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Login endpoint is working (returned 401 as expected)${NC}"
    echo "   Response: $BODY"
elif [ "$HTTP_CODE" = "000" ] || [ "$HTTP_CODE" = "" ]; then
    echo -e "${RED}❌ Connection refused - Server might not be running${NC}"
    exit 1
else
    echo -e "${YELLOW}⚠️  Unexpected response: HTTP $HTTP_CODE${NC}"
    echo "   Response: $BODY"
fi
echo ""

# Test 3: Check CORS headers
echo "3️⃣  Checking CORS headers..."
CORS_HEADERS=$(curl -s -X OPTIONS "$API_URL/login" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v 2>&1 | grep -i "access-control")

if [ -z "$CORS_HEADERS" ]; then
    echo -e "${YELLOW}⚠️  No CORS headers detected (might be normal for OPTIONS requests)${NC}"
else
    echo -e "${GREEN}✅ CORS headers detected:${NC}"
    echo "$CORS_HEADERS"
fi
echo ""

# Test 4: Login con credenciales correctas
echo "4️⃣  Testing login with correct credentials..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@uni.com","password":"admin123"}')

if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
    echo -e "${GREEN}✅ Login successful!${NC}"
    echo "   You can now use the app"
    
    # Extract token
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    echo "   Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}❌ Login failed${NC}"
    echo "   Response: $LOGIN_RESPONSE"
    echo ""
    echo "   Make sure:"
    echo "   1. Database is seeded: php artisan db:seed"
    echo "   2. Credentials are correct: admin@uni.com / admin123"
fi
echo ""

echo "================================================="
echo "✨ API test complete!"
