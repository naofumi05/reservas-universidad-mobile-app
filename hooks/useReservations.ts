import { reservationsService } from '@/services/reservations';
import { CreateReservationData } from '@/types/models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const KEYS = {
    MY_RESERVATIONS: 'my_reservations',
};

export const useReservations = () => {
    const queryClient = useQueryClient();

    // Obtener mis reservas
    const reservationsQuery = useQuery({
        queryKey: [KEYS.MY_RESERVATIONS],
        queryFn: reservationsService.getMyReservations,
    });

    // Crear reserva
    const createReservationMutation = useMutation({
        mutationFn: (data: CreateReservationData) => reservationsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEYS.MY_RESERVATIONS] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
        },
    });

    // Cancelar reserva
    const cancelReservationMutation = useMutation({
        mutationFn: (id: number) => reservationsService.cancel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEYS.MY_RESERVATIONS] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
        },
    });

    return {
        reservations: reservationsQuery.data || [],
        isLoading: reservationsQuery.isLoading,
        isError: reservationsQuery.isError,
        refetch: reservationsQuery.refetch,

        createReservation: createReservationMutation.mutate,
        isCreating: createReservationMutation.isPending,

        cancelReservation: cancelReservationMutation.mutate,
        isCanceling: cancelReservationMutation.isPending,
    };
};
