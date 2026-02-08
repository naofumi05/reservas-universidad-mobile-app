import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text, useTheme } from 'react-native-paper';

interface StatsData {
    totales: {
        total_reservas: number;
        reservas_activas: number;
        reservas_canceladas: number;
    };
    promedios: {
        reservas_por_usuario: number;
        reservas_por_recurso: number;
    };
    top_usuarios: Array<{
        usuario: string;
        total_reservas: number;
    }>;
}

export default function AdminStatsSection() {
    const theme = useTheme();

    const { data: stats, isLoading } = useQuery<StatsData>({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const response = await api.get('/reservas/reportes/estadisticas');
            return response.data;
        },
        refetchInterval: 60000, // Refresh every minute
    });

    if (isLoading) {
        return (
            <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Estadísticas del Sistema</Text>
                <ActivityIndicator style={{ marginTop: 20 }} />
            </View>
        );
    }

    if (!stats) return null;

    return (
        <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Estadísticas del Sistema</Text>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                                {stats.totales.total_reservas}
                            </Text>
                            <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
                                Total Reservas
                            </Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: theme.colors.tertiary }}>
                                {stats.totales.reservas_activas}
                            </Text>
                            <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
                                Activas
                            </Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: theme.colors.error }}>
                                {stats.totales.reservas_canceladas}
                            </Text>
                            <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
                                Canceladas
                            </Text>
                        </View>
                    </View>

                    {stats.top_usuarios && stats.top_usuarios.length > 0 && (
                        <View style={{ marginTop: 16 }}>
                            <Text variant="labelLarge" style={{ marginBottom: 8, fontWeight: '600' }}>
                                Usuarios Más Activos
                            </Text>
                            {stats.top_usuarios.slice(0, 3).map((user, index) => (
                                <View key={index} style={styles.topUserRow}>
                                    <Text variant="bodyMedium">{user.usuario}</Text>
                                    <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                        {user.total_reservas} reservas
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
        fontWeight: '600',
    },
    card: {
        marginBottom: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
    },
    statItem: {
        alignItems: 'center',
    },
    topUserRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
});
