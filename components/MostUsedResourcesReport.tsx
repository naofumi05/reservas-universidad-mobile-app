import api from '@/services/api';
import { Resource } from '@/types/models';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, List, Text, useTheme } from 'react-native-paper';

interface ReportData {
    recurso_id: number;
    nombre: string;
    total_reservas: number;
    horas_reservadas: number;
    recurso?: Resource;
}

export default function MostUsedResourcesReport() {
    const theme = useTheme();

    const { data: report, isLoading } = useQuery<ReportData[]>({
        queryKey: ['reports', 'most-used-resources'],
        queryFn: async () => {
            const response = await api.get('/recursos/reportes/mas-usados');
            return response.data;
        },
        refetchInterval: 300000, // Refresh every 5 minutes
    });

    if (isLoading) {
        return (
            <Card style={styles.card}>
                <Card.Title title="Recursos Más Usados" />
                <Card.Content>
                    <ActivityIndicator style={{ marginTop: 20 }} />
                </Card.Content>
            </Card>
        );
    }

    if (!report || report.length === 0) {
        return (
            <Card style={styles.card}>
                <Card.Title title="Recursos Más Usados" />
                <Card.Content>
                    <Text>No hay datos disponibles</Text>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Card style={styles.card}>
            <Card.Title title="Recursos Más Usados" subtitle="Top 10 recursos" />
            <Card.Content>
                <View>
                    {report.slice(0, 10).map((item, index) => (
                        <List.Item
                            key={item.recurso_id}
                            title={item.nombre}
                            description={`${item.total_reservas} reservas • ${Math.round(item.horas_reservadas)} horas`}
                            left={() => (
                                <View style={[styles.rank, { backgroundColor: index < 3 ? theme.colors.primaryContainer : theme.colors.surfaceVariant }]}>
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                                        #{index + 1}
                                    </Text>
                                </View>
                            )}
                        />
                    ))}
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
    },
    rank: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
});
