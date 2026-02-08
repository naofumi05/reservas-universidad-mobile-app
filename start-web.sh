#!/bin/bash
# Script para ejecutar la app móvil en modo web

echo "🚀 Iniciando Easy Reservas App (Expo Web)"
echo "==========================================="
echo ""
echo "Verificando que Node.js está instalado..."
node --version

echo ""
echo "Limpiando caché de Expo..."
# rm -rf .expo  # Descomentar si hay problemas

echo ""
echo "Iniciando servidor Expo..."
echo "Se abrirá: http://localhost:19000 para seleccionar plataforma"
echo ""
echo "Presiona 'w' para abrir en navegador web"
echo ""

npx expo start --web
