import { Role } from '@/types/models';
import api from './api';

export const rolesService = {
    getAll: async (): Promise<Role[]> => {
        console.log('[RolesService] getAll called');
        const response = await api.get<{ data: Role[] }>('/roles');
        return response.data.data;
    }
};
