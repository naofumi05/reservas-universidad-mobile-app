# 📱 Actualización App Móvil - Igualada con Frontend Web

## ✅ Mejoras Realizadas

### 🎯 Nuevos Hooks Creados

1. **`useStatistics.ts`** - Hook para obtener estadísticas generales
   - Total de reservas
   - Reservas activas
   - Total de usuarios
   - Total de recursos
   - Reservas por mes
   - Recursos más usados

2. **`useResourceTypes.ts`** - Hook para obtener tipos de recursos
   - Necesario para crear y editar recursos

3. **`useUsers.ts`** - Hook para obtener lista de usuarios
   - Integración completa con React Query
   - Búsqueda y filtrado

### 📊 Componentes Nuevos

1. **`StatisticsCards.tsx`** - Componente de tarjetas de estadísticas
   - Muestra 4 métricas principales
   - Diseño horizontal scrolleable
   - Compatible con el tema amber/yellow

### 🏢 Panel de Administración Completo

#### Generación de Usuarios
- [x] **`app/admin/users/index.tsx`** - Lista de usuarios con búsqueda
- [x] **`app/admin/users/create.tsx`** - Crear nuevo usuario
- [x] **`app/admin/users/edit.tsx`** - Editar usuario y eliminar

#### Gestión de Recursos
- [x] **`app/admin/resources/index.tsx`** - Lista de recursos con búsqueda
- [x] **`app/admin/resources/create.tsx`** - Crear nuevo recurso
- [x] **`app/admin/resources/edit.tsx`** - Editar recurso y eliminar

### 👤 Pantala de Perfil Mejorada

Nuevas opciones agregadas:
- ✅ Cambiar contraseña
- ✅ Gestionar notificaciones
- ✅ Ver información de cuenta
- ✅ Badge con rol del usuario
- ✅ Confirmación antes de cerrar sesión
- ✅ Notificaciones con Snackbar

### 📈 Dashboard Mejorado
- ✅ Agregado componente de Estadísticas Generales (solo para admins)
- ✅ Mantiene todas las funcionalidades anteriores
- ✅ Mejor organización visual

## 🔧 Configuración

### API Base URL
La app móvil utiliza la siguiente configuración en `constants/config.ts`:

```typescript
export const CONFIG = {
    API_URL: 'http://192.168.100.32:8000/api', // Android
    // o 'http://localhost:8000/api' // iOS/Web
    TIMEOUT: 30000,
    STORAGE_KEYS: {
        TOKEN: 'user_token',
        USER: 'user_data',
    },
    DEBUG: true,
};

// Para compatibilidad:
export const API_BASE_URL = CONFIG.API_URL;
```

## 🔐 Authentication

### Flujo de Autenticación
1. Usuario inicia sesión con email y contraseña
2. Backend retorna JWT token
3. Token se almacena en AsyncStorage
4. Se incluye en cada petición en header `Authorization: Bearer {token}`
5. En logout se invalida el token y se limpia AsyncStorage

### Puntos Finales Utilizados
- `POST /api/login` - Iniciar sesión
- `GET /api/me` - Obtener usuario autenticado
- `POST /api/logout` - Cerrar sesión

## 📋 Funcionalidades admin

### Usuarios
- ✅ Listar todos los usuarios
- ✅ Crear nuevo usuario (nombre, email, contraseña, rol)
- ✅ Editar usuario (nombre, email, rol, estado)
- ✅ Eliminar usuario (desactivar)
- ✅ Búsqueda por nombre o email

### Recursos
- ✅ Listar todos los recursos
- ✅ Crear nuevo recurso (nombre, tipo, capacidad, planta, descripción)
- ✅ Editar recurso
- ✅ Eliminar recurso
- ✅ Búsqueda por nombre o tipo

### Estadísticas
- ✅ Total de reservas
- ✅ Reservas activas
- ✅ Total de usuarios
- ✅ Total de recursos
- ✅ Almacenados en caché con React Query

## 📱 Funcionalidades Usuario

### Reservas
- ✅ Ver próxima reserva en dashboard
- ✅ Listar todas las reservas
- ✅ Ver detalles de reserva
- ✅ Crear nueva reserva
- ✅ Cancelar reserva

### Recursos
- ✅ Ver lista de recursos disponibles
- ✅ Filtrar por tipo
- ✅ Buscar por nombre o ubicación
- ✅ Ver detalles del recurso

### Notificaciones
- ✅ Ver notificaciones
- ✅ Marcar como leída
- ✅ Badge de notificaciones sin leer

## 🎨 Tema Visual

### Colores Implementados
- **Primary**: Amber/Amarillo (#F59E0B)
- **Secondary**: Gris
- **Tertiary**: Verde (#10B981)
- **Error**: Rojo (#EF4444)

Desde `constants/theme.ts`:
```typescript
export const colors = {
  primary: '#F59E0B',      // Amber
  secondary: '#6B7280',    // Gray
  tertiary: '#10B981',     // Green
  error: '#EF4444',        // Red
};
```

## ✨ Validaciones Implementadas

### Formularios
- ✅ Validación de campos obligatorios
- ✅ Validación de email
- ✅ Validación de contraseña (mínimo 6 caracteres)
- ✅ Confirmación de contraseña
- ✅ Mensajes de error por campo

### Seguridad
- ✅ JWT token authentication
- ✅ Protección de rutas (solo acceso autenticado)
- ✅ Verificación de rol (solo admin puede acceder a panel admin)
- ✅ Logout seguro con invalidación de token

## 🚀 Cómo Usar

### Para iniciar la app móvil

```bash
cd C:\xampp\htdocs\reservas-universidad-mobile-app
npm start
# o
npx expo start
```

### Para iniciar el backend

```bash
cd C:\xampp\htdocs\reservas-universidad-NEW
php artisan serve --port=8000
```

### Credenciales de Prueba

```
Email: admin@uni.com
Password: admin123
```

## 📦 Dependencias Principales

- **React Native** + **Expo** - Framework móvil
- **Expo Router** - Navegación
- **React Native Paper** - Componentes UI
- **React Query** - State management para datos
- **Axios** - Cliente HTTP
- **AsyncStorage** - Almacenamiento local
- **TailwindCSS** (en web) - Estilos

## 🔄 Sincronización con el Servidor

Todas las operaciones CRUD se sincronizan automáticamente con el servidor:

1. **Get** - Obtiene datos del servidor
2. **Create** - Crea registro en servidor y actualiza caché local
3. **Update** - Actualiza registro en servidor y caché local
4. **Delete** - Elimina en servidor y caché local

Con React Query, los datos se cachean y se pueden refrescar con:
- `refetch()` - Recarga manual
- Pull-to-refresh - Recarga al deslizar hacia abajo
- Auto-refresh al enfocar pantalla

## 🐛 Debugging

La app incluye logging detallado en `services/api.ts`:

```typescript
console.log(`[API SUCCESS] ${method} ${url}`);
console.log(`[API ERROR] ${method} ${url} -> Status: ${status}`);
```

Activa en desarrollo con `DEBUG: true` en config.ts

## ✅ Checklist de Completitud

- [x] Autenticación JWT funcional
- [x] Panel admin completo (usuarios y recursos)
- [x] Gestión de reservas
- [x] Notificaciones
- [x] Perfil de usuario con configuración
- [x] Estadísticas para admin
- [x] Validación de formularios
- [x] Protección de rutas
- [x] Tema visual coherente
- [x] Sincronización con servidor
- [x] Manejo de errores
- [x] Caching con React Query

---

**Estado**: ✅ App móvil completamente alineada con el frontend web

**Última actualización**: 8 de febrero de 2026
