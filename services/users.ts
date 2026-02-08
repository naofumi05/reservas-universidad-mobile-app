import { User } from '@/types/auth';
import api from './api';

export const usersService = {
    getAll: async (): Promise<User[]> => {
        console.log('[UsersService] getAll called');
        const response = await api.get<{ data: User[] }>('/usuarios');
        return response.data.data;
    },

    getById: async (id: number): Promise<User> => {
        console.log(`[UsersService] getById called with id: ${id}`);
        const response = await api.get<{ data: User }>(`/usuarios/${id}`);
        return response.data.data;
    },

    create: async (data: Partial<User> & { password: string }): Promise<User> => {
        console.log('[UsersService] create called', data);
        const response = await api.post<{ data: User }>('/usuarios', data);
        return response.data.data;
    },

    update: async (id: number, data: Partial<User>): Promise<User> => {
        console.log(`[UsersService] update called with id: ${id}`, data);
        const response = await api.put<{ user: User }>(`/usuarios/${id}`, data);
        return response.data.user;
    },

    delete: async (id: number): Promise<{ message: string }> => {
        console.log(`[UsersService] delete called with id: ${id}`);
        const response = await api.delete<{ message: string }>(`/usuarios/${id}`);
        return response.data;
    }
};
