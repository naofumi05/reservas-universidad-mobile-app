import { Notification } from '@/types/models';
import api from './api';

export const notificationsService = {
    getAll: async (): Promise<Notification[]> => {
        console.log('[NotificationsService] getAll called');
        const response = await api.get<any>('/notificaciones');

        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    },

    markAsRead: async (id: string): Promise<any> => {
        console.log(`[NotificationsService] markAsRead called for notification ${id}`);
        const response = await api.put(`/notificaciones/${id}/leer`);
        return response.data;
    },

    markAllAsRead: async (): Promise<any> => {
        console.log('[NotificationsService] markAllAsRead called');
        // Corrected URL based on Postman collection
        const response = await api.put('/notificaciones/marcar-todas-leidas');
        return response.data;
    }
};
