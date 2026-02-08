# 📱 Setup - App Móvil Easy Reservas

## ✅ Cambios Realizados

Se ha actualizado la configuración de la app móvil para que funcione con el backend local:

### 1. **URL del API Actualizada**
- ❌ Antes: `http://192.168.100.32:8000/api` (IP del compañero)
- ✅ Ahora: `http://127.0.0.1:8000/api` (Localhost)
- Archivo: `constants/config.ts`

## 🚀 Cómo Ejecutar la App

### Paso 1: Instalar Dependencias (si no lo has hecho)
```bash
cd C:\xampp\htdocs\reservas-universidad-mobile-app
npm install
```

### Paso 2: Asegurate que el Backend está Corriendo
```bash
# En otra terminal PowerShell
cd C:\xampp\htdocs\reservas-universidad-NEW
php artisan serve --port=8000
```

### Paso 3: Inicia la App Móvil
```bash
# En la carpeta del proyecto móvil
npm start
```

Esto abrirá Expo Go. Tienes 3 opciones:
- **Android**: Presiona `a`
- **iOS**: Presiona `i`
- **Web**: Presiona `w`

## 📲 Credenciales de Prueba

**Admin:**
- Email: `admin@uni.com`
- Contraseña: `admin123`

**Rol:** Admin (acceso a todas las funciones)

## 🏗️ Estructura de la App

```
app/
├── (auth)/           # Pantalla de login
│   └── login.tsx
├── (tabs)/           # Pantallas principales (para usuarios normales)
│   ├── index.tsx     # Dashboard
│   ├── resources.tsx # Búsqueda de recursos
│   ├── reservations.tsx # Mis reservas
│   ├── profile.tsx   # Perfil
│   └── explore.tsx   # Exploración
├── admin/            # Pantallas admin
│   ├── resources/    # Gestión de recursos
│   └── users/        # Gestión de usuarios
└── auth/             # Cambio de contraseña
```

## 🔐 Sistema de Roles

### Admin
- Gestionar recursos (crear, editar, eliminar)
- Gestionar usuarios
- Ver reportes y estadísticas
- Crear bloqueos de recursos
- Aprobar/rechazar reservas

### Usuario Normal
- Ver recursos disponibles
- Hacer reservas
- Ver mis reservas
- Cambiar perfil

## 📡 Endpoints Configurados

La app se conecta a estos endpoints (todos bajo `/api`):

### Autenticación
- `POST /login` - Iniciar sesión
- `POST /logout` - Cerrar sesión
- `GET /me` - Obtener usuario actual
- `POST /auth/change-password-first-login` - Cambiar contraseña primer login

### Recursos
- `GET /recursos` - Listar recursos
- `GET /recursos/:id` - Obtener recurso
- `GET /tipos-recursos` - Tipos de recursos
- `GET /recursos/:id/disponibilidad` - Verificar disponibilidad

### Reservas
- `GET /reservas` - Mis reservas
- `POST /reservas` - Crear reserva
- `PUT /reservas/:id/cancelar` - Cancelar reserva

### Admin
- `CRUD /recursos` - Crear/actualizar/eliminar recursos
- `CRUD /usuarios` - Gestionar usuarios

## ⚙️ Configuración de Emulador (Android)

Si usas emulador Android, para acceder a localhost:
```bash
# Usa esta IP en lugar de 127.0.0.1
http://10.0.2.2:8000/api
```

En `constants/config.ts` cambia:
```typescript
API_URL: 'http://10.0.2.2:8000/api'
```

## 🐛 Troubleshooting

### Error: "Cannot connect to API"
- ✅ Verifica que el backend esté corriendo en `http://127.0.0.1:8000`
- ✅ Verifica la URL en `constants/config.ts`
- ✅ Si usas Android emulador, usa `10.0.2.2` en lugar de `127.0.0.1`

### Error: "401 Unauthorized"
- ✅ Verifica las credenciales: `admin@uni.com` / `admin123`
- ✅ Revisa que el backend tenga datos (ejecuta `php artisan db:seed`)

### Error: "Invalid JWT Key"
- ✅ El backend tiene `JWT_SECRET` configurado en `.env`
- ✅ Reinicia el servidor backend

## 🔄 Sincronización con Backend y Frontend

La app móvil está sincronizada con:
- **Backend**: `C:\xampp\htdocs\reservas-universidad-NEW` (Laravel)
- **Frontend Web**: `C:\xampp\htdocs\EasyReservas` (React)

Todos comparten:
- ✅ Los mismos endpoints de API
- ✅ El mismo sistema de autenticación JWT
- ✅ Los mismos roles (admin/usuario)
- ✅ La misma base de datos

## 📝 Librerías Principales

- **React Native**: Framework móvil
- **Expo**: Herramienta de desarrollo
- **Expo Router**: Navegación
- **React Query**: Gestión de datos
- **Axios**: Cliente HTTP
- **React Native Paper**: Componentes UI
- **AsyncStorage**: Almacenamiento local

## 🎯 Próximos Pasos (Opcional)

1. Crear pantalla de registro
2. Agregar notificaciones push
3. Agregar sincronización offline
4. Mejorar temas (dark mode)
5. Agregar más reportes y estadísticas

---

¿Preguntas? Revisa los archivos en `services/` para ver cómo se conecta a cada endpoint.
