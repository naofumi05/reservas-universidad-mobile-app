# ✅ SOLUCIÓN - App Móvil Android

## El Problema
El emulador Android NO podía conectarse a `10.0.0.2` (dirección especial de Android).

## La Solución
He configurado la app para usar tu **IP local: `192.168.100.32`**

## 📱 Pasos para que Funcione

### 1. Verificar que el Backend está corriendo en TODAS las interfaces

Abre una terminal y ejecuta:
```powershell
cd C:\xampp\htdocs\reservas-universidad-NEW
php artisan serve
```

Debería mostrar:
```
INFO  Server running on [http://127.0.0.1:8000].
```

### 2. Recargar la App en el Emulador

En Expo (donde está corriendo tu app), **presiona `r`** para recargar (o haz refresh manual)

### 3. Intenta Loguearte Nuevamente

- Email: `admin@uni.com`
- Contraseña: `admin123`

## ⚠️ IMPORTANTE - Si la IP cambió

Si tu IP local **cambió** (puedes verificar con `ipconfig | findstr IPv4`), necesitas actualizar:

**En el archivo:** `C:\xampp\htdocs\reservas-universidad-mobile-app\constants\config.ts`

Busca esta línea:
```typescript
android: 'http://192.168.100.32:8000/api',  // TU IP LOCAL
```

Y reemplaza `192.168.100.32` con tu IP actual.

Luego recarga la app (presiona `r` en Expo).

## 🔍 Debugging

Si sigue sin funcionar, comparte estos logs:

1. **Log de Expo** - Lo que ves en la consola de Expo
2. **Console del navegador** - F12 → Console
3. **Output de este comando:**
```powershell
curl -X POST http://192.168.100.32:8000/api/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@uni.com","password":"admin123"}'
```

## 📋 Checklist

- ✅ Backend corriendo: http://192.168.100.32:8000/api/ping
- ✅ App recargada: presionaste `r` en Expo  
- ✅ IP correcta en config.ts
- ✅ Firewall permite conexión al puerto 8000

## 💡 Alternativa - Si sigue sin funcionar

Si persiste el error "Network Error", intenta:

1. Cierra el emulador
2. Ejecuta:
```powershell
cd C:\xampp\htdocs\reservas-universidad-mobile-app
rm -r .expo
npx expo start
```
3. Presiona `a` para Android emulator
4. Deja que se inicie y prueba de nuevo

---

**¿Qué ves ahora en la consola de Expo?**
