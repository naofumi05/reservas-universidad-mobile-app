import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import * as config from '@/constants/config';
import { useAuth } from './useAuth';

export interface ResourceType {
  id: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export function useResourceTypes() {
  const { token } = useAuth();

  const query = useQuery({
    queryKey: ['resourceTypes'],
    queryFn: async () => {
      if (!token) return [];
      const response = await axios.get(`${config.API_BASE_URL}/tipos-recursos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data || response.data;
    },
    enabled: !!token,
  });

  return {
    types: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
