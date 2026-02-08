import { StatCard } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

interface StatisticsData {
    total_reservas: number;
    reservas_activas: number;
    reservas_canceladas: number;
    reservas_completadas: number;
    recursos_mas_usados: Array<{ recurso_nombre: string; total_reservas: number }>;
    usuarios_top: Array<{ usuario_nombre: string; total_reservas: number }>;
}

// Gráfico de barras estilizado
const StyledBarChart = ({ data }: { data: { label: string, value: number, color?: string }[] }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <View style={styles.chartWrapper}>
            {data.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                    <View style={styles.barLabelRow}>
                        <Text style={styles.barLabelText}>{item.label}</Text>
                        <Text style={styles.barValueText}>{item.value}</Text>
                    </View>
                    <View style={styles.barTrack}>
                        <View
                            style={[
                                styles.barFill,
                                {
                                    width: `${(item.value / maxValue) * 100}%`,
                                    backgroundColor: item.color || colors.primary
                                }
                            ]}
                        />
                    </View>
                </View>
            ))}
        </View>
    );
};

export default function StatisticsScreen() {
    const theme = useTheme();
    const { isAdmin, user } = useAuth();
    const [dateRange] = useState({ desde: '', hasta: '' });

    const { data: statistics, isLoading, error, refetch } = useQuery({
        queryKey: ['statistics', dateRange, isAdmin, user?.id],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (dateRange.desde) params.append('fecha_desde', dateRange.desde);
            if (dateRange.hasta) params.append('fecha_hasta', dateRange.hasta);

            if (isAdmin) {
                const response = await api.get(`/reservas/reportes/estadisticas?${params}`);
                const apiData = response.data;
                return {
                    total_reservas: apiData.totales?.total_reservas || 0,
                    reservas_activas: apiData.totales?.reservas_activas || 0,
                    reservas_canceladas: apiData.totales?.reservas_canceladas || 0,
                    reservas_completadas: apiData.totales?.reservas_finalizadas || 0,
                    recursos_mas_usados: (apiData.reservas_por_tipo_recurso || []).map((r: any) => ({
                        recurso_nombre: r.tipo,
                        total_reservas: r.total_reservas
                    })),
                    usuarios_top: (apiData.top_usuarios || []).map((u: any) => ({
                        usuario_nombre: u.usuario,
                        total_reservas: u.total_reservas
                    }))
                } as StatisticsData;
            } else {
                const response = await api.get(`/reservas/reportes/por-usuario/${user?.id}?${params}`);
                const apiData = response.data;
                const resourceCounts: Record<string, number> = {};
                (apiData.reservas || []).forEach((res: any) => {
                    const name = res.recurso || 'Desconocido';
                    resourceCounts[name] = (resourceCounts[name] || 0) + 1;
                });
                const sortedResources = Object.entries(resourceCounts)
                    .map(([nombre, total]) => ({ recurso_nombre: nombre, total_reservas: total }))
                    .sort((a, b) => b.total_reservas - a.total_reservas);

                return {
                    total_reservas: apiData.total_reservas || 0,
                    reservas_activas: apiData.reservas_activas || 0,
                    reservas_canceladas: apiData.reservas_canceladas || 0,
                    reservas_completadas: apiData.reservas_finalizadas || 0,
                    recursos_mas_usados: sortedResources,
                    usuarios_top: []
                } as StatisticsData;
            }
        },
        enabled: !!user,
    });

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const barData = statistics?.recursos_mas_usados?.slice(0, 5).map(r => ({
        label: r.recurso_nombre,
        value: r.total_reservas,
        color: colors.primary
    })) || [];

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Premium con Gradiente Verde */}
                <LinearGradient
                    colors={[colors.primary, '#059669']}
                    style={styles.header}
                >
                    <SafeAreaView edges={['top']}>
                        <View style={styles.headerContent}>
                            <Text style={styles.headerTitle}>Estadísticas</Text>
                            <Text style={styles.headerSubtitle}>
                                {isAdmin ? 'Reporte global del sistema' : 'Resumen de tu actividad'}
                            </Text>
                        </View>
                    </SafeAreaView>
                </LinearGradient>

                <View style={styles.content}>
                    {isLoading ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={styles.loaderText}>Analizando datos...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={60} color={colors.error} />
                            <Text style={styles.errorText}>No pudimos cargar los reportes</Text>
                            <Button mode="contained" onPress={() => refetch()} style={styles.retryBtn}>
                                Reintentar
                            </Button>
                        </View>
                    ) : (
                        <>
                            {/* Panel de Mini Cartas Flotantes */}
                            <View style={styles.statsGrid}>
                                <View style={styles.statRow}>
                                    <View style={styles.statItem}>
                                        <StatCard
                                            title="Total"
                                            value={statistics?.total_reservas || 0}
                                            icon="calendar-multiple"
                                            color="blue"
                                        />
                                    </View>
                                    <View style={styles.statItem}>
                                        <StatCard
                                            title="Activas"
                                            value={statistics?.reservas_activas || 0}
                                            icon="clock-check"
                                            color="green"
                                        />
                                    </View>
                                </View>
                                <View style={[styles.statRow, { marginTop: 15 }]}>
                                    <View style={styles.statItem}>
                                        <StatCard
                                            title="Finalizadas"
                                            value={statistics?.reservas_completadas || 0}
                                            icon="checkbox-marked-circle"
                                            color="purple"
                                        />
                                    </View>
                                    <View style={styles.statItem}>
                                        <StatCard
                                            title="Canceladas"
                                            value={statistics?.reservas_canceladas || 0}
                                            icon="close-circle"
                                            color="red"
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Recursos más usados */}
                            <Card style={styles.chartCard}>
                                <View style={styles.chartHeader}>
                                    <View style={styles.chartIconTitle}>
                                        <MaterialCommunityIcons name="trophy-outline" size={24} color={colors.primary} />
                                        <Text style={styles.chartTitle}>Recursos Populares</Text>
                                    </View>
                                </View>
                                <View style={styles.divider} />
                                {barData.length > 0 ? (
                                    <StyledBarChart data={barData} />
                                ) : (
                                    <Text style={styles.noDataText}>Sin datos suficientes aún.</Text>
                                )}
                            </Card>

                            {/* Top Usuarios (Admin Only) */}
                            {isAdmin && statistics?.usuarios_top && statistics.usuarios_top.length > 0 && (
                                <Card style={[styles.chartCard, { marginBottom: 30 }]}>
                                    <View style={styles.chartHeader}>
                                        <View style={styles.chartIconTitle}>
                                            <MaterialCommunityIcons name="account-star-outline" size={24} color="#8B5CF6" />
                                            <Text style={styles.chartTitle}>Top Usuarios Activos</Text>
                                        </View>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.userList}>
                                        {statistics.usuarios_top.slice(0, 5).map((u, i) => (
                                            <View key={i} style={styles.userItem}>
                                                <View style={styles.rankBadge}>
                                                    <Text style={styles.rankText}>{i + 1}</Text>
                                                </View>
                                                <Text style={styles.userName} numberOfLines={1}>{u.usuario_nombre}</Text>
                                                <View style={styles.countBadge}>
                                                    <Text style={styles.countText}>{u.total_reservas}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </Card>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        paddingBottom: 50,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    content: {
        paddingHorizontal: 20,
        marginTop: -25,
    },
    loaderContainer: {
        paddingTop: 100,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 15,
        color: '#64748B',
        fontSize: 15,
    },
    errorContainer: {
        paddingTop: 80,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#1E293B',
        fontWeight: 'bold',
        marginTop: 15,
    },
    retryBtn: {
        marginTop: 20,
        borderRadius: 12,
    },
    statsGrid: {
        marginBottom: 20,
    },
    statRow: {
        flexDirection: 'row',
        gap: 15,
    },
    statItem: {
        flex: 1,
    },
    chartCard: {
        borderRadius: 24,
        backgroundColor: '#fff',
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        marginTop: 15,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    chartIconTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: 20,
    },
    chartWrapper: {
        gap: 18,
    },
    barContainer: {
        gap: 6,
    },
    barLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    barLabelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        flex: 1,
    },
    barValueText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    barTrack: {
        height: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
    noDataText: {
        textAlign: 'center',
        color: '#94A3B8',
        paddingVertical: 20,
    },
    userList: {
        gap: 12,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 16,
        gap: 12,
    },
    rankBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EDE9FE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#7C3AED',
    },
    userName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#1E293B',
    },
    countBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    countText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.primary,
    },
});
