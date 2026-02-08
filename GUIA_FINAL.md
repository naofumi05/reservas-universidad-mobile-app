# 📱 GUÍA FINAL - Ejecutar Easy Reservas App Móvil

## ✅ Estado Verificado

✅ **Backend API:** Funcionando en `http://127.0.0.1:8000`
✅ **CORS:** Configurado para desarrollo local
✅ **JWT:** Generando tokens correctamente
✅ **Base de datos:** Poblada con datos de prueba

## 🚀 INSTRUCCIONES PASO A PASO

### PASO 1: Asegurar que el Backend Está Corriendo

```powershell
# Verifica que el servidor está activo
cd C:\xampp\htdocs\reservas-universidad-NEW
php artisan serve --port=8000
```

**Debería mostrar:**
```
INFO  Server running on [http://127.0.0.1:8000].
```

### PASO 2: Ejecutar la App Móvil

Abre una **NUEVA TERMINAL** y:

```powershell
cd C:\xampp\htdocs\reservas-universidad-mobile-app
npx expo start
```

### PASO 3:  Elegir Plataforma

Cuando Expo inicie, verás:
```
› Metro waiting on http://localhost:19000

Scan QR code above with Expo Go app

Press:
 › a - Android emulator
 › i - iOS emulator
 › w - web browser
 › r - reload app
 › q - quit
```

**Presiona `w` para abrir en navegador web**

### PASO 4: Esperar a que Compile

La primera compilación tarda 30-60 segundos. Verás:
```
Bundling [================================] 100%
```

Luego se abrirá el navegador en `http://localhost:19000` o similar.

### PASO 5: Loguearse

**Credenciales:**
- Email: `admin@uni.com`
- Contraseña: `admin123`

Si ves un botón para iniciar sesión, ingresa estos datos.

## 🐛 TROUBLESHOOTING

### Error: "Network Error" en la App

**Solución:**
1. Verifica que el servidor está corriendo: `http://127.0.0.1:8000/api/ping`
2. Limpia caché de Expo:
   ```powershell
   rm -r .expo  # En la carpeta de la app
   ```
3. Reinicia Expo:
   ```powershell
   npx expo start --web
   ```

### Error: "Cannot connect to API"

**Verifica:**
```powershell
# En la carpeta de la app
.\test-api.bat
```

Debería devolver un JSON con token.

### Error: "Module not found" o similar

**Solución:**
```powershell
cd C:\xampp\htdocs\reservas-universidad-mobile-app
npm install
npx expo start --web
```

## 📡 URLs Importantes

| Servicio | URL |
|----------|-----|
| **Backend API** | http://127.0.0.1:8000 |
| **API Ping** | http://127.0.0.1:8000/api/ping |
| **Expo Dev** | http://localhost:19000 (cuando ejecutas npx expo start) |
| **Expo Web** | http://localhost:19001 (cuando presionas `w`) |
| **Frontend Web** | http://localhost:5173 |

## 🔐 Credenciales

**Admin:**
- Email: `admin@uni.com`
- Contraseña: `admin123`
- Rol: Admin (acceso total)

**Usuario Normal:** 
- (Puedes crearlos desde el panel admin en la app web)

## 📝 Notas Importantes

1. **Primera compilación:** Puede tardar 1-2 minutos
2. **Hot reload:** Si cambias código, se actualiza automáticamente
3. **Logs:** Verás logs en la terminal de Expo
4. **Desarrollador:** Abre DevTools del navegador (F12) para ver errores

## 🎯 Flujo de Trabajo

```
Terminal 1          Terminal 2              Navegador
    ↓                   ↓                       ↓
Backend          Expo Start         Login → Dashboard
Running          ↓                   ↓
127.0.0.1:8000   Compila            Ver Recursos
                  ↓                   Ver Reservas
                  Web Server         Admin Panel
                  localhost:19000
```

## ✨ Si Todo Funciona

Deberías ver:
1. ✅ Pantalla de login de Easy Reservas
2. ✅ Poder loguearte con admin@uni.com
3. ✅ Ver dashboard con recursos y reservas
4. ✅ Acceso a panel admin

## 💡 Próximos Pasos

Una vez que funcione:
1. Explora las secciones (Recursos, Mis Reservas, Perfil)
2. Intenta crear una reserva
3. Crea un usuario normal y prueba su dashboard
4. Revisa los reportes en la sección de admin

---

**¿Problemas?** Comparte:
1. El error exacto en la consola (F12)
2. Output de `.\test-api.bat`
3. Output de `npx expo start`
