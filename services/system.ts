import api from './api';

export const systemService = {
    ping: async (): Promise<{ message: string }> => {
        console.log('[SystemService] ping called');
        const response = await api.get<{ message: string }>('/ping');
        return response.data;
    }
};
