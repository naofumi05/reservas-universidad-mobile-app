import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator, Card, List, SegmentedButtons, Text, useTheme } from 'react-native-paper';

interface ReportByResourceData {
    recurso_id: number;
    nombre_recurso: string;
    total_reservas: number;
    horas_reservadas: number;
}

interface ReportByUserData {
    user_id: number;
    nombre_usuario: string;
    total_reservas: number;
    horas_reservadas: number;
}

export default function ReservationReports() {
    const theme = useTheme();
    const [reportType, setReportType] = useState<'resource' | 'user'>('resource');

    const { data: resourceReport, isLoading: isLoadingResource } = useQuery<ReportByResourceData[]>({
        queryKey: ['reports', 'reservations-by-resource'],
        queryFn: async () => {
            const response = await api.get('/reservas/reportes/por-recurso');
            return response.data;
        },
        enabled: reportType === 'resource',
        refetchInterval: 300000, // Refresh every 5 minutes
    });

    const { data: userReport, isLoading: isLoadingUser } = useQuery<ReportByUserData[]>({
        queryKey: ['reports', 'reservations-by-user'],
        queryFn: async () => {
            const response = await api.get('/reservas/reportes/por-usuario');
            return response.data;
        },
        enabled: reportType === 'user',
        refetchInterval: 300000,
    });

    const isLoading = reportType === 'resource' ? isLoadingResource : isLoadingUser;
    const data = reportType === 'resource' ? resourceReport : userReport;

    return (
        <Card style={styles.card}>
            <Card.Title title="Reportes de Reservas" />
            <Card.Content>
                <SegmentedButtons
                    value={reportType}
                    onValueChange={(value) => setReportType(value as 'resource' | 'user')}
                    buttons={[
                        { value: 'resource', label: 'Por Recurso', icon: 'domain' },
                        { value: 'user', label: 'Por Usuario', icon: 'account' },
                    ]}
                    style={{ marginBottom: 16 }}
                />

                {isLoading && <ActivityIndicator style={{ marginTop: 20 }} />}

                {!isLoading && (!data || data.length === 0) && (
                    <Text>No hay datos disponibles</Text>
                )}

                {!isLoading && data && data.length > 0 && (
                    <View>
                        {data.slice(0, 5).map((item: any) => {
                            if (reportType === 'resource') {
                                const resourceItem = item as ReportByResourceData;
                                return (
                                    <List.Item
                                        key={resourceItem.recurso_id}
                                        title={resourceItem.nombre_recurso}
                                        description={`${resourceItem.total_reservas} reservas • ${Math.round(resourceItem.horas_reservadas)} horas`}
                                        left={props => <List.Icon {...props} icon="domain" />}
                                    />
                                );
                            } else {
                                const userItem = item as ReportByUserData;
                                return (
                                    <List.Item
                                        key={userItem.user_id}
                                        title={userItem.nombre_usuario}
                                        description={`${userItem.total_reservas} reservas • ${Math.round(userItem.horas_reservadas)} horas`}
                                        left={props => <List.Icon {...props} icon="account" />}
                                    />
                                );
                            }
                        })}
                    </View>
                )}
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
    },
});
