import { CreateReservationData, HistoryLog, Reservation, SystemStats, UpdateReservationData } from '@/types/models';
import api from './api';

export const reservationsService = {
    getAll: async (): Promise<Reservation[]> => {
        console.log('[ReservationsService] getAll called');
        const response = await api.get<any>('/reservas');

        // Manejar tanto respuesta directa array [] como respuesta envuelta { data: [] }
        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    },

    create: async (data: CreateReservationData): Promise<{ message: string; reserva: Reservation }> => {
        console.log('[ReservationsService] create called', data);
        const response = await api.post('/reservas', data);
        return response.data;
    },

    cancel: async (id: number): Promise<{ message: string; reserva: Reservation }> => {
        console.log(`[ReservationsService] cancel called for reservation ${id}`);
        const response = await api.put(`/reservas/${id}/cancelar`);
        return response.data;
    },

    getMyReservations: async (): Promise<Reservation[]> => {
        console.log('[ReservationsService] getMyReservations called');
        const response = await api.get<any>('/reservas');

        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    },

    getById: async (id: number): Promise<Reservation> => {
        console.log(`[ReservationsService] getById called for reservation ${id}`);
        const response = await api.get<Reservation>(`/reservas/${id}`);
        return response.data;
    },

    update: async (id: number, data: UpdateReservationData): Promise<{ message: string; reserva: Reservation }> => {
        console.log(`[ReservationsService] update called for reservation ${id}`, data);
        const response = await api.put<{ message: string; reserva: Reservation }>(`/reservas/${id}`, data);
        return response.data;
    },

    checkConflicts: async (resourceId: number, start: string, end: string): Promise<any> => {
        console.log(`[ReservationsService] checkConflicts called for resource ${resourceId}`, { start, end });
        const response = await api.post('/reservas/verificar-conflictos', {
            recurso_id: resourceId,
            fecha_inicio: start,
            fecha_fin: end
        });
        return response.data;
    },

    getHistory: async (id: number): Promise<HistoryLog[]> => {
        console.log(`[ReservationsService] getHistory called for reservation ${id}`);
        const response = await api.get<any>(`/reservas/${id}/historial`);

        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    },

    getReportByUser: async (userId: number, filters?: any): Promise<any> => {
        console.log(`[ReservationsService] getReportByUser called for user ${userId}`, filters);
        const response = await api.get(`/reservas/reportes/por-usuario/${userId}`, { params: filters });
        return response.data;
    },

    getStats: async (start?: string, end?: string): Promise<SystemStats> => {
        console.log('[ReservationsService] getStats called', { start, end });
        const response = await api.get<SystemStats>('/reservas/reportes/estadisticas', {
            params: { fecha_desde: start, fecha_hasta: end }
        });
        return response.data;
    }
};
