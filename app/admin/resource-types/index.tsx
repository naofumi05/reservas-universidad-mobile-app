import { PageHeader, StatusBadge } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Card, FAB, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ResourceType {
    id: number;
    nombre: string;
    descripcion?: string;
    estado: number;
}

export default function ResourceTypesListScreen() {
    const router = useRouter();
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: types = [], isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['resource-types'],
        queryFn: async (): Promise<ResourceType[]> => {
            const response = await api.get('/tipos-recursos');
            return response.data.data || response.data;
        },
        enabled: !!token,
    });

    const filteredTypes = types.filter(t =>
        t.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleDelete = (type: ResourceType) => {
        Alert.alert(
            'Eliminar Tipo de Recurso',
            `¿Estás seguro de eliminar "${type.nombre}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/tipos-recursos/${type.id}`);
                            refetch();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el tipo de recurso');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: ResourceType }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <View style={styles.typeInfo}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="shape" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.typeDetails}>
                            <Text style={styles.typeName}>{item.nombre}</Text>
                            <Text style={styles.typeDescription} numberOfLines={2}>
                                {item.descripcion || 'Sin descripción'}
                            </Text>
                        </View>
                    </View>
                    <StatusBadge status={item.estado === 1 ? 'active' : 'inactive'} />
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => router.push(`/admin/resource-types/edit/${item.id}`)}
                    >
                        <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
                        <Text style={styles.actionText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.deleteBtn]}
                        onPress={() => handleDelete(item)}
                    >
                        <MaterialCommunityIcons name="delete" size={20} color={colors.error} />
                        <Text style={[styles.actionText, { color: colors.error }]}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader
                title="Tipos de Recursos"
                subtitle="Listado de tipos de recursos"
                icon="shape"
            />

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Buscar por nombre o descripción"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>

            {isLoading ? (
                <ActivityIndicator style={{ marginTop: 40 }} size="large" />
            ) : (
                <FlatList
                    data={filteredTypes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="shape-outline" size={48} color={colors.gray400} />
                            <Text style={styles.emptyText}>No se encontraron tipos de recursos</Text>
                        </View>
                    }
                    ListFooterComponent={
                        <Text style={styles.footerText}>
                            Mostrando {filteredTypes.length} de {types.length} tipos
                        </Text>
                    }
                />
            )}

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => router.push('/admin/resource-types/create')}
                label="Nuevo tipo"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchContainer: {
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
    },
    searchBar: {
        backgroundColor: colors.surface,
    },
    listContent: {
        padding: spacing.base,
        paddingBottom: 100,
    },
    card: {
        marginBottom: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    typeInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    typeDetails: {
        flex: 1,
    },
    typeName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.gray900,
    },
    typeDescription: {
        fontSize: 14,
        color: colors.gray500,
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.gray100,
        gap: spacing.base,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    deleteBtn: {},
    actionText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: spacing['2xl'],
    },
    emptyText: {
        marginTop: spacing.sm,
        fontSize: 14,
        color: colors.gray500,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: colors.gray400,
        marginTop: spacing.sm,
    },
    fab: {
        position: 'absolute',
        margin: spacing.base,
        right: 0,
        bottom: 0,
        backgroundColor: colors.primary,
    },
});
