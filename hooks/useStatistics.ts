import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import * as config from '@/constants/config';
import { useAuth } from './useAuth';

export interface Statistics {
  totales: {
    total_reservas: number;
    total_usuarios: number;
    total_recursos: number;
    reservas_activas: number;
  };
  reservas_por_mes: Array<{
    mes: string;
    cantidad: number;
  }>;
  recursos_mas_usados: Array<{
    recurso: string;
    cantidad: number;
  }>;
}

export function useStatistics() {
  const { token } = useAuth();

  const query = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      if (!token) return null;
      try {
        const response = await axios.get(`${config.API_BASE_URL}/estadisticas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching statistics:', error);
        // Return mock data on error
        return {
          totales: {
            total_reservas: 0,
            total_usuarios: 0,
            total_recursos: 0,
            reservas_activas: 0,
          },
          reservas_por_mes: [],
          recursos_mas_usados: [],
        };
      }
    },
    enabled: !!token,
  });

  return {
    stats: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
