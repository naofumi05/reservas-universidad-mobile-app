import { resourcesService } from '@/services/resources';
import { ResourceFilters } from '@/types/models';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export function useResources(filters?: ResourceFilters) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Detect if we need advanced search
  const isAdvancedSearch = filters && (
    filters.capacidad ||
    filters.ubicacion ||
    filters.fecha_inicio ||
    filters.fecha_fin
  );

  // Ensure filters is stable or use a consistent key structure
  const queryKey = ['resources', filters || {}];

  const query = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      console.log(`[useResources] Fetching resources. User: ${user?.name || 'Loading...'}, filters:`, filters || 'None');

      try {
        let data;
        if (isAdvancedSearch) {
          data = await resourcesService.searchAdvanced(filters);
        } else {
          data = await resourcesService.getAll(filters);
        }
        console.log(`[useResources] Successfully fetched ${data?.length || 0} resources`);
        return data;
      } catch (err) {
        console.error('[useResources] Fetch error:', err);
        throw err;
      }
    },
    enabled: !!user,
  });

  const typesQuery = useQuery({
    queryKey: ['resource-types'], // Consistent with other files
    queryFn: async () => {
      if (!user) return [];
      return await resourcesService.getTypes();
    },
    enabled: !!user,
  });

  return {
    resources: query.data || [],
    types: typesQuery.data || [],
    isLoadingResources: query.isLoading,
    isLoadingTypes: typesQuery.isLoading,
    isErrorResources: query.isError,
    errorResources: query.error,
    refetchResources: query.refetch,
    refetchTypes: typesQuery.refetch,
  };
}

export function useResourceDetails(id: number) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      if (!user) return null;
      return await resourcesService.getById(id);
    },
    enabled: !!user && !!id,
  });
}
