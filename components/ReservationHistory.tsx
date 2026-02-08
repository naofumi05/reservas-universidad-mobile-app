import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Card, List, Text, useTheme } from 'react-native-paper';

interface HistoryEntry {
    id: number;
    reserva_id: number;
    user_id: number;
    accion: string;
    detalle: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface ReservationHistoryProps {
    reservationId: number;
}

export default function ReservationHistory({ reservationId }: ReservationHistoryProps) {
    const theme = useTheme();

    const { data: history, isLoading } = useQuery<HistoryEntry[]>({
        queryKey: ['reservation', 'history', reservationId],
        queryFn: async () => {
            const response = await api.get(`/reservas/${reservationId}/historial`);
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <Card style={styles.card}>
                <Card.Title title="Historial de Cambios" />
                <Card.Content>
                    <ActivityIndicator style={{ marginTop: 20 }} />
                </Card.Content>
            </Card>
        );
    }

    if (!history || history.length === 0) {
        return null;
    }

    return (
        <Card style={styles.card}>
            <Card.Title title="Historial de Cambios" />
            <Card.Content>
                {history.map((entry, index) => (
                    <List.Item
                        key={entry.id}
                        title={entry.accion.replace('_', ' ').toUpperCase()}
                        description={`${entry.detalle}\nPor: ${entry.user.name}`}
                        left={() => <List.Icon icon="history" />}
                        right={() => (
                            <Text variant="labelSmall" style={{ color: theme.colors.secondary }}>
                                {new Date(entry.created_at).toLocaleString()}
                            </Text>
                        )}
                        style={index < history.length - 1 ? { borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceVariant } : {}}
                    />
                ))}
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
    },
});
