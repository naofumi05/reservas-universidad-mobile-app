import { Resource, ResourceFilters, ResourceType } from '@/types/models';
import api from './api';

export const resourcesService = {
    getAll: async (filters?: ResourceFilters): Promise<Resource[]> => {
        console.log('[ResourcesService] getAll called with filters:', filters);
        const params = new URLSearchParams();
        if (filters?.tipo_recurso_id) params.append('tipo_recurso_id', String(filters.tipo_recurso_id));
        if (filters?.disponible !== undefined && filters?.disponible !== null) params.append('disponible', String(filters.disponible ? 1 : 0));

        const url = params.toString() ? `/recursos?${params.toString()}` : '/recursos';
        console.log(`[ResourcesService] Fetching URL: ${url}`);

        try {
            const response = await api.get<any>(url);
            const data = response.data;

            console.log('[ResourcesService] Response data type:', Array.isArray(data) ? 'Array' : typeof data);

            if (Array.isArray(data)) {
                console.log(`[ResourcesService] Returning direct array of ${data.length} items`);
                return data;
            }

            if (data && typeof data === 'object') {
                console.log('[ResourcesService] Response keys:', Object.keys(data));

                // standard Laravel
                if (Array.isArray(data.data)) {
                    console.log(`[ResourcesService] Found array in .data (${data.data.length} items)`);
                    return data.data;
                }
                // pluralized
                if (Array.isArray(data.recursos)) {
                    console.log(`[ResourcesService] Found array in .recursos (${data.recursos.length} items)`);
                    return data.recursos;
                }

                const firstArrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
                if (firstArrayKey) {
                    console.log(`[ResourcesService] Found array in .${firstArrayKey} (${data[firstArrayKey].length} items)`);
                    return data[firstArrayKey];
                }
            }

            console.warn('[ResourcesService] No array found in response body');
            return [];
        } catch (error) {
            console.error('[ResourcesService] Error in getAll:', error);
            throw error;
        }
    },

    getById: async (id: number): Promise<Resource> => {
        console.log(`[ResourcesService] getById called for resource ${id}`);
        const response = await api.get<Resource>(`/recursos/${id}`);
        return response.data;
    },

    getTypes: async (): Promise<ResourceType[]> => {
        console.log('[ResourcesService] getTypes called');
        try {
            const response = await api.get<any>('/tipos-recursos');
            const data = response.data;

            if (Array.isArray(data)) {
                return data;
            }

            if (data && typeof data === 'object') {
                if (Array.isArray(data.data)) return data.data;
                if (Array.isArray(data.tipos)) return data.tipos;
                if (Array.isArray(data.tipos_recursos)) return data.tipos_recursos;

                const firstArrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
                if (firstArrayKey) return data[firstArrayKey];
            }
        } catch (error) {
            console.error('[ResourcesService] Error in getTypes:', error);
        }
        return [];
    },

    checkAvailability: async (id: number, start: string, end: string): Promise<any> => {
        console.log(`[ResourcesService] checkAvailability called for resource ${id}`, { start, end });
        const response = await api.get(`/recursos/${id}/disponibilidad`, {
            params: { fecha_inicio: start, fecha_fin: end }
        });
        return response.data;
    },

    // Admin methods
    create: async (data: Partial<Resource>): Promise<Resource> => {
        console.log('[ResourcesService] create called', data);
        const response = await api.post<any>('/recursos', data);
        return response.data.data || response.data;
    },

    update: async (id: number, data: Partial<Resource>): Promise<Resource> => {
        console.log(`[ResourcesService] update called for resource ${id}`, data);
        const response = await api.put<any>(`/recursos/${id}`, data);
        return response.data.recurso || response.data.data || response.data;
    },

    delete: async (id: number): Promise<{ message: string }> => {
        console.log(`[ResourcesService] delete called for resource ${id}`);
        const response = await api.delete<{ message: string }>(`/recursos/${id}`);
        return response.data;
    },

    // Advanced search & reports
    searchAdvanced: async (filters: any): Promise<Resource[]> => {
        console.log('[ResourcesService] searchAdvanced called', filters);
        const response = await api.get<any>('/recursos/busqueda-avanzada', { params: filters });
        const data = response.data;

        if (Array.isArray(data)) {
            return data;
        } else if (data && Array.isArray(data.data)) {
            return data.data;
        }
        return [];
    },

    getAvailableByType: async (typeId: number, start?: string, end?: string): Promise<Resource[]> => {
        console.log(`[ResourcesService] getAvailableByType called for type ${typeId}`, { start, end });
        const response = await api.get<any>(`/recursos/tipo/${typeId}/disponibles`, {
            params: { fecha_inicio: start, fecha_fin: end }
        });
        const data = response.data;

        if (Array.isArray(data)) {
            return data;
        } else if (data && Array.isArray(data.data)) {
            return data.data;
        }
        return [];
    },

    getMostUsed: async (limit: number = 10, start?: string, end?: string): Promise<any[]> => {
        console.log('[ResourcesService] getMostUsed called', { limit, start, end });
        const response = await api.get<any>('/recursos/reportes/mas-utilizados', {
            params: { limite: limit, fecha_desde: start, fecha_hasta: end }
        });
        const data = response.data;

        if (Array.isArray(data)) {
            return data;
        } else if (data && Array.isArray(data.data)) {
            return data.data;
        }
        return [];
    }
};
