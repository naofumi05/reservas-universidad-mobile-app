import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as config from '@/constants/config';
import { useAuth } from './useAuth';

export interface User {
  id: number;
  name: string;
  email: string;
  role_id?: number;
  role?: { id: number; nombre: string };
  estado: number;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export function useUsers() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (!token) return [];
      const response = await axios.get(`${config.API_BASE_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data || response.data;
    },
    enabled: !!token,
  });

  const fetchUsers = async () => {
    if (!token) return [];
    const response = await axios.get(`${config.API_BASE_URL}/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data.data || response.data;
    queryClient.setQueryData(['users'], data);
    return data;
  };

  return {
    users: query.data || [],
    loading: query.isLoading,
    error: query.error,
    fetchUsers,
    refetch: query.refetch,
  };
}
