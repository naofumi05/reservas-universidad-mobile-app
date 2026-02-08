# 🎓 Universidad Mobile App - Sistema de Reservas

![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)

Una aplicación móvil moderna y "Premium" diseñada para la gestión de reservas de recursos universitarios (aulas, laboratorios, bibliotecas). Esta app se integra con un backend Laravel para ofrecer una experiencia fluida tanto a estudiantes como a administradores.

## ✨ Características Principales

- **Diseño Premium:** Estética institucional en verde esmeralda con gradientes, sombras suaves y micro-animaciones.
- **Dashboard Dual:**
  - **Administrador:** Vista global con estadísticas, gestión de usuarios y recursos.
  - **Estudiante/Usuario:** Vista personalizada con próximas reservas y acceso rápido.
- **Gestión Inteligente:** Sistema de búsqueda con filtros avanzados (capacidad, ubicación, tipo).
- **Control de Acceso:** Manejo de roles (Admin/User) y seguridad mediante JWT.
- **Reportes Visuales:** Pantalla de estadísticas con gráficos estilizados y análisis de uso.

## 🚀 Instalación y Configuración

### 1. Requisitos Previos

- Node.js instalado.
- Expo Go en tu dispositivo móvil o un emulador de Android/iOS.
- El backend de Laravel en ejecución.

### 2. Clonar el Repositorio

```bash
git clone [URL-DEL-REPOSITORIO]
cd reservas-universidad-mobile-app
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar el API

Localiza el archivo `constants/config.ts` o usa un archivo `.env`:

- **Emulador Android:** `http://10.0.2.2:8000/api`
- **Dispositivo Físico/Web:** `http://[TU-IP-LOCAL]:8000/api`

### 5. Iniciar la Aplicación

```bash
npx expo start -c
```

## 📂 Estructura del Proyecto

- `app/`: Navegación basada en archivos (Expo Router).
- `components/`: UI custom y componentes reutilizables.
- `hooks/`: Lógica compartida y React Query.
- `services/`: Capa de servicios para comunicación con el API de Laravel.
- `constants/`: Temas (colores institucionales) y configuración global.

## 👥 Credenciales de Prueba (Admin)

- **Email:** `admin@uni.com`
- **Password:** `admin123`

## 🎨 Identidad Visual

La app utiliza un sistema de diseño basado en:

- **Color Primario:** Verde Institucional (`#10B981`)
- **Estilo:** Minimalista, Premium, "Rich Aesthetics".

---
Desarrollado para el sistema de gestión universitaria.
