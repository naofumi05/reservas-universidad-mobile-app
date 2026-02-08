import { CONFIG } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Crear instancia de Axios
const api = axios.create({
    baseURL: CONFIG.API_URL,
    timeout: CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores (ej: 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
        console.log(`[API SUCCESS] ${response.config.method?.toUpperCase()} ${response.config.url}`);
        return response;
    },
    async (error) => {
        const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
        const url = error.config?.url || 'UNKNOWN';
        
        // Logueo detallado de errores
        if (error.response) {
            // El servidor respondió con un status error
            console.log(`[API ERROR] ${method} ${url} -> Status: ${error.response.status}`);
            console.log(`[API ERROR] Response:`, error.response.data);
        } else if (error.request) {
            // La solicitud se realizó pero no hubo respuesta
            console.log(`[API ERROR] ${method} ${url} -> Network Error (no response)`);
            console.log(`[API ERROR] Request:`, error.request);
        } else {
            // Algo sucedió en la configuración de la solicitud
            console.log(`[API ERROR] ${method} ${url} -> Error: ${error.message}`);
        }

        if (error.response?.status === 401) {
            // Token expirado o inválido
            await AsyncStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
            await AsyncStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        }
        return Promise.reject(error);
    }
);

export default api;
