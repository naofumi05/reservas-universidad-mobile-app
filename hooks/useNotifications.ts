import { notificationsService } from '@/services/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const KEYS = {
    NOTIFICATIONS: 'notifications',
};

export const useNotifications = () => {
    const queryClient = useQueryClient();

    // Obtener notificaciones
    const notificationsQuery = useQuery({
        queryKey: [KEYS.NOTIFICATIONS],
        queryFn: notificationsService.getAll,
        // Refetch cada minuto para mantener actualizado
        refetchInterval: 60000,
    });

    // Marcar una como leída
    const markReadMutation = useMutation({
        mutationFn: notificationsService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEYS.NOTIFICATIONS] });
        },
    });

    // Marcar todas como leídas
    const markAllReadMutation = useMutation({
        mutationFn: notificationsService.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEYS.NOTIFICATIONS] });
        },
    });

    return {
        notifications: notificationsQuery.data || [],
        isLoading: notificationsQuery.isLoading,
        isError: notificationsQuery.isError,
        refetch: notificationsQuery.refetch,

        markAsRead: markReadMutation.mutate,
        markAllAsRead: markAllReadMutation.mutate,

        unreadCount: (notificationsQuery.data || []).filter(n => !n.leida).length
    };
};
