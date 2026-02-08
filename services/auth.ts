import { LoginCredentials, RegisterData, User } from '@/types/auth'; // Ensure types exist or define them
import api from './api';

// Definir tipos aquí si no existe el archivo de tipos aún
export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/login', credentials);
        return response.data;
    },

    logout: async (): Promise<{ message: string }> => {
        const response = await api.post('/logout');
        return response.data;
    },

    me: async (): Promise<User> => {
        const response = await api.get('/me');
        return response.data;
    },

    // Registro (opcional por ahora, según plan)
    register: async (data: RegisterData): Promise<any> => {
        console.log('[AuthService] register called', data);
        const response = await api.post('/register', data);
        return response.data;
    },

    changePasswordFirstLogin: async (userId: number, password: string): Promise<any> => {
        console.log(`[AuthService] changePasswordFirstLogin called for user ${userId}`);
        const response = await api.post('/auth/change-password-first-login', {
            user_id: userId,
            new_password: password,
            new_password_confirmation: password
        });
        return response.data;
    },

    updateProfile: async (data: { name: string; email: string }): Promise<any> => {
        console.log('[AuthService] updateProfile called', data);
        const response = await api.put('/perfil', data);
        return response.data;
    }
};
