// Configuración global de la aplicación
import { Platform } from 'react-native';

// Detectar el entorno y usar la URL correcta
const getAPIUrl = (): string => {
    // En desarrollo, intentar primero localhost, luego 127.0.0.1
    const API_URLS = {
        web: 'http://localhost:8000/api',
        android: 'http://192.168.100.32:8000/api',  // TU IP LOCAL
        ios: 'http://localhost:8000/api',
        default: 'http://localhost:8000/api',
    };

    const url = API_URLS[Platform.OS as keyof typeof API_URLS] || API_URLS.default;
    console.log(`[CONFIG] Platform: ${Platform.OS}, API_URL: ${url}`);
    return url;
};

export const CONFIG = {
    // URL base de la API (se detecta automáticamente según el entorno)
    API_URL: getAPIUrl(),

    // Timeout para las peticiones (en ms)
    TIMEOUT: 30000,

    // Claves para almacenamiento local
    STORAGE_KEYS: {
        TOKEN: 'user_token',
        USER: 'user_data',
    },

    // Debug
    DEBUG: true,
};

// Exportar como compatibilidad con código más antiguo
export const API_BASE_URL = CONFIG.API_URL;
